
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

// Configuración de rutas para que funcione en Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURACIÓN ---
// IMPORTANTE: El ID debe ser minúsculas. Lo forzamos abajo.
// Si tu proyecto se llama "quoterappproduction", ponlo aquí.
// El ID por defecto es 'quoter-74545691' si no tienes uno propio.
let PROJECT_ID = 'quoter-74545691'; 

// AUTO-CORRECCIÓN: Convertir a minúsculas para evitar el error de Firebase
PROJECT_ID = PROJECT_ID.toLowerCase();

// Interfaz para preguntas
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

// Función para ejecutar comandos en la terminal de forma segura
const run = (cmd, ignoreError = false) => {
    try {
        // 'shell: true' es la clave para que Windows entienda los comandos
        execSync(cmd, { stdio: 'inherit', shell: true });
        return true;
    } catch (e) {
        if (!ignoreError) {
            console.error(`\n❌ Error ejecutando: ${cmd}`);
            console.error("💡 Consejo: Si es un error de permisos, intenta ejecutar la terminal como Administrador.");
            console.error("El proceso se ha detenido por el error de arriba.\n");
            process.exit(1);
        }
        return false;
    }
};

async function main() {
    console.log("\n===================================================");
    console.log("🚗  QUOTER AUTOMOTIVE - ASISTENTE DE DESPLIEGUE  🚗");
    console.log("    (Versión Automática v5.1 - Fix Mayúsculas)");
    console.log("===================================================\n");
    console.log(`ℹ️  Proyecto objetivo: ${PROJECT_ID}\n`);

    // 0. AUTO-REPARACIÓN
    console.log("🧹 Paso 0/6: Reparando archivos de configuración...");

    try {
        const firebasercPath = path.join(__dirname, '.firebaserc');
        // Nos aseguramos que el archivo .firebaserc tenga el ID correcto en minúsculas
        const firebasercContent = {
            "projects": {
                "default": PROJECT_ID
            }
        };
        fs.writeFileSync(firebasercPath, JSON.stringify(firebasercContent, null, 2));
        console.log("   ✅ Archivo .firebaserc corregido.");

        const firebaseCachePath = path.join(__dirname, '.firebase');
        if (fs.existsSync(firebaseCachePath)) {
            fs.rmSync(firebaseCachePath, { recursive: true, force: true });
            console.log("   ✅ Caché (.firebase) limpiada.");
        }
    } catch (e) {
        console.log("   ⚠️  Advertencia durante la limpieza (continuando...):", e.message);
    }

    // 1. Verificar herramientas
    console.log("\n🔍 1. Verificando herramientas...");
    try {
        execSync('firebase --version', { stdio: 'ignore', shell: true });
    } catch (e) {
        console.log("⚠️  Firebase CLI no encontrado. Instalando automáticamente...");
        run('npm install -g firebase-tools');
    }

    // 2. Verificar Login (Mejorado)
    console.log("\n🔑 Paso 1/6: Verificando sesión...");
    try {
        // Intentamos listar proyectos. Si falla, es que no hay sesión o el token expiró.
        execSync('firebase projects:list', { stdio: 'ignore', shell: true });
        console.log("   ✅ Sesión activa detectada.");
    } catch (e) {
        console.log("\n⚠️  Parece que no has iniciado sesión o la sesión ha caducado.");
        console.log("👉 Se abrirá una ventana en tu navegador para que entres con tu cuenta de Google.");
        console.log("👉 Por favor, inicia sesión y vuelve a la terminal.");
        
        // Ejecutamos login interactivo
        // Si falla aquí, el script se detendrá gracias a la función run()
        run('firebase login');
    }

    // 3. Configurar Proyecto
    console.log("\n☁️  Paso 2/6: Conectando con la nube...");
    console.log(`👉 Configurando proyecto: ${PROJECT_ID}`);
    
    // Intentamos usar el proyecto. Si falla porque no existe, intentamos crearlo o añadirlo.
    const successConfig = run(`firebase use ${PROJECT_ID}`, true);
    
    if (!successConfig) {
        console.log(`⚠️  El proyecto '${PROJECT_ID}' no parece estar en tu lista local.`);
        console.log("   Intentando añadirlo a la configuración...");
        // Intentamos añadirlo como alias default
        const addSuccess = run(`firebase use --add ${PROJECT_ID} --alias default`, true);
        
        if (!addSuccess) {
            console.error("\n❌ ERROR CRÍTICO: No se puede acceder al proyecto.");
            console.error(`1. Asegúrate de que el proyecto '${PROJECT_ID}' existe en tu consola de Firebase.`);
            console.error("2. Asegúrate de que tu usuario tiene permisos sobre él.");
            console.error("3. Si el proyecto es nuevo, créalo primero en https://console.firebase.google.com");
            process.exit(1);
        }
    }

    // 4. CONFIGURACIÓN BASE DE DATOS (NUEVO)
    console.log("\n💾  Paso 3/6: Configuración de Base de Datos (Memoria Persistente)...");
    console.log("   Si usas Supabase, tus datos no se borrarán al reiniciar el servidor.");
    
    const useDb = await askQuestion("   ¿Quieres configurar una DATABASE_URL externa ahora? (s/n): ");
    
    if (useDb.toLowerCase() === 's' || useDb.toLowerCase() === 'si' || useDb.toLowerCase() === 'y') {
        const dbUrl = await askQuestion("   👉 Pega tu Connection String de Supabase: ");
        if (dbUrl && dbUrl.trim().length > 0) {
            const envPath = path.join(__dirname, 'server', '.env');
            let envContent = '';
            
            if (fs.existsSync(envPath)) {
                envContent = fs.readFileSync(envPath, 'utf8');
            }

            // Reemplazar o añadir DATABASE_URL
            if (envContent.includes('DATABASE_URL=')) {
                envContent = envContent.replace(/DATABASE_URL=.*/g, `DATABASE_URL="${dbUrl.trim()}"`);
            } else {
                envContent += `\nDATABASE_URL="${dbUrl.trim()}"`;
            }

            fs.writeFileSync(envPath, envContent);
            console.log("   ✅ DATABASE_URL guardada en server/.env correctamente.");
        } else {
            console.log("   ⚠️  URL vacía. Se usará memoria volátil.");
        }
    } else {
        console.log("   ⚠️  Saltando configuración de DB. Los datos serán temporales.");
    }
    rl.close();

    // 5. Construir la Web (Frontend)
    console.log("\n📦  Paso 4/6: Construyendo la web...");
    run('npm install');
    run('npm run build');

    // 6. Preparar el Servidor (Backend)
    console.log("\n⚙️  Paso 5/6: Preparando el servidor...");
    const serverDir = path.join(__dirname, 'server');
    if (fs.existsSync(serverDir)) {
        process.chdir(serverDir);
        
        try {
            const pkgPath = path.join(serverDir, 'package.json');
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            if (pkg.engines?.node !== '22') {
                console.log("   🔧 Actualizando motor Node.js a v22...");
                pkg.engines = { "node": "22" };
                fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
            }
        } catch (e) {
            console.log("   ⚠️ No se pudo verificar package.json del servidor.");
        }

        run('npm install --production');
        process.chdir(__dirname);
    } else {
        console.error("❌ Error: No encuentro la carpeta 'server'.");
        process.exit(1);
    }

    // 7. Subir a la nube
    console.log("\n🔥  Paso 6/6: Subiendo a Firebase...");
    run('firebase deploy --only hosting,functions');

    console.log("\n✅ ¡ÉXITO! TU APP ESTÁ ONLINE.");
    console.log("🌍 Abre la URL que aparece arriba ('Hosting URL') para verla.");
    console.log("===================================================");
}

main();
