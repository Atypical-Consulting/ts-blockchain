import SHA256 from 'crypto-js/sha256';
import { ec } from 'elliptic';
import { v4 as uuidv4 } from 'uuid';

const ecInstance = new ec('secp256k1');

export default class ChainUtil {
  public static genKeyPair(): ec.KeyPair {
    return ecInstance.genKeyPair();
  }

  public static id(): string {
    return uuidv4();
  }

  public static hash<T>(data: T): string {
    return SHA256(JSON.stringify(data)).toString();
  }

  public static verifySignature(publicKey: string, signature: ec.Signature, dataHash: string): boolean {
    return ecInstance.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
  }
}
