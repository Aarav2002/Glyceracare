import React, { useState } from 'react';
import { Products } from '../components/Products';
import { ProductManager } from '../components/admin/ProductManager';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export function ProductsPage() {
  const [isEditing, setIsEditing] = useState(false);
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
      {/* Iframe Background */}
      <div className="fixed inset-0 -z-10">
        <iframe
          src="https://my.spline.design/clicktocreatebubbles-2c3036e0d0f15c7c55118cf70d7964a6/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="w-full h-full"
        ></iframe>
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
