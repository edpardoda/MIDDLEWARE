export interface Producto {
  id: number
  nombre: string
  precio: number
  categoria: string
}

export class ProductoRepository {
  private productos: Producto[] = []
  private currentId = 1

  create(data: Omit<Producto, 'id'>): Producto {
    const producto: Producto = {
      id: this.currentId++,
      ...data
    }
    this.productos.push(producto)
    return producto
  }

  findAll(categoria?: string): Producto[] {
    if (categoria) {
      return this.productos.filter(p => p.categoria === categoria)
    }
    return this.productos
  }

  findById(id: number): Producto | undefined {
    return this.productos.find(p => p.id === id)
  }

  update(id: number, data: Partial<Omit<Producto, 'id'>>): Producto | null {
    const producto = this.findById(id)
    if (!producto) return null

    Object.assign(producto, data)
    return producto
  }

  delete(id: number): boolean {
    const index = this.productos.findIndex(p => p.id === id)
    if (index === -1) return false

    this.productos.splice(index, 1)
    return true
  }
}
