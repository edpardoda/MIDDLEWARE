import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
dotenv.config();

async function authPlugin(fastify, options) {

    // Registrar JWT
    await fastify.register(jwt, {
        secret: process.env.JWT_SECRET || 'supersecret'
    });

    // Middleware de autenticación
    fastify.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify();
        } catch (error) {
            return reply.status(401).send({
                error: 'Unauthorized',
                message: 'Invalid or missing token'
            });
        }
    });

    // Middleware de rol admin
    fastify.decorate("requireAdmin", async function (request, reply) {
        try {
            const user = request.user;

            if (user.role !== 'admin') {
                return reply.status(403).send({
                    error: 'Forbidden',
                    message: 'Admin access required'
                });
            }

        } catch (error) {
            return reply.status(401).send({
                error: 'Unauthorized',
                message: 'Invalid or missing token'
            });
        }
    });
}

export default fp(authPlugin);
