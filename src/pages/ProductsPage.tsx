import React, { useState } from 'react';
import { Products } from '../components/Products';
import { ProductManager } from '../components/admin/ProductManager';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export function ProductsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  React.useEffect(() => {
    const checkAdmin = async () => {
      if (user?.email) {
        const { data } = await supabase
          .from('admin_credentials')
          .select('email')
          .eq('email', user.email)
          .single();

        setIsAdmin(!!data);
      }
    };
    checkAdmin();
  }, [user]);

  return (
    <div className="relative pt-16">
      {/* Optimized Background */}
      <div className="fixed inset-0 -z-10">
        {iframeError ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse"></div>
        ) : (
          <div className="w-full h-full relative">
            {/* Use CSS animation instead of heavy iframe for better performance */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 opacity-80"></div>
            <div className="absolute inset-0">
              {/* Lightweight particle effect using CSS */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-70 animate-ping" style={{animationDelay: '0s'}}></div>
              <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-60 animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-white rounded-full opacity-50 animate-ping" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full opacity-70 animate-ping" style={{animationDelay: '3s'}}></div>
              <div className="absolute bottom-1/4 right-1/2 w-2 h-2 bg-white rounded-full opacity-60 animate-ping" style={{animationDelay: '4s'}}></div>
            </div>
            {/* Fallback iframe for users who want full experience */}
            <noscript>
              <iframe
                src="https://my.spline.design/clicktocreatebubbles-2c3036e0d0f15c7c55118cf70d7964a6/"
                frameBorder="0"
                width="100%"
                height="100%"
                className="w-full h-full"
                title="Interactive Background"
              ></iframe>
            </noscript>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
          >
            {isEditing ? 'View Products' : 'Edit Products'}
          </button>
        </div>
      )}

      {isEditing && isAdmin ? (
        <ProductManager />
      ) : (
        <Products />
      )}
    </div>
  );
}
