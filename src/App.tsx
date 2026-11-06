import React, { useState, useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MenuItem, CartItem } from './types'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { StorySection } from './components/StorySection'
import { MenuSection } from './components/MenuSection'
import { IngredientsSection } from './components/IngredientsSection'
import { SignatureSection } from './components/SignatureSection'
import { FooterSection } from './components/FooterSection'
import { OrderDrawer } from './components/OrderDrawer'

gsap.registerPlugin(ScrollTrigger)

export function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Initialize Lenis Smooth Scrolling integrated with GSAP ScrollTrigger
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    })

    // Synchronize Lenis scroll position with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // GSAP ticker drives Lenis animation frame
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(updateTicker)
      lenis.destroy()
    }
  }, [])

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.item.id === id) {
            const nextQty = i.quantity + delta
            return nextQty > 0 ? { ...i, quantity: nextQty } : null
          }
          return i
        })
        .filter((i): i is CartItem => i !== null)
    )
  }

  const handleClearCart = () => {
    setCartItems([])
  }

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-[100dvh] flex flex-col bg-warmWhite text-deepCharcoal font-sans selection:bg-chiliRed selection:text-white">
      {/* Floating Navigation */}
      <Navbar cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1 w-full">
        {/* Section 1: Cinematic Scroll Video Hero */}
        <HeroSection onOrderClick={() => setIsCartOpen(true)} />

        {/* Section 2: Brand Story */}
        <StorySection />

        {/* Section 3: The Menu */}
        <MenuSection onAddToCart={handleAddToCart} />

        {/* Section 4: The Ingredient Experience */}
        <IngredientsSection />

        {/* Section 5: Signature Momo Experience */}
        <SignatureSection onOrderClick={() => setIsCartOpen(true)} />
      </main>

      {/* Section 6: CTA and Footer */}
      <FooterSection onOrderClick={() => setIsCartOpen(true)} />

      {/* Slide-over Order Bag Drawer */}
      <OrderDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />
    </div>
  )
}

export default App

