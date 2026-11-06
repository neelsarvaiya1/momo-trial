import React, { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ShieldCheck, Flame, Heart, Sparkles } from 'lucide-react'
import { playTactileClick } from '../utils/audio'

gsap.registerPlugin(ScrollTrigger)

export const StorySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageFrameRef = useRef<HTMLDivElement>(null)
  const [activePleatSpot, setActivePleatSpot] = useState<number>(0)

  const pleatAnatomy = [
    {
      title: 'The Pleated Crown',
      detail: 'A delicate spiraled seal pinched 24 times to lock in fragrant steam and hot savory broth.',
      position: 'top-1/4 left-1/2',
    },
    {
      title: 'Translucent 1mm Skin',
      detail: 'Hand-rolled mountain wheat dough rolled ultra-thin for an ethereal, silky bite.',
      position: 'bottom-1/3 left-1/3',
    },
    {
      title: 'Heart of Aromatics',
      detail: 'Sweet farm cabbage, wild timur pepper, ginger juice, and toasted sesame essence.',
      position: 'bottom-1/4 right-1/4',
    },
  ]

  useGSAP(
    () => {
      if (!containerRef.current) return

      const elements = containerRef.current.querySelectorAll('.story-reveal')
      gsap.fromTo(
        elements,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          },
        }
      )

      if (imageFrameRef.current) {
        gsap.fromTo(
          imageFrameRef.current,
          { scale: 0.96, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: imageFrameRef.current,
              start: 'top 80%',
            },
          }
        )
      }
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="story"
      className="relative w-full py-24 sm:py-32 md:py-40 bg-warmWhite overflow-hidden border-t border-doughCream/50"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Asymmetric Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Typography & Brand Narrative (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Small Editorial Label */}
            <div className="story-reveal inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-chiliRed" />
              <span className="text-xs uppercase font-bold tracking-widest text-deepCharcoal/70">
                OUR PHILOSOPHY
              </span>
            </div>

            {/* Headline */}
            <h2 className="story-reveal font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-deepCharcoal tracking-tight leading-[1.05] mb-8">
              Good things
              <br />
              <span className="text-chiliRed italic font-normal">come in folds.</span>
            </h2>

            {/* Supporting Text */}
            <p className="story-reveal font-sans text-lg sm:text-xl text-deepCharcoal/80 leading-relaxed max-w-2xl font-normal mb-8">
              Every momo starts with something simple. Fresh ingredients, delicate dough, and a little love in every fold.
            </p>

            <p className="story-reveal font-sans text-base text-deepCharcoal/70 leading-relaxed max-w-2xl font-light mb-10">
              Rooted in centuries-old Himalayan traditions, our kitchen rejects shortcuts. We roll our dough fresh every morning, hand-pinch every dumpling with 24 signature pleats, and steam each batch in natural bamboo baskets so the authentic aroma greets you before your first bite.
            </p>

            {/* Editorial Metrics */}
            <div className="story-reveal grid grid-cols-3 gap-6 pt-8 border-t border-doughCream/80">
              <div>
                <span className="block font-serif text-3xl sm:text-4xl font-bold text-deepCharcoal mb-1">
                  24
                </span>
                <span className="block text-xs uppercase font-semibold tracking-wider text-deepCharcoal/60">
                  Pleats per Momo
                </span>
              </div>
              <div>
                <span className="block font-serif text-3xl sm:text-4xl font-bold text-deepCharcoal mb-1">
                  1mm
                </span>
                <span className="block text-xs uppercase font-semibold tracking-wider text-deepCharcoal/60">
                  Dough Translucency
                </span>
              </div>
              <div>
                <span className="block font-serif text-3xl sm:text-4xl font-bold text-chiliRed mb-1">
                  100%
                </span>
                <span className="block text-xs uppercase font-semibold tracking-wider text-deepCharcoal/60">
                  Handcrafted Daily
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Close-up Art Photography & Interactive Pleat Guide (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              ref={imageFrameRef}
              className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-deepCharcoal/10 border-4 border-white bg-doughCream group"
            >
              {/* Authentic Visual from momo.mp4 */}
              <img
                src="/assets/pleating.jpg"
                alt="Close-up of handcrafting 24 momo pleats"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Subtle Warm Film Tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-deepCharcoal/60 via-transparent to-transparent pointer-events-none" />

              {/* Interactive Pleat Hotspots */}
              <div className="absolute bottom-6 inset-x-6 z-20">
                <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-doughCream shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-chiliRed flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      ANATOMY OF THE FOLD
                    </span>
                    <div className="flex gap-1">
                      {pleatAnatomy.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            playTactileClick()
                            setActivePleatSpot(i)
                          }}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                            activePleatSpot === i ? 'bg-chiliRed w-6' : 'bg-doughCream hover:bg-deepCharcoal/30'
                          }`}
                          aria-label={`View pleat detail ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="font-serif text-base font-bold text-deepCharcoal mb-1">
                    {pleatAnatomy[activePleatSpot].title}
                  </h3>
                  <p className="text-xs text-deepCharcoal/80 leading-relaxed font-sans">
                    {pleatAnatomy[activePleatSpot].detail}
                  </p>
                </div>
              </div>
            </div>

            {/* Small Editorial Caption */}
            <div className="mt-4 flex items-center gap-3 text-xs text-deepCharcoal/60 uppercase font-semibold tracking-wider">
              <span>Himalayan Mountain Recipe</span>
              <span>•</span>
              <span>Bamboo Steamed at 100°C</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

