import { Type } from '@sinclair/typebox';
const avancesRoutes = async (fastify) => {
    // Helper Schema
    const AvanceSchema = Type.Object({
        idAvance: Type.Integer(),
        semana: Type.Union([Type.Integer(), Type.Null()]),
        contenido: Type.Union([Type.String(), Type.Null()]),
        calificacion: Type.Union([Type.Number(), Type.Null()]),
        estado: Type.Union([Type.String(), Type.Null()]),
        Propuesta: Type.Optional(Type.Object({
            tema: Type.Union([Type.String(), Type.Null()])
        }))
    });
    // GET /avances
    fastify.get('/', {
        schema: {
            tags: ['Avances'],
            summary: 'Listar todos los avances',
            response: {
                200: Type.Array(AvanceSchema)
            }
        }
    }, async (request, reply) => {
        const avances = await fastify.prisma.avance.findMany({
            include: {
                Propuesta: true
            }
        });
        return avances.map(a => ({
            ...a,
            calificacion: a.calificacion ? Number(a.calificacion) : null
        }));
    });
    // POST /avances
    fastify.post('/', {
        schema: {
            tags: ['Avances'],
            summary: 'Registrar nuevo avance',
            body: Type.Object({
                semana: Type.Integer(),
                contenido: Type.String(),
                Propuesta_id: Type.Integer()
            }),
            response: {
                201: AvanceSchema
            }
        }
    }, async (request, reply) => {
        const { semana, contenido, Propuesta_id } = request.body;
        const nuevoAvance = await fastify.prisma.avance.create({
            data: {
                semana,
                contenido,
                fecha_entrega: new Date(),
                estado: 'entregado',
                Propuesta_tesis_idPropuesta_tesis: Propuesta_id
            },
            include: { Propuesta: true }
        });
        reply.status(201);
        return {
            ...nuevoAvance,
            calificacion: null // Inicialmente es null
        };
    });
};
export default avancesRoutes;
//# sourceMappingURL=avances.js.map