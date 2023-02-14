# Lesson 5: Ethers.js Simple Storage Q&A
## *[1. Cannot read properties of undefined (reading 'JsonRpcProvider') #2706](https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/2706#discussioncomment-4906223)*
ethers 的版本有問題，回退到ver.5即可
## *[2. Could Not Detect Network on deploy.js - WSL & Ganache #34](https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/34)*
1.) 在VSCode的terminal使用Ganache(不同於UI) <br>
2.) 用Ganache windows的UI時，調整防火牆設定 <br>

# Lesson 6: Hardhat Simple Storage Q&A
## Error: Cannot find module '../tasks/block-number'
1.) 可能是多個地方有hardhat.config.js導致路徑出錯
2.) block-number.js後多打了空白，導致出現leading or trailing spaces detected in file or....的問題
