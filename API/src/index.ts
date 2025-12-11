// extraer todas las funcionalidades de express
import express, { Application, Request, Response } from 'express'; // agarra todo
// extraer todas las funcionalidades de cors
import cors from 'cors';
// extraer todas las funcionalidades de env para variables globales
import dotenv from 'dotenv';
// extraer todas las funcionalidades de helmet
import helmet from 'helmet';
// importar las rutas de productos
import productosRoutes from './routes/productos.routes';
// importar el manejador de errores
import { errorHandler } from './middleware/errorHandler';
// importar las variables de entorno
import { env } from './config/env';

dotenv.config(); // inicializar dotenv

const app: Application = express() // inicializar express

// Middlewares de seguridad
app.use(helmet());
app.use(cors({
  origin: env.CORS,
  credentials: true
}));

// traducir las peticiones o respuestas en json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    status: 'ok',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/productos', productosRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    error: 'NOT_FOUND',
    message: 'Ruta no encontrada'
  });
});

// Error handler (debe ser el último)
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`✅ Servidor ejecutándose en puerto ${env.PORT}`);
  console.log(`📝 Documentación: http://localhost:${env.PORT}/api/productos`);
});