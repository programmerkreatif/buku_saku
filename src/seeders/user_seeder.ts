import bcrypt from 'bcrypt';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../config/database'; // ← sesuaikan path
import { NewUser } from '../types/user.types';

const ADMIN = {
  name: 'Administrator Keuanganku',
  email: 'admin@keuanganku.com',
  plainPassword: 'keuanganku',
  role: 'admin' as const,
};

async function seedAdmin(): Promise<void> {
  try {
    // 1. Cek apakah admin sudah ada
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [ADMIN.email]
    );

    if (rows.length > 0) {
      console.log('ℹ️  Admin sudah ada, skip seeding.');
      console.log('   Email    :', ADMIN.email);
      console.log('   Password :', ADMIN.plainPassword);
      return;
    }

    // 2. Hash password
    const hashed = await bcrypt.hash(ADMIN.plainPassword, 10);

    // 3. Insert admin
    const payload: NewUser = {
      name: ADMIN.name,
      email: ADMIN.email,
      password: hashed,
      role: ADMIN.role,
    };

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [payload.name, payload.email, payload.password, payload.role]
    );

    console.log('✅ Admin berhasil dibuat!');
    console.log('   ID       :', result.insertId);
    console.log('   Name     :', payload.name);
    console.log('   Email    :', payload.email);
    console.log('   Password :', ADMIN.plainPassword);
    console.log('   Role     :', payload.role);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('❌ Gagal seeding admin:', msg);
    process.exitCode = 1;
  } finally {
    // Tutup pool supaya proses ts-node keluar
    await db.end();
  }
}

seedAdmin();