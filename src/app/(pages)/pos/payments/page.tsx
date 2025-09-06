"use client";

import React, { useState, useEffect } from "react";
import Card from "@/app/components/ui/Card";
import useApi from "@/app/hooks/useApi";
import Button from "@/app/components/ui/Button";
import { Trash2 } from "lucide-react";

type Payment = {
  _id: string;
  orderId: string;
  tableNo: number;
  amount: number;
  method: string;
  createdAt: string;
};

const PaymentsPage: React.FC = () => {
  // Example: get token from localStorage or context
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  const { data, remove } = useApi<Payment[]>(
    "/payment",
    token ? { headers: { Authorization: `Bearer ${token}` } } : {}
  );

  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (data) {
      setPayments(data);
    }
  }, [data]);

  const formatOrderId = (id: string, index: number) => `#${1000 + index + 1}`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const filteredPayments = payments
    .filter((payment) =>
      !searchQuery ||
      (payment.orderId && payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
    });

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  const deleteAllPayments = async () => {
    if (confirm("Are you sure you want to delete all payments? This action cannot be undone.")) {
      const success = await remove("/payment");
      if (success) {
        setPayments([]);
        setCurrentPage(1);
      }
    }
  };

  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredPayments.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, sortOrder]);

  return (
    <section className="flex min-h-screen container overflow-x-hidden">
      <div className="p-0 md:p-[clamp(1rem,2vw,1.5rem)] flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-[clamp(1rem,2vw,1.5rem)]">
          <h1 className="text-[clamp(1.5rem,3vw,2rem)] text-center md:text-left font-bold text-[#ffffff] mb-[clamp(0.5rem,1vw,1rem)] md:mb-0">
            Payment History
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(0.75rem,1.5vw,1rem)] mb-[clamp(1rem,2vw,1.5rem)]">
          <Card className="p-[clamp(0.75rem,1.5vw,1rem)] bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="p-[clamp(0.5rem,1vw,0.75rem)] rounded-full bg-blue-900/30 text-blue-400 mr-[clamp(0.75rem,1.5vw,1rem)]">
                <svg
                  className="w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium text-black">Total Payments</p>
                <p className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold text-black">
                  {filteredPayments.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-[clamp(0.75rem,1.5vw,1rem)] bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="p-[clamp(0.5rem,1vw,0.75rem)] rounded-full bg-green-900/30 text-green-400 mr-[clamp(0.75rem,1.5vw,1rem)]">
                <svg
                  className="w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium text-black">Total Revenue</p>
                <p className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold text-black">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-[clamp(0.75rem,1.5vw,1rem)] bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="p-[clamp(0.5rem,1vw,0.75rem)] rounded-full bg-purple-900/30 text-purple-400 mr-[clamp(0.75rem,1.5vw,1rem)]">
                <svg
                  className="w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium text-black">
                  Average per Table
                </p>
                <p className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold text-black">
                  $
                  {filteredPayments.length > 0
                    ? (totalAmount / filteredPayments.length).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-[clamp(0.75rem,1.5vw,1rem)] md:p-[clamp(1rem,2vw,1.5rem)] bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-[clamp(0.5rem,1vw,1rem)]">
            <h2 className="text-[clamp(1rem,2vw,1.125rem)] font-semibold text-black mb-[clamp(0.25rem,0.5vw,0.5rem)] md:mb-0">
              Payment Records
            </h2>

            <div className="flex flex-col sm:flex-row gap-[clamp(0.25rem,0.5vw,0.5rem)]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
                className="px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.25rem,0.5vw,0.5rem)] bg-gray-200 border border-gray-200 rounded-lg text-[clamp(0.75rem,1.5vw,0.875rem)] text-black"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.25rem,0.5vw,0.5rem)] bg-gray-200 rounded-lg text-[clamp(0.75rem,1.5vw,0.875rem)] text-black flex items-center"
              >
                {sortOrder === "asc" ? "Ascending" : "Descending"}
                <svg
                  className="w-[clamp(0.75rem,1.5vw,1rem)] h-[clamp(0.75rem,1.5vw,1rem)] ml-[clamp(0.25rem,0.5vw,0.5rem)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {sortOrder === "asc" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  )}
                </svg>
              </button>

              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700 cursor-pointer text-white flex gap-[clamp(0.25rem,0.5vw,0.5rem)] items-center justify-between"
                onClick={deleteAllPayments}
              >
                <Trash2 className="w-[clamp(1rem,2vw,1.25rem)] h-[clamp(1rem,2vw,1.25rem)] mr-[clamp(0.25rem,0.5vw,0.5rem)]" />
                Delete all payments
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-left text-[clamp(0.625rem,1.25vw,0.75rem)] font-medium text-black uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-left text-[clamp(0.625rem,1.25vw,0.75rem)] font-medium text-black uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-left text-[clamp(0.625rem,1.25vw,0.75rem)] font-medium text-black uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-left text-[clamp(0.625rem,1.25vw,0.75rem)] font-medium text-black uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-left text-[clamp(0.625rem,1.25vw,0.75rem)] font-medium text-black uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="text-black divide-y divide-gray-700">
                {currentItems.length > 0 ? (
                  currentItems.map((payment, index) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] whitespace-nowrap text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium text-blue-400">
                        {formatOrderId(payment.orderId, index + startIndex)}
                      </td>
                      <td className="px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] whitespace-nowrap text-[clamp(0.75rem,1.5vw,0.875rem)] text-black">
                        Table {payment.tableNo}
                      </td>
                      <td className="px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] whitespace-nowrap text-[clamp(0.75rem,1.5vw,0.875rem)] font-semibold text-black">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] whitespace-nowrap">
                        <span
                          className={`px-[clamp(0.25rem,0.5vw,0.5rem)] py-[clamp(0.125rem,0.25vw,0.25rem)] text-[clamp(0.625rem,1.25vw,0.75rem)] font-medium rounded-full capitalize
                          ${
                            payment.method === "cash"
                              ? "bg-green-900/30 text-green-400"
                              : ""
                          }
                          ${
                            payment.method === "card"
                              ? "bg-blue-900/30 text-blue-400"
                              : ""
                          }
                          ${
                            payment.method === "digital"
                              ? "bg-purple-900/30 text-purple-400"
                              : ""
                          }
                        `}
                        >
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] whitespace-nowrap text-[clamp(0.75rem,1.5vw,0.875rem)] text-black">
                        {formatDate(payment.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(2rem,4vw,3rem)] text-center text-[clamp(0.875rem,1.75vw,1rem)] text-gray-500"
                    >
                      {payments.length === 0
                        ? "No payments found"
                        : "No payments match your search"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredPayments.length > 0 && (
            <div className="mt-[clamp(0.75rem,1.5vw,1rem)] flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-black mb-[clamp(0.25rem,0.5vw,0.5rem)] sm:mb-0">
                Showing{" "}
                <span className="font-medium text-black">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-black">
                  {Math.min(endIndex, totalItems)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-black">
                  {totalItems}
                </span>{" "}
                payments
              </p>

              <div className="flex space-x-[clamp(0.25rem,0.5vw,0.5rem)]">
                <Button
                  variant="secondary"
                  className="px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.25rem,0.5vw,0.5rem)] text-[clamp(0.75rem,1.5vw,0.875rem)] bg-gray-200 text-black rounded-lg disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.25rem,0.5vw,0.5rem)] text-[clamp(0.75rem,1.5vw,0.875rem)] text-black">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  className="px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.25rem,0.5vw,0.5rem)] text-[clamp(0.75rem,1.5vw,0.875rem)] bg-gray-200 text-black rounded-lg disabled:opacity-50"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <style jsx global>{`
        body {
          background-color: #111827;
          color: #fff;
        }
        /* Custom scrollbar for dark theme */
        ::-webkit-scrollbar {
          width: clamp(6px, 1vw, 8px);
          height: clamp(6px, 1vw, 8px);
        }
        ::-webkit-scrollbar-track {
          background: #374151;
        }
        ::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: clamp(2px, 0.5vw, 4px);
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </section>
  );
};

export default PaymentsPage;