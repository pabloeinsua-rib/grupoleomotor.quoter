import fs from 'fs';
import path from 'path';
import db from './database.js';

async function runImport() {
    try {
        const rawData = fs.readFileSync(path.join(process.cwd(), 'server', 'demo_data.json'), 'utf8');
        const dealers = JSON.parse(rawData);

        console.log(`Leidos ${dealers.length} concesionarios del archivo JSON.`);

        const stmt = db.prepare(`
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

        const insertMany = db.transaction((dealersList) => {
            for (const d of dealersList) {
                const parseField = (val) => val === '-1' ? null : val;
                stmt.run({
                    zona: d['Descripción Establecimientos'] || 'Desconocida',
                    nombre_kas: d['__EMPTY'] || null,
                    codigo_macrocadena: parseField(d['__EMPTY_1']),
                    nombre_macrocadena: parseField(d['__EMPTY_2']),
                    codigo_cadena: parseField(d['__EMPTY_3']),
                    nombre_cadena: parseField(d['__EMPTY_4']),
                    codigo_establecimiento: parseField(d['__EMPTY_5']),
                    nombre_establecimiento: parseField(d['__EMPTY_6']),
                    cif: parseField(d['__EMPTY_7']),
                    estado: parseField(d['__EMPTY_9']),
                    codigo_pdv: d['__EMPTY_11'] ? String(d['__EMPTY_11']).trim() : null,
                    nombre_pdv: parseField(d['__EMPTY_12']),
                    localidad: parseField(d['__EMPTY_13']),
                    codigo_postal: d['__EMPTY_14'] ? String(d['__EMPTY_14']) : null,
                    provincia: parseField(d['__EMPTY_15']),
                    codigo_provincia: d['__EMPTY_16'] ? String(d['__EMPTY_16']) : null
                });
                insertCount++;
            }
        });

        // Filtrar aquellos que no tengan código PDV
        const validDealers = dealers.filter(d => d['__EMPTY_11']);
        
        insertMany(validDealers);
        
        console.log(`✅ Importación completada con éxito. Registros procesados/actualizados: ${insertCount}`);
        
        // Comprobación de qué se ha grabado
        const stmtCheck = db.prepare('SELECT count(*) as count FROM dealerships');
        console.log("Dealer count in DB:", stmtCheck.get().count);

        const all = db.prepare('SELECT nombre_pdv, zona, nombre_kas FROM dealerships LIMIT 3').all();
        console.log("Sample records:", all);

    } catch (e) {
        console.error('❌ Error durante la importación:', e);
    }
}

runImport();
