import { FastifyInstance } from "fastify";
import calculatorTools from '../tools/calculator.tools.json'

interface CalculatorRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  a: number;
  b: number;
}

export const calculatorRoutes = (fastify: FastifyInstance) => {

  fastify.post<{ Body: CalculatorRequest }>(
    "/tools/calculator",
    {
      schema: {
        summary: "Ejecutar operación aritmética",
        description: `
Ejecuta una operación aritmética básica (suma, resta, multiplicación o división)
recibiendo dos operandos numéricos.

La autenticación se documenta mediante esquemas de seguridad aunque no se
encuentra implementada.
        `,
        tags: ["calculator"],

        security: [
          {
            ApiKeyAuth: []
          }
        ],

        body: {
          ...calculatorTools.inputSchema,
          examples: {
            suma: {
              summary: "Ejemplo de suma",
              value: {
                operation: "add",
                a: 10,
                b: 5
              }
            },
            resta: {
              summary: "Ejemplo de resta",
              value: {
                operation: "subtract",
                a: 10,
                b: 3
              }
            },
            multiplicacion: {
              summary: "Ejemplo de multiplicación",
              value: {
                operation: "multiply",
                a: 4,
                b: 6
              }
            },
            division: {
              summary: "Ejemplo de división",
              value: {
                operation: "divide",
                a: 20,
                b: 4
              }
            },
            divisionPorCero: {
              summary: "Error: división por cero",
              value: {
                operation: "divide",
                a: 10,
                b: 0
              }
            }
          }
        },

        response: {
          200: {
            description: "Operación ejecutada correctamente",
            type: "object",
            properties: {
              result: { type: "number" },
              operation: { type: "string" }
            },
            examples: {
              successAdd: {
                summary: "Resultado de suma",
                value: {
                  operation: "add",
                  result: 15
                }
              },
              successDivide: {
                summary: "Resultado de división",
                value: {
                  operation: "divide",
                  result: 5
                }
              }
            }
          },

          400: {
            description: "Error de validación o lógica",
            type: "object",
            properties: {
              error: { type: "string" }
            },
            examples: {
              invalidOperation: {
                summary: "Operación inválida",
                value: {
                  error: "Operación inválida"
                }
              },
              divisionByZero: {
                summary: "División por cero",
                value: {
                  error: "No se puede dividir para cero"
                }
              }
            }
          },

          500: {
            description: "Error interno del servidor"
          }
        }
      }
    },

    async (request, reply) => {
      const { operation, a, b } = request.body;

      let result: number = 0;

      switch (operation) {
        case "add":
          result = a + b;
          break;

        case "subtract":
          result = a - b;
          break;

        case "multiply":
          result = a * b;
          break;

        case "divide":
          if (b === 0) {
            return reply.status(400).send({ error: "No se puede dividir para cero" });
          }
          result = a / b;
          break;

        default:
          return reply.status(400).send({ error: "Operación inválida" });
      }

      return { result, operation };
    }
  );
};
