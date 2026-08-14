export type ProductCategory = 'water' | 'habitat' | 'nutrition' | 'health';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  image: string;
  blurb: string;
  why: string;
  affiliateUrl: string;
  badge?: string;
  recommendedFor?: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'test-kit',
    name: 'Master Liquid Test Kit',
    category: 'water',
    price: 34.99,
    compareAt: 42.0,
    rating: 4.9,
    reviews: 2140,
    image: '/images/product-test-kit.jpg',
    blurb: 'Ammonia, nitrite, nitrate, and pH in one kit. The foundation of every healthy tank.',
    why: 'Guessing water quality is how bettas get sick. Liquid tests beat strips.',
    affiliateUrl: 'https://www.amazon.com/s?k=aquarium+master+test+kit',
    badge: 'Best seller',
    recommendedFor: ['ammonia', 'nitrite', 'nitrate', 'ph'],
  },
  {
    id: 'heater',
    name: 'Precision 50W Heater',
    category: 'habitat',
    price: 28.5,
    rating: 4.8,
    reviews: 1688,
    image: '/images/product-heater.jpg',
    blurb: 'Stable 76–80°F without hot spots. Auto shut-off if water is low.',
    why: 'Bettas are tropical. A reliable heater is non-negotiable.',
    affiliateUrl: 'https://www.amazon.com/s?k=adjustable+aquarium+heater+50w',
    recommendedFor: ['heater', 'temp'],
  },
  {
    id: 'filter',
    name: 'Gentle Sponge Filter',
    category: 'habitat',
    price: 16.95,
    rating: 4.7,
    reviews: 980,
    image: '/images/product-filter.jpg',
    blurb: 'Biological filtration with a current bettas can actually swim against.',
    why: 'Hang-on-back filters often blast bettas. Sponges are kinder and cycle faster.',
    affiliateUrl: 'https://www.amazon.com/s?k=aquarium+sponge+filter',
    recommendedFor: ['filter', 'ammonia'],
  },
  {
    id: 'food',
    name: 'Daily Betta Pellets',
    category: 'nutrition',
    price: 12.0,
    rating: 4.8,
    reviews: 3210,
    image: '/images/product-food.jpg',
    blurb: 'Slow-sinking pellets sized for betta mouths. High protein, low filler.',
    why: 'Flakes foul water. A measured pellet diet keeps color and energy high.',
    affiliateUrl: 'https://www.amazon.com/s?k=betta+fish+pellets',
    badge: 'Keeper favorite',
  },
  {
    id: 'tank',
    name: '5-Gallon Rimless Habitat',
    category: 'habitat',
    price: 49.0,
    compareAt: 64.0,
    rating: 4.6,
    reviews: 740,
    image: '/images/product-tank.jpg',
    blurb: 'The minimum we recommend. Stable chemistry, room to flare and rest.',
    why: 'Cups and 1-gallon kits crash overnight. Five gallons is the real start line.',
    affiliateUrl: 'https://www.amazon.com/s?k=5+gallon+rimless+aquarium',
    recommendedFor: ['size'],
  },
  {
    id: 'leaves',
    name: 'Indian Almond Leaves',
    category: 'health',
    price: 11.5,
    rating: 4.9,
    reviews: 1544,
    image: '/images/product-leaves.jpg',
    blurb: 'Tannins that soothe fins, lower pH gently, and recreate a betta’s native water.',
    why: 'A cheap, natural buffer against fin issues and stress.',
    affiliateUrl: 'https://www.amazon.com/s?k=indian+almond+leaves+aquarium',
    recommendedFor: ['fin', 'color'],
  },
  {
    id: 'conditioner',
    name: 'Tap Water Conditioner',
    category: 'water',
    price: 9.99,
    rating: 4.8,
    reviews: 5021,
    image: '/images/product-conditioner.jpg',
    blurb: 'Removes chlorine, chloramine, and heavy metals in seconds.',
    why: 'Never add raw tap water. This bottle pays for itself on the first water change.',
    affiliateUrl: 'https://www.amazon.com/s?k=aquarium+water+conditioner',
    recommendedFor: ['water-change'],
  },
];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  water: 'Water chemistry',
  habitat: 'Habitat',
  nutrition: 'Nutrition',
  health: 'Health & recovery',
};

export function recommendProducts(issueKeys: string[], limit = 3): Product[] {
  const scored = PRODUCTS.map((product) => {
    const hits = (product.recommendedFor || []).filter((key) => issueKeys.includes(key)).length;
    return { product, hits };
  })
    .filter((item) => item.hits > 0)
    .sort((a, b) => b.hits - a.hits);

  const picked = scored.map((item) => item.product);
  if (picked.length >= limit) return picked.slice(0, limit);
  const extras = PRODUCTS.filter((product) => !picked.includes(product));
  return [...picked, ...extras].slice(0, limit);
}
