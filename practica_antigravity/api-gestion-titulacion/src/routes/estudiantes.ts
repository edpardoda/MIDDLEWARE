import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

const estudiantesRoutes: FastifyPluginAsyncTypebox = async (fastify) => {

    // GET /estudiantes
    fastify.get('/', {
        schema: {
            tags: ['Estudiantes'],
            summary: 'Listar todos los estudiantes',
            response: {
                200: Type.Array(Type.Object({
                    idEstudiante: Type.Integer(),
                    semestre: Type.Union([Type.Literal('Septimo'), Type.Literal('Octavo'), Type.Null()]),
                    Usuario: Type.Object({
                        idUsuario: Type.Integer(),
                        Nombres: Type.Union([Type.String(), Type.Null()]),
                        Apellidos: Type.Union([Type.String(), Type.Null()]),
                        Correo_Institucional: Type.Union([Type.String(), Type.Null()])
                    })
                }))
            }
        }
    }, async (request, reply) => {
        return fastify.prisma.estudiante.findMany({
            include: { Usuario: true }
        });
    });

    // POST /estudiantes would go here
};

export default estudiantesRoutes;
