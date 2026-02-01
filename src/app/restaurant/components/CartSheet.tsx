'use client';

import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Shopping cart({items.length})
            </h2>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                  {/* Product Image */}
                  {/* <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div> */}

                  {/* Product Info */}
                  {/* <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">₿ {item.price.toFixed(2)}</p>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.notes}</p>
                      )}
                    </div>
                  </div> */}

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
                    >
                      <span className="text-sm">−</span>
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white hover:bg-opacity-90 transition-colors"
                    >
                      <span className="text-sm">+</span>
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Total and Confirm Button */}
          {items.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t border-border pt-4">
              <div className="flex items-center justify-between mb-4 px-0">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">₿ {totalPrice}</span>
              </div>
              <button className="w-full py-4 px-6 bg-primary text-white font-bold text-lg rounded-full hover:bg-opacity-90 transition-all">
                confirm
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Clear Cart Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-foreground mb-6">Remove all items from your cart?</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 px-4 border border-primary text-primary font-semibold rounded-full hover:bg-primary/5 transition-colors"
              >
                cancel
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 py-3 px-4 bg-primary text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors"
              >
                agree
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
