import React from 'react';
import { Droplets } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center">
          <Droplets className="h-8 w-8 text-teal-500" />
          <span className="ml-2 text-xl font-bold text-white">GlyceraCare</span>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} GlyceraCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}