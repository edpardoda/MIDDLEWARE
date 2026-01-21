import dotenv from 'dotenv';
import fastify from 'fastify';
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

async function startServer() {
    try {
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




app.get('/', async (request, reply) => {
    reply.send({ hello: 'world' });
});

export default app;