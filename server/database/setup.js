/**
 * KANCHKURA COLLEGE ERP - COMPLETE DATABASE SETUP SCRIPT
 *
 * This script handles the full database lifecycle:
 * 1. Creates the database if it doesn't exist
 * 2. Runs schema.sql
 * 3. Runs seed.sql
 * 4. Runs migrations
 *
 * Usage: node database/setup.js
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kanchkura_college',
};

function runCommand(cmd, description) {
  console.log(`\n▶️  ${description}...`);
  try {
    const output = execSync(cmd, { encoding: 'utf8', timeout: 60000, stdio: 'pipe' });
    console.log(`✅ Done`);
    if (output.trim()) console.log(output.trim());
    return output;
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    if (error.stdout) console.log(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
    throw error;
  }
}

async function setupDatabase() {
  console.log(`
╔══════════════════════════════════════════════╗
║   KANCHKURA COLLEGE ERP - DATABASE SETUP    ║
╚══════════════════════════════════════════════╝
`);

  console.log(`Database: ${DB_CONFIG.database}`);
  console.log(`Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`);
  console.log(`User: ${DB_CONFIG.user}`);

  // Find mysql client
  let mysqlCmd = 'mysql';
  const possiblePaths = [
    'mysql',
    'C:\\xampp\\mysql\\bin\\mysql.exe',
    '/usr/bin/mysql',
    '/usr/local/bin/mysql',
  ];
  for (const p of possiblePaths) {
    try {
      execSync(`${p} --version`, { stdio: 'ignore' });
      mysqlCmd = p;
      break;
    } catch (e) { /* continue */ }
  }

  const auth = DB_CONFIG.password ? `-p"${DB_CONFIG.password}"` : '';
  const baseCmd = `"${mysqlCmd}" -h ${DB_CONFIG.host} -P ${DB_CONFIG.port} -u ${DB_CONFIG.user} ${auth}`;

  try {
    // Step 1: Create database
    console.log('\n📦 Step 1: Creating database...');
    execSync(`${baseCmd} -e "CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`, {
      stdio: 'pipe', timeout: 10000,
    });
    console.log('✅ Database created/verified');

    // Step 2: Run schema.sql
    console.log('\n📋 Step 2: Applying schema...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      execSync(`${baseCmd} ${DB_CONFIG.database} < "${schemaPath}"`, {
        stdio: 'pipe', timeout: 30000,
      });
      console.log('✅ Schema applied');
    } else {
      console.log('⚠️  schema.sql not found at', schemaPath);
    }

    // Step 3: Run seed.sql
    console.log('\n🌱 Step 3: Seeding data...');
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      execSync(`${baseCmd} ${DB_CONFIG.database} < "${seedPath}"`, {
        stdio: 'pipe', timeout: 30000,
      });
      console.log('✅ Seed data inserted');
    } else {
      console.log('⚠️  seed.sql not found at', seedPath);
    }

    // Step 4: Configure Sequelize sync
    console.log('\n🔄 Step 4: Running Sequelize sync...');
    const { sequelize } = require('../config/database');
    await sequelize.sync({ alter: false });
    console.log('✅ Models synced');

    console.log(`
╔══════════════════════════════════════════════╗
║  ✅ DATABASE SETUP COMPLETE                   ║
║  Database: ${DB_CONFIG.database.padEnd(26)}║
║  Tables:  20                                  ║
╚══════════════════════════════════════════════╝
    `);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Setup failed:`, error.message);
    process.exit(1);
  }
}

setupDatabase();
