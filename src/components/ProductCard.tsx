import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types/product';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

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
    const price = product.weights[selectedWeight];
    addToCart({
      id: product.id,
      name: product.name,
      price: price.toString(),
      quantity: quantity,
      weight: selectedWeight,
      min_quantity: product.min_quantity || 1, // Pass min_quantity
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
            {Object.entries(product.weights).map(([weight, price]) => (
              <option key={weight} value={weight}>
                {weight} - ₹{price}
              </option>
            ))}
          </select>
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