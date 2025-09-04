import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Image from 'next/image';
import {Trash2} from "lucide-react"

type MenuItem = {
  _id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  imagepath?: string;
  image?: string;
};

type MenuItemCardProps = {
  item: MenuItem;
  onAddToOrder: () => void;
  deleteItem: () => void;
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToOrder, deleteItem }) => {
  return (
    <Card className="flex flex-col h-full justify-between hover:shadow-lg shadow-[#ffffff41] transition-shadow">
      {item.imagepath && (
        <div className="h-50 bg-gray-200 overflow-hidden">
          <Image
            src={item.imagepath || item.image || '/placeholder.png'}
            alt={item.name}
            width={400}
            height={200}
            className="object-cover w-full h-full"
            blurDataURL='/placeholder.png'
          />
        </div>
      )}
      <div className='p-4 flex-1'>
        <div className="flex w-full justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">{item.name}</h3>
      <button onClick={deleteItem} className='mr-4 p-1 rounded cursor-pointer active:scale-90 bg-red-500'><Trash2 className='text-white'/></button>
      </div>
        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
        <p className="text-blue-600 font-medium">${item.price.toFixed(2)}</p>
      </div>
      <div className="p-4 border-t border-gray-100">
        <Button
          onClick={onAddToOrder}
          variant="primary"
          size="sm"
          className="w-full"
        >
          Add to Order
        </Button>
      </div>
    </Card>
  );
};

export default MenuItemCard;