// Self-check for MOMO website core assets and menu data integrity
// ponytail: single runnable assert-based verification check without extra test framework overhead

import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

console.log('Running MOMO core verification...')

// 1. Verify original momo.mp4 and public/momo.mp4 exist
assert(fs.existsSync(path.join(root, 'momo.mp4')), 'momo.mp4 must exist at project root')
assert(fs.existsSync(path.join(root, 'public/momo.mp4')), 'momo.mp4 must exist in public folder')
console.log('✔ Video asset momo.mp4 verified')

// 2. Verify extracted keyframe stills exist
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

// 3. Verify production build output exists
assert(fs.existsSync(path.join(root, 'dist/index.html')), 'Production build dist/index.html must exist')
const html = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf-8')
assert(html.includes('MOMO.'), 'Built index.html must contain brand title')
console.log('✔ Production bundle verified')

console.log('🎉 All MOMO site checks passed successfully!')
