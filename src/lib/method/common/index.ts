import UAParser from 'ua-parser-js';
import { Request } from 'express';
import crypto from 'crypto';

import { ALGORITHM, callOtherService, ENCRYPTION_KEY, RESPONSE_MESSAGES } from '../../../lib';
import { ILocation } from '../../../interfaces';

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

export const getLocation = async (ip: string) => {
  let actualIp = ip;

  // If localhost, fetch the actual public IP
  if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('::ffff:127.0.0.1')) {
    // Get the real public IP of the machine
    const publicIpResponse = await callOtherService<{ ip: string }>(
      'https://api.ipify.org?format=json',
      'GET',
    );
    actualIp = publicIpResponse.ip;
  }

  // Clean IPv6 prefix
  if (actualIp.startsWith('::ffff:')) {
    actualIp = actualIp.replace('::ffff:', '');
  }

  const response = await callOtherService<ILocation>(
    `https://ipapi.co/${actualIp}/json/`,
    'GET',
  );

  return {
    city: response.city,
    region: response.region,
    country: response.country_name,
    latitude: response.latitude,
    longitude: response.longitude,
    countryCode: response.country_code,
    countryCode3: response.country_code_iso3,
    timezone: response.timezone,
    currency: response.currency,
    languages: response.languages,
    flag: `https://flagcdn.com/${response.country_code.toLowerCase()}.svg`,
  };
};

export const getErrorMessage = (error: any): string => {
  return  error?.message ? error.message : RESPONSE_MESSAGES.en.unknown_error;
}
