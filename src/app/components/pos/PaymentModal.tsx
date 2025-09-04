import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onProcessPayment: (paymentMethod: string, amountReceived: number) => void;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  onProcessPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState(total.toFixed(2));
  const [change, setChange] = useState(0);

  const calculateChange = (amount: string) => {
    const received = parseFloat(amount) || 0;
    setAmountReceived(amount);
    setChange(received - total);
  };

  const handleProcessPayment = () => {
    onProcessPayment(paymentMethod, parseFloat(amountReceived));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Process Payment"
      footer={
        <>
          <Button
            onClick={onClose}
            variant="secondary"
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleProcessPayment}
            variant="primary"
            disabled={paymentMethod === 'cash' && change < 0}
          >
            Complete Payment
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cash">Cash</option>
            <option value="card">Credit Card</option>
            <option value="mobile">Mobile Payment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Amount
          </label>
          <p className="text-lg font-semibold">${total.toFixed(2)}</p>
        </div>

        {paymentMethod === 'cash' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Received
              </label>
              <Input
                type="number"
                value={amountReceived}
                onChange={calculateChange}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Change
              </label>
              <p
                className={`text-lg font-semibold ${
                  change < 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                ${Math.abs(change).toFixed(2)} {change < 0 ? 'short' : ''}
              </p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;