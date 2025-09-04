import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
};

type ProductCardProps = {
  product: Product;
  onAddToCart: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <Card className="flex flex-col h-full">
      {product.image && (
        <div className="h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={160}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-lg mb-1">{product.name}</h3>
        <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500 mb-4">Stock: {product.stock}</p>
        <Button
          onClick={onAddToCart}
          variant="primary"
          size="sm"
          className="mt-auto"
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;