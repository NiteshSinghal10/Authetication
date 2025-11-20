import jwt, { SignOptions } from 'jsonwebtoken';

import { PRIVATE_KEY } from '../../../lib';

export const generateToken = (
  data: object,
  type: 'refresh' | 'access',
  options: SignOptions = {},
) => {
  const payload = {
    ...data,
    type,
  };

  const token = jwt.sign(payload, PRIVATE_KEY, {
    ...options,
    algorithm: 'RS256',
  });

  return token;
};
