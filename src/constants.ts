import { Category, MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Avocado Toast',
    description: 'Poached egg, radish, and microgreens on rustic sourdough.',
    price: 14,
    category: 'Breakfast',
    imageUrl: 'https://picsum.photos/seed/avocado/400/300'
  } as MenuItem,
  {
    id: '2',
    name: 'Eggs Benedict',
    description: 'Traditional style with smoked ham and hollandaise sauce.',
    price: 16,
    category: 'Breakfast',
    imageUrl: 'https://picsum.photos/seed/eggs/400/300'
  } as MenuItem,
  {
    id: '3',
    name: 'Truffle Mushroom Burger',
    description: 'Gourmet patty with truffle aioli and caramelized onions.',
    price: 19,
    category: 'Lunch',
    imageUrl: 'https://picsum.photos/seed/burger/400/300'
  } as MenuItem,
  {
    id: '4',
    name: 'Quinoa Harvest Salad',
    description: 'Roasted sweet potato, kale, and lemon tahini dressing.',
    price: 15,
    category: 'Lunch',
    imageUrl: 'https://picsum.photos/seed/salad/400/300'
  } as MenuItem,
  {
    id: '5',
    name: 'Lobster Linguine',
    description: 'Fresh pasta with butter-poached lobster and cherry tomatoes.',
    price: 32,
    category: 'Dinner',
    imageUrl: 'https://picsum.photos/seed/lobster/400/300'
  } as MenuItem,
  {
    id: '6',
    name: 'Ribeye Steak',
    description: '12oz grass-fed beef served with herb butter and frites.',
    price: 45,
    category: 'Dinner',
    imageUrl: 'https://picsum.photos/seed/steak/400/300'
  } as MenuItem,
  {
    id: '7',
    name: 'Craft Espresso',
    description: 'Rich, smooth double-shot from single-origin beans.',
    price: 4.5,
    category: 'Drinks',
    imageUrl: 'https://picsum.photos/seed/coffee/400/300'
  } as MenuItem,
  {
    id: '8',
    name: 'Hibiscus Iced Tea',
    description: 'Refreshing herbal tea with a hint of honey and lime.',
    price: 6,
    category: 'Drinks',
    imageUrl: 'https://picsum.photos/seed/tea/400/300'
  } as MenuItem
];

export const CATEGORIES: Category[] = ['Breakfast', 'Lunch', 'Dinner', 'Drinks'];
