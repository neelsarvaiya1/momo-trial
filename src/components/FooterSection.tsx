import React, { useState } from 'react'
import {
  Instagram,
  MapPin,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { playTactileClick, playAddSuccess } from '../utils/audio'

interface FooterSectionProps {
  onOrderClick: () => void
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onOrderClick }) => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return

    playAddSuccess()
    setIsSubscribed(true)
  }

  const galleryImages = [
    { src: '/assets/steamer.jpg', alt: 'Bamboo steamer full of fresh momos' },
    { src: '/assets/pleating.jpg', alt: 'Hand folding 24 pleats' },
    { src: '/assets/plated.jpg', alt: 'Crispy fried golden momos' },
    { src: '/assets/hero-close.jpg', alt: 'Steaming hot momo close up' },
  ]

  return (
    <footer className="w-full bg-[#141414] text-warmWhite overflow-hidden border-t border-white/10">
      {/* 1. FINAL CALL TO ACTION BANNER */}
      <div className="relative py-24 sm:py-32 px-6 sm:px-10 lg:px-16 border-b border-white/10 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-chiliRed/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/10 text-chiliRed text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FRESHLY FOLDED DAILY</span>
          </div>

          <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white leading-[1.0] mb-6">
            Craving something
            <br />
            <span className="text-chiliRed italic font-normal">delicious?</span>
          </h2>

          <p className="font-sans text-lg sm:text-xl text-white/70 max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Freshly folded. Ready to make your day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                playTactileClick()
                onOrderClick()
              }}
              className="btn-press w-full sm:w-auto px-10 py-5 rounded-full bg-chiliRed hover:bg-chiliRed-hover text-white text-xs font-bold tracking-widest uppercase shadow-2xl shadow-chiliRed/40 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>ORDER YOUR MOMOS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#story"
              onClick={playTactileClick}
              className="btn-press w-full sm:w-auto px-8 py-5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold tracking-widest uppercase transition-colors"
            >
              READ OUR STORY
            </a>
          </div>
        </div>
      </div>

      {/* 2. INSTAGRAM EDITORIAL MOMO STRIP */}
      <div className="py-12 px-6 sm:px-10 lg:px-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-white/60">
              <Instagram className="w-4 h-4 text-chiliRed" />
              <span>@MOMODINING • LIVE FROM OUR KITCHEN</span>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-white/60 hover:text-chiliRed transition-colors"
            >
              Follow Us →
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl overflow-hidden border border-white/10 group relative"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-deepCharcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. FOOTER MAIN INFORMATION COLUMNS */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Col 1: Brand & Bio (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-1.5 mb-5">
              <div className="w-7 h-7 rounded-full bg-chiliRed flex items-center justify-center text-white">
                <span className="font-serif font-black text-xs">M</span>
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-white">
                MOMO<span className="text-chiliRed">.</span>
              </span>
            </div>

            <p className="font-sans text-sm text-white/60 leading-relaxed max-w-sm mb-6">
              Artisanal Himalayan dumplings hand-pinched with 24 pleats and steamed in bamboo. Sourced from local organic farms.
            </p>

            {/* Newsletter Subscription */}
            <div className="max-w-sm">
              <span className="text-xs uppercase font-bold tracking-wider text-white/80 block mb-2">
                Join The Tasting Table
              </span>
              {isSubscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/10 border border-freshGreen/40 text-xs text-freshGreen font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Welcome! Check your inbox for 15% off your first steamer.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-2.5 rounded-full bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-chiliRed transition-colors"
                  />
                  <button
                    type="submit"
                    className="btn-press px-5 py-2.5 rounded-full bg-chiliRed text-white text-xs font-bold tracking-wider uppercase shrink-0"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Locations & Dining (3 Cols) */}
          <div className="lg:col-span-3">
            <span className="text-xs uppercase font-bold tracking-widest text-white/50 block mb-4">
              FLAGSHIP KITCHEN
            </span>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-chiliRed mt-1 shrink-0" />
                <span>
                  74 Mercer Street, SoHo
                  <br />
                  New York, NY 10012
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-chiliRed shrink-0" />
                <a href="tel:+12125550198" className="hover:text-chiliRed transition-colors">
                  +1 (212) 555-0198
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-chiliRed shrink-0" />
                <a href="mailto:hello@momodining.com" className="hover:text-chiliRed transition-colors">
                  hello@momodining.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Hours (3 Cols) */}
          <div className="lg:col-span-3">
            <span className="text-xs uppercase font-bold tracking-widest text-white/50 block mb-4">
              STEAMING HOURS
            </span>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-chiliRed mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-white">Monday to Thursday</span>
                  <span className="text-white/60">11:30 AM to 10:00 PM</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-chiliRed mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-white">Friday to Sunday</span>
                  <span className="text-white/60">11:30 AM to 11:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Navigation (2 Cols) */}
          <div className="lg:col-span-2">
            <span className="text-xs uppercase font-bold tracking-widest text-white/50 block mb-4">
              EXPLORE
            </span>
            <ul className="space-y-2 text-xs font-semibold uppercase tracking-wider text-white/70">
              <li>
                <a href="#hero" onClick={playTactileClick} className="hover:text-chiliRed transition-colors">
                  Hero Experience
                </a>
              </li>
              <li>
                <a href="#story" onClick={playTactileClick} className="hover:text-chiliRed transition-colors">
                  Our Philosophy
                </a>
              </li>
              <li>
                <a href="#menu" onClick={playTactileClick} className="hover:text-chiliRed transition-colors">
                  Fresh Menu
                </a>
              </li>
              <li>
                <a href="#ingredients" onClick={playTactileClick} className="hover:text-chiliRed transition-colors">
                  Farm Ingredients
                </a>
              </li>
              <li>
                <a href="#experience" onClick={playTactileClick} className="hover:text-chiliRed transition-colors">
                  Imperial Momo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© {new Date().getFullYear()} MOMO Culinary Group Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Dietary & Allergen Guide</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

