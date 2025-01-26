import { ProductWithVariants } from '../types/product';

export const products: ProductWithVariants[] = [
  {
    id: 1,
    name: 'Lavender Dreams',
    description: 'Calming lavender soap with essential oils',
    image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=800&q=80',
    price: '₹8.99',
    category: 'Floral',
    weights: {
      '50gm': 8.99,
      '75gm': 12.99,
      '100gm': 15.99
    }
  },
  {
    id: 2,
    name: 'Citrus Burst',
    description: 'Energizing orange and lemon blend',
    image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&w=800&q=80',
    price: '₹7.99',
    category: 'Citrus',
    weights: {
      '50gm': 7.99,
      '75gm': 11.99,
      '100gm': 14.99
    }
  },
  {
    id: 3,
    name: 'Oatmeal & Honey',
    description: 'Gentle exfoliating soap for sensitive skin',
    image: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=800&q=80',
    price: '₹9.99',
    category: 'Natural',
    weights: {
      '50gm': 9.99,
      '75gm': 13.99,
      '100gm': 16.99
    }
  }
];

export const categories = ['All', 'Floral', 'Citrus', 'Natural'] as const;
export const weightOptions = ['50gm', '75gm', '100gm'] as const;