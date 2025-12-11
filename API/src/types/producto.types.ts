export const CATEGORIAS_PRODUCTOS = [
    'frutas',
    'verduras',
    'lacteos',
    'carnes'
];

export type CategoriaProducto = typeof CATEGORIAS_PRODUCTOS[number];

export interface Producto {
    id: string;
    nombre: string;
    descripcion?: string;
    categoria: string;
    precioUnitario: number;
    unidadMedida: string;
    stockDisponible: number;
    certificacionOrganica: boolean;
    productor: string;
    creadoEn: string;
    actualizadoEn?: string;
}