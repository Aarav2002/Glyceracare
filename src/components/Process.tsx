import React from 'react';
import { Leaf, Droplets, Heart } from 'lucide-react';

export function Process() {
  return (
    <section id="process" className="bg-teal-50 py-12 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Manufacturing Process
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-500">
            Quality and care in every step
          </p>
        </div>
        <div className="mt-10 sm:mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center p-6">
            <div className="flex justify-center">
              <Leaf className="h-10 w-10 sm:h-12 sm:w-12 text-teal-600" />
            </div>
            <h3 className="mt-4 text-lg sm:text-xl font-medium text-gray-900">Natural Ingredients</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              We source the finest natural ingredients, ensuring quality and sustainability
            </p>
          </div>
          <div className="text-center p-6">
            <div className="flex justify-center">
              <Droplets className="h-10 w-10 sm:h-12 sm:w-12 text-teal-600" />
            </div>
            <h3 className="mt-4 text-lg sm:text-xl font-medium text-gray-900">Cold Process</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              Traditional cold process method to preserve natural benefits
            </p>
          </div>
          <div className="text-center p-6">
            <div className="flex justify-center">
              <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-teal-600" />
            </div>
            <h3 className="mt-4 text-lg sm:text-xl font-medium text-gray-900">Made with Love</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              Each bar is handcrafted with attention to detail and care
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}