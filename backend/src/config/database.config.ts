import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => {
  // Railway provides DATABASE_URL, parse it if available
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      migrationsRun: false,
      logging: process.env.NODE_ENV === 'development',
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    };
  }

  // Fallback to individual variables (for local development)
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'user_management',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    migrationsRun: false,
    logging: process.env.NODE_ENV === 'development',
  };
});
