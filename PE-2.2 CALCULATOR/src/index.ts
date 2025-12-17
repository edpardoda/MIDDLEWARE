import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import { calculatorRoutes } from './routes/calculator.routes'
import fastifySwaggerUi from '@fastify/swagger-ui'

const fastify = Fastify({
  logger: true
})

// Swagger
fastify.register(swagger, {
  openapi: {
    openapi: "3.0.3",
    info: {
      title: "Calculator API - MCP Server",
      description: `
Calculator API es un MCP Server diseñado para exponer operaciones
aritméticas básicas (suma, resta, multiplicación y división) mediante
una API REST.

Este proyecto tiene fines académicos y demuestra el uso de OpenAPI 3.0
para documentar servicios, manejo de errores, seguridad y evolución
de APIs.
      `,
      version: "1.0.0",
      contact: {
        name: "Eduardo Pardo",
        email: "eg.pd2005@gmail.com",
        url: "https://github.com/edpardoda"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo"
      }
    ],

    tags: [
      {
        name: "calculator",
        description: "Operaciones aritméticas básicas"
      }
    ],
        components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-KEY",
          description:
            "Clave API utilizada para autenticar clientes autorizados."
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Autenticación mediante token JWT enviado en el header Authorization."
        }
      }
    },

    security: [
      {
        ApiKeyAuth: []
      }
    ]
  }
})



fastify.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true
  }
})

// Ruta base
fastify.get('/', async () => {
  return { message: 'MCP Server corriendo' }
})

fastify.register(calculatorRoutes)

// Iniciar servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" })
    console.log("Servidor corriendo en http://localhost:3000")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

