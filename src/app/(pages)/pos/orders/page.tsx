"use client";

import React, { useEffect, useState } from "react";
import Card from "../../../components/ui/Card";
import OrderItem from "../../../components/pos/OrderItem";
import OrderSummary from "../../../components/pos/OrderSummary";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import {
  updateOrderItem,
  removeFromOrder,
  clearTableOrder,
  setTableStatus,
  initializeTables,
} from "@/app/redux/orderSlice";
import useApi from "@/app/hooks/useApi";
import { toast } from "react-toastify";

interface PaymentHistory {
  amount: number;
  method: string;
  tableNo: number;
}

const OrdersPage: React.FC = () => {
  const dispatch = useDispatch();
  const { tables } = useSelector((state: RootState) => state.orders);
  const [currentTable, setCurrentTable] = useState(1);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState("");
  const [note, setNote] = useState("");
  const { post } = useApi<PaymentHistory>("/payment/process");

  // Initialize tables on component mount
  useEffect(() => {
    dispatch(initializeTables([1, 2, 3, 4, 5, 6, 7, 8]));
  }, [dispatch]);

  // Get current table's order
  const currentTableData = tables.find((t) => t.tableNumber === currentTable);
  const currentOrder = currentTableData?.items || [];
  const currentTableStatus = currentTableData?.status || 'available';

  const subtotal = currentOrder.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Update table status when order changes
  useEffect(() => {
    const newStatus = currentOrder.length > 0 ? 'occupied' : 'available';
    if (currentTableStatus !== newStatus) {
      dispatch(setTableStatus({ tableNumber: currentTable, status: newStatus }));
    }
  }, [currentOrder, currentTable, currentTableStatus, dispatch]);

  const increaseQuantity = (id: string) => {
    dispatch(
      updateOrderItem({
        tableNumber: currentTable,
        itemId: id,
        updates: {
          quantity: (currentOrder.find((i) => i.id === id)?.quantity || 0) + 1,
        },
      })
    );
  };

  const decreaseQuantity = (id: string) => {
    const currentQuantity =
      currentOrder.find((i) => i.id === id)?.quantity || 0;
    if (currentQuantity > 1) {
      dispatch(
        updateOrderItem({
          tableNumber: currentTable,
          itemId: id,
          updates: { quantity: currentQuantity - 1 },
        })
      );
    } else {
      dispatch(removeFromOrder({ tableNumber: currentTable, itemId: id }));
    }
  };

  const removeItem = (id: string) => {
    dispatch(removeFromOrder({ tableNumber: currentTable, itemId: id }));
  };

  const openNoteModal = (id: string, currentNote?: string) => {
    setCurrentItemId(id);
    setNote(currentNote || "");
    setIsNoteModalOpen(true);
  };

  const saveNote = () => {
    dispatch(
      updateOrderItem({
        tableNumber: currentTable,
        itemId: currentItemId,
        updates: { specialInstructions: note },
      })
    );
    setIsNoteModalOpen(false);
  };

  const clearOrder = () => {
    dispatch(clearTableOrder(currentTable));
    dispatch(setTableStatus({ tableNumber: currentTable, status: 'available' }));
  };

  const processCheckout = () => {
    const orderData = {
      amount: total,
      method: "card",
      tableNo: currentTable,
    };

    try {
      post("/payment/process", orderData);
      clearOrder();
      toast.success("Payment processed successfully!");
    } catch (err) {
      console.error("Error processing payment:", err);
      toast.error("Payment processing failed. Please try again.");
    }
  };

  return (
    <section className="flex text-black overflow-x-hidden">
      <div className="p-1 flex-1 container">
        <div className="flex flex-col md:flex-row max-w-[1440px] justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-50">Order Management</h1>
          <div className="flex items-center">
            <span className="mr-2 text-blue-50">Table:</span>
            <select
              value={currentTable}
              onChange={(e) => setCurrentTable(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-1 !text-blue-50"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num} className="!text-black">
                  {num}
                </option>
              ))}
            </select>
            <span className={`ml-4 px-2 py-1 rounded text-xs ${
              currentTableStatus === 'available' 
                ? 'bg-green-500 text-white' 
                : currentTableStatus === 'occupied'
                ? 'bg-red-500 text-white'
                : 'bg-yellow-500 text-black'
            }`}>
              {currentTableStatus.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4 !text-black">
                Order for Table {currentTable}
              </h2>
              {currentOrder.length === 0 ? (
                <p className="text-center py-8 text-black">
                  No items in this order
                </p>
              ) : (
                <div className="divide-y divide-gray-200">
                  {currentOrder.map((item) => (
                    <OrderItem
                      key={item.id}
                      name={item.name}
                      price={item.price}
                      quantity={item.quantity}
                      specialInstructions={item.specialInstructions}
                      onIncrease={() => increaseQuantity(item.id)}
                      onDecrease={() => decreaseQuantity(item.id)}
                      onRemove={() => removeItem(item.id)}
                      onEditInstructions={() =>
                        openNoteModal(item.id, item.specialInstructions)
                      }
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div>
            <OrderSummary
              subtotal={subtotal}
              tax={tax}
              total={total}
              onCheckout={processCheckout}
              onClearOrder={clearOrder}
              isOrderEmpty={currentOrder.length === 0}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Add Special Instructions"
        footer={
          <>
            <Button
              onClick={() => setIsNoteModalOpen(false)}
              variant="secondary"
              className="mr-2 !text-black"
            >
              Cancel
            </Button>
            <Button
              onClick={saveNote}
              variant="primary"
              className="!text-black"
            >
              Save Note
            </Button>
          </>
        }
      >
        <Input
          value={note}
          onChange={setNote}
          placeholder="E.g. No onions, extra spicy, etc."
          className="!text-black"
        />
      </Modal>
    </section>
  );
};

export default OrdersPage;