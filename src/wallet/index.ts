import ChainUtil from '../chain-util';
import Transaction from './transaction';
import { INITIAL_BALANCE } from '../config';
import Blockchain from '../blockchain';
import { ec } from 'elliptic';
import TransactionPool from './transaction-pool';

export default class Wallet {
  balance: number;
  keyPair: ec.KeyPair;
  publicKey: string;
  address: string;

  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
    this.address = '';
  }

  toString(): string {
    return `Wallet -
      publicKey: ${this.publicKey.toString()}
      balance  : ${this.balance}`;
  }

  sign(dataHash: any): ec.Signature {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(
    recipient: string,
    amount: number,
    blockchain: Blockchain,
    transactionPool: TransactionPool
  ): Transaction {
    this.balance = this.calculateBalance(blockchain);

    if (amount > this.balance) {
      throw new Error(
        `Amount: ${amount} exceeds current balance: ${this.balance}`
      );
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  calculateBalance(blockchain: Blockchain): number {
    let balance = this.balance;
    let transactions: Transaction[] = [];
    blockchain.chain.forEach(block =>
      block.data.forEach(transaction => {
        transactions.push(transaction);
      })
    );

    const walletInputs = transactions.filter(
      transaction => transaction.input.address === this.publicKey
    );

    let startTime = 0;

    if (walletInputs.length > 0) {
      const recentInput = walletInputs.reduce((prev, current) =>
        prev.input.timestamp > current.input.timestamp ? prev : current
      );

      balance = recentInput.outputs.find(
        output => output.address === this.publicKey
      )!.amount;
      startTime = recentInput.input.timestamp;
    }

    // transactions
    //   .filter((transaction) => transaction.input.timestamp > startTime)
    //   .filter((transaction) => output.address === this.publicKey)
    //   .forEach((transaction)=> {balance += transaction})

    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime) {
        transaction.outputs.forEach(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }

  static blockchainWallet(): Wallet {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }
}
