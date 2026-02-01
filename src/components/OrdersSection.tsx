'use client'

import { useUser } from './UserContext'
import { Card } from '@/components/ui/card'

export default function OrdersSection() {
  // const { orders } = useUser()

  // if (orders.length === 0) {
  //   return (
  //     <Card className="p-12 text-center">
  //       <p className="text-muted-foreground text-lg">No orders yet</p>
  //       <p className="text-sm text-muted-foreground mt-2">
  //         Start exploring our menu and place your first order!
  //       </p>
  //     </Card>
  //   )
  // }

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'completed':
  //       return 'bg-green-100/20 text-green-700 border-green-200'
  //     case 'pending':
  //       return 'bg-yellow-100/20 text-yellow-700 border-yellow-200'
  //     case 'cancelled':
  //       return 'bg-red-100/20 text-red-700 border-red-200'
  //     default:
  //       return 'bg-muted text-muted-foreground'
  //   }
  // }

  return (
    <div className="space-y-4">
      {/* {orders.map((order) => (
        <Card key={order.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground">{order.id}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(order.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Badge className={`${getStatusColor(order.status)} border capitalize`}>
              {order.status}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.name} x {item.quantity}
                </span>
                <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center">
            <span className="font-medium text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">${order.total.toFixed(2)}</span>
          </div>
        </Card>
      ))} */}
    </div>
  )
}
