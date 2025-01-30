import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || '',
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || '',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || '',
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || '',
};
