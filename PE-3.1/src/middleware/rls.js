/*
1. Usuario envía request con JWT
2. JWT contiene id y username
3. Middleware verifica JWT y extrae id del usuario
4. Se consulta BD para obtener el rol
5. Si role es "admin", acceso total
6. Si no, acceso solo a sus propios registros
*/

export function buildRLSFilter(user) {
  if (user.role === "admin") {
    // Admin puede ver todo
    return { clause: "1=1", params: [] };
  } else {
    // Usuario normal solo ve sus registros
    return { clause: "user_id = ?", params: [user.id] };
  }
}


// Verifica si un registro pertenece al usuario
export async function verifyOwnership(pool, table, recordId, userId) {
  const [rows] = await pool.execute(
    `SELECT user_id FROM ${table} WHERE id = ?`,
    [recordId]
  );

  if (rows.length === 0) {
    return false; // Registro no existe
  }

  return rows[0].user_id === userId;
}

