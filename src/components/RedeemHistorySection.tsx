'use client'

import { useUser, RedeemHistoryItem } from './UserContext'
import { Card } from '@/components/ui/card'
import { Gift } from 'lucide-react'

export default function RedeemHistorySection() {
  const { redeemHistory, profileLoading, accessToken } = useUser()

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'CLAIMED':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'EXPIRED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (profileLoading) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">Loading redeem history...</p>
      </Card>
    )
  }

  if (!accessToken) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">Please sign in to view your redeem history</p>
      </Card>
    )
  }

  if (!redeemHistory || redeemHistory.items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Gift className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">No rewards redeemed yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Use your points to redeem exciting rewards!
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Total: {redeemHistory.total} redemption{redeemHistory.total !== 1 ? 's' : ''}
        </p>
      </div>

      {redeemHistory.items.map((item: RedeemHistoryItem) => (
        <Card key={item.id} className="p-4">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-foreground truncate">
                  {item.reward?.name || 'Reward'}
                </h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border shrink-0 ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              
              {item.reward?.description && (
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {item.reward.description}
                </p>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {new Date(item.redeemedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <span className="text-sm font-medium text-purple-600">
                  -{item.pointsUsed} pts
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
