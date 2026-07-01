import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';

const decodeKey = (encodedKey) => {
  const key = Buffer.from(encodedKey, 'base64');
  if (key.length !== 32) {
    const error = new Error('Paper Moon content key must decode to 32 bytes.');
    error.status = 503;
    throw error;
  }
  return key;
};

const encryptTrace = (body, encodedKey) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', decodeKey(encodedKey), iv);
  const ciphertext = Buffer.concat([cipher.update(String(body), 'utf8'), cipher.final()]);
  return {
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
  };
};

const decryptTrace = ({ ciphertext, iv, tag }, encodedKey) => {
  try {
    const decipher = createDecipheriv(
      'aes-256-gcm',
      decodeKey(encodedKey),
      Buffer.from(iv, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    return Buffer.concat([
      decipher.update(Buffer.from(ciphertext, 'base64')),
      decipher.final(),
    ]).toString('utf8');
  } catch {
    throw new Error('Trace protection check failed.');
  }
};

const ownerCapabilityHash = (token) =>
  createHash('sha256').update(String(token ?? '')).digest();

const createOwnerCapability = () => {
  const token = randomBytes(32).toString('base64url');
  return {
    token,
    hash: ownerCapabilityHash(token).toString('hex'),
  };
};

const verifyOwnerCapability = (token, expectedHash) => {
  try {
    return timingSafeEqual(
      ownerCapabilityHash(token),
      Buffer.from(expectedHash, 'hex'),
    );
  } catch {
    return false;
  }
};

export {
  createOwnerCapability,
  decryptTrace,
  encryptTrace,
  verifyOwnerCapability,
};
