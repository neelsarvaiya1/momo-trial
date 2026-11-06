import React, { useState, useEffect } from 'react'
import { ShoppingBag, Menu as MenuIcon, X, Utensils } from 'lucide-react'
import { playTactileClick } from '../utils/audio'

interface NavbarProps {
  cartCount: number
  onOpenCart: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Transition from transparent hero to warm-white background
      if (window.scrollY > 80) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Our Story', href: '#story' },
    { label: 'Menu', href: '#menu' },
    { label: 'Ingredients', href: '#ingredients' },
    { label: 'Experience', href: '#experience' },
  ]

  const handleLinkClick = (href: string) => {
    playTactileClick()
    setMobileMenuOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-out-custom px-4 sm:px-8 py-3 sm:py-4 ${
          isScrolled
            ? 'bg-warmWhite/90 backdrop-blur-md border-b border-doughCream/80 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand Logo / Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('#hero')
            }}
            className="flex items-center gap-1.5 group cursor-pointer"
            aria-label="MOMO Home"
          >
            <div className="w-8 h-8 rounded-full bg-chiliRed flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <span className="font-serif font-black text-xs">M</span>
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-deepCharcoal">
              MOMO<span className="text-chiliRed">.</span>
            </span>
          </a>

          {/* Center: Desktop Navigation Links (Rounded Pill Design) */}
          <nav
            className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-doughCream/80 shadow-sm"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick(link.href)
                }}
                className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-deepCharcoal/80 hover:text-chiliRed hover:bg-doughCream/50 transition-colors duration-150 cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Order Momos Button */}
            <button
              onClick={() => {
                playTactileClick()
                onOpenCart()
              }}
              className="btn-press relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-chiliRed hover:bg-chiliRed-hover text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-chiliRed/20 cursor-pointer"
              aria-label={`View order bag with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">ORDER MOMOS</span>
              <span className="sm:hidden">ORDER</span>

              {cartCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-chiliRed text-[10px] font-extrabold tabular-nums animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => {
                playTactileClick()
                setMobileMenuOpen(!mobileMenuOpen)
              }}
              className="btn-press md:hidden p-2 rounded-full bg-white/80 border border-doughCream text-deepCharcoal cursor-pointer"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-warmWhite/95 backdrop-blur-xl flex flex-col justify-between p-8 pt-24 animate-in fade-in duration-200">
          <nav className="flex flex-col gap-4">
            <span className="text-[11px] font-bold tracking-widest uppercase text-chiliRed mb-2">
              EXPLORE OUR WORLD
            </span>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick(link.href)
                }}
                className="font-serif text-3xl font-bold text-deepCharcoal hover:text-chiliRed transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-doughCream">
            <button
              onClick={() => {
                playTactileClick()
                setMobileMenuOpen(false)
                onOpenCart()
              }}
              className="btn-press w-full py-4 rounded-full bg-chiliRed text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-chiliRed/30"
            >
              <Utensils className="w-4 h-4" />
              <span>START YOUR ORDER ({cartCount} ITEMS)</span>
            </button>
            <p className="text-center text-xs text-deepCharcoal/60 mt-4">
              Fresh handcrafted Himalayan momos served daily.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

