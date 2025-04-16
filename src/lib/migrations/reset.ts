import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

async function resetPostgres() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Read the reset file
    const resetPath = join(process.cwd(), 'src', 'lib', 'migrations', 'reset.sql');
    const resetSQL = readFileSync(resetPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = resetSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.toLowerCase().includes('drop')) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await pool.query(statement);
      }
    }
    
    console.log('PostgreSQL reset completed successfully');
  } catch (error) {
    console.error('PostgreSQL reset failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  resetPostgres()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 