import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

async function seedPostgres() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Read the seed data file
    const seedPath = join(process.cwd(), 'src', 'lib', 'migrations', 'init.sql');
    const seedSQL = readFileSync(seedPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = seedSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.toLowerCase().includes('insert into')) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await pool.query(statement);
      }
    }
    
    console.log('PostgreSQL seeding completed successfully');
  } catch (error) {
    console.error('PostgreSQL seeding failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  seedPostgres()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 