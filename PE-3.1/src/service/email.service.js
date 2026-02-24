import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configuración del transporte de Nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

/**
 * Envía un correo electrónico.
 * @param {string} to - Destinatario
 * @param {string} subject - Asunto
 * @param {string} text - Contenido del correo
 * @returns {Object} Resultado con success y mensaje
 */
export const sendEmail = async (to, subject, text) => {
    try {
        console.log("Enviando email a:", to);

        const mailOptions = {
            from: `"MCP Server" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Correo enviado:", info.response);

        return {
            success: true,
            message: "Correo enviado correctamente",
            id: info.messageId
        };
    } catch (error) {
        console.error("Error al enviar email:", error);
        return {
            success: false,
            message: "Error al enviar email",
            error: error.message
        };
    }
};
