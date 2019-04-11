import SHA256 from 'crypto-js/sha256';
import { ec } from 'elliptic';
import uuidV1 from 'uuid/v1';

const ecInstance = new ec('secp256k1');

export default class ChainUtil {
  static genKeyPair(): ec.KeyPair {
    return ecInstance.genKeyPair();
  }

  static id(): string {
    return uuidV1();
  }

  static hash(data: any): string {
    return SHA256(JSON.stringify(data)).toString();
  }

  static verifySignature(publicKey: string, signature: ec.Signature, dataHash: string): boolean {
    return ecInstance.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
  }
}
