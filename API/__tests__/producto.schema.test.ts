/// <reference types="jest" />
import { crearProductoSchema, actualizarProductoSchema } from '../src/schemas/producto.schemas';
import { CATEGORIAS_PRODUCTOS } from '../src/types/producto.types';

describe('Producto Schemas', () => {
  describe('crearProductoSchema', () => {
    it('debe validar correctamente con datos válidos', () => {
      const datosValidos = {
        nombre: 'Manzana Roja',
        descripcion: 'Manzana roja orgánica de la región',
        categoria: 'frutas',
        precioUnitario: 2.5,
        unidadMedida: 'kg',
        stockDisponible: 100,
        certificacionOrganica: true,
        productor: 'Granja Verde'
      };

      const resultado = crearProductoSchema.safeParse(datosValidos);

      expect(resultado.success).toBe(true);
      if (resultado.success) {
        expect(resultado.data.nombre).toBe('Manzana Roja');
        expect(resultado.data.categoria).toBe('frutas');
        expect(resultado.data.precioUnitario).toBe(2.5);
      }
    });

    it('debe aplicar valor default a descripción si es omitida', () => {
      const datossinDescripcion = {
        nombre: 'Tomate',
        categoria: 'verduras',
        precioUnitario: 1.5,
        unidadMedida: 'kg',
        stockDisponible: 50,
        certificacionOrganica: false,
        productor: 'Agricultor Local'
      };

      const resultado = crearProductoSchema.safeParse(datossinDescripcion);

      expect(resultado.success).toBe(true);
      if (resultado.success) {
        expect(resultado.data.descripcion).toBe('');
      }
    });

    it('debe aplicar valor default a certificacionOrganica si es omitida', () => {
      const datosSinCertificacion = {
        nombre: 'Lechuga',
        categoria: 'verduras',
        precioUnitario: 2.0,
        unidadMedida: 'unidad',
        stockDisponible: 30,
        productor: 'Agricultor Local'
      };

      const resultado = crearProductoSchema.safeParse(datosSinCertificacion);

      expect(resultado.success).toBe(true);
      if (resultado.success) {
        expect(resultado.data.certificacionOrganica).toBe(false);
      }
    });

    it('debe rechazar nombre con menos de 2 caracteres', () => {
      const datosInvalidos = {
        nombre: 'A',
        categoria: 'frutas',
        precioUnitario: 2.5,
        unidadMedida: 'kg',
        stockDisponible: 100,
        certificacionOrganica: true,
        productor: 'Granja Verde'
      };

      const resultado = crearProductoSchema.safeParse(datosInvalidos);

      expect(resultado.success).toBe(false);
      if (!resultado.success) {
        expect(resultado.error.issues[0].message).toContain('al menos 2 caracteres');
      }
    });

    it('debe rechazar nombre vacío', () => {
      const datosInvalidos = {
        nombre: '',
        categoria: 'frutas',
        precioUnitario: 2.5,
        unidadMedida: 'kg',
        stockDisponible: 100,
        certificacionOrganica: true,
        productor: 'Granja Verde'
      };

      const resultado = crearProductoSchema.safeParse(datosInvalidos);

      expect(resultado.success).toBe(false);
    });

    it('debe rechazar precio negativo o cero', () => {
      const datosConPrecioNegativo = {
        nombre: 'Producto',
        categoria: 'frutas',
        precioUnitario: -5.0,
        unidadMedida: 'kg',
        stockDisponible: 100,
        certificacionOrganica: true,
        productor: 'Granja'
      };

      const resultado = crearProductoSchema.safeParse(datosConPrecioNegativo);

      expect(resultado.success).toBe(false);
      if (!resultado.success) {
        expect(resultado.error.issues[0].message).toContain('positivo');
      }
    });

    it('debe rechazar precio de cero', () => {
      const datosConPrecioZero = {
        nombre: 'Producto',
        categoria: 'frutas',
        precioUnitario: 0,
        unidadMedida: 'kg',
        stockDisponible: 100,
        certificacionOrganica: true,
        productor: 'Granja'
      };

      const resultado = crearProductoSchema.safeParse(datosConPrecioZero);

      expect(resultado.success).toBe(false);
    });

    it('debe rechazar categoría inválida', () => {
      const datosConCategoriaInvalida = {
        nombre: 'Producto',
        categoria: 'electronica',
        precioUnitario: 2.5,
        unidadMedida: 'kg',
        stockDisponible: 100,
        certificacionOrganica: true,
        productor: 'Granja'
      };

      const resultado = crearProductoSchema.safeParse(datosConCategoriaInvalida);

      expect(resultado.success).toBe(false);
      if (!resultado.success) {
        expect(resultado.error.issues[0].message).toContain('Categoría');
      }
    });

    it('debe aceptar solo categorías válidas', () => {
      CATEGORIAS_PRODUCTOS.forEach(categoria => {
        const datos = {
          nombre: 'Producto',
          categoria,
          precioUnitario: 2.5,
          unidadMedida: 'kg',
          stockDisponible: 100,
          certificacionOrganica: true,
          productor: 'Granja'
        };

        const resultado = crearProductoSchema.safeParse(datos);
        expect(resultado.success).toBe(true);
      });
    });

    it('debe rechazar stock negativo', () => {
      const datosConStockNegativo = {
        nombre: 'Producto',
        categoria: 'frutas',
        precioUnitario: 2.5,
        unidadMedida: 'kg',
        stockDisponible: -10,
        certificacionOrganica: true,
        productor: 'Granja'
      };

      const resultado = crearProductoSchema.safeParse(datosConStockNegativo);

      expect(resultado.success).toBe(false);
      if (!resultado.success) {
        expect(resultado.error.issues[0].message).toContain('negativo');
      }
    });

    it('debe rechazar stock no entero', () => {
      const datosConStockDecimal = {
        nombre: 'Producto',
        categoria: 'frutas',
        precioUnitario: 2.5,
        unidadMedida: 'kg',
        stockDisponible: 10.5,
        certificacionOrganica: true,
        productor: 'Granja'
      };

      const resultado = crearProductoSchema.safeParse(datosConStockDecimal);

      expect(resultado.success).toBe(false);
    });

    it('debe aceptar stock de 0', () => {
      const datosConStockCero = {
        nombre: 'Producto',
        categoria: 'frutas',
        precioUnitario: 2.5,
        unidadMedida: 'kg',
        stockDisponible: 0,
        certificacionOrganica: true,
        productor: 'Granja'
      };

      const resultado = crearProductoSchema.safeParse(datosConStockCero);

      expect(resultado.success).toBe(true);
    });

    it('debe rechazar productor con menos de 2 caracteres', () => {
      const datosConProductorCorto = {
        nombre: 'Producto',
        categoria: 'frutas',
        precioUnitario: 2.5,
        unidadMedida: 'kg',
        stockDisponible: 100,
        certificacionOrganica: true,
        productor: 'A'
      };

      const resultado = crearProductoSchema.safeParse(datosConProductorCorto);

      expect(resultado.success).toBe(false);
      if (!resultado.success) {
        expect(resultado.error.issues[0].message).toContain('al menos 2 caracteres');
      }
    });

    it('debe rechazar campos requeridos faltantes', () => {
      const datosIncompletos = {
        nombre: 'Producto',
        categoria: 'frutas'
      };

      const resultado = crearProductoSchema.safeParse(datosIncompletos);

      expect(resultado.success).toBe(false);
      if (!resultado.success) {
        expect(resultado.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('debe rechazar tipo incorrecto para precioUnitario', () => {
      const datosConTipoIncorrecto = {
        nombre: 'Producto',
        categoria: 'frutas',
        precioUnitario: 'dos punto cinco',
        unidadMedida: 'kg',
        stockDisponible: 100,
        certificacionOrganica: true,
        productor: 'Granja'
      };

      const resultado = crearProductoSchema.safeParse(datosConTipoIncorrecto);

      expect(resultado.success).toBe(false);
    });

    it('debe rechazar tipo incorrecto para certificacionOrganica', () => {
      const datosConTipoIncorrecto = {
        nombre: 'Producto',
        categoria: 'frutas',
        precioUnitario: 2.5,
        unidadMedida: 'kg',
        stockDisponible: 100,
        certificacionOrganica: 'true',
        productor: 'Granja'
      };

      const resultado = crearProductoSchema.safeParse(datosConTipoIncorrecto);

      expect(resultado.success).toBe(false);
    });

    it('debe validar unidadMedida no vacía', () => {
      const datosConUnidadVacia = {
        nombre: 'Producto',
        categoria: 'frutas',
        precioUnitario: 2.5,
        unidadMedida: '',
        stockDisponible: 100,
        certificacionOrganica: true,
        productor: 'Granja'
      };

      const resultado = crearProductoSchema.safeParse(datosConUnidadVacia);

      expect(resultado.success).toBe(false);
    });
  });

  describe('actualizarProductoSchema', () => {
    it('debe permitir actualización con todos los campos opcionales', () => {
      const datosActualizacion = {
        nombre: 'Nombre Actualizado',
        precioUnitario: 3.0
      };

      const resultado = actualizarProductoSchema.safeParse(datosActualizacion);

      expect(resultado.success).toBe(true);
      if (resultado.success) {
        expect(resultado.data.nombre).toBe('Nombre Actualizado');
        expect(resultado.data.precioUnitario).toBe(3.0);
      }
    });

    it('debe permitir actualización vacía', () => {
      const datosActualizacion = {};

      const resultado = actualizarProductoSchema.safeParse(datosActualizacion);

      expect(resultado.success).toBe(true);
    });

    it('debe mantener las mismas reglas de validación que el schema de creación', () => {
      const datosConPrecioNegativo = {
        precioUnitario: -5.0
      };

      const resultado = actualizarProductoSchema.safeParse(datosConPrecioNegativo);

      expect(resultado.success).toBe(false);
    });

    it('debe validar campos individuales cuando se proporcionan', () => {
      const datosConNombreCorto = {
        nombre: 'A'
      };

      const resultado = actualizarProductoSchema.safeParse(datosConNombreCorto);

      expect(resultado.success).toBe(false);
    });

    it('debe permitir actualizar solo la categoría', () => {
      const datosActualizacion = {
        categoria: 'lacteos'
      };

      const resultado = actualizarProductoSchema.safeParse(datosActualizacion);

      expect(resultado.success).toBe(true);
      if (resultado.success) {
        expect(resultado.data.categoria).toBe('lacteos');
      }
    });

    it('debe permitir actualizar solo el stock', () => {
      const datosActualizacion = {
        stockDisponible: 50
      };

      const resultado = actualizarProductoSchema.safeParse(datosActualizacion);

      expect(resultado.success).toBe(true);
      if (resultado.success) {
        expect(resultado.data.stockDisponible).toBe(50);
      }
    });

    it('debe rechazar campos con valores inválidos en actualización parcial', () => {
      const datosInvalidos = {
        nombre: 'Válido',
        precioUnitario: -10
      };

      const resultado = actualizarProductoSchema.safeParse(datosInvalidos);

      expect(resultado.success).toBe(false);
    });
  });
});
