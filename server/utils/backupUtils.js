const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const backupUtils = {
  backupDir: path.join(__dirname, '../../backups'),

  ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  },

  createJSONBackup(data, notes = '') {
    const dir = this.ensureDir(this.backupDir);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `kanchkura-backup-${timestamp}.json`;
    const filepath = path.join(dir, filename);

    const backup = {
      _meta: {
        name: 'kanchkura-erp-backup',
        version: '1.0.0',
        created_at: new Date().toISOString(),
        notes,
      },
      data,
    };

    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
    return { filename, filepath, size: fs.statSync(filepath).size };
  },

  createSQLBackup(config) {
    return new Promise((resolve, reject) => {
      const dir = this.ensureDir(this.backupDir);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `kanchkura-db-${timestamp}.sql`;
      const filepath = path.join(dir, filename);

      const cmd = `mysqldump -h ${config.host} -P ${config.port} -u ${config.user} ${config.password ? '-p' + config.password : ''} ${config.database} > ${filepath}`;

      exec(cmd, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
        if (error) {
          console.error('SQL backup error:', error);
          reject(error);
          return;
        }
        resolve({ filename, filepath, size: fs.statSync(filepath).size });
      });
    });
  },

  restoreFromJSON(filepath) {
    if (!fs.existsSync(filepath)) throw new Error('Backup file not found');
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    return data.data || data;
  },

  cleanupBackups(keepLast = 10) {
    const dir = this.ensureDir(this.backupDir);
    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith('.json') || f.endsWith('.sql'))
      .map(f => ({ name: f, path: path.join(dir, f), mtime: fs.statSync(path.join(dir, f)).mtime }))
      .sort((a, b) => b.mtime - a.mtime);

    if (files.length > keepLast) {
      const toDelete = files.slice(keepLast);
      for (const f of toDelete) {
        fs.unlinkSync(f.path);
        console.log(`Deleted old backup: ${f.name}`);
      }
    }
  },

  getBackupStats() {
    const dir = this.ensureDir(this.backupDir);
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') || f.endsWith('.sql'));
    const totalSize = files.reduce((sum, f) => sum + (fs.statSync(path.join(dir, f)).size || 0), 0);
    const latestBackup = files.length > 0
      ? files.map(f => ({ name: f, mtime: fs.statSync(path.join(dir, f)).mtime }))
          .sort((a, b) => b.mtime - a.mtime)[0]
      : null;

    return {
      total_backups: files.length,
      total_size: totalSize,
      latest_backup: latestBackup?.name || null,
      latest_backup_time: latestBackup?.mtime || null,
      backup_directory: dir,
    };
  },
};

// Run directly for CLI backup
if (require.main === module) {
  console.log('📦 Running backup...');
  backupUtils.createJSONBackup({ timestamp: new Date().toISOString() }, 'CLI backup')
    .then(result => {
      console.log(`✅ Backup created: ${result.filename} (${(result.size / 1024).toFixed(2)} KB)`);
      backupUtils.cleanupBackups(10);
    })
    .catch(err => console.error('❌ Backup failed:', err));
}

module.exports = backupUtils;
