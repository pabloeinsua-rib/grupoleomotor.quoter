var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server/run_import.js
var import_fs = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var import_url2 = require("url");

// server/database.js
var import_better_sqlite3 = __toESM(require("better-sqlite3"));
var import_path = __toESM(require("path"));
var import_url = require("url");
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var dbPath = import_path.default.join(__dirname, "quoter.db");
var db;
try {
  db = new import_better_sqlite3.default(dbPath, { verbose: console.log });
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
    `);
  console.log("\u2705 Base de datos SQLite iniciada y verificada.");
} catch (e) {
  console.warn("\u26A0\uFE0F Advertencia: Error cargando DB local (puede ser normal en build time o serverless si falta lib):", e.message);
}
var database_default = db;

// server/run_import.js
var import_meta2 = {};
var __filename2 = (0, import_url2.fileURLToPath)(import_meta2.url);
var __dirname2 = import_path2.default.dirname(__filename2);
async function runImport() {
  try {
    const rawData = import_fs.default.readFileSync(import_path2.default.join(__dirname2, "demo_data.json"), "utf8");
    const dealers = JSON.parse(rawData);
    console.log(`Leidos ${dealers.length} concesionarios del archivo JSON.`);
    const stmt = database_default.prepare(`
            INSERT INTO dealerships (
                codigo_pdv, nombre_pdv, cif, localidad, codigo_postal, provincia, codigo_provincia,
                codigo_establecimiento, nombre_establecimiento, codigo_cadena, nombre_cadena,
                codigo_macrocadena, nombre_macrocadena, zona, nombre_kas, estado
            ) VALUES (
                @codigo_pdv, @nombre_pdv, @cif, @localidad, @codigo_postal, @provincia, @codigo_provincia,
                @codigo_establecimiento, @nombre_establecimiento, @codigo_cadena, @nombre_cadena,
                @codigo_macrocadena, @nombre_macrocadena, @zona, @nombre_kas, @estado
            )
            ON CONFLICT(codigo_pdv) DO UPDATE SET
                nombre_pdv=excluded.nombre_pdv,
                cif=excluded.cif,
                localidad=excluded.localidad,
                codigo_postal=excluded.codigo_postal,
                provincia=excluded.provincia,
                codigo_provincia=excluded.codigo_provincia,
                codigo_establecimiento=excluded.codigo_establecimiento,
                nombre_establecimiento=excluded.nombre_establecimiento,
                codigo_cadena=excluded.codigo_cadena,
                nombre_cadena=excluded.nombre_cadena,
                codigo_macrocadena=excluded.codigo_macrocadena,
                nombre_macrocadena=excluded.nombre_macrocadena,
                zona=excluded.zona,
                nombre_kas=excluded.nombre_kas,
                estado=excluded.estado,
                updated_at=CURRENT_TIMESTAMP
        `);
    let insertCount = 0;
    const insertMany = database_default.transaction((dealersList) => {
      for (const d of dealersList) {
        const parseField = (val) => val === "-1" ? null : val;
        stmt.run({
          zona: d["Descripci\xF3n Establecimientos"] || "Desconocida",
          nombre_kas: d["__EMPTY"] || null,
          codigo_macrocadena: parseField(d["__EMPTY_1"]),
          nombre_macrocadena: parseField(d["__EMPTY_2"]),
          codigo_cadena: parseField(d["__EMPTY_3"]),
          nombre_cadena: parseField(d["__EMPTY_4"]),
          codigo_establecimiento: parseField(d["__EMPTY_5"]),
          nombre_establecimiento: parseField(d["__EMPTY_6"]),
          cif: parseField(d["__EMPTY_7"]),
          estado: parseField(d["__EMPTY_9"]),
          codigo_pdv: d["__EMPTY_11"] ? String(d["__EMPTY_11"]).trim() : null,
          nombre_pdv: parseField(d["__EMPTY_12"]),
          localidad: parseField(d["__EMPTY_13"]),
          codigo_postal: d["__EMPTY_14"] ? String(d["__EMPTY_14"]) : null,
          provincia: parseField(d["__EMPTY_15"]),
          codigo_provincia: d["__EMPTY_16"] ? String(d["__EMPTY_16"]) : null
        });
        insertCount++;
      }
    });
    const validDealers = dealers.filter((d) => d["__EMPTY_11"]);
    insertMany(validDealers);
    console.log(`\u2705 Importaci\xF3n completada con \xE9xito. Registros procesados/actualizados: ${insertCount}`);
    const stmtCheck = database_default.prepare("SELECT count(*) as count FROM dealerships");
    console.log("Dealer count in DB:", stmtCheck.get().count);
    const all = database_default.prepare("SELECT nombre_pdv, zona, nombre_kas FROM dealerships LIMIT 3").all();
    console.log("Sample records:", all);
  } catch (e) {
    console.error("\u274C Error durante la importaci\xF3n:", e);
  }
}
runImport();
