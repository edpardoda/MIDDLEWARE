import { ProductoRepository } from '../src/repositories/producto.repository.js'

describe('ProductoRepository', () => {
  let repository: ProductoRepository

  beforeEach(() => {
    repository = new ProductoRepository()
  })

  test('create(): crea producto con ID autoincrementado', () => {
  const producto = repository.create({
    nombre: 'Laptop',
    precio: 1000,
    categoria: 'tecnologia'
  })

  expect(producto.id).toBe(1)
})

test('create(): incrementa el ID automáticamente', () => {
  repository.create({ nombre: 'A', precio: 10, categoria: 'hogar' })
  const producto = repository.create({
    nombre: 'B',
    precio: 20,
    categoria: 'hogar'
  })

  expect(producto.id).toBe(2)
})

test('findAll(): retorna todos los productos', () => {
  repository.create({ nombre: 'A', precio: 10, categoria: 'hogar' })
  repository.create({ nombre: 'B', precio: 20, categoria: 'tecnologia' })

  const productos = repository.findAll()
  expect(productos.length).toBe(2)
})

test('findAll(): filtra productos por categoría', () => {
  repository.create({ nombre: 'A', precio: 10, categoria: 'hogar' })
  repository.create({ nombre: 'B', precio: 20, categoria: 'tecnologia' })

  const productos = repository.findAll('hogar')
  expect(productos.length).toBe(1)
})

test('findById(): encuentra producto existente', () => {
  const producto = repository.create({
    nombre: 'Monitor',
    precio: 300,
    categoria: 'tecnologia'
  })

  const encontrado = repository.findById(producto.id)
  expect(encontrado).toBeDefined()
})

test('findById(): retorna undefined si no existe', () => {
  const resultado = repository.findById(999)
  expect(resultado).toBeUndefined()
})

test('update(): actualiza un producto existente', () => {
  const producto = repository.create({
    nombre: 'Tablet',
    precio: 400,
    categoria: 'tecnologia'
  })

  const actualizado = repository.update(producto.id, { precio: 500 })
  expect(actualizado?.precio).toBe(500)
})

test('update(): retorna null si el ID no existe', () => {
  const resultado = repository.update(999, { nombre: 'X' })
  expect(resultado).toBeNull()
})

test('delete(): elimina un producto existente', () => {
  const producto = repository.create({
    nombre: 'Impresora',
    precio: 150,
    categoria: 'oficina'
  })

  const eliminado = repository.delete(producto.id)
  expect(eliminado).toBe(true)
})

test('delete(): retorna false si el ID no existe', () => {
  const resultado = repository.delete(999)
  expect(resultado).toBe(false)
})


})
