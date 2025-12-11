API Marketplace Agrícola
Gestión de productos agrícolas con validación de datos, middleware personalizado y CRUD completo en Node.js + TypeScript.
1. Descripción General

Esta API permite administrar productos agrícolas mediante operaciones CRUD completamente validadas.
Incluye validación con Zod, manejo centralizado de errores, paginación, filtrado y documentación de cada endpoint.

Los productos se almacenan en memoria (array) durante la ejecución del servidor.

2. Requisitos Previos

Node.js v18 o superior

npm 

Thunder Client para pruebas

3. Instalación y Ejecución
npm install
npm run dev


El servidor se ejecutará en:

http://localhost:3000

Dependencias principales utilizadas:

| Nombre             | Para qué sirve                               |
| ------------------ | -------------------------------------------- |
| **express**        | Servidor HTTP                                |
| **cors**           | Permitir solicitudes desde otros orígenes    |
| **helmet**         | Seguridad básica para headers HTTP           |
| **zod**            | Validación de datos                          |
| **uuid**           | Crear IDs únicos                             |
| **sequelize**      | ORM (preparado para futuras conexiones a BD) |
| **pg / pg-hstore** | Drivers de PostgreSQL (para Sequelize)       |
| **typescript**     | Tipado estático                              |
| **tsx**            | Ejecutar TS sin compilar                     |
| **nodemon**        | Recarga automática en desarrollo             |
| **dotenv**         | Manejo de variables de entorno               |

4. Estructura del Proyecto
src/
│── config/
│── middleware/
│── routes/
│── schemas/
│── types/
│── models/
│── index.ts

4.1 index.ts

Archivo principal.
Configura:

Express

Middlewares (CORS, Helmet, JSON)

Ruta /health

Rutas de productos

Manejador global de errores

Es el punto de entrada del servidor.

5. Configuración (config/)
env.ts

Lee y valida variables de entorno usando Zod.

Variables usadas (ejemplo):

PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=productos_db

database.ts

Preparado para futura conexión a base de datos (actualmente no usada).

logger.ts

Configura logs informativos y de errores.

6. Middlewares (middleware/)
errorHandler.ts

Gestiona errores globales.
Devuelve respuestas estructuradas como:

{
  "ok": false,
  "error": "NOT_FOUND",
  "message": "Producto no encontrado"
}

validate.ts

Valida el body de las peticiones usando Zod.

Ejemplo de error de validación:

{
  "ok": false,
  "error": "VALIDATION_ERROR",
  "details": [
    { "path": "nombre", "message": "El nombre debe tener al menos 2 caracteres" }
  ]
}

7. Esquemas de Validación (schemas/)
producto.schemas.ts

Define:

crearProductoSchema

actualizarProductoSchema

Ejemplo de regla:

nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100)


Valida:

Campo	Regla
nombre	2–100 caracteres
categoria	frutas, verduras, lacteos, carnes
precioUnitario	número positivo
unidadMedida	texto
stockDisponible	entero, >= 0
certificacionOrganica	booleano
productor	2–100 caracteres
descripcion	opcional
8. Tipos de Datos (types/)
producto.types.ts

Define la interfaz del producto:

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precioUnitario: number;
  unidadMedida: string;
  stockDisponible: number;
  certificacionOrganica: boolean;
  productor: string;
  descripcion?: string;
}


Incluye constantes para categorías válidas.

9. Rutas de la API (routes/)
productos.routes.ts

Define todos los endpoints CRUD:

Método	Ruta	Descripción
POST	/api/productos	Crear producto
GET	/api/productos	Listar todos / Filtrar / Paginar
GET	/api/productos/:id	Obtener un producto
PUT	/api/productos/:id	Actualizar un producto
DELETE	/api/productos/:id	Eliminar producto

Flujo de procesamiento:

Cliente → validate → Controlador → Respuesta
               ↓
         errorHandler

10. Endpoints de la API
10.1 Obtener todos los productos

GET /api/productos

Respuesta:

{
  "ok": true,
  "data": [],
  "pagination": {
    "total": 0,
    "pagina": 1,
    "limite": 10,
    "totalPaginas": 0
  }
}


Soporta:

?categoria=

?productor=

?pagina=

?limite=

10.2 Crear producto

POST /api/productos

Body:

{
  "nombre": "Manzana Roja",
  "descripcion": "Manzanas frescas",
  "categoria": "frutas",
  "precioUnitario": 1.50,
  "unidadMedida": "kg",
  "stockDisponible": 50,
  "certificacionOrganica": true,
  "productor": "Juan García"
}


Respuesta 201:

{
  "ok": true,
  "data": { ... }
}

10.3 Obtener un producto por ID

GET /api/productos/:id

10.4 Actualizar producto

PUT /api/productos/:id

10.5 Eliminar producto

DELETE /api/productos/:id


13. Tecnologías Utilizadas

Express.js — servidor web

    Zod — validación de datos

    TypeScript — tipado estricto

    UUID — generar IDs únicos

Autor: Eduardo Pardo
Práctica Evaluada PE-2.1 – API REST para Gestión de Productos Agrícolas