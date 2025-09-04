"use client";

import React from 'react';
import Button from './Button';

type TableStatusProps = {
  tableNumber: number;
  status: 'available' | 'occupied' | 'reserved';
  onSelect: () => void;
};

const TableStatus: React.FC<TableStatusProps> = ({ tableNumber, status, onSelect }) => {
  const statusColors = {
    available: 'bg-green-100 text-green-800',
    occupied: 'bg-red-100 text-red-800',
    reserved: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Button
      onClick={onSelect}
      variant="outline"
      className={`w-24 h-24 m-2 flex flex-col items-center justify-center ${statusColors[status]}`}
    >
      <span className="text-2xl font-bold">{tableNumber}</span>
      <span className="text-xs capitalize">{status}</span>
    </Button>
  );
};

export default TableStatus;