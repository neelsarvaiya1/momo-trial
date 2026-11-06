import React, { useState } from 'react'
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  UtensilsCrossed,
} from 'lucide-react'
import { CartItem } from '../types'
import { playTactileClick, playAddSuccess } from '../utils/audio'

interface OrderDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, delta: number) => void
  onClearCart: () => void
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
}) => {
  const [orderState, setOrderState] = useState<'cart' | 'checkout' | 'confirmed'>('cart')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')

  if (!isOpen) return null

  const subtotal = items.reduce((sum, item) => sum + item.item.price * item.quantity, 0)
  const deliveryFee = deliveryType === 'delivery' && subtotal > 0 ? 3.99 : 0
  const tax = subtotal * 0.08875
  const total = subtotal > 0 ? subtotal + deliveryFee + tax : 0

  const handleProceedToCheckout = () => {
    playTactileClick()
    setOrderState('checkout')
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    playAddSuccess()
    setOrderState('confirmed')
  }

  const handleCloseAndReset = () => {
    playTactileClick()
    onClose()
    if (orderState === 'confirmed') {
      onClearCart()
      setOrderState('cart')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Dimmed backdrop */}
      <div
        onClick={handleCloseAndReset}
        className="fixed inset-0 bg-deepCharcoal/60 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-warmWhite border-l border-doughCream shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 ease-drawer">
          {/* Top Header */}
          <div className="p-6 border-b border-doughCream flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-chiliRed flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-deepCharcoal">
                  Your Steamer Bag
                </h3>
                <span className="text-xs text-deepCharcoal/60">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} items selected
                </span>
              </div>
            </div>

            <button
              onClick={handleCloseAndReset}
              className="btn-press p-2 rounded-full hover:bg-doughCream/50 text-deepCharcoal/70 hover:text-deepCharcoal cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {orderState === 'confirmed' ? (
              /* ORDER CONFIRMED VIEW */
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-freshGreen-light text-freshGreen flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-deepCharcoal mb-2">
                  Steamer is on the fire!
                </h4>
                <p className="font-sans text-sm text-deepCharcoal/70 mb-6 leading-relaxed">
                  Thank you, <strong>{customerName || 'friend'}</strong>. Our chefs have begun rolling your fresh dough.
                </p>

                <div className="bg-white p-5 rounded-2xl border border-doughCream text-left space-y-3 mb-8">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-deepCharcoal/60">Order Number</span>
                    <span className="font-mono font-bold text-deepCharcoal">#MM-{Math.floor(1000 + Math.random() * 9000)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-deepCharcoal/60">Estimated Preparation</span>
                    <span className="font-bold text-freshGreen">18 - 25 minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-doughCream">
                    <span className="text-deepCharcoal/60">Total Paid</span>
                    <span className="font-bold text-deepCharcoal tabular-nums">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCloseAndReset}
                  className="btn-press w-full py-3.5 rounded-full bg-chiliRed text-white text-xs font-bold tracking-wider uppercase"
                >
                  Return to Menu
                </button>
              </div>
            ) : orderState === 'checkout' ? (
              /* CHECKOUT FORM VIEW */
              <form onSubmit={handlePlaceOrder} className="space-y-5">
                <div className="flex gap-2 p-1 bg-white rounded-full border border-doughCream">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`flex-1 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-colors ${
                      deliveryType === 'delivery'
                        ? 'bg-deepCharcoal text-white'
                        : 'text-deepCharcoal/70'
                    }`}
                  >
                    Hot Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`flex-1 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-colors ${
                      deliveryType === 'pickup'
                        ? 'bg-deepCharcoal text-white'
                        : 'text-deepCharcoal/70'
                    }`}
                  >
                    Quick Pickup
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-deepCharcoal/70 mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-doughCream text-sm focus:outline-none focus:border-chiliRed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-deepCharcoal/70 mb-1.5">
                    Phone for SMS Alerts
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-doughCream text-sm focus:outline-none focus:border-chiliRed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-deepCharcoal/70 mb-1.5">
                    Delivery Address / Table
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Street address or Table number"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-doughCream text-sm focus:outline-none focus:border-chiliRed"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-doughCream/40 border border-doughCream text-xs text-deepCharcoal/80 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-chiliRed mt-0.5 shrink-0" />
                  <span>
                    Steamed fresh on demand. Your momos arrive in thermally insulated eco-bamboo packaging.
                  </span>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderState('cart')}
                    className="btn-press px-4 py-3 rounded-full border border-doughCream text-xs font-bold uppercase"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn-press flex-1 py-3.5 rounded-full bg-chiliRed text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-chiliRed/25"
                  >
                    Confirm & Send to Kitchen (${total.toFixed(2)})
                  </button>
                </div>
              </form>
            ) : items.length === 0 ? (
              /* EMPTY CART VIEW */
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-doughCream/60 flex items-center justify-center mx-auto mb-4 text-deepCharcoal/40">
                  <UtensilsCrossed className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-bold text-deepCharcoal mb-2">
                  Your steamer basket is empty
                </h4>
                <p className="font-sans text-xs text-deepCharcoal/60 max-w-xs mx-auto mb-6">
                  Add freshly steamed, crispy fried, or tandoori momos from our menu to start your feast.
                </p>
                <a
                  href="#menu"
                  onClick={handleCloseAndReset}
                  className="btn-press inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-chiliRed text-white text-xs font-bold tracking-wider uppercase"
                >
                  <span>Browse Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              /* CART ITEMS LIST */
              <div className="space-y-4">
                {items.map((cartItem) => (
                  <div
                    key={cartItem.item.id}
                    className="bg-white p-4 rounded-2xl border border-doughCream shadow-sm flex items-center gap-4"
                  >
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-doughCream shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-serif text-sm font-bold text-deepCharcoal truncate">
                          {cartItem.item.name}
                        </h4>
                        <span className="text-xs font-bold text-deepCharcoal tabular-nums">
                          ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                        </span>
                      </div>

                      <span className="text-[11px] text-deepCharcoal/60 block mb-2">
                        {cartItem.item.pieces} pcs • {cartItem.item.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center border border-doughCream rounded-full p-0.5 bg-warmWhite">
                          <button
                            onClick={() => {
                              playTactileClick()
                              onUpdateQuantity(cartItem.item.id, -1)
                            }}
                            className="btn-press w-6 h-6 rounded-full flex items-center justify-center text-deepCharcoal/70 hover:bg-doughCream/70"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold tabular-nums text-deepCharcoal">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => {
                              playTactileClick()
                              onUpdateQuantity(cartItem.item.id, 1)
                            }}
                            className="btn-press w-6 h-6 rounded-full flex items-center justify-center text-deepCharcoal/70 hover:bg-doughCream/70"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Summary & Proceed Button (if in cart state & has items) */}
          {orderState === 'cart' && items.length > 0 && (
            <div className="p-6 border-t border-doughCream bg-white space-y-4">
              <div className="space-y-1.5 text-xs text-deepCharcoal/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums text-deepCharcoal">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="tabular-nums">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-doughCream text-sm font-bold text-deepCharcoal">
                  <span>Estimated Total</span>
                  <span className="tabular-nums text-chiliRed font-serif text-lg">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="btn-press w-full py-4 rounded-full bg-chiliRed hover:bg-chiliRed-hover text-white text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-chiliRed/30 cursor-pointer"
              >
                <span>PROCEED TO ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
