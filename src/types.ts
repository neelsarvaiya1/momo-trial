export interface MenuItem {
  id: string
  name: string
  category: 'steamed' | 'fried' | 'tandoori' | 'special'
  description: string
  price: string // Exact '$-price' placeholder per master requirement
  isVeg: boolean
  spiciness: 1 | 2 | 3
  image: string
  tags?: string[]
  pieces?: number
  dip?: string
}

export interface CartItem {
  item: MenuItem
  quantity: number
  spiceLevel?: 'Mild' | 'Medium' | 'Fire'
  specialNotes?: string
}

export interface IngredientFeature {
  id: string
  name: string
  origin?: string
  description: string
  badge: string
  image: string
}
