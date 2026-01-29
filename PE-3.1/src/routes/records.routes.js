import { pool } from "../config/database.js";
import { buildRLSFilter, verifyOwnership } from "../middleware/rls.js";

export async function recordsRoutes(fastify, options) {

    // Siempre pedir autenticación
    fastify.addHook('onRequest', fastify.authenticate);

    // =========================
    // GET - Obtener registros
    // =========================
    fastify.get('/', async (request, reply) => {
        try {
            const { clause, params } = buildRLSFilter(request.user);

            const [records] = await pool.execute(
                `SELECT * FROM financial_records
                 WHERE ${clause}
                 ORDER BY created_at DESC`,
                params
            );

            return reply.status(200).send({
                message: 'Registros obtenidos con RLS',
                userId: request.user.id,
                rlsFilter: request.user.role === 'admin'
                    ? 'ADMIN'
                    : `user_id = ${request.user.id}`,
                count: records.length,
                records
            });

        } catch (error) {
            return reply.status(500).send({
                error: 'Internal Server Error',
                message: error.message
            });
        }
    });

    // =========================
    // POST - Crear registro
    // =========================
    fastify.post('/', async (request, reply) => {
        const { amount, category, description } = request.body;
        const userId = request.user.id;

        try {
            const [result] = await pool.execute(
                `INSERT INTO financial_records (user_id, amount, category, description, created_at)
                 VALUES (?, ?, ?, ?, NOW())`,
                [userId, amount, category, description]
            );

            return reply.status(201).send({
                message: 'Registro financiero creado',
                recordId: result.insertId
            });

        } catch (error) {
            return reply.status(500).send({
                error: 'Internal Server Error',
                message: error.message
            });
        }
    });

    // =========================
    // PUT - Actualizar registro
    // =========================
    fastify.put('/:id', async (request, reply) => {
        const { id } = request.params;
        const { amount, category, description } = request.body;
        const userId = request.user.id;
        const isAdmin = request.user.role === 'admin';

        try {
            // Verificar propiedad si no es admin
            if (!isAdmin) {
                const isOwner = await verifyOwnership(pool, 'financial_records', id, userId);
                if (!isOwner) {
                    return reply.status(403).send({
                        error: 'Forbidden',
                        message: 'No tienes permiso para modificar este registro'
                    });
                }
            }

            await pool.execute(
                `UPDATE financial_records
                 SET amount = ?, category = ?, description = ?
                 WHERE id = ?`,
                [amount, category, description, id]
            );

            return reply.status(200).send({
                message: 'Registro financiero actualizado',
                recordId: id
            });

        } catch (error) {
            return reply.status(500).send({
                error: 'Internal Server Error',
                message: error.message
            });
        }
    });

    // =========================
    // DELETE - Eliminar registro
    // =========================
    fastify.delete('/:id', async (request, reply) => {
        const { id } = request.params;
        const userId = request.user.id;
        const isAdmin = request.user.role === 'admin';

        try {
            // Verificar propiedad si no es admin
            if (!isAdmin) {
                const isOwner = await verifyOwnership(pool, 'financial_records', id, userId);
                if (!isOwner) {
                    return reply.status(403).send({
                        error: 'Forbidden',
                        message: 'No tienes permiso para eliminar este registro'
                    });
                }
            }

            await pool.execute(
                `DELETE FROM financial_records WHERE id = ?`,
                [id]
            );

            return reply.status(200).send({
                message: 'Registro financiero eliminado',
                recordId: id
            });

        } catch (error) {
            return reply.status(500).send({
                error: 'Internal Server Error',
                message: error.message
            });
        }
    });
}

export default recordsRoutes;