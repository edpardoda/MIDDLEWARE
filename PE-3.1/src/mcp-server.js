import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Configuración de base de datos
const DB_CONFIG = {
    host: process.env.DB_HOST,
    user: "mcp_agent",
    password: "Agent_Secret_Pass_123!",
    database: process.env.DB_NAME
};

// Crear servidor MCP
const server = new Server(
    {
        name: "MCP Server",
        version: "1.0.0",
        description: "Servidor MCP con acceso seguro a base de datos"
    },
    {
        capabilities: { tools: {} }
    }
);

// Lista de herramientas disponibles
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "db_readonly",
                description: "Consulta segura de información financiera. Solo lectura de balance y transacciones.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query_type: {
                            type: "string",
                            enum: ["balance", "get_last_transactions"],
                            description: "Tipo de consulta"
                        },
                        account_id: {
                            type: "number",
                            description: "ID de cuenta del usuario"
                        }
                    },
                    required: ["query_type", "account_id"]
                }
            }
        ]
    };
});

// Ejecución de herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name !== "db_readonly") {
        throw new Error("Tool not found");
    }

    // Validación estricta con Zod
    const inputSchema = z.object({
        query_type: z.enum(["balance", "get_last_transactions"]),
        account_id: z.number().int().positive()
    });

    try {
        // En MCP los argumentos vienen en request.params.arguments
        const { query_type, account_id } = inputSchema.parse(request.params.arguments);

        const connection = await mysql.createConnection(DB_CONFIG);

        try {
            // Definir identidad de sesión (Row Level Security)
            await connection.execute(
                "SET @app_current_user_id = ?",
                [account_id]
            );

            let result;

            if (query_type === "balance") {
                const [rows] = await connection.execute(
                    "SELECT SUM(amount) AS total_balance FROM financial_records_secure"
                );
                result = rows[0].total_balance ?? 0;
            }

            if (query_type === "get_last_transactions") {
                const [rows] = await connection.execute(
                    "SELECT * FROM financial_records_secure ORDER BY created_at DESC LIMIT 5"
                );
                result = rows;
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2)
                    }
                ]
            };

        } finally {
            await connection.end();
        }

    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error al ejecutar la herramienta: ${error.message}`,
                    isError: true
                }
            ]
        };
    }
});

// Inicialización del servidor
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("MCP Server iniciado correctamente");
}

main().catch(console.error);
