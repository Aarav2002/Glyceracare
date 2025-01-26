import React, { useEffect, useState } from 'react';
import { MinusCircle, PlusCircle, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

export function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCart();
  const [productImages, setProductImages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchProductImages();
  }, [items]);

  const fetchProductImages = async () => {
    try {
      // Create a mapping of product IDs to their image URLs
      const productIds = [...new Set(items.map((item) => item.id))]; // Remove duplicates
      const { data, error } = await supabase
        .from('products')
        .select('id, image_url')
        .in('id', productIds);

      if (error) throw error;

      const imageMapping: { [key: string]: string } = {};
      data?.forEach((product) => {
        imageMapping[product.id] = product.image_url || '/placeholder.png';
      });

      setProductImages(imageMapping);
    } catch (error) {
      console.error('Error fetching product images:', error);
    }
  };

  const handleQuantityChange = (
    itemId: number,
    itemWeight: string,
    increment: boolean,
    currentQuantity: number,
    minQuantity: number
  ) => {
    const newQuantity = increment
      ? currentQuantity + 1
      : Math.max(minQuantity, currentQuantity - 1);
    updateQuantity(itemId, itemWeight, newQuantity);
  };

  const calculateTotal = () => {
    return items
      .reduce(
        (total, item) =>
          total + parseFloat(item.price.replace('₹', '')) * item.quantity,
        0
      )
      .toFixed(2);
  };

  const calculateDiscount = () => {
    return items
      .reduce((total, item) => total + (item.discount || 0) * item.quantity, 0)
      .toFixed(2);
  };

  if (items.length === 0) {
    return <p className="text-center text-gray-500 mt-10">Your cart is empty</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section: Product List */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.weight}`}
              className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-4 border rounded-lg"
            >
              <img
                src={productImages[item.id] || '/placeholder.png'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="font-medium text-lg">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="text-sm text-green-600">
                  Delivery by {item.deliveryDate} | {item.deliveryCharges}
                </p>
                <p className="text-sm text-gray-500">
                  Min: {item.min_quantity} units
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.id,
                      item.weight,
                      false,
                      item.quantity,
                      item.min_quantity
                    )
                  }
                  className="text-gray-500 hover:text-teal-600 transition-colors"
                >
                  <MinusCircle className="h-5 w-5" />
                </button>
                <span className="text-lg font-medium w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.id,
                      item.weight,
                      true,
                      item.quantity,
                      item.min_quantity
                    )
                  }
                  className="text-gray-500 hover:text-teal-600 transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-medium text-teal-600">
                  ₹
                  {(
                    parseFloat(item.price.replace('₹', '')) * item.quantity
                  ).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.id, item.weight)}
                  className="text-red-500 hover:text-red-600 mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section: Price Summary */}
        <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold border-b pb-2">Price Details</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Price ({items.length} items)</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>−₹{calculateDiscount()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>Free</span>
            </div>
          </div>
          <div className="border-t mt-4 pt-4 font-semibold text-lg">
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span>
                ₹
                {(
                  parseFloat(calculateTotal()) - parseFloat(calculateDiscount())
                ).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="mt-4 text-green-600 text-sm">
            You will save ₹{calculateDiscount()} on this order
          </div>
          <button className="mt-6 w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
