import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types/product';
import { ShoppingCart, Plus, Minus, Tag } from 'lucide-react';
import { calculateDiscountedPrice, formatPrice, calculateSavings } from '../utils/priceCalculations';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedWeight, setSelectedWeight] = useState<string>('50gm');
  const [quantity, setQuantity] = useState<number>(product.min_quantity || 1);
  const { addToCart } = useCart();

  useEffect(() => {
    setQuantity(product.min_quantity || 1);
  }, [product.min_quantity]);

  const handleQuantityChange = (newQuantity: number) => {
    const minQty = product.min_quantity || 1;
    if (newQuantity >= minQty) {
      setQuantity(newQuantity);
    }
  };

  const handleInputQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue)) {
      const minQty = product.min_quantity || 1;
      setQuantity(Math.max(minQty, newValue));
    }
  };

  const handleAddToCart = () => {
    const originalPrice = product.weights[selectedWeight];
    const priceCalc = calculateDiscountedPrice(originalPrice, product.discount);
    
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      price: formatPrice(priceCalc.finalPrice),
      quantity: quantity,
      weight: selectedWeight,
      min_quantity: product.min_quantity || 1,
      deliveryDate: 'Tomorrow',
      deliveryCharges: 'Free delivery',
      discount: priceCalc.discountAmount,
      originalPrice: originalPrice
    });
  };
  

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={product.image_url || '/placeholder.png'}
          alt={product.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.png';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{product.description}</p>
        
        <div className="mt-3">
          <label htmlFor={`weight-${product.id}`} className="text-sm font-medium text-gray-700">
            Select Weight
          </label>
          <select
            id={`weight-${product.id}`}
            value={selectedWeight}
            onChange={(e) => setSelectedWeight(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
          >
            {Object.entries(product.weights).map(([weight, price]) => {
              const priceCalc = calculateDiscountedPrice(price, product.discount);
              return (
                <option key={weight} value={weight}>
                  {weight} - {priceCalc.discountAmount > 0 ? (
                    <>
                      {formatPrice(priceCalc.finalPrice)} 
                      <span style={{textDecoration: 'line-through', color: '#999'}}>
                        {formatPrice(priceCalc.originalPrice)}
                      </span>
                    </>
                  ) : (
                    formatPrice(price)
                  )}
                </option>
              );
            })}
          </select>
        </div>

        {/* Discount Badge */}
        {product.discount && product.discount.active && (
          <div className="mt-2">
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <Tag className="w-3 h-3 mr-1" />
              {product.discount.type === 'percentage' 
                ? `${product.discount.value}% OFF` 
                : `₹${product.discount.value} OFF`
              }
            </div>
            <p className="text-xs text-gray-500 mt-1">{product.discount.description}</p>
          </div>
        )}

        {/* Price Display */}
        <div className="mt-3">
          {(() => {
            const originalPrice = product.weights[selectedWeight];
            const priceCalc = calculateDiscountedPrice(originalPrice, product.discount);
            const savings = calculateSavings(priceCalc.originalPrice, priceCalc.finalPrice);
            
            return (
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-teal-600">
                    {formatPrice(priceCalc.finalPrice)}
                  </span>
                  {priceCalc.discountAmount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(priceCalc.originalPrice)}
                    </span>
                  )}
                </div>
                {savings.amount > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    You save {formatPrice(savings.amount)} ({savings.percentage}%)
                  </p>
                )}
              </div>
            );
          })()} 
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">
            Quantity (Pack of: {product.min_quantity || 1})
          </label>
          <div className="flex items-center space-x-2 mt-1">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              disabled={quantity <= (product.min_quantity || 1)}
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={product.min_quantity || 1}
              value={quantity}
              onChange={handleInputQuantityChange}
              className="w-20 text-center border-gray-300 rounded-md"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleAddToCart}
            className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart 
          </button>
        </div>
      </div>
    </div>
  );
}