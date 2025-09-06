"use client";

import React, { useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import { useReactToPrint } from "react-to-print";


const PrintBillPage: React.FC = () => {
  const { tables } = useSelector((state: RootState) => state.orders);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const billRef = useRef<HTMLDivElement>(null);

  // Get all occupied tables
  const occupiedTables = useMemo(
    () =>
      tables.filter(
        (table) =>
          table.status === "occupied" && table.items && table.items.length > 0
      ),
    [tables]
  );

  // Get selected table data
  const selectedTableData = useMemo(
    () => tables.find((table) => table.tableNumber === selectedTable),
    [tables, selectedTable]
  );

  const selectedOrder = selectedTableData?.items || [];

  // Calculate totals
  const { subtotal, tax, total } = useMemo(() => {
    const sub = selectedOrder.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tx = sub * 0.08;
    const tot = sub + tx;
    return { subtotal: sub, tax: tx, total: tot };
  }, [selectedOrder]);

  // Print functionality with error handling

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Bill-Table-${selectedTable || "Unknown"}`,
    onPrintError: (errorLocation, error) => {
      console.error(`Print error at ${errorLocation}:`, error);
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCurrentDateTime = () => {
    return new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (occupiedTables.length === 0) {
    return (
      <section className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Print Bill</h1>
          <p className="text-gray-600">No occupied tables with orders found.</p>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Print Bill
        </h1>

        {/* Table Selection */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Select Table
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {occupiedTables.map((table) => (
              <Button
                key={table.tableNumber}
                variant={
                  selectedTable === table.tableNumber ? "primary" : "secondary"
                }
                onClick={() => setSelectedTable(table.tableNumber)}
                className="!text-black"
              >
                Table {table.tableNumber}
              </Button>
            ))}
          </div>
        </Card>

        {/* Bill Preview */}
        {selectedTable && selectedOrder.length > 0 && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Bill for Table {selectedTable}
              </h2>
              <Button
                onClick={handlePrint}
                size="sm"
                variant="primary"
                className="text-white"
                disabled={!selectedOrder.length}
              >
                Print Bill
              </Button>
            </div>

            {/* Printable Bill Content */}
            <div
              ref={billRef}
              className="bg-white p-6 border-2 border-dashed border-gray-300 print:border-none print:p-0 print:w-[80mm]"
            >
              <style>{`
  @media print {
    body * {
      visibility: hidden;
    }
    .printable, .printable * {
      visibility: visible;
    }
    .printable {
      position: absolute;
      left: 0;
      top: 0;
      width: 80mm;
      font-family: "Arial", "Helvetica", sans-serif !important;
      font-size: 12px !important;
      line-height: 1.2 !important;
    }
    @page {
      size: 80mm auto;
      margin: 5mm;
    }
  }
`}</style>

              <div ref={contentRef} className="printable">
                {/* Restaurant Header */}
                <div className="text-center mb-4">
                  <h1 className="text-xl font-bold text-gray-800">
                    RESTAURANT NAME
                  </h1>
                  <p className="text-xs text-gray-600">
                    123 Restaurant Street, City
                  </p>
                  <p className="text-xs text-gray-600">Phone: (555) 123-4567</p>
                </div>

                {/* Bill Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">
                      Table:{" "}
                      <span className="font-semibold">{selectedTable}</span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Date:{" "}
                      <span className="font-semibold">
                        {getCurrentDateTime()}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      Bill #:{" "}
                      <span className="font-semibold">
                        {Math.floor(Math.random() * 1000)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Server: <span className="font-semibold">Staff</span>
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <div className="grid grid-cols-12 gap-2 font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-2">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                  {selectedOrder.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 py-2 border-b border-gray-200"
                    >
                      <div className="col-span-6">
                        <p className="font-medium text-gray-800 text-xs">
                          {item.name}
                        </p>
                        {item.specialInstructions && (
                          <p className="text-[10px] text-gray-500 italic">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>
                      <div className="col-span-2 text-center text-gray-600 text-xs">
                        {item.quantity}
                      </div>
                      <div className="col-span-2 text-right text-gray-600 text-xs">
                        {formatCurrency(item.price)}
                      </div>
                      <div className="col-span-2 text-right font-medium text-gray-800 text-xs">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t-2 border-gray-300 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-800 text-xs">
                      Subtotal:
                    </span>
                    <span className="font-semibold text-gray-800 text-xs">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 text-xs">Tax (8%):</span>
                    <span className="text-gray-600 text-xs">
                      {formatCurrency(tax)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-800 pt-2 border-t border-gray-300">
                    <span>TOTAL:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 pt-4 border-t border-gray-300">
                  <p className="text-xs text-gray-500">
                    Thank you for dining with us!
                  </p>
                  <p className="text-[10px] text-gray-400">Please come again</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
};

export default PrintBillPage;
