"use client";

import React, { useState } from "react";
import axios from "axios";

interface DishFormData {
  name: string;
  price: number;
  category: string;
  description: string;
  imagepath?: string;
}

interface DishFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const DishForm: React.FC<DishFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<DishFormData>({
    name: "",
    price: 0,
    category: "",
    description: "",
    imagepath: "",
  });

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert("Please fill in Name, Price, and Category before generating.");
      return;
    }

    try {
      setGenerating(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/menu/generate-description`,
        {
          name: formData.name,
          price: formData.price,
          category: formData.category,
        }
      );

      if (response.data?.description) {
        setFormData((prev) => ({
          ...prev,
          description: response.data.description,
        }));
      }
    } catch (err) {
      console.error("Error generating description:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/menu/upload`,
        formData
      );

      if (response.status === 200 || response.status === 201) {
        setFormData({
          name: "",
          price: 0,
          category: "",
          description: "",
          imagepath: "",
        });

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      console.error("Error creating dish:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#111]/80 flex items-center justify-center p-4 mt-8 md:mt-0">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black">Create New Dish</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>

          {/* Category */}
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            >
              <option value="">Select category</option>
              <option value="Main">Main</option>
              <option value="Dessert">Dessert</option>
              <option value="Drink">Drink</option>
              <option value="Appetizer">Appetizer</option>
              <option value="Salad">Salad</option>
            </select>
          </div>

          {/* Description + Generate Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={generating || loading}
              className="mt-2 px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
            >
              {generating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate Description"
              )}
            </button>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              name="imagepath"
              value={formData.imagepath}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading || generating}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || generating}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Dish"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DishForm;
