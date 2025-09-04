"use client";

import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import TableStatus from '../../components/ui/TableStatus';
import useApi from "@/app/hooks/useApi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { initializeTables } from "@/app/redux/orderSlice";

type Payment = {
  _id: string;
  orderId: string;
  tableNo: number;
  amount: number;
  method: string;
  createdAt: string;
};

const DashboardPage: React.FC = () => {
  const [value, setValue] = useState(0);
  const { data } = useApi<Payment[]>("/payment");
  const [dataPay, setDataPay] = useState<Payment[]>([]);
  const dispatch = useDispatch();
  
  // Get tables from Redux store
  const { tables } = useSelector((state: RootState) => state.orders);
  
  // Initialize tables on component mount
  useEffect(() => {
    dispatch(initializeTables([1, 2, 3, 4, 5, 6, 7, 8]));
  }, [dispatch]);

  // Calculate available tables count
  const availableTablesCount = tables.filter(
    table => table.status === 'available'
  ).length;

  useEffect(() => {
    try {
      if (data) {
        setDataPay(data);
        const total = data.reduce((sum, payment) => sum + payment.amount, 0);
        setValue(total);
      }
    } catch (error) {
      console.error("Error calculating total revenue:", error);
    }
  }, [data]);
  

  // Calculate active orders (tables with items)
  const activeOrdersCount = tables.filter(
    table => table.items && table.items.length > 0
  ).length;

  const formatOrderId = (id: string, index: number) => {
    return `#${1000 + index + 1}`;
  };


  return (
    <section className="flex">
      <div className="p-8 flex-1">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-black">Today&apos;s Revenue</h3>
            <p className="text-3xl font-bold text-black">${value.toFixed(2)}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-black">Active Orders</h3>
            <p className="text-3xl font-bold text-black">{activeOrdersCount}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-black">Available Tables</h3>
            <p className="text-3xl font-bold text-black">{availableTablesCount}/8</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4 text-black">Table Status</h2>
            <div className="flex flex-wrap">
              {tables.map((table) => (
                <TableStatus
                  key={table.tableNumber}
                  tableNumber={table.tableNumber}
                  status={table.status as 'available' | 'occupied' | 'reserved'}
                  onSelect={() => {}}
                />
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4 text-black">Recent Orders</h2>
            <div className="space-y-3">
              {dataPay.map((order, index) => (
                <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-black">{formatOrderId(order._id, index)}</p>
                      <p className="text-sm text-black">Table {order.tableNo}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black">${order.amount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.method === 'cash' ? 'bg-yellow-100 text-yellow-800' :
                        order.method === 'card' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.method.charAt(0).toUpperCase() + order.method.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
