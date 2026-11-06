import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { INGREDIENT_STORIES } from '../data/menuData'
import { Sparkles, CheckCircle2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export const IngredientsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const floatGroupRef = useRef<HTMLDivElement>(null)

  const rawIngredients = [
    { name: 'Mountain Spring Water & Wheat', note: 'Cold kneaded for silky elasticity' },
    { name: 'Crisp Sunrise Cabbage', note: 'Shredded paper-thin at 6 AM' },
    { name: 'Wild Timur Pepper', note: 'Foraged in the Himalayan foothills' },
    { name: 'Young Spring Onions & Ginger', note: 'Crushed and steeped in cold-pressed oil' },
    { name: 'Slow-Infused Chili Crunch', note: 'Aged with star anise and roasted garlic' },
  ]

  useGSAP(
    () => {
      if (!containerRef.current) return

      // Subtle parallax on the ingredient cards
      const cards = containerRef.current.querySelectorAll('.ingredient-card')
      cards.forEach((card, index) => {
        const speed = (index + 1) * 20
        gsap.to(card, {
          y: -speed,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })

      // Floating badges gentle parallax
      if (floatGroupRef.current) {
        gsap.to(floatGroupRef.current, {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        })
      }
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="ingredients"
      className="relative w-full py-28 sm:py-36 bg-warmWhite overflow-hidden border-t border-doughCream/70"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-freshGreen" />
            <span className="text-xs uppercase font-bold tracking-widest text-deepCharcoal/70">
              ORIGIN & INTEGRITY
            </span>
          </div>

          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-deepCharcoal tracking-tight leading-[1.05] mb-6">
            Freshness is
            <br />
            <span className="text-freshGreen italic font-normal">our secret ingredient.</span>
          </h2>

          <p className="font-sans text-base sm:text-lg text-deepCharcoal/75 leading-relaxed font-normal">
            No frozen fillings. No artificial flavor enhancers. We source whole ingredients directly from organic farmers, hand-pound our mountain aromatics, and fold everything fresh for today's table.
          </p>
        </div>

        {/* 2-Column Layered Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: 4 Ingredient Pillars (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {INGREDIENT_STORIES.map((story) => (
              <div
                key={story.id}
                className="ingredient-card group bg-white rounded-3xl p-6 border border-doughCream shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-doughCream/40">
                  <img
                    src={story.image}
                    alt={story.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-freshGreen bg-freshGreen-light px-2.5 py-0.5 rounded-full">
                    {story.badge}
                  </span>
                  <span className="text-[11px] font-medium text-deepCharcoal/50">
                    {story.origin}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-deepCharcoal mb-2">
                  {story.name}
                </h3>
                <p className="font-sans text-xs text-deepCharcoal/70 leading-relaxed">
                  {story.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Layered Editorial Spec Sheet (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div
              ref={floatGroupRef}
              className="bg-doughCream/40 rounded-3xl p-8 border border-doughCream shadow-sm"
            >
              <div className="flex items-center gap-2 mb-6 text-chiliRed">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest text-deepCharcoal">
                  THE DAILY PROMISE
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-deepCharcoal mb-4">
                What goes into each fold:
              </h3>

              <div className="space-y-4 mb-8">
                {rawIngredients.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-freshGreen mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-sm font-bold text-deepCharcoal">
                        {item.name}
                      </span>
                      <span className="block text-xs text-deepCharcoal/65">
                        {item.note}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white border border-doughCream text-xs text-deepCharcoal/80 leading-relaxed font-sans">
                <strong className="text-deepCharcoal block mb-1">Zero Food Waste Policy</strong>
                Every vegetable scrap and herb stem is slow-simmered into our savory aromatic dipping broth.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
