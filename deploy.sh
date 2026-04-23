
#!/bin/bash

# Este script hace todo el trabajo sucio.
set -e

echo ""
echo "🚗  QUOTER AUTOMOTIVE - ASISTENTE DE DESPLIEGUE  🚗"
echo "==================================================="
echo ""

# 1. Comprobar si tenemos las herramientas
if ! command -v npm &> /dev/null
then
    echo "❌ ERROR: No tienes Node.js instalado."
    echo "Por favor, instálalo desde: https://nodejs.org/"
    exit 1
fi

if ! command -v firebase &> /dev/null
then
    echo "🛠️  Instalando herramientas de Firebase..."
    npm install -g firebase-tools
fi

# 2. Iniciar sesión si hace falta
echo "🔑 Verificando sesión de Google..."
# Intentamos listar proyectos para ver si estamos logueados
if ! firebase projects:list &> /dev/null; then
    echo "⚠️  Necesitas iniciar sesión. Se abrirá tu navegador..."
    firebase login
fi

# 3. Construir la Web (Frontend)
echo ""
echo "📦  1/3 Construyendo la página web (React)..."
echo "---------------------------------------------"
npm install
npm run build

# 4. Preparar el Servidor (Backend)
echo ""
echo "⚙️  2/3 Preparando el servidor..."
echo "---------------------------------------------"
cd server
npm install --production
cd ..

# 5. Subir a la nube
echo ""
echo "🔥  3/3 Subiendo a Firebase (Esto puede tardar unos minutos)..."
echo "---------------------------------------------"
# Usamos el proyecto configurado en .firebaserc
firebase deploy --only hosting,functions

echo ""
echo "✅ ¡LISTO! TU APP ESTÁ EN INTERNET."
echo "🌍 Abre la URL que aparece arriba (Hosting URL) para verla."
echo "==================================================="
