'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/products/${product.id}`}>
      <div
        className="flex flex-col gap-3 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative w-full aspect-square bg-muted rounded-2xl overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:scale-105">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
          <p className="text-primary font-bold text-lg">
            ₿ {product.price.toFixed(2)}/
            <span className="text-sm text-muted-foreground">
              {product.id === '1' ? 'box' : product.id === '2' ? 'bottle' : 'item'}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
