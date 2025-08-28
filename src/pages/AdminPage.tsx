// src/pages/AdminPage.tsx
import React, { useState } from 'react';
import { ProductManager } from '../components/admin/ProductManager';
import { ContactManager } from '../components/admin/ContactManager';
import { ImageManager } from '../components/admin/ImageManager';
import { DiscountManager } from '../components/admin/DiscountManager';
import { CouponManager } from '../components/admin/CouponManager';
import { OrderManager } from '../components/admin/OrderManager';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex flex-wrap space-x-2 space-y-2 md:space-y-0">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'products'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('discounts')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'discounts'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Discounts
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'coupons'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Coupons
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'orders'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'contacts'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Contacts
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'images'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Gallery Images
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'products' && <ProductManager />}
          {activeTab === 'discounts' && <DiscountManager />}
          {activeTab === 'coupons' && <CouponManager />}
          {activeTab === 'orders' && <OrderManager />}
          {activeTab === 'contacts' && <ContactManager />}
          {activeTab === 'images' && <ImageManager />}
        </div>
      </div>
    </div>
  );
}