import { randomBytes, scryptSync } from 'crypto';

export function compareEncryptedData(
  data: string,
  hashedData: string,
): boolean {
  const [salt, key] = hashedData.split(':');
  if (!salt) {
    return false;
  }
  return (
    scryptSync(data, Buffer.from(salt, 'hex'), 64, { N: 1024 }).toString(
      'hex',
    ) === key
  );
}

export function encryptingData(data: string): string {
  const salt = randomBytes(16).toString('hex');
  const key = scryptSync(data, Buffer.from(salt, 'hex'), 64, {
    N: 1024,
  }).toString('hex');
  return `${salt}:${key}`;
}
