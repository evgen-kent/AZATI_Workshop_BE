import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

export interface ProcessEnv {
  PROTOCOL: string;
  HOST: string;
  PORT: number;
  CLIENT_URI: string;
  MONGODB_URI: string;
  MONGODB_CLOUD_URI: string;
}

export const ENV: ProcessEnv = {
  PROTOCOL: process.env.PROTOCOL,
  HOST: process.env.HOST,
  PORT: +process.env.PORT,
  CLIENT_URI: process.env.CLIENT_URI,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_CLOUD_URI: process.env.MONGODB_CLOUD_URI,
};
