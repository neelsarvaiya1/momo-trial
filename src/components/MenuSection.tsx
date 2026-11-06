import React, { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Plus, Check, Flame, Leaf, Sparkles, Info } from 'lucide-react'
import { MenuItem } from '../types'
import { MENU_ITEMS } from '../data/menuData'
import { playTactileClick, playAddSuccess } from '../utils/audio'

gsap.registerPlugin(ScrollTrigger)

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({})

  const categories = [
    { id: 'all', label: 'Complete Collection' },
    { id: 'steamed', label: 'Classic Steamed' },
    { id: 'fried', label: 'Crispy & Fried' },
    { id: 'tandoori', label: 'Clay Tandoori' },
    { id: 'special', label: 'Wok Specialties' },
  ]

  const filteredItems =
    selectedCategory === 'all'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === selectedCategory)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const cards = containerRef.current.querySelectorAll('.menu-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          },
        }
      )
    },
    { dependencies: [selectedCategory], scope: containerRef }
  )

  const handleAdd = (item: MenuItem) => {
    playAddSuccess()
    onAddToCart(item)

    // Visual button check animation
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }))
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }))
    }, 1200)
  }

  return (
    <section
      ref={containerRef}
      id="menu"
      className="relative w-full py-24 sm:py-32 bg-doughCream/30 border-t border-doughCream"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-chiliRed" />
              <span className="text-xs uppercase font-bold tracking-widest text-deepCharcoal/70">
                THE STEAM BASKET
              </span>
            </div>
            <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-deepCharcoal tracking-tight leading-[1.05]">
              Meet your
              <br />
              <span className="text-chiliRed italic font-normal">new obsession.</span>
            </h2>
          </div>

          <p className="font-sans text-sm sm:text-base text-deepCharcoal/75 max-w-md leading-relaxed">
            Every order comes fresh out of tiered cedar and bamboo steamers, accompanied by our signature slow-simmered Himalayan chili chutney.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playTactileClick()
                setSelectedCategory(cat.id)
              }}
              className={`btn-press whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-deepCharcoal text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-deepCharcoal/70 hover:text-deepCharcoal border border-doughCream'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Asymmetric / Dynamic Editorial Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => {
            const isAdded = addedItemIds[item.id]
            const isFeatured = idx === 0 && selectedCategory === 'all'

            return (
              <div
                key={item.id}
                className={`menu-card group relative bg-white rounded-3xl p-6 border border-doughCream/80 shadow-sm hover:shadow-xl hover:border-chiliRed/40 transition-all duration-300 flex flex-col justify-between ${
                  isFeatured ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div>
                  {/* Food Image with subtle zoom and border */}
                  <div
                    className={`relative w-full rounded-2xl overflow-hidden bg-doughCream/50 mb-5 ${
                      isFeatured ? 'aspect-[16/9]' : 'aspect-[4/3]'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Veg / Non-Veg Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase backdrop-blur-md shadow-sm ${
                          item.isVeg
                            ? 'bg-white/95 text-freshGreen border border-freshGreen/30'
                            : 'bg-white/95 text-chiliRed border border-chiliRed/30'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isVeg ? 'bg-freshGreen' : 'bg-chiliRed'
                          }`}
                        />
                        {item.isVeg ? 'Pure Veg' : 'Chicken / Meat'}
                      </span>
                    </div>

                    {/* Pieces tag */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-deepCharcoal/80 text-white backdrop-blur-md">
                        {item.pieces} Pieces
                      </span>
                    </div>
                  </div>

                  {/* Title & Price Header */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-serif text-2xl font-bold text-deepCharcoal group-hover:text-chiliRed transition-colors">
                      {item.name}
                    </h3>
                    <span className="font-serif text-xl font-bold text-deepCharcoal tabular-nums">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Appetizing Description */}
                  <p className="font-sans text-sm text-deepCharcoal/70 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Dip Pairing */}
                  <div className="flex items-center gap-2 text-xs text-deepCharcoal/60 mb-5 bg-warmWhite p-2.5 rounded-xl border border-doughCream/60">
                    <Sparkles className="w-3.5 h-3.5 text-chiliRed shrink-0" />
                    <span>Includes: <strong className="text-deepCharcoal font-medium">{item.dip}</strong></span>
                  </div>
                </div>

                {/* Footer / Card Actions */}
                <div className="pt-4 border-t border-doughCream/60 flex items-center justify-between">
                  {/* Spiciness Level meter */}
                  <div className="flex items-center gap-1" title={`Spice Level: ${item.spiciness} of 3`}>
                    {[1, 2, 3].map((lvl) => (
                      <Flame
                        key={lvl}
                        className={`w-4 h-4 transition-colors ${
                          lvl <= item.spiciness ? 'text-chiliRed fill-chiliRed' : 'text-doughCream'
                        }`}
                      />
                    ))}
                    <span className="text-[10px] uppercase font-bold tracking-wider text-deepCharcoal/50 ml-1">
                      {item.spiciness === 1 ? 'Mild' : item.spiciness === 2 ? 'Medium' : 'Fiery'}
                    </span>
                  </div>

                  {/* Add to Order Button with Emil Kowalski sub-300ms feedback */}
                  <button
                    onClick={() => handleAdd(item)}
                    className={`btn-press flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                      isAdded
                        ? 'bg-freshGreen text-white'
                        : 'bg-chiliRed hover:bg-chiliRed-hover text-white shadow-sm shadow-chiliRed/20'
                    }`}
                    aria-label={`Add ${item.name} to order`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>ADDED</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD TO ORDER</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
