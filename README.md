# Lesson 1~4 Note
比特幣不是圖靈完備的->無法執行一個編成語言的所有指令 <br>
預言機(oracle)網路問題：真實世界的數據輸入到blockchain(ex: ChainLink) <br>
智能合約：創建不可違背的承諾(promise)->即"區塊練創建的目的" <br>
UNISWAP <br>
Defi產業(可行?) <br>
DAOs(管理組織) <br>
sharding(分片) <br>
layer1: 基礎層(ETH2) <br>
layer2: 應用層(ChainLink) <br>
 <br>
string是一種byte <br>
"cat"是一種string，但可以自動轉為byte <br>
 <br>
 calldata是不能被修改的臨時變量 <br>
 memory是可以被修改的臨時變量 <br>
 ABI: application binary interface，智能合約的I/O <br>
 link: 驗證(ERC20) <br>
 **AggreratorV3Interface**可以用來做ABI call，但AggreratorV3Interface不是ABI <br>
  <br>
 **RPC URL(remote procedure call uniform resource location):** 到某個正在運行的區塊鍊的連接 <br>

# Lesson 5: Ethers.js Simple Storage Note
## *[1. Cannot read properties of undefined (reading 'JsonRpcProvider') #2706](https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/2706#discussioncomment-4906223)*
ethers 的版本有問題，回退到ver.5.7.2即可
## *[2. Could Not Detect Network on deploy.js - WSL & Ganache #34](https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/34)*
1.) 在VSCode的terminal使用Ganache(不同於UI) <br>
2.) 用Ganache windows的UI時，調整防火牆設定 <br>
->用terminal的方式較可行，Ganache UI常失敗 <br>
<br>
Node.js讓javascript可以在後端運作(讓javascript成為一種腳本語言) <br>
TypeScript是javascript的靜態行語言 <br>
 <br>

# Lesson 6: Hardhat Simple Storage Note
## Error: Cannot find module '../tasks/block-number'
1.) 可能是多個地方有hardhat.config.js導致路徑出錯 <br>
2.) block-number.js後多打了空白，導致出現leading or trailing spaces detected in file or....的問題 <br>
3.) npm install -D @nomiclabs/hardhat-waffle ethereum-waffle <br>

# Lesson 7: Hardhat Fund Me Note
**hre**>> hardhat runtime environment <br>
**getNamedAccounts** is a function that returns a promise to an object whose keys are names and values are addresses. It is parsed from the namedAccounts configuration (see namedAccounts). <br>
**linting(tool>>EsLint):** is the process of running a problem that will analysis code for potential errors. <br>
**solhint:** lint for solidity <br>
hardhat-deploy: 用來deploy & test(在deploy folder) <br>
hardhat config是deploy的entry point <br>
**Q: 如何在hardhat network上測試?(原來是remix的test net)** <br>
A: 用mocking <br>
**Q: What's mocking?** <br>
A: used for unit test. 一個object在測試的時候可能和其他的object有相依性, 於是利用mock來模擬其他的object. mocking is creating object that simulate the behavior of real object. <br>
mock似一個**虛擬的**餵價(price feed)合約(price feed contract: USD/ETH...etc.)，用來做最小化的本地測試 <br>
**unit test:** testing method by which individual units of source code are tested. (on local network) <br>
**staging test:** 假設都已經deploy上test net, 沒有mock. (only on test net) <br>
**AAVE:** 可以用在不同的chain上, **helper-network-config**根據不同的chain使用不同的參數(address) <br>
waffle test: "expect"<br>
contract自帶的function, proprities(在ethers document): attach, connect, address, provider... <br>




