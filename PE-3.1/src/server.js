import dotenv from 'dotenv';
import fastify from 'fastify';
import authPlugin from './plugin/auth.js';
import recordsRoutes from './routes/records.routes.js';
import auditRoutes from './routes/audit.route.js';
import authRoutes from './routes/auth.routes.js';


dotenv.config();

const app = fastify({
    logger: true
});

//plugin
import cors from '@fastify/cors';

//rutas
//import userRoutes from './routes/userRoutes.js';



//Configuracion a la base de datos
import testConnection from './config/database.js';
import { sendEmail } from './service/email.service.js';
import { success } from 'zod';

async function startServer() {
    try {
        await app.register(cors, {
            origin: '*'
        });

        await app.register(authPlugin);
        await app.register(authRoutes, { prefix: '/auth' });
        await app.register(recordsRoutes, { prefix: '/records' });
        await app.register(auditRoutes, { prefix: '/audit' });

        app.post('/send-email', async (request, reply) => {
            const { to, subject, text } = request.body;
            if (!to || !subject || !text) {
                return reply.status(400).send({ message: 'Faltan datos' });
            }

            try {
                const result = await sendEmail(to, subject, text);
                reply.send({ success: true, message: 'Email enviado correctamente' });
            } catch (error) {
                reply.status(500).send({ success: false, message: 'Error al enviar email' });
            }
        });

        app.get('/', async (request, reply) => {
            reply.send({ message: 'Bienvenido a la API' });
        });

        await testConnection();
        await app.listen({
            port: process.env.PORT || 3000,
            host: '0.0.0.0'
        });
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

startServer();


export default app;