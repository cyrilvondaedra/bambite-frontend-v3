'use client'

import { useEffect, useState } from 'react'
import { useUser } from './UserContext'
import { Card } from '@/components/ui/card'
import { api } from '@/lib/api'

interface Product {
  id: string
  name: string
  category: {
    id: string
    name: string
    status: string
  }
}

interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  priceAtTime: string
  netPrice: string
  selectedOptionsSnapshot: Record<string, string> | null
  createdAt: string
  product: Product
}

interface Order {
  id: string
  userId: string
  netPrice: string
  orderedDate: string
  status: string
  email: string
  phoneNumber: string
  orderItems: OrderItem[]
}

interface OrdersResponse {
  status: string
  data: Order[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

export default function OrdersSection() {
  const { accessToken } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!accessToken) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const res: OrdersResponse = await api(`/api/orders/my-orders?page=${page}&limit=10`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        
        setOrders(res.data || [])
        if (res.meta) {
          const totalPages = Math.ceil(res.meta.total / res.meta.limit)
          setTotalPages(totalPages || 1)
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        setError(err instanceof Error ? err.message : 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [accessToken, page])

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'PROCESSING':
      case 'PREPARING':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (loading) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">Loading orders...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={() => setPage(1)}
          className="mt-4 text-sm text-primary underline"
        >
          Try again
        </button>
      </Card>
    )
  }

  if (!accessToken) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">Please sign in to view your orders</p>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">No orders yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Start exploring our menu and place your first order!
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground">
                Order #{order.id.slice(-8).toUpperCase()}
              </h3>
              <p className="text-sm text-muted-foreground">
                {new Date(order.orderedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(order.status)}`}>
              {order.status.toLowerCase()}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {order.orderItems.map((item: OrderItem, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.product.name} x {item.quantity}
                </span>
                <span className="text-muted-foreground">
                  ${(parseFloat(item.priceAtTime) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center">
            <span className="font-medium text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">
              ${parseFloat(order.netPrice).toFixed(2)}
            </span>
          </div>
        </Card>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
