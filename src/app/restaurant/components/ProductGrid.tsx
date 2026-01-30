'use client';

import ProductCard from './ProductCard';
import { products } from '@/types/api/product';

interface ProductGridProps {
  category: string;
  searchQuery: string;
  priceRange: [number, number];
}

export default function ProductGrid({ category, searchQuery, priceRange }: ProductGridProps) {
  const filteredProducts = products.filter(p => {
    // Filter by category
    const matchCategory = p.category === category;
    
    // Filter by search query (case-insensitive)
    const matchSearch = searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by price range
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    
    return matchCategory && matchSearch && matchPrice;
  });

  return (
    <div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
