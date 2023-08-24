import time
import socket
import pickle
import random
import hashlib

##定義架構
class Transaction:
    def __init__(self, sender, receiver, amounts, fee, message):
        self.sender = sender
        self.receiver = receiver
        self.amounts = amounts
        self.fee = fee
        self.message = message

class Block:
    def __init__(self, previous_hash, difficulty, miner, miner_rewards):
        self.previous_hash = previous_hash
        self.hash = ''
        self.difficulty = difficulty
        self.nonce = 0
        self.timestamp = int(time.time())
        self.transactions = []
        self.miner = miner
        self.miner_rewards = miner_rewards 

class BlockChain:
    def __init__(self):
        self.adjust_difficulity_blocks = 10
        self.difficulity = 1
        self.block_time = 30
        self.miner_rewards  = 10
        self.block_limitation = 32
        self.chain = []
        self.pending_transactions = []


    ##產生hash值
    #將交易明細轉換為字串
    def transaction_to_string(self, transaction):
        transaction_dict = {
            'sender': str(transaction.sender),
            'receiver': str(transaction.receiver),
            'amounts': transaction.amounts,
            'fee': transaction.fee,
            'message': transaction.message
            }
        return str(transaction_dict)

    #把區塊記錄內的所有交易明細轉換為一個字串
    def get_transaction_string(self, block):
        transaction_str = ''
        for transaction in block.transactions:
            transaction_str += self.transaction_to_string(transaction)
        return transaction_str

    #產生對應的hash值
    def get_hash(self, block, nonce):
        s = hashlib.sha1()
        s.update(
            (
                block.previous_hash
                + str(block.timestamp)
                + self.get_transaction_string(block)
                + str(nonce)
            ).encode("utf-8")
        )
        h = s.hexdigest()
        return h


    ##產生創世塊
    def create_genesis_block(self):
        print("Create genesis block...")
        new_block = Block('Hello world!', self.difficulity, 'MoriahYen', self.miner_rewards)
        new_block.hash = self.get_hash(new_block, 0)
        self.chain.append(new_block)


    ##放置交易記錄到新區塊
    def add_transaction_to_block(self, block):
        #使用手續費高的
        self.pending_transactions.sort(key = lambda x: x.fee, reverse = True)
        if len(self.pending_transactions) > self.block_limitation:
            transaction_accepted = self.pending_transactions[:self.block_limitation]
            self.pending_transactions = self.pending_transactions[self.block_limitation:]
        else:
            transaction_accepted = self.pending_transactions
            self.pending_transactions = []
            block.transactions = transaction_accepted


    ##挖掘新區塊
    def mine_block(self, miner):
        start = time.process_time()
        last_block = self.chain[-1]
        new_block = Block(last_block.hash, self.difficulity, miner, self.miner_rewards)
        
        self.add_transaction_to_block(new_block)
        new_block.previous_hash = last_block.hash
        new_block.difficulty = self.difficulity
        new_block.hash = self.get_hash(new_block, new_block.nonce)

        while new_block.hash[0: self.difficulity] != '0' * self.difficulity:
            new_block.nonce += 1
            new_block.hash = self.get_hash(new_block, new_block.nonce)
            
        time_consumed = round(time.process_time() - start, 5)
        print(f"Hash found: {new_block.hash} @ difficulity {self.difficulity}, time cost: {time_consumed}s")
        self.chain.append(new_block)


    ##調整挖礦難度(做法不好)
    def adjust_difficulity(self):
        if len(self.chain) % self.adjust_difficulity_blocks != 1:
            return self.difficulity
        elif len(self.chain) <= self.adjust_difficulity_blocks:
            return self.difficulity
        else:
            start = self.chain[-1 * self.adjust_difficulity_blocks - 1].timestamp
            finish = self.chain[-1].timestamp
            average_time_consumed = round((finish - start) / (self.adjust_difficulity_blocks), 2)
            if average_time_consumed > self.block_time:
                print(f"Average block time: {average_time_consumed}s. Lower the difficulity")
                self.difficulity -= 1
            else:
                print(f"Average block time: {average_time_consumed}s. High up the difficulity")
                self.difficulity += 1


    ##計算帳戶餘額
    def get_balance(self, account):
        balance = 0
        for block in self.chain:
            # Check miner reward
            miner = False
            if block.miner == account:
                miner = True
                balance += block.miner_rewards
            for transaction in block.transaction:
                if miner:
                    balance += transaction.fee
                if transaction.sender == account:
                    balance -= transaction.amounts
                    balance -= transaction.fee
                elif transaction.receiver == account:
                    balance += transaction.amounts
        return balance


    ##確認hash值是否正確
    def verify_blockchain(self):
        previous_hash = ''
        for idx, block in enumerate(self.chain):
            if self.get_hash(block, block.nonce) != block.hash:
                print("Error! Hash not matched!")
                return False
            elif previous_hash != block.previous_hash and idx:
                print("Error! Hash not matched to previous_hash!")
                return False
            previous_hash = block.hash
        print("Hash correct!")
        return True

'''
##測試
'''
if __name__ == '__main__':
    block = BlockChain()
    block.create_genesis_block()
    block.mine_block('lkm543')

    block.verify_blockchain()
    
    print("Insert fake transaction.")
    fake_transaction = Transaction('test123', 'address', 100, 1, 'Test')
    block.chain[1].transactions.append(fake_transaction)
    block.mine_block('lkm543')

    block.verify_blockchain()












    
    
    



        




