import React, { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Volume2, VolumeX, Sparkles } from 'lucide-react'
import { playTactileClick, startSteamAmbience, stopSteamAmbience } from '../utils/audio'
import { HeroSequence } from './HeroSequence'

gsap.registerPlugin(ScrollTrigger)

interface HeroSectionProps {
  onOrderClick: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOrderClick }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const introTextRef = useRef<HTMLDivElement>(null)
  const midStoryRef = useRef<HTMLDivElement>(null)
  const endStoryRef = useRef<HTMLDivElement>(null)
  const progressBadgeRef = useRef<HTMLDivElement>(null)

  const [scrollProgress, setScrollProgress] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [isSequenceReady, setIsSequenceReady] = useState(false)

  useGSAP(
    () => {
      if (!containerRef.current) return

      // Pinned scroll section for Apple-style frame sequence scrub & editorial overlays
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 0.4, // Responsive and buttery smooth scroll scrubbing
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          setScrollProgress(p)

          // 1. Intro overlay animation (0.0 to 0.28)
          if (introTextRef.current) {
            if (p <= 0.28) {
              const fadeOut = gsap.utils.clamp(0, 1, 1 - p * 3.8)
              const moveUp = p * -90
              gsap.set(introTextRef.current, {
                opacity: fadeOut,
                y: moveUp,
                pointerEvents: p > 0.2 ? 'none' : 'auto',
              })
            } else {
              gsap.set(introTextRef.current, { opacity: 0, pointerEvents: 'none' })
            }
          }

          // 2. Mid ingredients callouts (0.30 to 0.68)
          if (midStoryRef.current) {
            if (p >= 0.28 && p <= 0.70) {
              let midOpacity = 0
              if (p < 0.48) {
                midOpacity = (p - 0.28) / 0.18
              } else {
                midOpacity = 1 - (p - 0.52) / 0.16
              }
              midOpacity = gsap.utils.clamp(0, 1, midOpacity)
              gsap.set(midStoryRef.current, {
                opacity: midOpacity,
                y: (p - 0.45) * -40,
                pointerEvents: midOpacity > 0.5 ? 'auto' : 'none',
              })
            } else {
              gsap.set(midStoryRef.current, { opacity: 0, pointerEvents: 'none' })
            }
          }

          // 3. Final Giant Momo conclusion (0.72 to 1.0)
          if (endStoryRef.current) {
            if (p >= 0.72) {
              const endOpacity = gsap.utils.clamp(0, 1, (p - 0.72) / 0.2)
              const endY = (1 - endOpacity) * 30
              gsap.set(endStoryRef.current, {
                opacity: endOpacity,
                y: endY,
                pointerEvents: endOpacity > 0.4 ? 'auto' : 'none',
              })
            } else {
              gsap.set(endStoryRef.current, { opacity: 0, pointerEvents: 'none' })
            }
          }

          // Progress badge indicator
          if (progressBadgeRef.current) {
            gsap.set(progressBadgeRef.current, {
              scaleX: p,
              transformOrigin: 'left center',
            })
          }
        },
      })

      return () => {
        st.kill()
      }
    },
    { scope: containerRef }
  )

  const handleScrollDown = () => {
    playTactileClick()
    const target = document.getElementById('story')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleSound = () => {
    playTactileClick()
    const nextState = !soundEnabled
    setSoundEnabled(nextState)

    if (nextState) {
      startSteamAmbience()
    } else {
      stopSteamAmbience()
    }
  }

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-screen bg-[#FAF8F4] overflow-hidden select-none"
      aria-label="Cinematic Momo Hero"
    >
      {/* Sticky 100vh Viewport Container */}
      <div className="relative w-full h-full flex items-center justify-center bg-[#FAF8F4]">
        {/* Subtle Ambient Vignette / Background Frame */}
        <div className="absolute inset-0 bg-[#FAF8F4] z-0" />

        {/* Apple-style Canvas Frame Sequence Container */}
        <div className="relative w-full h-full flex items-center justify-center z-10 overflow-hidden">
          <HeroSequence
            progress={scrollProgress}
            onFirstFrameLoaded={() => setIsSequenceReady(true)}
            className="w-full h-full"
          />

          {/* Cinematic subtle contrast gradient overlays */}
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#FAF8F4]/85 via-[#FAF8F4]/40 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#FAF8F4]/95 via-[#FAF8F4]/50 to-transparent pointer-events-none z-20" />
        </div>

        {/* 1. INTRO OVERLAY TEXT (Progress 0.0 -> 0.28) */}
        <div
          ref={introTextRef}
          className="absolute inset-0 z-30 flex flex-col justify-between p-6 sm:p-10 md:p-16 pointer-events-auto"
        >
          {/* Top spacer for navbar */}
          <div className="h-16 md:h-20" />

          {/* Main Headline & Eyebrow */}
          <div className="max-w-4xl mx-auto w-full text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-doughCream/80 text-chiliRed text-xs font-semibold tracking-widest uppercase mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-chiliRed animate-pulse" />
              <span>CRAFTED FRESH. SERVED HOT.</span>
            </div>

            {/* Main Headline - Bold, Expressive, 2 lines max */}
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-deepCharcoal leading-[0.95] drop-shadow-sm mb-6">
              Little folds.
              <br />
              <span className="text-chiliRed italic font-normal">BIG FLAVOUR.</span>
            </h1>

            {/* Supporting Sentence */}
            <p className="font-sans text-base sm:text-lg md:text-xl text-deepCharcoal/80 max-w-xl mx-auto font-medium leading-relaxed">
              Handcrafted momos. Fresh ingredients. Unforgettable bites.
            </p>
          </div>

          {/* Bottom Bar: Scroll Indicator */}
          <div className="w-full flex items-center justify-between max-w-7xl mx-auto text-deepCharcoal/70 text-xs font-semibold tracking-widest uppercase">
            <div className="hidden sm:flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-freshGreen animate-ping" />
              <span>Handcrafted Daily • Steamed to Order</span>
            </div>

            <button
              type="button"
              onClick={handleScrollDown}
              className="mx-auto sm:mx-0 flex flex-col items-center gap-2 group cursor-pointer hover:text-chiliRed transition-colors duration-200"
              aria-label="Scroll down to discover"
            >
              <span className="tracking-widest">SCROLL TO DISCOVER</span>
              <div className="w-5 h-8 rounded-full border border-deepCharcoal/30 flex items-start justify-center p-1 group-hover:border-chiliRed transition-colors">
                <div className="w-1.5 h-2.5 rounded-full bg-chiliRed animate-bounce" />
              </div>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-right">
              <span>Himalayan Heritage</span>
            </div>
          </div>
        </div>

        {/* 2. MID STORY INGREDIENT FOCUS CALLOUTS (Progress 0.30 -> 0.68) */}
        <div
          ref={midStoryRef}
          style={{ opacity: 0 }}
          className="absolute inset-0 z-30 pointer-events-none flex items-center justify-between px-6 sm:px-12 md:px-20 max-w-7xl mx-auto"
        >
          {/* Left Feature Card */}
          <div className="hidden md:block max-w-xs bg-white/85 backdrop-blur-md p-5 rounded-2xl border border-doughCream shadow-sm transform -translate-y-6">
            <span className="text-[10px] uppercase font-bold tracking-widest text-freshGreen block mb-1">
              THE FILLING
            </span>
            <h2 className="font-serif text-lg font-bold text-deepCharcoal mb-1">
              Wild Timur & Fresh Herbs
            </h2>
            <p className="text-xs text-deepCharcoal/70 leading-relaxed font-sans">
              Hand-shredded sunrise cabbage, scallions, and citrus-tinged timur peppercorns hand-rolled with aromatic sesame oil.
            </p>
          </div>

          {/* Right Feature Card */}
          <div className="hidden md:block max-w-xs bg-white/85 backdrop-blur-md p-5 rounded-2xl border border-doughCream shadow-sm transform translate-y-6 text-right">
            <span className="text-[10px] uppercase font-bold tracking-widest text-chiliRed block mb-1">
              THE ARTISTRY
            </span>
            <h2 className="font-serif text-lg font-bold text-deepCharcoal mb-1">
              Delicate Handmade Folds
            </h2>
            <p className="text-xs text-deepCharcoal/70 leading-relaxed font-sans">
              Each fold is individually pinched by hand, creating a sealed chamber that locks in hot savory broth and steam.
            </p>
          </div>
        </div>

        {/* 3. FINAL GIANT MOMO CONCLUSION OVERLAY (Progress 0.72 -> 1.0) */}
        <div
          ref={endStoryRef}
          style={{ opacity: 0 }}
          className="absolute inset-x-0 bottom-12 sm:bottom-16 z-30 flex flex-col items-center text-center px-6 pointer-events-auto"
        >
          <div className="max-w-2xl bg-white/90 backdrop-blur-lg border border-doughCream p-6 sm:p-8 rounded-3xl shadow-xl shadow-deepCharcoal/5">
            <span className="text-xs uppercase tracking-widest font-bold text-chiliRed block mb-2">
              FRESHLY PREPARED DUMPLINGS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-deepCharcoal mb-3">
              Hot from the bamboo steamer.
            </h2>
            <p className="font-sans text-sm sm:text-base text-deepCharcoal/80 mb-6 leading-relaxed">
              Thin silky skin, bursting with fragrant broth, paired with stone-ground chili chutney.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onOrderClick}
                className="btn-press w-full sm:w-auto px-7 py-3.5 rounded-full bg-chiliRed hover:bg-chiliRed-hover text-white font-semibold text-sm tracking-wider uppercase shadow-md shadow-chiliRed/25 cursor-pointer"
              >
                ORDER THIS BATCH
              </button>
              <a
                href="#menu"
                onClick={playTactileClick}
                className="btn-press w-full sm:w-auto px-6 py-3.5 rounded-full bg-doughCream hover:bg-doughCream/80 text-deepCharcoal font-semibold text-sm tracking-wider uppercase transition-colors"
              >
                EXPLORE MENU
              </a>
            </div>
          </div>
        </div>

        {/* Audio Toggle & Visual Scrub Meter Pill (Floating in bottom-right) */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3">
          {/* Audio Ambience Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="btn-press w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-doughCream flex items-center justify-center text-deepCharcoal hover:text-chiliRed shadow-sm cursor-pointer"
            title={soundEnabled ? 'Mute Bamboo Steam Sound' : 'Unmute Bamboo Steam Sound'}
            aria-label="Toggle audio"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-chiliRed" /> : <VolumeX className="w-4 h-4 text-deepCharcoal/60" />}
          </button>

          {/* Scrub Progress Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-doughCream text-[11px] font-mono tabular-nums text-deepCharcoal/80 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-chiliRed" />
            <span>{Math.round(scrollProgress * 100)}%</span>
            <div className="w-12 h-1 bg-doughCream rounded-full overflow-hidden">
              <div
                ref={progressBadgeRef}
                className="w-full h-full bg-chiliRed origin-left"
                style={{ transform: `scaleX(${scrollProgress})` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
