import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

// Support both DATABASE_URL (Railway) and individual variables (local dev)
const dataSourceConfig: any = {
  type: 'postgres',
  entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
};

if (process.env.DATABASE_URL) {
  // Production: Use DATABASE_URL from Railway
  dataSourceConfig.url = process.env.DATABASE_URL;
  dataSourceConfig.ssl = { rejectUnauthorized: false };
} else {
  // Development: Use individual variables
  dataSourceConfig.host = process.env.DB_HOST || 'localhost';
  dataSourceConfig.port = parseInt(process.env.DB_PORT || '5432', 10);
  dataSourceConfig.username = process.env.DB_USERNAME || 'postgres';
  dataSourceConfig.password = process.env.DB_PASSWORD || 'postgres';
  dataSourceConfig.database = process.env.DB_DATABASE || 'user_management';
}

export default new DataSource(dataSourceConfig);

// If running directly (for migrations), initialize and run
if (require.main === module) {
  const AppDataSource = new DataSource(dataSourceConfig);
  
  AppDataSource.initialize()
    .then(async () => {
      console.log('✅ Data Source initialized');
      await AppDataSource.runMigrations();
      console.log('✅ Migrations completed');
      await AppDataSource.destroy();
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error during migration:', error);
      process.exit(1);
    });
}
