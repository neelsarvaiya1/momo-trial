import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Sparkles, Utensils, Award } from 'lucide-react'
import { playTactileClick } from '../utils/audio'

gsap.registerPlugin(ScrollTrigger)

interface SignatureSectionProps {
  onOrderClick: () => void
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({ onOrderClick }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current || !visualRef.current) return

      gsap.fromTo(
        visualRef.current,
        { scale: 0.92, opacity: 0.8 },
        {
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          duration: 1.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.6,
          },
        }
      )
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="experience"
      className="relative w-full py-28 sm:py-36 bg-deepCharcoal text-warmWhite overflow-hidden"
    >
      {/* Background glow elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chiliRed/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Scaled Large Visual Frame (6 Cols) */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div
              ref={visualRef}
              className="relative aspect-square sm:aspect-[4/3] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group"
            >
              <img
                src="/momo-final.jpg"
                alt="Signature Steaming Momo close up"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Edge Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-deepCharcoal/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Award Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-deepCharcoal/90 backdrop-blur-md border border-white/15 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-chiliRed flex items-center justify-center text-white shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/70 block">
                    CHEF'S SIGNATURE CREATION
                  </span>
                  <span className="font-serif text-sm font-bold text-white block">
                    The 24-Pleat Imperial Momo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Immersive Editorial Copy & Strong CTA (6 Cols) */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-chiliRed animate-ping" />
              <span className="text-xs uppercase font-bold tracking-widest text-chiliRed">
                THE ICONIC MOMO
              </span>
            </div>

            <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6">
              One bite.
              <br />
              <span className="text-chiliRed italic font-normal">Full happiness.</span>
            </h2>

            <p className="font-sans text-base sm:text-lg text-white/80 leading-relaxed font-light mb-8 max-w-xl">
              An explosion of warm, comforting Himalayan broth encased in an ultra-thin veil of hand-pinched dough. Finished with a spoonful of hot roasted sesame chili crunch.
            </p>

            {/* Tasting Notes */}
            <div className="grid grid-cols-2 gap-4 mb-10 p-5 rounded-2xl bg-white/5 border border-white/10 max-w-lg">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-white/50 block mb-1">
                  TEXTURE
                </span>
                <span className="font-serif text-sm font-bold text-white">
                  Silky & Translucent
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-white/50 block mb-1">
                  AROMA PROFILE
                </span>
                <span className="font-serif text-sm font-bold text-white">
                  Timur Citrus & Ginger
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => {
                  playTactileClick()
                  onOrderClick()
                }}
                className="btn-press w-full sm:w-auto px-8 py-4 rounded-full bg-chiliRed hover:bg-chiliRed-hover text-white text-xs font-bold tracking-widest uppercase shadow-xl shadow-chiliRed/30 cursor-pointer flex items-center justify-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>ORDER SIGNATURE BATCH</span>
              </button>

              <a
                href="#menu"
                onClick={playTactileClick}
                className="btn-press w-full sm:w-auto px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold tracking-widest uppercase border border-white/15 flex items-center justify-center transition-colors"
              >
                VIEW FULL MENU
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
