import AppLayout from '@/layouts/app-layout'
import { Head, useForm } from '@inertiajs/react'
import { useState } from 'react'
import type { Cliente, Producto, Pedido } from '@/types/pedido'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  clientes: Cliente[]
  productos: (Producto & { imagen?: string, isv: number })[]
  pedido: Pedido
}

export default function EditPedido({ clientes, productos, pedido }: Props) {
  const { data, setData, put, errors, processing } = useForm({
    cliente_id: pedido.cliente.id.toString(),
    productos: pedido.productos.map((p) => ({
      id: p.id,
      cantidad: p.pivot.cantidad,
      precio: Number(p.pivot.precio),
      isv: Number(p.pivot.isv_porcentaje ?? 0),
    })),
    monto_pagado: Number(pedido.monto_pagado),
  })

  const [productoSeleccionado, setProductoSeleccionado] = useState('')

  const agregarProducto = () => {
    const prodId = Number(productoSeleccionado)
    const producto = productos.find(p => p.id === prodId)
    if (!producto || data.productos.find(p => p.id === prodId)) return

    setData('productos', [
      ...data.productos,
      {
        id: producto.id,
        cantidad: 1,
        precio: Number(producto.precio),
        isv: Number(producto.isv),
      },
    ])
    setProductoSeleccionado('')
  }

  const actualizarCantidad = (id: number, cantidad: number) => {
    const prod = productos.find(p => p.id === id)
    if (!prod || cantidad < 1) return

    const cantidadOriginal = pedido.productos.find(p => p.id === id)?.pivot.cantidad || 0
    const stockDisponible = prod.stock + cantidadOriginal

    if (cantidad > stockDisponible) return

    setData('productos', data.productos.map(p =>
      p.id === id ? { ...p, cantidad } : p
    ))
  }

  const eliminarProducto = (id: number) => {
    setData('productos', data.productos.filter(p => p.id !== id))
  }

  const calcularTotal = () =>
    data.productos.reduce((total, p) => {
      const isvUnitario = p.precio * ((p.isv ?? 0) / 100)
      return total + (p.precio + isvUnitario) * p.cantidad
    }, 0)

  const calcularISVTotal = () =>
    data.productos.reduce((total, p) => {
      const isvUnitario = p.precio * ((p.isv ?? 0) / 100)
      return total + isvUnitario * p.cantidad
    }, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/pedidos/${pedido.id}`)
  }

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Pedidos', href: '/pedidos' },
      { title: `Editar #${pedido.id}`, href: `/pedidos/${pedido.id}/edit` },
    ]}>
      <Head title={`Editar Pedido #${pedido.id}`} />

      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Editar Pedido #{pedido.id}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Cliente */}
          <div>
            <Label>Cliente</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={data.cliente_id}
              onChange={e => setData('cliente_id', e.target.value)}
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.NOMBRES} {c.APELLIDOS}
                </option>
              ))}
            </select>
            {errors.cliente_id && <p className="text-red-500 text-sm">{errors.cliente_id}</p>}
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

          {/* Lista de productos */}
          {data.productos.length > 0 && (
            <div>
              <h2 className="font-semibold mb-2">Productos Seleccionados</h2>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-2 py-1 text-left">Producto</th>
                    <th className="px-2 py-1 text-left">Cantidad</th>
                    <th className="px-2 py-1 text-left">Precio</th>
                    <th className="px-2 py-1 text-left">ISV</th>
                    <th className="px-2 py-1 text-left">Stock</th>
                    <th className="px-2 py-1 text-left">Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.productos.map((p) => {
                    const prod = productos.find(prod => prod.id === p.id)!
                    const isvUnitario = p.precio * ((p.isv ?? 0) / 100)
                    const totalPorProducto = (p.precio + isvUnitario) * p.cantidad

                    const cantidadOriginal = pedido.productos.find(x => x.id === p.id)?.pivot.cantidad || 0
                    const stockDisponible = prod.stock + cantidadOriginal
                    const stockVisual = stockDisponible - p.cantidad

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
                            max={stockDisponible}
                            value={p.cantidad}
                            onChange={e => actualizarCantidad(p.id, parseInt(e.target.value))}
                            className="w-20"
                          />
                          {p.cantidad > stockDisponible && (
                            <p className="text-xs text-red-500">Stock insuficiente</p>
                          )}
                        </td>
                        <td className="px-2 py-1">L. {p.precio.toFixed(2)}</td>
                        <td className="px-2 py-1">{(p.isv ?? 0)}%</td>
                        <td className="px-2 py-1">{stockVisual}</td>
                        <td className="px-2 py-1">L. {totalPorProducto.toFixed(2)}</td>
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

          {/* Totales */}
          <div className="space-y-2">
            <p className="hidden">Total ISV: L. {calcularISVTotal().toFixed(2)}</p>
            <p className="font-semibold text-lg">Total a Pagar: L. {calcularTotal().toFixed(2)}</p>
          </div>

          {/* Monto pagado */}
          <div>
            <Label>Monto Pagado</Label>
            <Input
              type="number"
              value={data.monto_pagado}
              onChange={e => setData('monto_pagado', parseFloat(e.target.value))}
              min={0}
              step="0.01"
            />
            {errors.monto_pagado && <p className="text-red-500 text-sm">{errors.monto_pagado}</p>}
          </div>

          {/* Enviar */}
          <div>
            <Button type="submit" disabled={processing}>Actualizar Pedido</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
