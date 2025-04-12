import AppLayout from '@/layouts/app-layout'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  FileText,
  Loader2,
  Ban,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Pedido } from '@/types/pedido'

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Pedidos', href: '/pedidos' },
]

interface Props {
  pedidos: {
    data: Pedido[]
    current_page: number
    last_page: number
    links: { url: string | null; label: string; active: boolean }[]
  }
  filtro: 'todos' | 'pagado' | 'no_pagado'
}

export default function PedidosIndex({ pedidos, filtro: filtroInicial }: Props) {
  const [filtro, setFiltro] = useState<'todos' | 'pagado' | 'no_pagado'>(filtroInicial)

  useEffect(() => {
    setFiltro(filtroInicial)
  }, [filtroInicial])

  const aplicarFiltro = (f: 'todos' | 'pagado' | 'no_pagado') => {
    router.get('/pedidos', { filtro: f }, { preserveState: true, preserveScroll: true })
  }

  const eliminarPedido = (id: number) => {
    if (confirm('¿Estás seguro que deseas eliminar este pedido?')) {
      router.delete(`/pedidos/${id}`)
    }
  }

  const marcarComoPagado = (id: number) => {
    if (confirm('¿Confirmas que el pedido ha sido pagado completamente?')) {
      router.put(`/pedidos/${id}/pagar`)
    }
  }

  const estadoBadge = (estado: string) => {
    const base = 'flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full'
    switch (estado) {
      case 'pendiente':
        return (
          <span className={`${base} bg-gray-200 text-gray-800`}>
            <Loader2 className="w-3 h-3 animate-spin" /> Pendiente
          </span>
        )
      case 'espera':
        return (
          <span className={`${base} bg-yellow-200 text-yellow-800`}>
            <Loader2 className="w-3 h-3" /> Espera
          </span>
        )
      case 'pagado':
        return (
          <span className={`${base} bg-green-200 text-green-800`}>
            <CheckCircle className="w-3 h-3" /> Pagado
          </span>
        )
      case 'cancelado':
        return (
          <span className={`${base} bg-red-200 text-red-800`}>
            <Ban className="w-3 h-3" /> Cancelado
          </span>
        )
      default:
        return estado
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pedidos" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative flex-1 overflow-hidden rounded-xl border-sidebar-border/70 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Pedidos</h1>
            <Link href="/pedidos/create">
              <Button className="bg-primary text-white">Nuevo Pedido</Button>
            </Link>
          </div>

          {/* Botones de filtro */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={filtro === 'todos' ? 'default' : 'outline'}
              onClick={() => aplicarFiltro('todos')}
            >
              Todos
            </Button>
            <Button
              variant={filtro === 'pagado' ? 'default' : 'outline'}
              onClick={() => aplicarFiltro('pagado')}
            >
              Ver Pagados
            </Button>
            <Button
              variant={filtro === 'no_pagado' ? 'default' : 'outline'}
              onClick={() => aplicarFiltro('no_pagado')}
            >
              Ver No Pagados
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted text-xs uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Cliente</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Pagado</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Fecha</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.data.map((pedido) => (
                  <tr key={pedido.id} className="border-t hover:bg-accent/40">
                    <td className="px-4 py-2">{pedido.id}</td>
                    <td className="px-4 py-2">
                      {pedido.cliente?.NOMBRES} {pedido.cliente?.APELLIDOS}
                    </td>
                    <td className="px-4 py-2">L. {Number(pedido.total).toFixed(2)}</td>
                    <td className="px-4 py-2">L. {Number(pedido.monto_pagado).toFixed(2)}</td>
                    <td className="px-4 py-2">{estadoBadge(pedido.estado)}</td>
                    <td className="px-4 py-2">
                      {new Date(pedido.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 flex flex-wrap items-center gap-2">
                      {/* PAGAR COMPLETO (si no está pagado aún) */}
                      {pedido.estado !== 'pagado' && (
                        <Button
                          size="icon"
                          title="Marcar como pagado"
                          onClick={() => marcarComoPagado(pedido.id)}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}

                      {/* EDITAR solo si no está pagado */}
                      {pedido.estado !== 'pagado' && (
                        <Link href={`/pedidos/${pedido.id}/edit`}>
                          <Button variant="outline" size="icon" title="Editar pedido">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}

                      {/* ELIMINAR solo si no está pagado */}
                      {pedido.estado !== 'pagado' && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => eliminarPedido(pedido.id)}
                          title="Eliminar pedido"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}

                      {/* FACTURA solo si está pagado */}
                      {pedido.estado === 'pagado' && (
  <Link href={`/pedidos/${pedido.id}`}>
    <Button size="icon" variant="secondary" title="Ver Factura">
      <FileText className="w-4 h-4" />
    </Button>
  </Link>
)}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pedidos.data.length === 0 && (
              <div className="text-center p-4 text-muted-foreground">
                No hay pedidos que coincidan con el filtro seleccionado.
              </div>
            )}
          </div>

          {/* Paginación */}
          <div className="mt-4 flex justify-center gap-1 flex-wrap">
            {pedidos.links.map((link, index) => (
              <Link
                key={index}
                href={link.url ?? '#'}
                className={`px-3 py-1 text-sm rounded-md border ${
                  link.active
                    ? 'bg-primary text-white'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
