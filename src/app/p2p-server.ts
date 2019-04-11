import Websocket from 'ws';
import Blockchain from '../blockchain';
import TransactionPool from '../wallet/transaction-pool';
import Transaction from '../wallet/transaction';

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS'
};

export default class P2pServer {
  blockchain: Blockchain;
  transactionPool: TransactionPool;
  sockets: Websocket[];

  constructor(blockchain: Blockchain, transactionPool: TransactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen(): void {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on('connection', socket => this.connectSocket(socket));

    this.connectToPeers();

    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
  }

  connectToPeers(): void {
    peers.forEach(_ => {
      const socket = new Websocket(_);

      socket.on('open', () => this.connectSocket(socket));
    });
  }

  connectSocket(socket: Websocket): void {
    this.sockets.push(socket);
    console.log('Socket connected');

    this.messageHandler(socket);

    this.sendChain(socket);
  }

  messageHandler(socket: Websocket): void {
    socket.on('message', message => {
      const data = JSON.parse(message as string);
      switch (data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clear_transactions:
          this.transactionPool.clear();
          break;
      }
    });
  }

  sendChain(socket: Websocket): void {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.chain,
        chain: this.blockchain.chain
      })
    );
  }

  sendTransaction(socket: Websocket, transaction: Transaction): void {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.transaction,
        transaction
      })
    );
  }

  syncChains(): void {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  broadcastTransaction(transaction: Transaction): void {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  broadcastClearTransactions(): void {
    this.sockets.forEach(socket =>
      socket.send(
        JSON.stringify({
          type: MESSAGE_TYPES.clear_transactions
        })
      )
    );
  }
}
