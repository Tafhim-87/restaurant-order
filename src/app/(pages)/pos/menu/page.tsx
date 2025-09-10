"use client";

import React, { useState, useEffect } from "react";
import MenuItemCard from "../../../components/pos/MenuItemCard";
import CategoryFilter from "../../../components/pos/CategoryFilter";
import Button from "@/app/components/ui/Button";
import { useDispatch } from "react-redux";
import { addToOrder } from "@/app/redux/orderSlice";
import DishForm from "@/app/components/ui/DishForm";
// import useApi from "@/app/hooks/useApi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type MenuItem = {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
};

const MenuPage: React.FC = () => {
  const dispatch = useDispatch();
  const [createDish, setCreateDish] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [menuData, setMenuData] = useState<MenuItem[] | null>(null);
  const [tableNumber, setTableNumber] = useState(1);
  // const { data, remove, refetch } = useApi<MenuItem[]>("/menu");

  const categories = Array.from(
    new Set(menuData?.map((item) => item.category))
  );

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get<MenuItem[]>(`${process.env.NEXT_PUBLIC_API}/menu`);
        setMenuData(response.data);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenu();
  }, []);

  const deleteItem = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API}/menu/${id}`);
      setMenuData((prevData) => prevData?.filter((item) => item._id !== id) || null);
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const filteredItems = selectedCategory
    ? menuData?.filter((item: MenuItem) => item.category === selectedCategory)
    : menuData ?? [];

  const handleAddToOrder = (item: MenuItem) => {
    dispatch(
      addToOrder({
        tableNumber,
        item: {
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          total: item.price,
        },
      })
    );
  };

  return (
    <section className="flex">
      <div className="p-8 flex-1">
        <div className="lg:flex flex flex-col lg:flex-row gap-4 mb-4 lg:justify-between justify-center items-center">
          <h1 className="text-2xl font-bold w-full">Menu Management</h1>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <span className="mr-2 text-blue-50">Table:</span>
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 !text-blue-50"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num} className="!text-black">
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="active:scale-95"
              onClick={() => setCreateDish(true)}
            >
              Create Dish
            </Button>
          </div>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-1 text-black sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {(filteredItems ?? []).map((item) => (
            <MenuItemCard
              key={item._id}
              item={item}
              onAddToOrder={() => handleAddToOrder(item)}
              deleteItem={() => deleteItem(item._id)}
            />
          ))}
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>

      {/* Modal (DishForm) */}
      {createDish && (
        <DishForm
          onSuccess={() => {
            setCreateDish(false);
            // Optionally, re-fetch menu data here if needed

          }}
          onCancel={() => {
            setCreateDish(false);
            // Optionally, re-fetch menu data here if needed
          }}
        />
      )}
    </section>
  );
};

export default MenuPage;
