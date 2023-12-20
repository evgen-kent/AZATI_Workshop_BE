import * as crypto from 'crypto';

export const hashPasswordAsync = async (password: string): Promise<string> => {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};
