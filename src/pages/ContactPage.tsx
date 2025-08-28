import React, { useEffect, useState } from 'react';
import { Contact } from '../components/Contact';
import { ContactManager } from '../components/admin/ContactManager';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { OptimizedSplineViewer } from '../components/OptimizedSplineViewer';

export function ContactPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
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
    <div className="relative min-h-screen">
      {/* Optimized Spline Viewer Background */}
      <div className="absolute inset-0 -z-10">
        <OptimizedSplineViewer
          url="https://prod.spline.design/a6oS3I6FPS78JYRf/scene.splinecode"
          style={{
            width: '100vw',
            height: '110vh',
            display: 'block',
            minHeight: '600px',
          }}
          className="w-full h-full"
          quality="low" // Use lower quality for background
          enableLazyLoading={true}
          enableIntersectionObserver={true}
          fallbackContent={
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
          }
        />
      </div>

      {/* Content Section */}
      <div className="relative z-10 pt-16">
        <Contact />

        {/* Render ContactManager only if the user is an admin */}
        {isAdmin && <ContactManager />}
      </div>
    </div>
  );
}
