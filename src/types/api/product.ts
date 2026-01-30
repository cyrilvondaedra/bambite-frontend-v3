export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Sweat',
    price: 40.0,
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=400&fit=crop',
    category: 'Beer & Drink',
  },
  {
    id: '2',
    name: 'Sponsor',
    price: 20.0,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    category: 'Beer & Drink',
  },
  {
    id: '3',
    name: 'Snow tower',
    price: 15.0,
    image: 'https://images.unsplash.com/photo-1584007066667-cf14ccad799d?w=400&h=400&fit=crop',
    category: 'Beer & Drink',
  },
  {
    id: '4',
    name: 'Peanut hair',
    price: 25.0,
    image: 'https://images.unsplash.com/photo-1585518419759-112b632a0b99?w=400&h=400&fit=crop',
    category: 'Beer & Drink',
  },
  {
    id: '5',
    name: 'Berry Blast',
    price: 18.0,
    image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd4d5f0?w=400&h=400&fit=crop',
    category: 'Fruit juice',
  },
  {
    id: '6',
    name: 'Tropical Mix',
    price: 22.0,
    image: 'https://images.unsplash.com/photo-1614707267537-b85faf00021b?w=400&h=400&fit=crop',
    category: 'Fruit juice',
  },
  {
    id: '7',
    name: 'Grilled Chicken',
    price: 45.0,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop',
    category: 'barbecue',
  },
  {
    id: '8',
    name: 'BBQ Ribs',
    price: 50.0,
    image: 'https://images.unsplash.com/photo-1633622715463-d30f4f325e24?w=400&h=400&fit=crop',
    category: 'barbecue',
  },
];
