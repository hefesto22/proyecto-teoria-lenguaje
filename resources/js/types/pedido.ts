export interface Cliente {
  RTN: any
  id: number
  NOMBRES: string
  APELLIDOS: string
}

export interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number        // 👈 necesario para validaciones
  imagen?: string      // 👈 necesario para mostrar la imagen
}

// Usado en formularios para agregar/editar productos de un pedido
export interface PedidoProductoInput {
  id: number
  cantidad: number
  precio: number
  isv: number
}

// Usado cuando consultamos un pedido desde el backend (con relación pivot)
export interface Pedido {
  id: number
  cliente: Cliente
  productos: (Producto & {
    pivot: {
      isv_porcentaje: number
      cantidad: number
      precio: number
      total: number
    }
  })[]
  total: number
  monto_pagado: number
  estado: 'pendiente' | 'espera' | 'pagado' | 'cancelado'
  created_at: string
}



