// src/routes/productos.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Producto } from '../types/producto.types';
import { crearProductoSchema, actualizarProductoSchema } from '../schemas/producto.schemas';
import { validateBody } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// "Base de datos" en memoria
const productos: Producto[] = [];

// Wrapper para async/sync errors
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * POST / - Create producto
 */
router.post(
  '/',
  validateBody(crearProductoSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const nuevoProducto: Producto = {
      id: uuidv4(),
      ...data,
      creadoEn: new Date().toISOString()
    };
    productos.push(nuevoProducto);
    res.status(201).json({
      ok: true,
      message: 'Producto creado exitosamente',
      data: nuevoProducto
    });
  })
);

/**
 * GET / - List productos con filtros
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { categoria, productor, pagina = '1', limite = '10' } = req.query;

    let result = [...productos];

    if (categoria) {
      result = result.filter(p => p.categoria === String(categoria));
    }

    if (productor) {
      result = result.filter(p => p.productor.toLowerCase().includes(String(productor).toLowerCase()));
    }

    const page = parseInt(String(pagina)) || 1;
    const pageSize = parseInt(String(limite)) || 10;
    const start = (page - 1) * pageSize;
    const paginados = result.slice(start, start + pageSize);

    res.status(200).json({
      ok: true,
      data: paginados,
      pagination: {
        total: result.length,
        pagina: page,
        limite: pageSize,
        totalPaginas: Math.ceil(result.length / pageSize)
      }
    });
  })
);

/**
 * GET /:id - Get producto individual
 */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const producto = productos.find(p => p.id === id);

    if (!producto) {
      throw new AppError('Producto no encontrado', 404, 'NOT_FOUND');
    }

    res.status(200).json({
      ok: true,
      data: producto
    });
  })
);

/**
 * PUT /:id - Update producto
 */
router.put(
  '/:id',
  validateBody(actualizarProductoSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const index = productos.findIndex(p => p.id === id);

    if (index === -1) {
      throw new AppError('Producto no encontrado', 404, 'NOT_FOUND');
    }

    const actualizado: Producto = {
      ...productos[index],
      ...req.body,
      actualizadoEn: new Date().toISOString()
    };

    productos[index] = actualizado;

    res.status(200).json({
      ok: true,
      message: 'Producto actualizado exitosamente',
      data: actualizado
    });
  })
);

/**
 * DELETE /:id - Delete producto
 */
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const index = productos.findIndex(p => p.id === id);

    if (index === -1) {
      throw new AppError('Producto no encontrado', 404, 'NOT_FOUND');
    }

    const [eliminado] = productos.splice(index, 1);

    res.status(200).json({
      ok: true,
      message: 'Producto eliminado exitosamente',
      data: eliminado
    });
  })
);

export default router;
