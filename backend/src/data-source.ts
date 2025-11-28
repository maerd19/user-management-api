import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const baseConfig: Partial<DataSourceOptions> = {
  type: 'postgres',
  entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
};

let dataSourceConfig: DataSourceOptions;

if (process.env.DATABASE_URL) {
  dataSourceConfig = {
    ...baseConfig,
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  } as DataSourceOptions;
} else {
  dataSourceConfig = {
    ...baseConfig,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'user_management',
  } as DataSourceOptions;
}

export default new DataSource(dataSourceConfig);

if (typeof require !== 'undefined' && require.main === module) {
  const AppDataSource = new DataSource(dataSourceConfig);

  AppDataSource.initialize()
    .then(async () => {
      console.log('Data Source initialized');
      await AppDataSource.runMigrations();
      console.log('Migrations completed');
      await AppDataSource.destroy();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error during migration:', error);
      process.exit(1);
    });
}
