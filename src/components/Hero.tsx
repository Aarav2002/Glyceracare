import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  useEffect(() => {
    // Load the Spline viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.59/build/spline-viewer.js";
    document.body.appendChild(script);
  }, []);

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

      {/* Right Section: Spline Viewer */}
      <div className="flex-1 h-full">
        <spline-viewer
          url="https://prod.spline.design/ac9R2h3nuaPZMq4P/scene.splinecode"
          style={{
            width: '100%',
            height: '100%',
          }}
        ></spline-viewer>
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
