import Blockchain from '../blockchain';
import Block from '../blockchain/block';
import Wallet from '../wallet';
import Transaction from '../wallet/transaction';
import TransactionPool from '../wallet/transaction-pool';
import P2pServer from './p2p-server';

export default class Miner {
  public blockchain: Blockchain;
  public transactionPool: TransactionPool;
  public wallet: Wallet;
  public p2pServer: P2pServer;

  public constructor(blockchain: Blockchain, transactionPool: TransactionPool, wallet: Wallet, p2pServer: P2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  public mine(): Block {
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
    const block = this.blockchain.addBlock(validTransactions);
    this.p2pServer.syncChains();
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}
