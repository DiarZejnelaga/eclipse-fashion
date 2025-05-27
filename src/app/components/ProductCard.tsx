// components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';

// Define a basic Product type based on what your data/products.js provides
interface Product {
  prodid: string;
  name: string;
  price: number;
  imageUrl: string;
  // Add other fields if your ProductCard needs them
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) return null;

  return (
    <Link
      href={`/items/${product.prodid}`} // Links to the new product detail page path
      className="block w-60 flex-shrink-0 group bg-neutral-800 rounded-md overflow-hidden"
    >
      <div className="relative aspect-[3/4] bg-neutral-700">
        <Image
          src={product.imageUrl || '/images/placeholder-product.png'}
          alt={product.name}
          fill
          sizes="240px" // Simple sizes attribute
          className="object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-3 text-center">
        <h3 className="text-sm font-semibold text-gray-100 truncate">{product.name}</h3>
        <p className="text-xs text-gray-400">{product.price.toFixed(2)} €</p>
      </div>
    </Link>
  );
}