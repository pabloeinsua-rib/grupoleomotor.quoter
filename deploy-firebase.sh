
#!/bin/bash

# Script de despliegue específico para Firebase
set -e

echo ""
echo "🔥  QUOTER AUTOMOTIVE - DESPLIEGUE A FIREBASE  🔥"
echo "================================================="
echo ""

# 1. Comprobaciones
if ! command -v firebase &> /dev/null
then
    echo "❌ ERROR: No tienes 'firebase-tools' instalado."
    echo "Ejecuta: npm install -g firebase-tools"
    exit 1
fi

# 2. Login
echo "🔑 Verificando sesión..."
if ! firebase projects:list &> /dev/null; then
    echo "⚠️  Inicia sesión en el navegador..."
    firebase login
fi

# 3. Configuración de Memoria (Base de Datos)
echo ""
echo "💾  CONFIGURACIÓN DE MEMORIA (BASE DE DATOS)"
echo "---------------------------------------------"
echo "En Firebase, la memoria interna se borra si la app no se usa por unos minutos."
echo "Para guardar datos permanentemente, necesitas una base de datos externa (PostgreSQL)."
echo ""
read -p "¿Quieres configurar una DATABASE_URL externa ahora? (s/n): " CONFIGURE_DB

if [[ "$CONFIGURE_DB" =~ ^[Ss]$ ]]; then
    read -p "👉 Introduce tu DATABASE_URL (ej: postgres://...): " DB_URL
    
    if [ -n "$DB_URL" ]; then
        # Escribir en server/.env
        # Si existe .env, reemplazamos la línea, si no, la añadimos
        ENV_FILE="server/.env"
        if grep -q "DATABASE_URL=" "$ENV_FILE"; then
            # Usamos sed diferente para Mac y Linux para compatibilidad
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=\"$DB_URL\"|" "$ENV_FILE"
            else
                sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"$DB_URL\"|" "$ENV_FILE"
            fi
        else
            echo "" >> "$ENV_FILE"
            echo "DATABASE_URL=\"$DB_URL\"" >> "$ENV_FILE"
        fi
        echo "✅ DATABASE_URL guardada en la configuración."
    else
        echo "⚠️  URL vacía. Se usará memoria volátil."
    fi
else
    echo "⚠️  Usando memoria volátil (SQLite en /tmp). Los datos se borrarán tras inactividad."
fi

# 4. Construcción
echo ""
echo "📦  Construyendo Frontend..."
npm install
npm run build

echo "⚙️  Preparando Backend..."
cd server
npm install --production
cd ..

# 5. Despliegue
echo ""
echo "🚀  Subiendo a la nube de Firebase..."
firebase deploy --only hosting,functions

echo ""
echo "✅ ¡DESPLIEGUE A FIREBASE COMPLETADO!"
echo "================================================="
