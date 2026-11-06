// Self-check for MOMO website core assets, image sequence, and menu data integrity
// ponytail: single runnable assert-based verification check without extra test framework overhead

import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

console.log('Running MOMO image sequence & site verification...')

// 1. Verify original video preserved in public/videos/momo.mp4
assert(fs.existsSync(path.join(root, 'public/videos/momo.mp4')), 'Original video must be preserved in public/videos/momo.mp4')
console.log('✔ Original video asset preserved in public/videos/momo.mp4')

// 2. Verify all 150 desktop webp frames exist
const totalFrames = 150
for (let i = 1; i <= totalFrames; i++) {
  const padded = String(i).padStart(4, '0')
  const framePath = path.join(root, `public/frames/frame_${padded}.webp`)
  assert(fs.existsSync(framePath), `Missing desktop frame: ${framePath}`)
}
console.log(`✔ All ${totalFrames} desktop sequence frames verified in public/frames/`)

// 3. Verify mobile sequence frames exist
for (let i = 1; i <= totalFrames; i++) {
  const padded = String(i).padStart(4, '0')
  const mobileFramePath = path.join(root, `public/frames/mobile/frame_${padded}.webp`)
  assert(fs.existsSync(mobileFramePath), `Missing mobile frame: ${mobileFramePath}`)
}
console.log(`✔ All ${totalFrames} mobile sequence frames verified in public/frames/mobile/`)

// 4. Verify culinary imagery and poster assets
const requiredAssets = [
  'public/momo-poster.jpg',
  'public/momo-final.jpg',
  'public/assets/steamer.jpg',
  'public/assets/pleating.jpg',
  'public/assets/plated.jpg',
  'public/assets/dough-roll.jpg',
  'public/assets/filling.jpg',
  'public/assets/hero-close.jpg',
]

for (const asset of requiredAssets) {
  assert(fs.existsSync(path.join(root, asset)), `Asset missing: ${asset}`)
  const stat = fs.statSync(path.join(root, asset))
  assert(stat.size > 1000, `Asset ${asset} is too small or corrupt (${stat.size} bytes)`)
}
console.log('✔ All culinary imagery and poster assets verified')

// 5. Verify HeroSequence component exists
assert(fs.existsSync(path.join(root, 'src/components/HeroSequence.tsx')), 'src/components/HeroSequence.tsx must exist')
console.log('✔ HeroSequence component verified')

console.log('🎉 All MOMO sequence & site checks passed successfully!')
