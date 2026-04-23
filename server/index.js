
const { onRequest } = require("firebase-functions/v2/https");
const app = require("./server");

// Exportamos la API como una función HTTPS de Gen 2
// Esto crea una URL que será usada por el hosting para redirigir /api
exports.api = onRequest({
    region: "europe-west1", // Ajusta a tu región preferida (ej: us-central1)
    memory: "512MiB",
    maxInstances: 10,
}, app);
