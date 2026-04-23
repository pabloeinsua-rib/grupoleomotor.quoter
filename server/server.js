
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { PubSub } from '@google-cloud/pubsub';
import dotenv from 'dotenv';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';

// Usar process.cwd() para compatibilidad con Vercel Serverless (evita error import.meta)
const rootDir = process.cwd();

// Configuración opcional de Pub/Sub
dotenv.config({ path: path.join(rootDir, '.env') });

// Importación normal (sin require()) porque database.js usa `export default`
import db from './database.js';

const app = express();

// Configuración de Multer para subida de archivos (Límite 25MB)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 } 
});

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro_quoter';

// Configuración opcional de Pub/Sub (para entornos Cloud)
const pubSubClient = new PubSub();
const TOPIC_QUOTE_PROCESSING = 'quote-processing-topic';
const TOPIC_EMAIL_NOTIFICATION = 'email-notification-topic';

app.use(cors({ origin: true })); // Permitir origen dinámico para Firebase
app.use(express.json());

// Servir archivos estáticos (Frontend construido) - Solo si no estamos en Firebase Functions puro
if (!process.env.FIREBASE_CONFIG) {
    if (process.env.NODE_ENV === 'production') {
        const distPath = path.join(rootDir, 'dist');
        // Configurar Cache-Control para el Service Worker
        app.get('/sw.js', (req, res) => {
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.set('Content-Type', 'application/javascript');
            res.sendFile(path.join(distPath, 'sw.js'));
        });
        
        // Mantenemos la ruta antigua por si acaso hay clientes cacheados
        app.get('/service-worker.js', (req, res) => {
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.set('Content-Type', 'application/javascript');
            res.sendFile(path.join(distPath, 'sw.js'));
        });
        
        // This is necessary to prevent express.static from catching the fallback * catchall
        app.use(express.static(distPath));
    }
}

// --- CONFIGURACIÓN NODEMAILER ---
// Se usan las variables de entorno definidas en Vercel o localmente
const SMTP_USER = process.env.BREVO_SMTP_USER || 'a83b55001@smtp-brevo.com';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: SMTP_USER, // Login SMTP de Brevo proporcionado para producción
        pass: process.env.BREVO_SMTP_KEY || process.env.EMAIL_PASS // Tu clave SMTP de Brevo (Master password) en Vercel
    }
});

// Verificación de conexión SMTP al iniciar el servidor
// Solo verificamos si no estamos en entorno serverless (Vercel o Firebase) para no colgar el arranque
const isServerlessEnv = !!process.env.FIREBASE_CONFIG || process.env.VERCEL === '1' || !!process.env.VERCEL_ENV;
if (!isServerlessEnv) {
    transporter.verify(function (error, success) {
        if (error) {
            console.warn('⚠️  ADVERTENCIA: No se pudo conectar al servidor de correo. Configuración SMTP podría estar fallando.');
        } else {
            console.log('✅ Servidor SMTP listo para enviar correos');
        }
    });
}

// Helper unificado para enviar correos
async function sendEmailBrevo(to, subject, text, html, attachments = []) {
    let apiKey = process.env.BREVO_API_KEY;
    if (apiKey && apiKey.startsWith('xsmtp')) {
        apiKey = null; // No válida para REST
    }
    
    if (!apiKey) {
        console.error("❌ ERROR CRÍTICO: BREVO_API_KEY no encontrada en las variables de entorno.");
        if (process.env.VERCEL) {
            console.error("💡 ESTÁS EN VERCEL: Recuerda que las variables de AI Studio NO se copian a Vercel automáticamente. Debes ir a Vercel Dashboard > Proyecto > Settings > Environment Variables, añadir BREVO_API_KEY y hacer REDEPLOY.");
        }
        throw new Error("BREVO_API_KEY no configurada. Por favor, añádela en tu panel (o en Vercel si estás en producción).");
    }

    // Preparar firma HTML/texto
    const signatureHtml = `
        <br/><br/>
        <hr style="border:none;border-top:1px solid #ccc;"/>
        <div style="font-family: 'Montserrat', sans-serif; color: #555; padding-top:10px;">
            <p style="margin:0;font-weight:bold;font-size:14px;color:#000;">QUOTER AUTOMOTIVE</p>
            <p style="margin:0;font-size:10px;color:#999;letter-spacing:1px;">NO REPLY</p>
        </div>
    `;
    const signatureText = "\n\n--\nQUOTER AUTOMOTIVE\nNO REPLY";
    
    const finalHtml = (html || `<div style="font-family:sans-serif;color:#333;">${text.replace(/\n/g, '<br/>')}</div>`) + signatureHtml;
    const finalText = text + signatureText;

    if (apiKey) {
        let brevoAttachments = undefined;
        if (attachments && attachments.length > 0) {
            brevoAttachments = attachments.map(att => ({
                name: att.filename,
                content: Buffer.isBuffer(att.content) ? att.content.toString('base64') : 
                         (typeof att.content === 'string' ? Buffer.from(att.content, 'utf8').toString('base64') : Buffer.from(att.content).toString('base64'))
            }));
        }

        try {
            console.log(`✉️ Enviando correo a ${to} vía API REST de Brevo...`);
            
            const payload = {
                sender: { name: "Quoter Automotive", email: "documentacion@quoter.es" },
                to: [{ email: to }],
                subject: subject,
                htmlContent: finalHtml,
                textContent: finalText
            };
            
            if (brevoAttachments && brevoAttachments.length > 0) {
                payload.attachment = brevoAttachments;
            }

            const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
                headers: {
                    'accept': 'application/json',
                    'api-key': apiKey,
                    'content-type': 'application/json'
                }
            });

            const result = response.data;
            console.log(`📧 Correo enviado por REST Brevo (ID: ${result.messageId || 'Desconocido'})`);
            return { messageId: result.messageId || 'api-sent' };
        } catch (error) {
            console.error("❌ Error de la API de Brevo:", error.response?.data || error.message);
            throw new Error(`Error enviando email vía Brevo API: ${error.response?.data?.message || error.message || 'Error desconocido'}`);
        }
    } else {
        const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
        if (isVercel) {
            console.error('❌ Intento de uso de SMTP en Vercel. Vercel bloquea puertos SMTP (587).');
            throw new Error('Vercel bloquea conexiones SMTP. Se requiere una BREVO_API_KEY (REST API v3, empieza por xkeysib-). Comprueba las variables de entorno de Vercel.');
        }

        // Fallback a SMTP (Para entornos locales, Docker o VPS)
        console.log('✉️ Usando SMTP como fallback o en modo Local.');
        
        // Timeout para que el SMTP no se cuelgue infinitamente
        const mailOptions = {
            from: '"Quoter Automotive" <documentacion@quoter.es>',
            to: to,
            subject: subject,
            text: finalText,
            html: finalHtml,
            attachments: attachments
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Correo enviado a través de SMTP: ${info.messageId}`);
        return info;
    }
}

// Función helper para publicar eventos (Simulación en local)
async function publishMessage(topicName, data) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[LOCAL] Evento publicado en ${topicName}:`, data.action || data.type);
        return;
    }
    try {
        const dataBuffer = Buffer.from(JSON.stringify(data));
        await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
    } catch (error) {
        console.error(`Error publicando en ${topicName}:`, error.message);
    }
}

// --- API: HEALTH CHECK ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend Running', dbMode: db.isProduction ? 'Cloud' : 'Local' });
});

// --- API: PROXY GEMINI (IA) ---
// Permite llamar a la IA de Google sin exponer la API Key en el frontend
app.all('/api-proxy/*', async (req, res) => {
    const targetUrl = `https://generativelanguage.googleapis.com${req.url.replace('/api-proxy', '')}`;
    let apiKey = req.query.key || process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'API Key de Gemini no configurada en el servidor' });

    const urlObj = new URL(targetUrl);
    urlObj.searchParams.set('key', apiKey);

    try {
        const response = await axios({
            method: req.method,
            url: urlObj.toString(),
            headers: { 'Content-Type': 'application/json', ...req.headers, host: new URL(targetUrl).host },
            data: req.body,
            responseType: 'stream'
        });
        res.set(response.headers);
        res.status(response.status);
        response.data.pipe(res);
    } catch (error) {
        console.error('Error en Proxy IA:', error.message);
        res.status(500).json({ error: 'Error conectando con Google AI' });
    }
});

// --- API: KNOWLEDGE BASE UPLOAD (Admin) ---
app.post('/api/admin/knowledge', upload.single('file'), async (req, res) => {
    try {
        const { title } = req.body;
        const file = req.file;

        if (!title || !file) {
            return res.status(400).json({ error: 'Faltan datos (título o archivo)' });
        }

        const sql = db.isProduction
            ? "INSERT INTO knowledge_base (title, filename, file_type) VALUES ($1, $2, $3) RETURNING id"
            : "INSERT INTO knowledge_base (title, filename, file_type) VALUES (?, ?, ?)";
        
        const result = await db.query(sql, [title, file.originalname, file.mimetype]);
        
        console.log(`📚 Nuevo documento en KB: ${title}`);
        res.status(200).json({ message: 'Documento registrado en la base de conocimiento' });

    } catch (error) {
        console.error('Error KB upload:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

app.get('/api/admin/knowledge', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM knowledge_base ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error recuperando KB' });
    }
});

// --- API: ADMIN - SUBIR CONCESIONARIOS DESDE JSON (FRONTEND) ---
app.post('/api/admin/import-dealers', async (req, res) => {
    try {
        const { dealers } = req.body;
        
        if (!Array.isArray(dealers) || dealers.length === 0) {
            return res.status(400).json({ error: 'Payload inválido o vacío. Se esperaba un JSON de concesionarios.' });
        }

        if (!db) {
            return res.status(500).json({ error: 'Base de datos SQLite no disponible en este entorno.' });
        }

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

        const validDealers = dealers.filter(d => d['__EMPTY_11']); // Solo los que tienen PDV
        insertMany(validDealers);

        res.status(200).json({ message: 'Importación exitosa', processedCount: insertCount });

    } catch (error) {
        console.error("Error importando concesionarios:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- UTILS: VALIDAR DNI/NIE ---
function validateDNI(dni) {
    if (!dni) return false;
    let validChars = 'TRWAGMYFPDXBNJZSQVHLCKET';
    let nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
    let nieRexp = /^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
    let str = dni.toString().toUpperCase().trim().replace(/[-_ ]/g, '');

    if (!nifRexp.test(str) && !nieRexp.test(str)) return false;

    let nie = str.replace(/^[X]/, '0').replace(/^[Y]/, '1').replace(/^[Z]/, '2');
    let letter = str.substr(-1);
    let charIndex = parseInt(nie.substr(0, 8)) % 23;

    return validChars.charAt(charIndex) === letter;
}

// --- API: LOGIN KAS Y STAFF COMPAÑIA ---
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Faltan credenciales' });
        }
        
        const cleanEmail = email.toLowerCase().trim();
        const cleanPassword = password.toUpperCase().trim().replace(/[-_ ]/g, '');

        if (!db) {
            return res.status(500).json({ error: 'DB no inicializada' });
        }

        // --- 1. SUPERADMIN BYPASS ---
        const superadminEmail = 'quoter.cpc@gmail.com';
        if (cleanEmail === superadminEmail && password === '999999') {
            return res.status(200).json({
                success: true,
                user: { id: 0, nombre: 'Admin CPC', email: cleanEmail, cargo: 'Super Admin', role: 'superadmin' }
            });
        }

        // --- 2. KAS / STAFF COMPAÑIA ---
        const kasUser = db.prepare('SELECT * FROM kas_users WHERE email = ?').get(cleanEmail);
        if (kasUser) {
            if (!validateDNI(cleanPassword)) {
                return res.status(400).json({ error: 'La contraseña debe ser un DNI/NIE válido con su letra correspondiente.' });
            }

            if (!kasUser.dni_password) {
                db.prepare('UPDATE kas_users SET dni_password = ? WHERE id = ?').run(cleanPassword, kasUser.id);
            } else if (kasUser.dni_password !== cleanPassword) {
                return res.status(401).json({ error: 'DNI / Contraseña incorrecta para este usuario.' });
            }

            return res.status(200).json({
                success: true,
                user: { id: kasUser.id, nombre: kasUser.nombre, email: kasUser.email, cargo: kasUser.cargo, role: 'kas' }
            });
        }

        // --- 3. VENDEDORES (SELLERS) ---
        const seller = db.prepare('SELECT * FROM seller_users WHERE email = ?').get(cleanEmail);
        if (seller) {
            if (seller.dni_password !== cleanPassword) {
                return res.status(401).json({ error: 'DNI / Contraseña incorrecta para este vendedor.' });
            }
            // Obtener PDVs permitidos con su info completa
            const pdvs = db.prepare(`
                SELECT d.codigo_pdv, d.nombre_pdv, d.tarifa_asignada, d.ver_comisiones, d.premium_program 
                FROM seller_dealerships sd
                JOIN dealerships d ON sd.codigo_pdv = d.codigo_pdv
                WHERE sd.seller_id = ?
            `).all(seller.id);

            return res.status(200).json({
                success: true,
                user: { 
                    id: seller.id, 
                    nombre: seller.nombre, 
                    email: seller.email, 
                    cargo: seller.rol, 
                    role: 'seller',
                    pdvs: pdvs // ahora trae objetos completos con config
                }
            });
        }

        // No existe en ningún sitio
        return res.status(404).json({ error: 'not_found' });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Error interno en el proceso de Login' });
    }
});

// --- API: REGISTRO PRIMER ACCESO VENDEDORES ---
app.post('/api/auth/register-seller', async (req, res) => {
    try {
        const { email, dni, nombre, rol, pdvCodes } = req.body;
        
        if (!email || !dni || !nombre || !rol || !pdvCodes || pdvCodes.length === 0) {
            return res.status(400).json({ error: 'Faltan datos requeridos (email, dni, nombre, rol, pdv/s)' });
        }

        const cleanEmail = email.toLowerCase().trim();
        const cleanPassword = dni.toUpperCase().trim().replace(/[-_ ]/g, '');

        if (!validateDNI(cleanPassword)) {
            return res.status(400).json({ error: 'El DNI/NIE de contraseña no es válido matemáticamente.' });
        }

        // Validar si existe ya como KAS
        const kasUser = db.prepare('SELECT * FROM kas_users WHERE email = ?').get(cleanEmail);
        if (kasUser) {
            return res.status(400).json({ error: 'Este email corresponde a staff corporativo. Loguéate normal.' });
        }

        let sellerId = null;
        
        const transaction = db.transaction(() => {
            const result = db.prepare(`
                INSERT INTO seller_users (email, nombre, rol, dni_password) 
                VALUES (?, ?, ?, ?)
                ON CONFLICT(email) DO UPDATE SET 
                nombre=excluded.nombre, rol=excluded.rol, dni_password=excluded.dni_password
            `).run(cleanEmail, nombre, rol, cleanPassword);

            sellerId = result.lastInsertRowid;
            
            // Si era un UPDATE, lastInsertRowid es 0, lo buscamos
            if (sellerId === 0) {
                const s = db.prepare('SELECT id FROM seller_users WHERE email = ?').get(cleanEmail);
                sellerId = s.id;
            }

            // Limpiamos los PDVs y metemos los nuevos
            db.prepare('DELETE FROM seller_dealerships WHERE seller_id = ?').run(sellerId);
            const insertPdv = db.prepare('INSERT INTO seller_dealerships (seller_id, codigo_pdv) VALUES (?, ?)');
            for (const code of pdvCodes) {
                insertPdv.run(sellerId, code);
            }
        });

        transaction();

        return res.status(200).json({ success: true, sellerId });

    } catch (error) {
        console.error("Seller Reg Error:", error);
        res.status(500).json({ error: 'Error del servidor registrando usuario' });
    }
});

// --- API: OBTENER CONCESIONARIOS PARA EL PANEL KAS ---
app.get('/api/kas/dealers', async (req, res) => {
    try {
        const { role, nombre } = req.query;
        if (!db) return res.status(500).json({ error: 'DB no inicializada' });

        if (role === 'superadmin') {
            const all = db.prepare('SELECT * FROM dealerships ORDER BY zona, nombre_kas, nombre_pdv').all();
            return res.json(all);
        } else if (role === 'kas') {
            if (!nombre) return res.status(400).json({ error: 'Falta nombre kas' });
            const myDealers = db.prepare('SELECT * FROM dealerships WHERE nombre_kas = ? ORDER BY nombre_pdv').all(nombre);
            return res.json(myDealers);
        }
        
        return res.status(403).json({ error: 'No autorizado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- API: EDITAR CONCESIONARIO KAS ---
app.put('/api/kas/dealers/:codigo_pdv', async (req, res) => {
    try {
        const { codigo_pdv } = req.params;
        const { tarifa_asignada, ver_comisiones, premium_program, nombre_kas } = req.body;
        const role = req.query.role; // Pásalo por query para chequear si admin puede cambiar el KAS

        if (!db) return res.status(500).json({ error: 'DB no inicializada' });

        let sql = 'UPDATE dealerships SET tarifa_asignada = ?, ver_comisiones = ?, premium_program = ?';
        let params = [tarifa_asignada, ver_comisiones, premium_program];

        if (role === 'superadmin' && nombre_kas !== undefined) {
             sql += ', nombre_kas = ?';
             params.push(nombre_kas);
        }

        sql += ' WHERE codigo_pdv = ?';
        params.push(codigo_pdv);

        db.prepare(sql).run(...params);
        return res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- API: CONSEGUIR TODAS LAS TARIFAS GLOBALES ---
app.get('/api/tariffs', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'DB no inicializada' });
        const all = db.prepare('SELECT id, nombre, created_at FROM tariffs ORDER BY nombre').all();
        // Insertamos hardcoded estándar si no hay nada
        const standard = [{ id: 'estandar', nombre: 'estandar' }, { id: 'prime', nombre: 'prime' }, { id: 'vip', nombre: 'vip' }];
        
        return res.json([...standard, ...all]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- API: SUBIR/CREAR TARIFA NUEVA (SUPERADMIN) ---
app.post('/api/admin/tariffs', async (req, res) => {
    try {
        const { nombre, datos_json } = req.body;
        if (!db) return res.status(500).json({ error: 'DB no inicializada' });
        
        db.prepare(`
            INSERT INTO tariffs (nombre, datos_json) VALUES (?, ?)
            ON CONFLICT(nombre) DO UPDATE SET datos_json = excluded.datos_json
        `).run(nombre, JSON.stringify(datos_json));

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- API: EDITAR ACUERDOS EN BLOQUE POR JERARQUIA ---
app.put('/api/kas/agreements', async (req, res) => {
    try {
        const { targetType, targetCode, tarifa_asignada, ver_comisiones, premium_program } = req.body;
        if (!db) return res.status(500).json({ error: 'DB no inicializada' });

        let sql = 'UPDATE dealerships SET tarifa_asignada = COALESCE(?, tarifa_asignada), ver_comisiones = COALESCE(?, ver_comisiones), premium_program = COALESCE(?, premium_program)';
        let params = [tarifa_asignada, ver_comisiones, premium_program];

        if (targetType === 'macro') {
            sql += ' WHERE codigo_macrocadena = ?';
        } else if (targetType === 'cadena') {
            sql += ' WHERE codigo_cadena = ? AND (codigo_macrocadena IS NULL OR codigo_macrocadena = "")';
        } else if (targetType === 'prescriptor') {
            sql += ' WHERE codigo_establecimiento = ? AND (codigo_cadena IS NULL OR codigo_cadena = "Sin Cadena" OR codigo_cadena = "") AND (codigo_macrocadena IS NULL OR codigo_macrocadena = "")';
        } else if (targetType === 'pdv') {
            sql += ' WHERE codigo_pdv = ?';
        } else {
            return res.status(400).json({ error: 'Invalid target type' });
        }

        params.push(targetCode);
        const info = db.prepare(sql).run(...params);
        return res.json({ success: true, updated: info.changes });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- API: BUSCADOR DE CONCESIONARIOS PARA REGISTRO VENDEDOR ---
app.get('/api/dealers/search', async (req, res) => {
    try {
        const q = req.query.q;
        if (!q || q.length < 3) return res.json([]);
        const stmt = db.prepare(`
            SELECT codigo_pdv, nombre_pdv, localidad, provincia, cif, codigo_establecimiento, nombre_establecimiento 
            FROM dealerships 
            WHERE nombre_pdv LIKE ? OR codigo_pdv LIKE ? OR nombre_establecimiento LIKE ?
            LIMIT 15
        `);
        const results = stmt.all(`%${q}%`, `%${q}%`, `%${q}%`);
        res.json(results);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- API: OBTENER TODOS LOS CONCESIONARIOS ---
app.get('/api/admin/dealers', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Base de datos SQLite no disponible en este entorno.' });
        }
        
        const stmt = db.prepare('SELECT * FROM dealerships ORDER BY zona, nombre_pdv');
        const dealers = stmt.all();
        
        res.status(200).json(dealers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/env-check', (req, res) => {
    res.json({
        hasBrevoKey: !!process.env.BREVO_API_KEY,
        hasBrevoSMTPPass: !!process.env.BREVO_SMTP_KEY || !!process.env.EMAIL_PASS,
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        vercelEnv: process.env.VERCEL_ENV
    });
});

app.get('/api/email/status', async (req, res) => {
    // Evitar que Vercel o el navegador cacheen esta respuesta
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    try {
        const hasApiKey = !!process.env.BREVO_API_KEY;
        const hasSmtpConfig = !!((process.env.BREVO_SMTP_USER || SMTP_USER) && (process.env.BREVO_SMTP_KEY || process.env.EMAIL_PASS));
        
        // Es válido si hay API KEY de Brevo (recomendado) O si hay credenciales SMTP clásicas
        const isConfigured = hasApiKey || hasSmtpConfig;
        
        const envKeys = Object.keys(process.env).filter(k => k.includes('BREVO') || k.includes('EMAIL') || k.includes('SMTP') || k.includes('API'));

        res.status(200).json({ 
            connected: isConfigured, 
            mode: 'production',
            envKeys: envKeys
        });
    } catch (error) {
         res.status(200).json({ connected: false, mode: 'error', error: error.message });
    }
});

// --- API: EMAIL - ENVÍO DOCUMENTACIÓN GENÉRICA (Con Adjunto) ---
app.post('/api/email/send-documentation', upload.array('files', 5), async (req, res) => {
    try {
        const { to, subject, body } = req.body;
        const files = req.files;

        if (!to || !subject) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (destinatario, asunto)' });
        }

        let attachments = [];
        if (files && files.length > 0) {
            attachments = files.map(file => ({
                filename: file.originalname || 'Documento.pdf',
                content: file.buffer
            }));
        }

        const text = body || "Se adjunta la documentación solicitada.\n\nEste mensaje se generó desde Quoter.";
        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #000; font-weight: 300;">Documentación Generada por Quoter</h2>
                <p>${body ? body.replace(/\n/g, '<br/>') : 'Adjunto encontrará la documentación solicitada de su oferta financiera.'}</p>
                <p>No responda a este correo electrónico.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666; text-align: center;">
                    Este es un correo generado automáticamente.
                </p>
            </div>
        `;

        const info = await sendEmailBrevo(to, subject, text, html, attachments);
        console.log(`📧 Documentación enviada a ${to}: ${info.messageId}`);
        
        await publishMessage(TOPIC_EMAIL_NOTIFICATION, { type: 'DOCS_SENT', to: to });
        res.status(200).json({ message: 'Documentación enviada correctamente', messageId: info.messageId });

    } catch (error) {
        console.error('❌ Error enviando documentación:', error);
        res.status(500).json({ error: 'Error al enviar el correo', details: error.message });
    }
});

// --- API: EMAIL - ENVÍO REFI (Con Adjunto) ---
app.post('/api/email/send-refi', upload.single('file'), async (req, res) => {
    try {
        const { dni } = req.body;
        const file = req.file;

        if (!dni || !file) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (DNI o Archivo)' });
        }
        
        const attachments = [
            {
                filename: file.originalname || 'Justificante_REFI.pdf',
                content: file.buffer
            }
        ];
        
        const subject = `${dni.toUpperCase()} / Justificante de Cancelación Financiera REFI`;
        const text = `Se adjunta documento de cancelación REFI para el DNI ${dni}.\n\nEste es un mensaje automático generado desde Quoter Automotive.`;
        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #000; font-weight: 300;">Cancelación Financiera REFI</h2>
                <p>Se adjunta el justificante correspondiente al DNI: <strong>${dni.toUpperCase()}</strong></p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666; text-align: center;">
                    Este es un correo generado automáticamente desde Quoter Automotive.
                </p>
            </div>
        `;

        const info = await sendEmailBrevo('consultas.auto@caixabankpc.com', subject, text, html, attachments);
        console.log(`📧 Email REFI enviado (${dni}): ${info.messageId}`);
        
        await publishMessage(TOPIC_EMAIL_NOTIFICATION, { type: 'REFI_SENT', dni: dni });
        res.status(200).json({ message: 'Correo enviado correctamente', messageId: info.messageId });

    } catch (error) {
        console.error('❌ Error enviando email REFI:', error);
        res.status(500).json({ error: 'Error al enviar el correo. Verifica la configuración del servidor.', details: error.message });
    }
});

// --- API: EMAIL - NOTIFICACIÓN GENERAL (Con o Sin Adjuntos) ---
app.post('/api/email/send-notification', upload.array('files', 5), async (req, res) => {
    try {
        const { to, subject, body } = req.body;
        const files = req.files || [];

        if (!to || !subject || !body) {
             return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        let attachments = [];
        if (files && files.length > 0) {
            attachments = files.map(file => ({
                filename: file.originalname,
                content: file.buffer
            }));
        }

        const info = await sendEmailBrevo(to, subject, body, null, attachments);
        res.status(200).json({ message: 'Notificación enviada correctamente', messageId: info.messageId });

    } catch (error) {
        console.error('❌ Error enviando notificación:', error);
        res.status(500).json({ error: 'Error al enviar la notificación', details: error.message });
    }
});

// --- API: EMAIL - TEST SMTP ---
app.post('/api/email/test', async (req, res) => {
    try {
        const { to } = req.body;
        if (!to) return res.status(400).json({ error: 'Falta el destinatario' });

        const info = await sendEmailBrevo(
            to, 
            'Prueba de conexión SMTP/REST - Quoter', 
            'Si estás leyendo esto, la configuración de Brevo (SMTP/REST) funciona correctamente. 🎉'
        );
        res.status(200).json({ message: 'Correo de prueba enviado correctamente', messageId: info.messageId });
    } catch (error) {
        console.error('❌ Error enviando correo de prueba:', error);
        res.status(500).json({ error: 'Error al enviar el correo de prueba', details: error.message });
    }
});

// --- API: LOGIN ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    try {
        if (cleanEmail === 'tramicar') {
            const sql = db.isProduction ? "SELECT * FROM users WHERE email = $1" : "SELECT * FROM users WHERE email = ?";
            const result = await db.query(sql, ['tramicar']); 
            const user = result.rows[0];

            if (!user) return res.status(401).json({ error: 'Usuario sistema no encontrado' });

            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: 86400 });
            return res.status(200).json({ auth: true, token, userId: user.id, role: user.role, name: user.name });
        }

        const sql = db.isProduction ? "SELECT * FROM users WHERE email = $1" : "SELECT * FROM users WHERE email = ?";
        const result = await db.query(sql, [cleanEmail]);
        let user = result.rows[0];

        if (!user) {
            // Usuario no existe, lo creamos automáticamente (correo como usuario, DNI como contraseña)
            const hashedPassword = bcrypt.hashSync(password, 8);
            const insertSql = db.isProduction 
                ? "INSERT INTO users (email, dni, password, role, name, is_first_login) VALUES ($1, $2, $3, 'normal', $1, true) RETURNING *"
                : "INSERT INTO users (email, dni, password, role, name, is_first_login) VALUES (?, ?, ?, 'normal', ?, 1)";
            
            if (db.isProduction) {
                const insertResult = await db.query(insertSql, [cleanEmail, password, hashedPassword]);
                user = insertResult.rows[0];
            } else {
                await db.query(insertSql, [cleanEmail, password, hashedPassword, cleanEmail]);
                const newResult = await db.query(sql, [cleanEmail]);
                user = newResult.rows[0];
            }
        } else {
            // Usuario existe, validamos contraseña
            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: 86400 });
        res.status(200).json({ auth: true, token, userId: user.id, email: user.email, role: user.role, name: user.name });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// --- API: GUARDAR OFERTA ---
app.post('/api/offers', async (req, res) => {
    const { userDni, clientName, vehicleModel, offerData } = req.body;
    try {
        const sql = db.isProduction 
            ? "INSERT INTO offers (user_dni, client_name, vehicle_model, data) VALUES ($1, $2, $3, $4) RETURNING id"
            : "INSERT INTO offers (user_dni, client_name, vehicle_model, data) VALUES (?, ?, ?, ?)";
            
        const result = await db.query(sql, [userDni, clientName, vehicleModel, JSON.stringify(offerData)]);
        const offerId = db.isProduction ? result.rows[0].id : result.lastID;

        await publishMessage(TOPIC_QUOTE_PROCESSING, { offerId, action: 'ANALYZE_OFFER', data: offerData });
        res.json({ message: 'Oferta guardada', id: offerId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Solo escuchamos en el puerto si estamos en entorno local (No Firebase ni Vercel)
const isServerless = !!process.env.FIREBASE_CONFIG || !!process.env.VERCEL;

if (!isServerless) {
    const startServer = async () => {
        if (process.env.NODE_ENV !== 'production') {
            const { createServer: createViteServer } = await import('vite');
            const vite = await createViteServer({
                server: { middlewareMode: true },
                appType: 'spa',
            });
            app.use(vite.middlewares);
        } else {
            app.get('*', (req, res) => {
                res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
            });
        }

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`\n🚀 SERVIDOR QUOTER ESCUCHANDO EN PUERTO ${PORT} (Modo Local)`);
        });
    };
    startServer();
}

// Exportación por defecto para Vercel/Firebase Serverless Functions
export default app;
