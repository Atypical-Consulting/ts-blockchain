import { ec } from 'elliptic';

import Wallet from '.';
import ChainUtil from '../chain-util';
import { MINING_REWARD } from '../config';
import { AmountExceedBalanceException } from '../errors';

export interface Input {
  timestamp: number;
  amount: number;
  address: string;
  signature: ec.Signature;
}

export interface Output {
  address: string;
  amount: number;
}

export default class Transaction {
  public id: string;
  public input: any;
  public outputs: Output[];

  public constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  public update(senderWallet: Wallet, recipient: string, amount: number): Transaction {
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey) as Output;

    if (amount > senderOutput.amount) {
      throw new AmountExceedBalanceException(amount);
    }

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  public static transactionWithOutputs(senderWallet: Wallet, outputs: Output[]) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  public static newTransaction(senderWallet: Wallet, recipient: string, amount: number): Transaction {
    if (amount > senderWallet.balance) {
      throw new AmountExceedBalanceException(amount);
    }

    return Transaction.transactionWithOutputs(senderWallet, [
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey,
      },
      { amount, address: recipient },
    ]);
  }

  public static rewardTransaction(minerWallet: Wallet, blockchainWallet: Wallet): Transaction {
    return Transaction.transactionWithOutputs(blockchainWallet, [
      {
        amount: MINING_REWARD,
        address: minerWallet.publicKey,
      },
    ]);
  }

  public static signTransaction(transaction: Transaction, senderWallet: Wallet): void {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
    };
  }

  public static verifyTransaction(transaction: Transaction): boolean {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs),
    );
  }
}
