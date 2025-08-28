import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OptimizedSplineViewer } from './OptimizedSplineViewer';

export function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen flex"> {/* Flex container to split content */}
      {/* Left Section: Text Content */}
      <div className="flex-1 flex items-center justify-center bg-black px-6 sm:px-12 lg:px-20">
        <div className="text-left max-w-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-white">
            <span className="block mb-2">Pure & Natural</span>
            <span className="block text-teal-400">Handcrafted Soaps</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Experience the luxury of natural skincare with our artisanal soaps, crafted with the finest ingredients for your skin's well-being.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center px-8 py-3 text-white bg-teal-600 hover:bg-teal-700 rounded-md text-lg transition-all duration-200"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Section: Optimized Spline Viewer */}
      <div className="flex-1 h-full relative bg-gradient-to-br from-gray-900 to-black">
        <OptimizedSplineViewer
          url="https://prod.spline.design/ac9R2h3nuaPZMq4P/scene.splinecode"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '500px',
          }}
          className="w-full h-full"
          quality="medium"
          enableLazyLoading={true}
          enableIntersectionObserver={true}
          fallbackContent={
            <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
              <div className="text-white text-center">
                <h3 className="text-2xl font-bold mb-2">Natural Beauty</h3>
                <p>Handcrafted Soaps</p>
              </div>
            </div>
          }
        />
      </div>

      {/* Black Stripe Overlay at the Bottom */}
      <div
        className="absolute bottom-0 w-full bg-black h-16"
        style={{
          zIndex: 50, // Ensure it's above most elements
        }}
      ></div>
    </div>
  );
}
