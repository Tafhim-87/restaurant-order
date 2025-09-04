import React from 'react';
import Button from '../ui/Button';

type OrderSummaryProps = {
  subtotal: number;
  tax: number;
  total: number;
  onCheckout: () => void;
  onClearOrder: () => void;
  isOrderEmpty: boolean;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  tax,
  total,
  onCheckout,
  onClearOrder,
  isOrderEmpty,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold text-lg mb-4">Order Summary</h3>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={onClearOrder}
          variant="danger"
          className="flex-1"
          disabled={isOrderEmpty}
        >
          Clear Order
        </Button>
        <Button
          onClick={onCheckout}
          variant="primary"
          className="flex-1"
          disabled={isOrderEmpty}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;