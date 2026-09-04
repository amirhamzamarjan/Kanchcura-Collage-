/**
 * KANCHKURA COLLEGE ERP - MIGRATION RUNNER
 *
 * Executes migrations in order and tracks which have been applied.
 * Run via: node database/migrations/run.js
 */

const path = require('path');
const fs = require('fs');
const { sequelize, Sequelize } = require('../../config/database');

const MIGRATIONS_DIR = __dirname;
const MIGRATIONS_TABLE = '_migrations';

const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
  .filter(f => f.match(/^\d+_.*\.js$/) && f !== 'run.js')
  .sort();

async function runMigrations() {
  console.log('🔄 Running database migrations...\n');

  try {
    // Ensure migrations tracking table exists
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        version VARCHAR(50),
        description TEXT,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        duration_ms INT DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Get already applied migrations
    const [applied] = await sequelize.query(`SELECT name FROM ${MIGRATIONS_TABLE}`);
    const appliedNames = new Set(applied.map(r => r.name));

    let totalRun = 0;

    for (const file of migrationFiles) {
      if (appliedNames.has(file.replace('.js', ''))) {
        console.log(`  ⏭️  Skipping ${file} (already applied)`);
        continue;
      }

      console.log(`  ▶️  Running ${file}...`);
      const migration = require(path.join(MIGRATIONS_DIR, file));

      if (typeof migration.up !== 'function') {
        console.log(`  ⚠️  ${file} has no 'up' function, skipping`);
        continue;
      }

      const startTime = Date.now();

      try {
        await migration.up(sequelize);
        const duration = Date.now() - startTime;

        await sequelize.query(
          `INSERT INTO ${MIGRATIONS_TABLE} (name, version, description, duration_ms) VALUES (?, ?, ?, ?)`,
          { replacements: [migration.name || file.replace('.js', ''), migration.version || '1.0.0', migration.description || '', duration] }
        );

        console.log(`  ✅ ${file} applied (${duration}ms)`);
        totalRun++;
      } catch (err) {
        console.error(`  ❌ ${file} FAILED:`, err.message);
        throw err;
      }
    }

    if (totalRun === 0) {
      console.log('\n✨ All migrations already applied. Database is up to date.');
    } else {
      console.log(`\n✅ Applied ${totalRun} migration(s) successfully.`);
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

runMigrations();
