# Lesson 1~4 Note
預言機網路問題：真實世界的數據輸入到blockchain(ex: ChainLink) <br>
智能合約：創建不可違背的承諾(promise) <br>
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
 AggreratorV3Interface可以用來做ABI call，但AggreratorV3Interface不是ABI <br>
  <br>

# Lesson 5: Ethers.js Simple Storage Note
## *[1. Cannot read properties of undefined (reading 'JsonRpcProvider') #2706](https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/2706#discussioncomment-4906223)*
ethers 的版本有問題，回退到ver.5.7.2即可
## *[2. Could Not Detect Network on deploy.js - WSL & Ganache #34](https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/34)*
1.) 在VSCode的terminal使用Ganache(不同於UI) <br>
2.) 用Ganache windows的UI時，調整防火牆設定 <br>
<br>
Node.js讓javascript可以在後端運作(讓javascript成為一種腳本語言) <br>
TypeScript是javascript的靜態行語言 <br>
 <br>

# Lesson 6: Hardhat Simple Storage Note
## Error: Cannot find module '../tasks/block-number'
1.) 可能是多個地方有hardhat.config.js導致路徑出錯 <br>
2.) block-number.js後多打了空白，導致出現leading or trailing spaces detected in file or....的問題 <br>
3.) npm install -D @nomiclabs/hardhat-waffle ethereum-waffle

# Lesson 7: Hardhat Fund Me Note
hre>> hardhat runtime environment