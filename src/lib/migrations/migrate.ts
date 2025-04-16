import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

async function migratePostgres() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Read the migration file
    const migrationPath = join(process.cwd(), 'src', 'lib', 'migrations', 'init.postgres.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    // Execute the migration
    await pool.query(migrationSQL);
    console.log('PostgreSQL migration completed successfully');
  } catch (error) {
    console.error('PostgreSQL migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  migratePostgres()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 