'use client'

import { useUser, PointHistoryItem } from './UserContext'
import { Card } from '@/components/ui/card'
import { ArrowUpCircle, ArrowDownCircle, Gift, ShoppingBag } from 'lucide-react'

export default function PointHistorySection() {
  const { pointHistory, profileLoading, accessToken } = useUser()

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PURCHASE':
        return <ShoppingBag className="w-5 h-5 text-green-600" />
      case 'REDEEM':
        return <Gift className="w-5 h-5 text-purple-600" />
      case 'ADJUSTMENT_ADD':
      case 'BONUS':
        return <ArrowUpCircle className="w-5 h-5 text-blue-600" />
      case 'ADJUSTMENT_SUBTRACT':
      case 'EXPIRED':
        return <ArrowDownCircle className="w-5 h-5 text-red-600" />
      default:
        return <ArrowUpCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PURCHASE':
        return 'Purchase'
      case 'REDEEM':
        return 'Redeemed'
      case 'ADJUSTMENT_ADD':
        return 'Points Added'
      case 'ADJUSTMENT_SUBTRACT':
        return 'Points Deducted'
      case 'BONUS':
        return 'Bonus'
      case 'EXPIRED':
        return 'Expired'
      default:
        return type
    }
  }

  if (profileLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold heading mb-6">Point History</h2>
        <div className="py-6 text-center">
          <p className="text-muted-foreground text-lg">Loading point history...</p>
        </div>
      </Card>
    )
  }

  if (!accessToken) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold heading mb-6">Point History</h2>
        <div className="py-6 text-center">
          <p className="text-muted-foreground text-lg">Please sign in to view your point history</p>
        </div>
      </Card>
    )
  }

  if (!pointHistory || pointHistory.items.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold heading mb-6">Point History</h2>
        <div className="py-6 text-center">
          <p className="text-muted-foreground text-lg">No point history yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Earn points by making purchases!
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold heading">Point History</h2>
      </Card>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Total: {pointHistory.total} transaction{pointHistory.total !== 1 ? 's' : ''}
        </p>
      </div>

      {pointHistory.items.map((item: PointHistoryItem) => (
        <Card key={item.id} className="p-4">
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              {getTypeIcon(item.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">
                  {getTypeLabel(item.type)}
                </h4>
                <span className={`font-bold ${item.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.delta >= 0 ? '+' : ''}{item.delta} pts
                </span>
              </div>
              
              {item.note && (
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {item.note}
                </p>
              )}
              
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
