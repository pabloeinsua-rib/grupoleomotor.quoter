const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Para manejar archivos en memoria

// Configuración
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json());

// Configuración del Transporter (Usar Gmail, Outlook, o SMTP corporativo)
// NOTA: Para Gmail, necesitas una "App Password", no tu contraseña normal.
const transporter = nodemailer.createTransport({
    service: 'gmail', // O 'hotmail', o host SMTP específico
    auth: {
        user: process.env.EMAIL_USER, // Tu correo (ej: no-reply@quoter.com)
        pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación
    }
});

// Ruta para verificar estado
app.get('/', (req, res) => {
    res.send('Quoter Mail Server is Running');
});

// Endpoint para envío de correos REFI (con adjunto)
app.post('/api/send-refi', upload.single('file'), async (req, res) => {
    try {
        const { dni } = req.body;
        const file = req.file;

        if (!dni || !file) {
            return res.status(400).json({ error: 'Faltan datos (DNI o Archivo)' });
        }

        const mailOptions = {
            from: '"Quoter Automotive" <documentacion@quoter.es>',
            to: 'consultas.auto@caixabankpc.com',
            subject: `${dni.toUpperCase()} / Justificante de Cancelación Financiera REFI`,
            text: "Adjuntamos Documento de Cancelación REFI, para cerrar incidencia.\n\nEste es un mensaje automático generado desde Quoter Automotive.\nGracias.\nSaludos.",
            attachments: [
                {
                    filename: file.originalname || 'Justificante_REFI.pdf',
                    content: file.buffer
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado: ' + info.response);
        res.status(200).json({ message: 'Correo enviado correctamente', messageId: info.messageId });

    } catch (error) {
        console.error('Error enviando email:', error);
        res.status(500).json({ error: 'Error al enviar el correo', details: error.message });
    }
});

// Endpoint para envío de correos genéricos (Sin adjunto)
app.post('/api/send-notification', async (req, res) => {
    try {
        const { to, subject, body } = req.body;

        const mailOptions = {
            from: '"Quoter Automotive" <documentacion@quoter.es>',
            to: to,
            subject: subject,
            text: body
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Notificación enviada' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de correo escuchando en el puerto ${PORT}`);
});