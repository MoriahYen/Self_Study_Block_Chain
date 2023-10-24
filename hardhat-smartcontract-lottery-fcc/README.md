Still have error:  <br>
assert(endingTimeStamp > startingTimeStamp) --> error <br>
expect(endingTimeStamp.toNumber()).to.be.greaterThan(startingTimeStamp.toNumber()) ?? <br>

# hardhat-smartcontract-lottery-fcc
1. 任何人都可以fund 0.1ETH進入raffle<br>
2. 有一個counter，時間到會選出winner<br>
3. winner拿走所有的錢<br>

**chainlink VRF:**<br>
用來獲取這個可以驗證的**隨機數**<br>
https://vrf.chain.link/<br>
在Remix上操作，需要透過合約地址來註冊consumer獲得隨機數<br>

**chainlink keeper**(改稱為chainlink Automation):<br>
將合約註冊為Chainlink keeper網路的"Upkeep"(維護?)<br>
auto process，是一種鍊外計算(Chainlink keeper網路)<br>
AutomationCounter.sol裡有counter<br>

---

學習event<br>
**modulo function**: 防止隨機數太大，array塞不下<br>

---
## function checkUpkeep()<br>
```
return: upkeepNeeded
upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers);
```
查看是否到了該獲取的隨機數>更新winner>給錢<br>

## function fulfillRandomWords()<br>
獲取隨機數<br>
選出winner<br>
把s_raffleState打開<br>
清空array<br>
轉錢(call)到winner<br>


## function performUpkeep()<br>
驗證正確性<br>

