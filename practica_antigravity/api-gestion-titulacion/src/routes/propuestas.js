import { Type } from '@sinclair/typebox';
const propuestasRoutes = async (fastify) => {
    // Helper Schema for Propuesta
    const PropuestaSchema = Type.Object({
        idPropuesta_tesis: Type.Integer(),
        tema: Type.Union([Type.String(), Type.Null()]),
        objetivos: Type.Union([Type.String(), Type.Null()]),
        estado: Type.Union([Type.String(), Type.Null()]),
        Estudiante: Type.Optional(Type.Object({
            Usuario: Type.Object({
                Nombres: Type.Union([Type.String(), Type.Null()]),
                Apellidos: Type.Union([Type.String(), Type.Null()])
            })
        }))
    });
    // GET /propuestas
    fastify.get('/', {
        schema: {
            tags: ['Propuestas'],
            summary: 'Listar todas las propuestas',
            response: {
                200: Type.Array(PropuestaSchema)
            }
        }
    }, async (request, reply) => {
        return fastify.prisma.propuesta_tesis.findMany({
            include: {
                Estudiante: {
                    include: { Usuario: true }
                }
            }
        });
    });
    // POST /propuestas
    fastify.post('/', {
        schema: {
            tags: ['Propuestas'],
            summary: 'Crear nueva propuesta',
            body: Type.Object({
                tema: Type.String(),
                objetivos: Type.String(),
                problematica: Type.String(),
                alcance: Type.String(),
                Estudiante_idEstudiante: Type.Integer()
            }),
            response: {
                201: PropuestaSchema
            }
        }
    }, async (request, reply) => {
        const { tema, objetivos, problematica, alcance, Estudiante_idEstudiante } = request.body;
        const nuevaPropuesta = await fastify.prisma.propuesta_tesis.create({
            data: {
                tema,
                objetivos,
                problematica,
                alcance,
                Estudiante_idEstudiante,
                estado: 'Pendiente'
            },
            include: {
                Estudiante: { include: { Usuario: true } }
            }
        });
        reply.status(201);
        return nuevaPropuesta;
    });
};
export default propuestasRoutes;
//# sourceMappingURL=propuestas.js.map