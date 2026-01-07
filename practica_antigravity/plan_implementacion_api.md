# Plan de Implementación API REST (Fastify + Prisma + MySQL)

Este documento detalla el plan paso a paso para construir la API REST solicitada, utilizando las tecnologías más recientes y mejores prácticas de 2025.

## 1. Stack Tecnológico
*   **Lenguaje:** Node.js (v22+ LTS recomendado) con TypeScript (v5.7+).
*   **Estándar:** ECMAScript 2025 (ESM nativo).
*   **Framework Web:** Fastify (v5+).
*   **ORM:** Prisma (v6+).
*   **Base de Datos:** MySQL 8.0.
*   **Validación:** TypeBox (`@sinclair/typebox` y `@fastify/type-provider-typebox`) para validación rápida y tipado estático inferido.
*   **Documentación:** Swagger UI (`@fastify/swagger` + `@fastify/swagger-ui`).

## 2. Estructura del Proyecto
```
my-api/
├── src/
│   ├── plugins/        # Plugins de Fastify (Prisma, Auth, Swagger)
│   ├── routes/         # Definición de rutas (Controllers)
│   ├── services/       # Lógica de negocio (opcional, para separar de rutas)
│   ├── types/          # Tipos globales adicionales
│   ├── app.ts          # Configuración de la App (instance factory)
│   └── server.ts       # Punto de entrada (listen)
├── prisma/
│   ├── schema.prisma   # Modelo de datos
│   └── migrations/     # Historial de cambios SQL
├── package.json
└── tsconfig.json
```

## 3. Pasos de Implementación

### Fase 1: Inicialización
1.  **Setup de Node y TypeScript:**
    ```bash
    npm init -y
    npm install fastify @sinclair/typebox @fastify/type-provider-typebox @prisma/client
    npm install -D typescript @types/node ts-node prisma
    npx tsc --init
    ```
    *   **Configuración Crítica (`package.json`):**
        ```json
        {
          "type": "module"
        }
        ```
    *   **Configuración TypeScript (`tsconfig.json`):**
        ```json
        {
          "compilerOptions": {
            "target": "ES2025",
            "module": "NodeNext",
            "moduleResolution": "NodeNext",
            "strict": true
          }
        }
        ```

2.  **Configuración de Prisma:**
    ```bash
    npx prisma init
    ```
    *   Configurar `DATABASE_URL` en `.env` para apuntar a MySQL 8.0.
    *   Copiar el modelo corregido del `proyecto titulacion.sql` al `schema.prisma`.

### Fase 2: Configuración del Core (Fastify)
Crear el servidor base con soporte para TypeBox (Mejor práctica actual para tipado en Fastify).

**`src/app.ts` (Ejemplo Base):**
```typescript
import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import prismaPlugin from './plugins/prisma';
import routes from './routes';

export const buildApp = () => {
  const app = Fastify().withTypeProvider<TypeBoxTypeProvider>();

  // Plugins
  app.register(prismaPlugin);
  
  // Rutas
  app.register(routes);

  return app;
};
```

### Fase 3: Integración con Prisma
Crear un plugin para inyectar la instancia de Prisma en todo el servidor y manejar la conexión/desconexión limpiamente.

**`src/plugins/prisma.ts`:**
```typescript
import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

export default fp(async (fastify) => {
  const prisma = new PrismaClient();
  
  await prisma.$connect();

  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async (server) => {
    await server.prisma.$disconnect();
  });
});

// Tipado para TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
```

### Fase 4: Definición de Rutas (Endpoints)
Implementar rutas tipo "CRUD" usando la validación de TypeBox.

**Ejemplo `src/routes/estudiantes.ts`:**
```typescript
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

const estudiantesRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  
  // GET /estudiantes
  fastify.get('/', {
    schema: {
      tags: ['Estudiantes'],
      response: {
        200: Type.Array(Type.Object({
          idEstudiante: Type.Integer(),
          Usuario: Type.Object({
            Nombres: Type.String(),
            Correo: Type.String()
          })
        }))
      }
    }
  }, async (request, reply) => {
    return fastify.prisma.estudiante.findMany({
      include: { Usuario: true } // Join con tabla Usuario
    });
  });

  // POST /estudiantes (Creación)
  // ... implementación similar
};

export default estudiantesRoutes;
```

## 4. Siguientes Pasos Recomendados
1.  **Ejecutar Script SQL Corregido:** Antes de iniciar Prisma, asegurar que la DB tenga la estructura correcta o definirla puramente en `schema.prisma`.
2.  **Generar Cliente:** `npx prisma generate`.
3.  **Desarrollo Iterativo:** Implementar primero el módulo de Autenticación (Login), luego Propuestas, y finalmente Avances.
4.  **Documentación:** Configurar Swagger para visualizar la API en `/documentation`.

## Notas Importantes
*   **TypeBox vs JSON Schema:** TypeBox compila a JSON Schema pero permite usar interfaces de TS directamente, evitando duplicar definiciones de tipos.
*   **Manejo de Errores:** Se recomienda un `setErrorHandler` global en `app.ts` para capturar errores de Prisma (ej. registros duplicados) y devolver códigos HTTP correctos (409 Conflict, 404 Not Found).
