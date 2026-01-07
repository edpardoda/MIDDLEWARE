import { Type } from '@sinclair/typebox';
const evaluacionesRoutes = async (fastify) => {
    // Helper Schema
    const EvaluacionSchema = Type.Object({
        idEvaluacion: Type.Integer(),
        rol_revisor: Type.Union([Type.String(), Type.Null()]),
        comentarios: Type.Union([Type.String(), Type.Null()]),
        calificacion: Type.Union([Type.Number(), Type.Null()]),
        fecha_evaluacion: Type.Union([Type.String(), Type.Null()]), // Date as string
        Usuario: Type.Object({
            Nombres: Type.Union([Type.String(), Type.Null()]),
            Apellidos: Type.Union([Type.String(), Type.Null()])
        })
    });
    // GET /evaluaciones
    fastify.get('/', {
        schema: {
            tags: ['Evaluaciones'],
            summary: 'Listar todas las evaluaciones',
            response: {
                200: Type.Array(EvaluacionSchema)
            }
        }
    }, async (request, reply) => {
        const evaluaciones = await fastify.prisma.evaluacion_Propuesta.findMany({
            include: {
                Usuario: true
            }
        });
        return evaluaciones.map(e => ({
            ...e,
            calificacion: e.calificacion ? Number(e.calificacion) : null,
            fecha_evaluacion: (e.fecha_evaluacion?.toISOString().split('T')[0]) ?? null
        }));
    });
    // POST /evaluaciones
    fastify.post('/', {
        schema: {
            tags: ['Evaluaciones'],
            summary: 'Crear nueva evaluación',
            body: Type.Object({
                Propuesta_id: Type.Integer(),
                Usuario_id: Type.Integer(),
                rol_revisor: Type.Union([
                    Type.Literal('miembro_comite'),
                    Type.Literal('tutor_revisor'),
                    Type.Literal('director_carrera')
                ]),
                comentarios: Type.String(),
                calificacion: Type.Number()
            }),
            response: {
                201: EvaluacionSchema
            }
        }
    }, async (request, reply) => {
        const { Propuesta_id, Usuario_id, rol_revisor, comentarios, calificacion } = request.body;
        const nuevaEvaluacion = await fastify.prisma.evaluacion_Propuesta.create({
            data: {
                Propuesta_tesis_idPropuesta_tesis: Propuesta_id,
                Usuario_idUsuario: Usuario_id,
                rol_revisor,
                comentarios,
                calificacion,
                fecha_evaluacion: new Date()
            },
            include: { Usuario: true }
        });
        reply.status(201);
        return {
            ...nuevaEvaluacion,
            calificacion: nuevaEvaluacion.calificacion ? Number(nuevaEvaluacion.calificacion) : null,
            fecha_evaluacion: (nuevaEvaluacion.fecha_evaluacion?.toISOString().split('T')[0]) ?? null
        };
    });
};
export default evaluacionesRoutes;
//# sourceMappingURL=evaluaciones.js.map