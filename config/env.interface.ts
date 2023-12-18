import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

interface ProcessEnv {
  PORT: number;
  SERVER_URI: string;
  CLIENT_URI: string;
  MONGODB_URI: string;
  MONGODB_CLOUD_URI: string;
}

export const ENV: ProcessEnv = {
  PORT: +process.env.PORT,
  SERVER_URI: process.env.SERVER_URI,
  CLIENT_URI: process.env.CLIENT_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_CLOUD_URI: process.env.MONGODB_CLOUD_URI,
};
