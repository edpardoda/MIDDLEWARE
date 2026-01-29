import { pool } from "../config/database.js";

export default async function auditRoutes(fastify, options) {

    // =========================
    // GET - Obtener auditorías
    // =========================
    fastify.get('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
        try {
            const limit = parseInt(request.query.limit) || 50;
            const [records] = await pool.execute(
                `SELECT * FROM audit_logs LIMIT ? OFFSET ? ORDER BY created_at DESC`,
                [limit, 0]
            );
            return reply.status(200).send({
                message: 'Registros de auditoría obtenidos',
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
}
