import React from 'react';
import Button from '../ui/Button';

type OrderItemProps = {
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onEditInstructions: () => void;
};

const OrderItem: React.FC<OrderItemProps> = ({
  name,
  price,
  quantity,
  specialInstructions,
  onIncrease,
  onDecrease,
  onRemove,
  onEditInstructions,
}) => {
  return (
    <div className="border-b border-gray-200 py-3">
      <div className="flex justify-between">
        <div className="flex-1">
          <h4 className="font-medium">{name}</h4>
          <p className="text-gray-600">${price.toFixed(2)}</p>
          {specialInstructions && (
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-semibold">Note:</span> {specialInstructions}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={onDecrease}
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
          >
            -
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            onClick={onIncrease}
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
          >
            +
          </Button>
        </div>
      </div>
      <div className="flex space-x-2 mt-2">
        <Button
          onClick={onEditInstructions}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Add Note
        </Button>
        <Button
          onClick={onRemove}
          variant="danger"
          size="sm"
          className="text-xs"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default OrderItem;