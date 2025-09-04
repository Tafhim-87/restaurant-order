import React from 'react';
import Button from '../ui/Button';

type CartItemProps = {
  name: string;
  price: number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

const CartItem: React.FC<CartItemProps> = ({
  name,
  price,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-200">
      <div className="flex-1">
        <h4 className="font-medium">{name}</h4>
        <p className="text-gray-600">${price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={onDecrease}
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0 flex items-center justify-center"
        >
          -
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button
          onClick={onIncrease}
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0 flex items-center justify-center"
        >
          +
        </Button>
        <Button
          onClick={onRemove}
          variant="danger"
          size="sm"
          className="ml-2"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;