import * as crypto from 'crypto';
import { EnvError } from './customErrors';

const algorithm = 'aes256';
const key = process.env.SECRET_KEY;

if (!key) {
  throw new EnvError('No SECRET_KEY in .env');
}

export function encrypt(text: string): string {
  const cipher = crypto.createCipher(algorithm, key as string);
  const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

  return encrypted;
}

export function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipher(algorithm, key as string);
  const decrypted =
    decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

  return decrypted;
}
