import AppLayout from '@/layouts/app-layout'
import { Head, useForm } from '@inertiajs/react'
import { useState } from 'react'
import type { Cliente, Producto } from '@/types/pedido'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  clientes: Cliente[]
  productos: (Producto & { imagen?: string })[]
}

export default function CreatePedido({ clientes, productos }: Props) {
  const { data, setData, post, errors, processing } = useForm({
    cliente_id: '',
    productos: [] as {
      id: number
      cantidad: number
      precio: number
    }[],
    monto_pagado: 0,
  })

  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [clienteInput, setClienteInput] = useState('')

  const agregarProducto = () => {
    const prodId = Number(productoSeleccionado)
    const producto = productos.find(p => p.id === prodId)
    if (!producto || producto.stock <= 0) return

    if (data.productos.find(p => p.id === prodId)) return

    setData('productos', [
      ...data.productos,
      {
        id: producto.id,
        cantidad: 1,
        precio: Number(producto.precio),
      },
    ])
    setProductoSeleccionado('')
  }

  const actualizarCantidad = (id: number, cantidad: number) => {
    const prod = productos.find(p => p.id === id)
    if (!prod) return
    if (cantidad > prod.stock) return
    setData('productos', data.productos.map(p =>
      p.id === id ? { ...p, cantidad } : p
    ))
  }

  const eliminarProducto = (id: number) => {
    setData('productos', data.productos.filter(p => p.id !== id))
  }

  const calcularTotal = () =>
    data.productos.reduce((total, p) => total + Number(p.precio) * p.cantidad, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/pedidos')
  }

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Pedidos', href: '/pedidos' },
      { title: 'Nuevo', href: '/pedidos/create' },
    ]}>
      <Head title="Nuevo Pedido" />

      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Nuevo Pedido</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Cliente con búsqueda dinámica */}
          <div className="relative">
            <Label>Cliente</Label>
            <Input
              value={clienteInput}
              onChange={(e) => setClienteInput(e.target.value)}
              placeholder="Buscar por nombre o RTN"
              className="w-full"
              autoComplete="off"
            />
            {clienteInput && (
              <ul className="absolute z-10 bg-white shadow-md border w-full max-h-48 overflow-y-auto rounded-md">
                {clientes
                  .filter((c) =>
                    `${c.NOMBRES} ${c.APELLIDOS} ${c.RTN}`.toLowerCase().includes(clienteInput.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((c) => (
                    <li
                      key={c.id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setData('cliente_id', c.id.toString())
                        setClienteInput(`${c.NOMBRES} ${c.APELLIDOS} - ${c.RTN}`)
                      }}
                    >
                      {c.NOMBRES} {c.APELLIDOS} - {c.RTN}
                    </li>
                  ))}
              </ul>
            )}
            {errors.cliente_id && <p className="text-red-500 text-sm mt-1">{errors.cliente_id}</p>}
          </div>

          {/* Agregar productos */}
          <div className="space-y-2">
            <Label>Producto</Label>
            <div className="flex gap-2">
              <select
                className="flex-1 border rounded px-3 py-2"
                value={productoSeleccionado}
                onChange={e => setProductoSeleccionado(e.target.value)}
              >
                <option value="">Seleccione un producto</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                    {p.nombre} - L. {Number(p.precio).toFixed(2)} ({p.stock} en stock)
                  </option>
                ))}
              </select>
              <Button type="button" onClick={agregarProducto}>Agregar</Button>
            </div>
          </div>

          {/* Lista de productos agregados */}
          {data.productos.length > 0 && (
            <div>
              <h2 className="font-semibold mb-2">Productos Seleccionados</h2>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-2 py-1 text-left">Producto</th>
                    <th className="px-2 py-1 text-left">Cantidad</th>
                    <th className="px-2 py-1 text-left">Precio</th>
                    <th className="px-2 py-1 text-left">Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.productos.map((p) => {
                    const prod = productos.find(prod => prod.id === p.id)!
                    return (
                      <tr key={p.id} className="border-t">
                        <td className="px-2 py-1 flex items-center gap-2">
                          {prod.imagen && (
                            <img src={prod.imagen} alt={prod.nombre} className="w-10 h-10 object-cover rounded" />
                          )}
                          {prod.nombre}
                        </td>
                        <td className="px-2 py-1">
                          <Input
                            type="number"
                            min={1}
                            max={prod.stock}
                            value={p.cantidad}
                            onChange={e =>
                              actualizarCantidad(p.id, parseInt(e.target.value))
                            }
                            className="w-20"
                          />
                          {p.cantidad > prod.stock && (
                            <p className="text-xs text-red-500">Stock insuficiente</p>
                          )}
                        </td>
                        <td className="px-2 py-1">L. {Number(p.precio).toFixed(2)}</td>
                        <td className="px-2 py-1">L. {(Number(p.precio) * p.cantidad).toFixed(2)}</td>
                        <td>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => eliminarProducto(p.id)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Total y pago */}
          <div>
            <Label>Total: <strong>L. {calcularTotal().toFixed(2)}</strong></Label>
          </div>
          <div>
            <Label>Monto Pagado</Label>
            <Input
              type="number"
              value={data.monto_pagado}
              onChange={e => setData('monto_pagado', parseFloat(e.target.value))}
              min={0}
            />
            {errors.monto_pagado && <p className="text-red-500 text-sm">{errors.monto_pagado}</p>}
          </div>

          {/* Enviar */}
          <div>
            <Button type="submit" disabled={processing}>Guardar Pedido</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
