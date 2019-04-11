import ChainUtil from '../chain-util';
import { DIFFICULTY, MINE_RATE } from '../config';
import Transaction from '../wallet/transaction';

export default class Block {
  timestamp: number;
  lastHash: string;
  hash: string;
  data: Transaction[];
  nonce: number;
  difficulty: number;

  constructor(
    timestamp: number,
    lastHash: string,
    hash: string,
    data: Transaction[],
    nonce: number,
    difficulty: number,
  ) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString(): string {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Nonce     : ${this.nonce}
      Difficulty: ${this.difficulty}
      Data      : ${this.data}`;
  }

  static genesis(): Block {
    // TODO: Replace '0' by 'Genesis time'
    return new this(0, '-----', 'f1r57-h45h', [], 0, DIFFICULTY);
    // return new this('Genesis time', '-----', 'f1r57-h45h', [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock: Block, data: any): Block {
    let hash;
    let timestamp;
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp: number, lastHash: string, data: any, nonce: number, difficulty: number): string {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }

  static blockHash(block: Block): string {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock: Block, currentTime: number): number {
    let { difficulty } = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}
