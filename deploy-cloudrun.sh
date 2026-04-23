
#!/bin/bash

# Script de despliegue para Google Cloud Run
set -e

echo ""
echo "🚗  QUOTER AUTOMOTIVE - DESPLIEGUE A GOOGLE CLOUD RUN  🚗"
echo "========================================================="
echo ""

# 1. Comprobaciones previas
if ! command -v gcloud &> /dev/null
then
    echo "❌ ERROR: No tienes 'gcloud CLI' instalado."
    echo "Por favor, instálalo desde: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# 2. Configuración del Proyecto
echo "📋 Configuración:"
read -p "👉 Introduce tu GOOGLE CLOUD PROJECT ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: El Project ID es obligatorio."
    exit 1
fi

REGION="europe-west1" # Puedes cambiar esto por tu región preferida (ej: us-central1)
SERVICE_NAME="quoter-automotive"

echo ""
echo "⚙️  Configurando proyecto: $PROJECT_ID en región $REGION..."
gcloud config set project $PROJECT_ID

# 3. Despliegue
echo ""
echo "🚀  Iniciando despliegue a Cloud Run (Source Deploy)..."
echo "    Esto construirá la imagen Docker en la nube y desplegará el servicio."
echo "    Puede tardar unos minutos."
echo "---------------------------------------------------------"

gcloud run deploy $SERVICE_NAME \
    --source . \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars NODE_ENV=production

echo ""
echo "✅ ¡DESPLIEGUE COMPLETADO!"
echo "🌍 Tu aplicación está disponible en la URL que aparece arriba."
echo "========================================================="
