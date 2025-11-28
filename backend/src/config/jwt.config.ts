import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_ACCESS_SECRET || 'dev-secret-change-in-production',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
  refreshSecret:
    process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
