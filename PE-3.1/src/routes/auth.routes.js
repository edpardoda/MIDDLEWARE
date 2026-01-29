import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";

async function authRoutes(fastify, options) {
// ---------- RUTA REGISTER ----------
fastify.post("/register", {
  schema: {
    body: {
      type: "object",
      required: ["username", "password"],
      properties: {
        username: { type: "string" },
        password: { type: "string" }
      }
    }
  }
}, async (request, reply) => {

  const { username, password } = request.body;

  // Rol por defecto
  const role = "user";

  try {
    const [existing] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      return reply.status(409).send({
        error: "Conflict",
        message: "Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 👇 Usa el nombre real de tu columna
    await pool.execute(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    );

    return reply.status(201).send({
      message: "User registered successfully"
    });

  } catch (error) {
    return reply.status(500).send({
      error: "Internal Server Error",
      message: error.message
    });
  }
});


  // ---------- RUTA LOGIN ----------
  fastify.post("/login", {
    schema: {
      body: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string" },
          password: { type: "string" }
        }
      }
    }
  }, async (request, reply) => {

    const { username, password } = request.body;

    try {
      // Buscar usuario
      const [users] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );

      if (users.length === 0) {
        return reply.status(401).send({
          error: "Unauthorized",
          message: "Invalid username or password"
        });
      }

      const user = users[0];
      // Comparar password
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return reply.status(401).send({
          error: "Unauthorized",
          message: "Invalid username or password"
        });
      }

      // Generar JWT
      const token = fastify.jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role
      });

      return reply.send({
        message: "Login successful",
        token
      });

    } catch (error) {
      return reply.status(500).send({
        error: "Internal Server Error",
        message: error.message
      });
    }
  });
}

export default authRoutes;
