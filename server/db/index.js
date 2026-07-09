import pkg from "pg";
import dotenv from "dotenv";
import { URL } from "url";

dotenv.config();

const { Pool } = pkg;

// Sanitize the DATABASE_URL to remove connection-string query params
// that can cause hangs or are handled differently by pg (e.g. channel_binding, sslmode).
function sanitizeDatabaseUrl(raw) {
  if (!raw) return raw;
  try {
    const u = new URL(raw);
    // Remove params that may cause compatibility issues
    u.searchParams.delete("channel_binding");
    u.searchParams.delete("uselibpqcompat");
    u.searchParams.delete("sslmode");
    return u.toString();
  } catch (e) {
    return raw;
  }
}

const connectionString = sanitizeDatabaseUrl(process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString,
  // Use SSL for Neon / hosted Postgres. Keep rejectUnauthorized false for ease in dev.
  ssl: { rejectUnauthorized: false },
  // Avoid long hangs during auth
  connectionTimeoutMillis: 10000,
});

export const connectDB = async () => {
  try {
    // Use a simple test query; this will surface authentication / handshake errors.
    await pool.query("SELECT 1");
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed", err);
    process.exit(1);
  }
};