/**
 * KANCHKURA COLLEGE ERP - DATABASE BACKUP & RESTORE SYSTEM
 *
 * Features:
 * - Automatic scheduled backups
 * - Manual backup creation
 * - Backup restoration
 * - Backup cleanup (retention policy)
 * - Backup status tracking
 *
 * Usage:
 *   node database/backups/backupSystem.js backup          - Manual backup
 *   node database/backups/backupSystem.js restore <id>    - Restore backup
 *   node database/backups/backupSystem.js list            - List backups
 *   node database/backups/backupSystem.js cleanup         - Clean old backups
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kanchkura_college',
};

const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30;
const MAX_BACKUPS = 20;

class BackupSystem {
  constructor() {
    this.ensureDir(BACKUP_DIR);
  }

  ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Create a timestamped backup filename
   */
  generateFilename() {
    const now = new Date();
    const ts = now.toISOString()
      .replace(/T/, '_')
      .replace(/:/g, '-')
      .replace(/\..+/, '');
    return `kanchkura_backup_${ts}.sql`;
  }

  /**
   * Get MySQL dump command
   */
  getMysqldumpCommand() {
    const { host, port, user, password, database } = DB_CONFIG;
    let cmd = `mysqldump --host=${host} --port=${port} --user=${user}`;

    if (password) {
      cmd += ` --password="${password}"`;
    }

    cmd += ` --routines --triggers --events --single-transaction --skip-lock-tables`;
    cmd += ` --default-character-set=utf8mb4`;
    cmd += ` ${database}`;

    // Try to find mysqldump
    const possiblePaths = [
      'mysqldump',
      'C:\\xampp\\mysql\\bin\\mysqldump.exe',
      '/usr/bin/mysqldump',
      '/usr/local/bin/mysqldump',
    ];

    for (const p of possiblePaths) {
      try {
        execSync(`${p} --version`, { stdio: 'ignore' });
        cmd = `${p} ${cmd.substring('mysqldump'.length)}`;
        break;
      } catch (e) { /* try next */ }
    }

    return cmd;
  }

  /**
   * Create a database backup
   */
  async createBackup({ type = 'manual', notes = '', userId = null } = {}) {
    const filename = this.generateFilename();
    const filepath = path.join(BACKUP_DIR, filename);

    console.log(`📦 Creating backup: ${filename}`);

    try {
      const cmd = this.getMysqldumpCommand();
      const output = execSync(cmd, {
        encoding: 'utf8',
        maxBuffer: 100 * 1024 * 1024, // 100MB
        timeout: 300000, // 5 minutes
      });

      // Add metadata header to the dump
      const header = `-- ============================================================\n` +
        `-- KANCHKURA COLLEGE ERP - DATABASE BACKUP\n` +
        `-- Generated: ${new Date().toISOString()}\n` +
        `-- Database: ${DB_CONFIG.database}\n` +
        `-- Type: ${type}\n` +
        `-- Notes: ${notes || 'N/A'}\n` +
        `-- ============================================================\n\n`;

      fs.writeFileSync(filepath, header + output, 'utf8');

      const stats = fs.statSync(filepath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

      console.log(`✅ Backup created: ${filename} (${sizeMB} MB)`);

      // Cleanup old backups
      this.cleanupOldBackups();

      return {
        filename,
        filepath,
        fileSize: stats.size,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`❌ Backup failed:`, error.message);
      throw error;
    }
  }

  /**
   * Restore database from a backup file
   */
  async restoreBackup(filename) {
    const filepath = path.join(BACKUP_DIR, filename);

    if (!fs.existsSync(filepath)) {
      throw new Error(`Backup file not found: ${filename}`);
    }

    console.log(`🔄 Restoring from backup: ${filename}`);

    try {
      const { host, port, user, password, database } = DB_CONFIG;
      let cmd = `mysql --host=${host} --port=${port} --user=${user}`;

      if (password) {
        cmd += ` --password="${password}"`;
      }

      cmd += ` ${database} < "${filepath}"`;

      // Find mysql client
      const possiblePaths = [
        'mysql',
        'C:\\xampp\\mysql\\bin\\mysql.exe',
        '/usr/bin/mysql',
        '/usr/local/bin/mysql',
      ];

      for (const p of possiblePaths) {
        try {
          execSync(`${p} --version`, { stdio: 'ignore' });
          cmd = `${p} ${cmd.substring('mysql'.length)}`;
          break;
        } catch (e) { /* try next */ }
      }

      execSync(cmd, {
        stdio: 'inherit',
        timeout: 600000, // 10 minutes
      });

      console.log(`✅ Database restored from: ${filename}`);
      return { success: true, filename };
    } catch (error) {
      console.error(`❌ Restore failed:`, error.message);
      throw error;
    }
  }

  /**
   * List all available backups
   */
  listBackups() {
    if (!fs.existsSync(BACKUP_DIR)) {
      return [];
    }

    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.endsWith('.sql') && f.startsWith('kanchkura_backup_'))
      .map(f => {
        const filepath = path.join(BACKUP_DIR, f);
        const stats = fs.statSync(filepath);
        return {
          filename: f,
          filepath,
          size: stats.size,
          sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
          createdAt: stats.birthtime || stats.mtime,
          modifiedAt: stats.mtime,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    return files;
  }

  /**
   * Delete old backups based on retention policy
   */
  cleanupOldBackups() {
    const backups = this.listBackups();

    // Remove based on retention days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

    let deleted = 0;
    for (const backup of backups) {
      if (backup.createdAt < cutoffDate) {
        try {
          fs.unlinkSync(backup.filepath);
          console.log(`  🗑️  Deleted old backup: ${backup.filename}`);
          deleted++;
        } catch (e) {
          console.error(`  ⚠️  Could not delete ${backup.filename}:`, e.message);
        }
      }
    }

    // If still over max, delete oldest
    const remaining = this.listBackups();
    if (remaining.length > MAX_BACKUPS) {
      const toDelete = remaining.slice(MAX_BACKUPS);
      for (const backup of toDelete) {
        try {
          fs.unlinkSync(backup.filepath);
          console.log(`  🗑️  Deleted excess backup: ${backup.filename}`);
          deleted++;
        } catch (e) {
          console.error(`  ⚠️  Could not delete ${backup.filename}:`, e.message);
        }
      }
    }

    if (deleted > 0) {
      console.log(`  Cleaned up ${deleted} old backup(s)`);
    }

    return deleted;
  }

  /**
   * Get backup statistics
   */
  getStats() {
    const backups = this.listBackups();
    const totalSize = backups.reduce((sum, b) => sum + b.size, 0);
    const latestBackup = backups.length > 0 ? backups[0] : null;

    return {
      totalBackups: backups.length,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      latestBackup: latestBackup ? {
        filename: latestBackup.filename,
        createdAt: latestBackup.createdAt,
        sizeMB: latestBackup.sizeMB,
      } : null,
      backupDirectory: BACKUP_DIR,
      retentionDays: RETENTION_DAYS,
      maxBackups: MAX_BACKUPS,
    };
  }
}

// ============================================================
// CLI INTERFACE
// ============================================================
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'backup';
  const system = new BackupSystem();

  (async () => {
    try {
      switch (command) {
        case 'backup':
        case 'create':
          const result = await system.createBackup({
            type: 'manual',
            notes: args.slice(1).join(' ') || 'CLI backup',
          });
          console.log(`\n📁 ${result.filename}`);
          console.log(`📦 ${(result.fileSize / (1024 * 1024)).toFixed(2)} MB`);
          break;

        case 'restore':
          if (!args[1]) {
            console.error('❌ Usage: node backupSystem.js restore <filename>');
            process.exit(1);
          }
          await system.restoreBackup(args[1]);
          break;

        case 'list':
        case 'ls':
          const backups = system.listBackups();
          if (backups.length === 0) {
            console.log('📂 No backups found.');
          } else {
            console.log('📂 Available Backups:');
            console.log('─'.repeat(80));
            backups.forEach((b, i) => {
              console.log(`  ${i + 1}. ${b.filename}`);
              console.log(`     Size: ${b.sizeMB} MB | Created: ${b.createdAt.toISOString()}`);
            });
            console.log('─'.repeat(80));
            const stats = system.getStats();
            console.log(`\n📊 Total: ${stats.totalBackups} backups (${stats.totalSizeMB} MB)`);
          }
          break;

        case 'cleanup':
        case 'clean':
          const deleted = system.cleanupOldBackups();
          console.log(`\n🧹 Cleanup complete. Removed ${deleted} backup(s).`);
          break;

        case 'stats':
          const s = system.getStats();
          console.log('📊 Backup Statistics:');
          console.log(`  Total backups: ${s.totalBackups}`);
          console.log(`  Total size: ${s.totalSizeMB} MB`);
          console.log(`  Latest backup: ${s.latestBackup?.filename || 'None'}`);
          console.log(`  Retention: ${s.retentionDays} days`);
          console.log(`  Max backups: ${s.maxBackups}`);
          console.log(`  Directory: ${s.backupDirectory}`);
          break;

        default:
          console.log('Usage:');
          console.log('  node backupSystem.js backup [notes]    Create backup');
          console.log('  node backupSystem.js restore <file>    Restore backup');
          console.log('  node backupSystem.js list              List backups');
          console.log('  node backupSystem.js cleanup           Clean old backups');
          console.log('  node backupSystem.js stats             Show statistics');
      }
    } catch (error) {
      console.error(`\n❌ ${command} failed:`, error.message);
      process.exit(1);
    }
  })();
}

module.exports = BackupSystem;
