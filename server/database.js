import Database from 'better-sqlite3';
import path from 'path';

// Database connection
const dbPath = path.join(process.cwd(), 'server', 'quoter.db');
let db;
try {
    db = new Database(dbPath, { verbose: console.log });

    // Initialize Database Schema
    db.exec(`
        CREATE TABLE IF NOT EXISTS dealerships (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo_pdv TEXT UNIQUE NOT NULL,
            nombre_pdv TEXT NOT NULL,
            cif TEXT,
            localidad TEXT,
            codigo_postal TEXT,
            provincia TEXT,
            codigo_provincia TEXT,
            codigo_establecimiento TEXT,
            nombre_establecimiento TEXT,
            codigo_cadena TEXT,
            nombre_cadena TEXT,
            codigo_macrocadena TEXT,
            nombre_macrocadena TEXT,
            zona TEXT,
            nombre_kas TEXT,
            estado TEXT,
            
            -- Configuraciones Multi-Tenant
            tarifa_asignada TEXT DEFAULT 'estandar',
            ver_comisiones BOOLEAN DEFAULT 0,
            premium_program BOOLEAN DEFAULT 0,
            
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS kas_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            cargo TEXT,
            dni_password TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS seller_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            nombre TEXT NOT NULL,
            rol TEXT NOT NULL,
            dni_password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS seller_dealerships (
            seller_id INTEGER NOT NULL,
            codigo_pdv TEXT NOT NULL,
            PRIMARY KEY(seller_id, codigo_pdv)
        );

        CREATE TABLE IF NOT EXISTS tariffs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT UNIQUE NOT NULL,
            datos_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    
    console.log("✅ Base de datos SQLite iniciada y verificada.");
} catch (e) {
    console.warn("⚠️ Advertencia: Error cargando DB local (puede ser normal en build time o serverless si falta lib):", e.message);
}

export default db;
