import React from 'react';
import { X, ShoppingCart, MinusCircle, PlusCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

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

  const handleViewCart = () => {
    onClose(); // Close the modal
    navigate('/cart'); // Navigate to the Cart page
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 text-teal-600 mr-2" />
              <h2 className="text-xl font-semibold">Your Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-4">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.weight}`}
                    className="flex flex-col space-y-2 p-3 border rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.price} each | Pack of: {item.min_quantity} units
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.weight)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
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
                      <span className="font-medium text-teal-600">
                        ₹{(parseFloat(item.price.replace('₹', '')) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t">
            <button
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors mb-3"
              onClick={onClose}
            >
              Continue Shopping
            </button>
            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleViewCart}
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
