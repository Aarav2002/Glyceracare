import React, { useEffect, useState } from 'react';
import { MinusCircle, PlusCircle, X, Tag, Calculator, LogIn, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { calculateCartTotal, formatPrice } from '../utils/priceCalculations';

export function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
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
    const cartItems = items.map(item => ({
      quantity: item.quantity,
      originalPrice: item.originalPrice || parseFloat(item.price.replace('₹', '')),
      discount: undefined
    }));
    
    return calculateCartTotal(cartItems, undefined, 0);
  };

  const totals = calculateTotal();

  const handleCheckout = () => {
    if (!user) {
      // User not logged in, show alert and redirect to home for login
      alert('Please login to proceed with checkout');
      navigate('/');
      return;
    }
    navigate('/checkout');
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
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm font-medium text-teal-600">
                    {item.price}
                  </p>
                  {item.originalPrice && item.originalPrice > parseFloat(item.price.replace('₹', '')) && (
                    <>
                      <p className="text-sm text-gray-400 line-through">
                        {formatPrice(item.originalPrice)}
                      </p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <Tag className="w-3 h-3 mr-1" />
                        {Math.round(((item.originalPrice - parseFloat(item.price.replace('₹', ''))) / item.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
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
          <h2 className="text-lg font-semibold border-b pb-2 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Price Details
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal ({items.length} items)</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  Product Discounts
                </span>
                <span>−{formatPrice(totals.discountAmount)}</span>
              </div>
            )}
            {totals.couponDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span>−{formatPrice(totals.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (GST 18%)</span>
              <span>{formatPrice(totals.taxAmount)}</span>
            </div>
          </div>
          <div className="border-t mt-4 pt-4 font-semibold text-lg">
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span className="text-teal-600">{formatPrice(totals.totalAmount)}</span>
            </div>
          </div>
          {(totals.discountAmount > 0 || totals.couponDiscount > 0) && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm font-medium">
                🎉 You're saving {formatPrice(totals.discountAmount + totals.couponDiscount)} on this order!
              </p>
            </div>
          )}
          
          {/* Authentication-aware checkout button */}
          {user ? (
            <button 
              onClick={handleCheckout}
              className="mt-6 w-full bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 transition-colors font-medium"
            >
              Proceed to Checkout
            </button>
          ) : (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center p-3 bg-amber-50 border border-amber-200 rounded-md">
                <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                <span className="text-sm text-amber-800 font-medium">
                  Login required to checkout
                </span>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 transition-colors font-medium flex items-center justify-center"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
