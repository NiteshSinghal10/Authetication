import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const MONGO_URI = process.env.MONGO_URI;

// Google Auth variables
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
export const GOOGLE_CODE_EXCHANGE_API = String(
  process.env.GOOGLE_CODE_EXCHANGE_API,
);
export const GOOGLE_PEOPLE_API = String(process.env.GOOGLE_PEOPLE_API);

// Private and public keys
export const PRIVATE_KEY = String(process.env.PRIVATE_KEY);
export const PUBLIC_KEY = String(process.env.PUBLIC_KEY);

// Crypto encryption
export const ENCRYPTION_KEY = String(process.env.ENCRYPTION_KEY);
export const ALGORITHM = String(process.env.ALGORITHM);

export const REFRESH_TOKEN_EXPIRED_IN = Number(
  process.env.REFRESH_TOKEN_EXPIRED_IN,
);
export const ACCESS_TOKEN_EXPIRED_IN = Number(
  process.env.ACCESS_TOKEN_EXPIRED_IN,
);
