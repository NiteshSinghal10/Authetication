import UAParser from 'ua-parser-js';
import { Request } from 'express';
import crypto from 'crypto';

import { ALGORITHM, ENCRYPTION_KEY } from '../../../lib';

export function getDeviceInfo(req: Request) {
  const parser = new (UAParser as any)(req.headers['user-agent'] || '');
  const device = parser.getDevice();
  const os = parser.getOS();

  const deviceName = device.model || os.name || 'Unknown Device';
  const userAgent = req.headers['user-agent'] || 'Unknown UA';
  const ipAddress = req.ip || 'Unknown IP';

  return { deviceName, userAgent, ipAddress };
}

// Encrypt function
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16); // initialization vector
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv,
  );
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  // return iv + encrypted text in hex
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decrypt function
export function decrypt(hash: string): string {
  const [ivHex, encryptedHex] = hash.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv,
  );
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
