import Transaction from './transaction';

export default class TransactionPool {
  public transactions: Transaction[];

  public constructor() {
    this.transactions = [];
  }

  public updateOrAddTransaction(transaction: Transaction): void {
    const transactionWithId = this.transactions.find((t) => t.id === transaction.id);

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  public existingTransaction(address: string): Transaction | undefined {
    return this.transactions.find((t) => t.input.address === address);
  }

  public validTransactions(): Transaction[] {
    return this.transactions.filter((transaction) => {
      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);

      if (transaction.input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${transaction.input.address}.`);
        return false;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}.`);
        return false;
      }

      return transaction;
    });
  }

  public clear(): void {
    this.transactions = [];
  }
}
