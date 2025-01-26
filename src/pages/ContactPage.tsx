import React, { useEffect, useState } from 'react';
import { Contact } from '../components/Contact';
import { ContactManager } from '../components/admin/ContactManager';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    // Load the Spline viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.54/build/spline-viewer.js';
    document.body.appendChild(script);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Spline Viewer Background */}
      <div className="absolute inset-0 -z-10">
        <spline-viewer
          url="https://prod.spline.design/a6oS3I6FPS78JYRf/scene.splinecode"
          style={{
            width: '100vw',
            height: '110vh',
            display: 'block',
          }}
        ></spline-viewer>
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
