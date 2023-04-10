const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
// [Moriah]
// equls to :
// const helperConfig  = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig 
const { verify } = require("../utils/verify")
require("dotenv").config()

// [Moriah]
// async function deployFunc(hre) {
//  // hre: hardhat runtime enviroment
//  hre.getNamedAccounts()
// }
// module.exports.default = deployFunc
// is the same as below
//
// module.exports = async (hre) => {
//     const{ getNamedAccounts, deployments } = hre
// }
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`FundMe deployed at ${fundMe.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
}

module.exports.tags = ["all", "fundme"]
