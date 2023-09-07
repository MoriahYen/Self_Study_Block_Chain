const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require ("../../helper-hardhat-config")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name) ? describe.skip :describe ("Raffle Unit Test", async function () {
    let raffle, vefCoordinatorV2Mock, raffleEntranceFee, deployer, interval
    const chainId = network.config.chainId

    beforeEach (async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture (["all"])
        raffle = await ethers.getContract ("Raffle", deployer)
        vefCoordinatorV2Mock = await ethers.getContract ("VRFCoordinatorV2Mock", deployer)
        raffleEntranceFee = await raffle.getEntranceFee()
        interval = await raffle.getInterval()
    })

    describe ("constructor", async function () {
        it ("initializes the raffle correctly", async function () {
            const raffleState = await raffle.getRaffleState()   
            const interval = await raffle.getInterval()
            assert.equal (raffleState.toString(), "0")
            assert.equal (interval.toString(), networkConfig[chainId]["interval"])
        })
    })

    describe ("enterRaffle", async function () {
        it ("revert when you don't pay enough", async function () {
            await expect (raffle.enterRaffle()).to.be.revertedWith("Raffle__NotEnoughETHEntered")
        })
        it ("records players when they enter", async function () {
            await raffle.enterRaffle ({value: raffleEntranceFee})
            const playerFromContract = await raffle.getPlayer(0)
            assert.equal (playerFromContract, deployer)
        })
        it ("emits event on enter", async function () {
            await expect (raffle.enterRaffle({value: raffleEntranceFee})).to.emit(raffle, "RaffleEnter") 
        })
        it("doesn't allow entrance when raffle is culaaulating", async function () {
            await raffle.enterRaffle ({ value: raffleEntranceFee })
            // [Moriah] Hardhat debug method
            // https://hardhat.org/hardhat-network/docs/reference
            await network.provider.send ("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.send ("evm_mine", [])
            await raffle.performUpkeep([])
            await expect (raffle.enterRaffle({value: raffleEntranceFee})).to.be.revertedWith("Raffle__RaffleNotOpen")
        })
    })

    describe ("checkUpkeep", async function () {
        it ("returns false if people haven't sent any ETH", async function () {
            await network.provider.send ("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.send ("evm_mine", [])
            // [Moriah] callStatic: simulate transaction
            const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
            assert (!upkeepNeeded)
        })
        it("returns false if raffle isn't open", async function () {
            await raffle.enterRaffle({ value: raffleEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request("evm_mine", [] )
            await raffle.performUpkeep([]) // changes the state to calculating
            const raffleState = await raffle.getRaffleState() // stores the new state
            const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
            assert.equal(raffleState.toString() == "1", upkeepNeeded == false)
        })
        it("returns false if enough time hasn't passed", async () => {
            await raffle.enterRaffle({ value: raffleEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() - 5]) // use a higher number here if this test fails
            await network.provider.request({ method: "evm_mine", params: [] })
            const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
            assert(!upkeepNeeded)
        })
        it("returns true if enough time has passed, has players, eth, and is open", async () => {
            await raffle.enterRaffle({ value: raffleEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
            const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
            assert(upkeepNeeded)
        })
    })
    describe ("performUpkeep", function () {
        it("it can only run if checkUpkeep is true", async function () {
            await raffle.enterRaffle({ value: raffleEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
            const tx = await raffle.performUpkeep("0x") 
            assert(tx)  
        })
        it("reverts if checkup is false", async () => {
            await expect(raffle.performUpkeep("0x")).to.be.revertedWith("Raffle__UpkeepNotNeeded")
        })
        it("updates the raffle state, emits and event, and calls the vrf coordinator", async () => {
            // Too many asserts in this test!
            await raffle.enterRaffle({ value: raffleEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
            const txResponse = await raffle.performUpkeep("0x") // emits requestId
            const txReceipt = await txResponse.wait(1) // waits 1 block
            const raffleState = await raffle.getRaffleState() // updates state
            // [Moriah] events[1]
            // in VRFCoordinatorV2Mock.sol
            // event RandomWordsRequested(
            //     bytes32 indexed keyHash,
            //     uint256 requestId, <--
            //     uint256 preSeed,
            //     uint64 indexed subId,
            //     uint16 minimumRequestConfirmations,
            //     uint32 callbackGasLimit,
            //     uint32 numWords,
            //     address indexed sender
            //   );
            const requestId = txReceipt.events[1].args.requestId    
            assert(requestId.toNumber() > 0)
            assert(raffleState == 1) // 0 = open, 1 = calculating
        })
    })
    describe ("fulfillRandomWords", function () {
        // [Moriah] everyone need to entrt raffle first
        beforeEach (async function () {
            await raffle.enterRaffle({ value: raffleEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
        })
        // [Moriah]
        // function fulfillRandomWords(uint256 _requestId, address _consumer) external {
        //     fulfillRandomWordsWithOverride(_requestId, _consumer, new uint256[](0));
        //   }
        it("can only be called after performupkeep", async () => {
            await expect(vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)).to.be.revertedWith("nonexistent request")
            await expect(vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address)).to.be.revertedWith("nonexistent request")
        })
        it ("picks a winner, resets, and sends money", async function () {
            const additionalEntrances = 3 // to test
            const startingIndex = 2
            let startingBalance
            for (let i = startingIndex; i < startingIndex + additionalEntrances; i++) { // i = 2; i < 5; i=i+1
                raffle = raffleContract.connect(accounts[i]) // Returns a new instance of the Raffle contract connected to player
                await raffle.enterRaffle({ value: raffleEntranceFee })
            }
            const startingTimeStamp = await raffle.getLastTimeStamp() // stores starting timestamp (before we fire our event)
            // [Moriah] use listener
            await new Promise(async (resolve, reject) => {
                raffle.once("WinnerPicked", async () => { // event listener for WinnerPicked
                    console.log("WinnerPicked event fired!")
                    // assert throws an error if it fails, so we need to wrap
                    // it in a try/catch so that the promise returns event
                    // if it fails.
                    try {
                        // Now lets get the ending values...
                        const recentWinner = await raffle.getRecentWinner()
                        const raffleState = await raffle.getRaffleState()
                        const winnerBalance = await accounts[2].getBalance()
                        const endingTimeStamp = await raffle.getLastTimeStamp()
                        await expect(raffle.getPlayer(0)).to.be.reverted
                        // Comparisons to check if our ending values are correct:
                        assert.equal(recentWinner.toString(), accounts[2].address)
                        assert.equal(raffleState, 0)
                        assert.equal(
                            winnerBalance.toString(), 
                            startingBalance // startingBalance + ( (raffleEntranceFee * additionalEntrances) + raffleEntranceFee )
                                .add(
                                    raffleEntranceFee
                                        .mul(additionalEntrances)
                                        .add(raffleEntranceFee)
                                )
                                .toString()
                        )
                        assert(endingTimeStamp > startingTimeStamp)
                        resolve() // if try passes, resolves the promise 
                    } catch (e) { 
                        reject(e) // if try fails, rejects the promise
                    }
                })

                // kicking off the event by mocking the chainlink keepers and vrf coordinator
            try {
                const tx = await raffle.performUpkeep("0x")
                const txReceipt = await tx.wait(1)
                startingBalance = await accounts[2].getBalance()
                await vrfCoordinatorV2Mock.fulfillRandomWords(
                    txReceipt.events[1].args.requestId,
                    raffle.address
                )
                } catch (e) {
                    reject(e)
                }
            }) 
        })  
    })
})