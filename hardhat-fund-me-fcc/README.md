# hardhat-fund-me-fcc
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
**AAVE:** borrowing & lending protocol. 可以用在不同的chain上, **helper-network-config**根據不同的chain使用不同的參數(address) <br>
waffle test: "expect"<br>
contract自帶的function, proprities(在ethers document): attach, connect, address, provider... <br>
await deployments fixture(["all"]): deploy所有contract<br>


---

1. 學習使用hardhat-deploy<br>
2. 學習使用helper-hardhat-config.js<br>
3. 學習mock<br>
4. 學習撰寫unit/staging test<br>
5. 
