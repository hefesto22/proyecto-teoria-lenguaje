import AppLayout from '@/layouts/app-layout'
import { Head, usePage } from '@inertiajs/react'
import type { PageProps as InertiaPageProps } from '@inertiajs/core'

interface ProductoPivot {
  nombre: string
  cantidad: number
  precio: number
  isv_porcentaje: number
  isv_total: number
  total_con_isv: number
}

interface Props extends InertiaPageProps {
  pedido: {
    id: number
    created_at: string
    cliente: {
      nombres: string
      apellidos: string
      rtn?: string
      direccion?: string
    }
    user: {
      name: string
    }
  }
  productos: ProductoPivot[]
  [key: string]: any
}

export default function PedidoShow() {
  const { pedido, productos } = usePage<Props>().props

  const total = productos.reduce((sum, p) => sum + Number(p.total_con_isv), 0)
  const isv15 = productos
    .filter(p => p.isv_porcentaje === 15)
    .reduce((sum, p) => sum + Number(p.isv_total), 0)
  const isv18 = productos
    .filter(p => p.isv_porcentaje === 18)
    .reduce((sum, p) => sum + Number(p.isv_total), 0)

  return (
    <AppLayout>
      <Head title={`Factura Pedido #${pedido.id}`} />

      <div className="max-w-4xl mx-auto bg-white p-10 border border-gray-400 text-xs print:text-[10px] font-sans">
        {/* Encabezado */}
        <div className="flex justify-between mb-4 border-b pb-2">
          <div>
            <h1 className="text-xl font-bold text-gray-800">FACTURA</h1>
            <p className="text-gray-600 text-sm">No. 002-001-01-0000000{pedido.id}</p>
          </div>
          <div className="text-right text-sm text-gray-700">
            <p><strong>Fecha:</strong> {new Date(pedido.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Datos del cliente */}
        <div className="mb-4 border p-3 rounded">
          <p><strong>CLIENTE:</strong> {pedido.cliente.nombres} {pedido.cliente.apellidos}</p>
          <p><strong>RTN:</strong> {pedido.cliente.rtn || 'No definido'}</p>
          <p><strong>DIRECCIÓN:</strong> {pedido.cliente.direccion || 'No definida'}</p>
        </div>

        {/* Tabla de productos */}
        <table className="w-full border border-collapse mb-4 text-xs">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="border px-2 py-1 w-16">Cantidad</th>
              <th className="border px-2 py-1">Descripción</th>
              <th className="border px-2 py-1 w-24 text-right">Valor</th>
              <th className="border px-2 py-1 w-28 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr key={i} className="border-t">
                <td className="border px-2 py-1 text-center">{p.cantidad}</td>
                <td className="border px-2 py-1">{p.nombre}</td>
                <td className="border px-2 py-1 text-right">L. {Number(p.precio).toFixed(2)}</td>
                <td className="border px-2 py-1 text-right">L. {Number(p.total_con_isv).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Desglose ISV y exoneración */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Datos del Adquirente Exonerado</h3>
            <p>N° Orden de Compra Exenta ______________________</p>
            <p>N° Cons. del Registro Exonerado ________________</p>
            <p>N° Identificativo del Registro de la SAG ________</p>
          </div>

          <div>
            <table className="w-full border text-xs">
              <tbody>
                <tr><td className="border px-2 py-1">Importe Gravado</td><td className="border px-2 py-1 text-right">-</td></tr>
                <tr><td className="border px-2 py-1">Importe Exento / ISV TO</td><td className="border px-2 py-1 text-right">-</td></tr>
                <tr><td className="border px-2 py-1">Importe Exonerado</td><td className="border px-2 py-1 text-right">-</td></tr>
                <tr><td className="border px-2 py-1">ISV 15%</td><td className="border px-2 py-1 text-right">L. {isv15.toFixed(2)}</td></tr>
                <tr><td className="border px-2 py-1">ISV 18%</td><td className="border px-2 py-1 text-right">L. {isv18.toFixed(2)}</td></tr>
                <tr className="font-bold"><td className="border px-2 py-1">TOTAL</td><td className="border px-2 py-1 text-right">L. {total.toFixed(2)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie de factura */}
        <div className="mt-6 text-sm">
          <p><strong>Cantidad en letras:</strong> __________________________________________</p>
          <p className="mt-2 text-[10px] text-gray-500">
            CAI. 6542H9-B3C8BC-7442C5-5BD634-5684F5-C0 | Autorización 002-001-01-00000001 al 002-001-01-00000050<br />
            Fecha límite de emisión: 17-05-2025 | Imprenta los Andes RTN 08011985024566 Cert. 8341-151151048
          </p>
        </div>

        {/* Botón imprimir */}
        <div className="mt-8 flex justify-end print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded shadow font-medium"
          >
            Imprimir Factura
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
