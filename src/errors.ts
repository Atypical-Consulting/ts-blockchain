export class InvalidTransactionException extends Error {
  public address: string;

  public constructor(address: string) {
    const message = `Invalid transaction from ${address}.`;

    super(message);

    this.address = address;
    this.message = message;
  }
}

export class InvalidSignatureException extends Error {
  public address: string;

  public constructor(address: string) {
    const message = `Invalid signature from ${address}.`;

    super(message);

    this.address = address;
    this.message = message;
  }
}

export class AmountExceedBalanceException extends Error {
  public amount: number;
  public balance?: number;

  public constructor(amount: number, balance?: number) {
    const message =
      balance === undefined
        ? `Amount: ${amount} exceeds balance.`
        : `Amount: ${amount} exceeds current balance: ${balance}`;

    super(message);

    this.amount = amount;
    this.balance = balance;
    this.message = message;
  }
}
