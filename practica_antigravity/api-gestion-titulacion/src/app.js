import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import prismaPlugin from './plugins/prisma.js'; // Note .js extension for ESM
import estudiantesRoutes from './routes/estudiantes.js';
import propuestasRoutes from './routes/propuestas.js';
import avancesRoutes from './routes/avances.js';
import evaluacionesRoutes from './routes/evaluaciones.js';
export const buildApp = async () => {
    const app = Fastify({
        logger: true
    }).withTypeProvider();
    // Plugins
    await app.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'API Gestión Titulación',
                description: 'API REST para el sistema de titulación',
                version: '1.0.0'
            },
            tags: [
                { name: 'Estudiantes', description: 'Gestión de estudiantes' }
            ]
        }
    });
    await app.register(fastifySwaggerUi, {
        routePrefix: '/documentation',
    });
    await app.register(prismaPlugin);
    // Rutas
    await app.register(estudiantesRoutes, { prefix: '/estudiantes' });
    await app.register(propuestasRoutes, { prefix: '/propuestas' });
    await app.register(avancesRoutes, { prefix: '/avances' });
    await app.register(evaluacionesRoutes, { prefix: '/evaluaciones' });
    return app;
};
//# sourceMappingURL=app.js.map