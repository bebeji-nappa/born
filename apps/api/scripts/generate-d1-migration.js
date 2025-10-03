import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, '../prisma/migrations');
const d1Dir = path.join(migrationsDir, 'd1');

// prisma/migrations内のフォルダを取得（d1フォルダ以外）
const migrationFolders = fs.readdirSync(migrationsDir)
  .filter(item => {
    const itemPath = path.join(migrationsDir, item);
    return fs.statSync(itemPath).isDirectory() && item !== 'd1';
  })
  .sort();

if (migrationFolders.length === 0) {
  console.log('No Prisma migration folders found.');
  process.exit(0);
}

// 最新のマイグレーションフォルダを取得
const latestMigration = migrationFolders[migrationFolders.length - 1];
const migrationSqlPath = path.join(migrationsDir, latestMigration, 'migration.sql');

if (!fs.existsSync(migrationSqlPath)) {
  console.error(`Migration SQL not found: ${migrationSqlPath}`);
  process.exit(1);
}

// D1フォルダ内の既存ファイル数を取得して連番を決定
const d1Files = fs.readdirSync(d1Dir)
  .filter(f => f.endsWith('.sql'))
  .sort();

const nextNumber = d1Files.length > 0
  ? parseInt(d1Files[d1Files.length - 1].match(/^(\d+)_/)?.[1] || '0') + 1
  : 1;

const d1FileName = `${String(nextNumber).padStart(4, '0')}_${latestMigration.split('_').slice(1).join('_')}.sql`;
const d1FilePath = path.join(d1Dir, d1FileName);

// PrismaマイグレーションSQLを読み込み
let sqlContent = fs.readFileSync(migrationSqlPath, 'utf-8');

// SQLiteの互換性のための変換（必要に応じて追加）
sqlContent = sqlContent
  .replace(/BOOLEAN/g, 'INTEGER') // BOOLEANをINTEGERに変換
  .replace(/ DEFAULT false/g, ' DEFAULT 0')
  .replace(/ DEFAULT true/g, ' DEFAULT 1');

// D1用SQLファイルを作成
fs.writeFileSync(d1FilePath, sqlContent);

console.log(`✅ D1 migration generated: ${d1FileName}`);
console.log(`   Source: ${latestMigration}/migration.sql`);
console.log(`   Destination: prisma/migrations/d1/${d1FileName}`);
console.log(`\nNext steps:`);
console.log(`1. Review the generated SQL in: prisma/migrations/d1/${d1FileName}`);
console.log(`2. Apply to local D1: pnpm d1:migrate:local`);
