import AppLayout from '@/layouts/app-layout'
import { Head, useForm } from '@inertiajs/react'
import { useState } from 'react'
import type { Cliente, Producto, Pedido, PedidoProductoInput } from '@/types/pedido'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  clientes: Cliente[]
  productos: (Producto & { imagen?: string })[]
  pedido: Pedido
}

export default function EditPedido({ clientes, productos, pedido }: Props) {
  const [productoSeleccionado, setProductoSeleccionado] = useState('')

  const { data, setData, put, errors, processing } = useForm({
    cliente_id: pedido.cliente.id.toString(),
    productos: pedido.productos.map((p) => ({
      id: p.id,
      cantidad: p.pivot.cantidad,
      precio: Math.floor(Number(p.pivot.precio)),
    })),
    monto_pagado: Math.floor(pedido.monto_pagado),
  })

  const agregarProducto = () => {
    const prodId = Number(productoSeleccionado)
    const producto = productos.find((p) => p.id === prodId)
    if (!producto) return
    if (data.productos.find((p) => p.id === prodId)) return

    setData('productos', [
      ...data.productos,
      {
        id: producto.id,
        cantidad: 1,
        precio: Math.floor(Number(producto.precio)),
      },
    ])
    setProductoSeleccionado('')
  }

  const actualizarCantidad = (id: number, cantidad: number) => {
    setData('productos', data.productos.map((p) =>
      p.id === id ? { ...p, cantidad } : p
    ))
  }

  const eliminarProducto = (id: number) => {
    setData('productos', data.productos.filter((p) => p.id !== id))
  }

  const calcularTotal = (): number =>
    data.productos.reduce((total, p) => total + Math.floor(p.precio) * p.cantidad, 0)

  const formatoMiles = (numero: number) =>
    new Intl.NumberFormat('es-HN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.floor(numero))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/pedidos/${pedido.id}`)
  }

  const total = calcularTotal()

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
              value={data.cliente_id ?? ''}
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
            <Label>Agregar Producto</Label>
            <div className="flex gap-2">
              <select
                className="flex-1 border rounded px-3 py-2"
                value={productoSeleccionado}
                onChange={e => setProductoSeleccionado(e.target.value)}
              >
                <option value="">Seleccione un producto</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - L. {formatoMiles(p.precio)}
                  </option>
                ))}
              </select>
              <Button type="button" onClick={agregarProducto}>
                Agregar
              </Button>
            </div>
          </div>

          {/* Lista de productos */}
          {data.productos.length > 0 && (
            <div>
              <h2 className="font-semibold mb-2">Productos Seleccionados</h2>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-2 py-1 text-left">Imagen</th>
                    <th className="px-2 py-1 text-left">Producto</th>
                    <th className="px-2 py-1 text-left">Cantidad</th>
                    <th className="px-2 py-1 text-left">Precio</th>
                    <th className="px-2 py-1 text-left">Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.productos.map((p) => {
                    const prod = productos.find((prod) => prod.id === p.id)!
                    return (
                      <tr key={p.id} className="border-t">
                        <td className="px-2 py-1">
                          {prod.imagen && (
                            <img
                              src={prod.imagen.startsWith('http') ? prod.imagen : `/storage/${prod.imagen}`}
                              alt={prod.nombre}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                        </td>
                        <td className="px-2 py-1">{prod.nombre}</td>
                        <td className="px-2 py-1">
                          <Input
                            type="number"
                            min={1}
                            max={prod.stock}
                            value={p.cantidad}
                            onChange={e => actualizarCantidad(p.id, parseInt(e.target.value))}
                            className="w-16"
                          />
                        </td>
                        <td className="px-2 py-1">L. {formatoMiles(p.precio)}</td>
                        <td className="px-2 py-1">
                          L. {formatoMiles(p.precio * p.cantidad)}
                        </td>
                        <td className="px-2 py-1">
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

          {/* Total */}
          <div>
            <Label>Total: <strong>L. {formatoMiles(total)}</strong></Label>
          </div>

          {/* Monto pagado */}
          <div>
            <Label>Monto Pagado</Label>
            <Input
              type="number"
              min={0}
              value={data.monto_pagado}
              onChange={e => {
                const valor = Math.floor(Number(e.target.value))
                const valido = isNaN(valor) ? 0 : Math.min(valor, total)
                setData('monto_pagado', valido)
              }}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Visual: <strong>L. {formatoMiles(data.monto_pagado)}</strong>
            </p>
            {data.monto_pagado > total && (
              <p className="text-red-500 text-sm">
                El monto pagado no puede ser mayor al total del pedido.
              </p>
            )}
            {errors.monto_pagado && <p className="text-red-500 text-sm">{errors.monto_pagado}</p>}
          </div>

          {/* Botón guardar */}
          <div>
            <Button type="submit" disabled={processing}>
              Actualizar Pedido
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
