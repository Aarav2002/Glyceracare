import React, { useEffect, useState } from 'react';
import { InstagramGallery } from '../components/InstagramGallery';
import { supabase } from '../lib/supabase';
import { ImageManager } from '../components/admin/ImageManager';
import { useAuth } from '../context/AuthContext';

export function AboutPage() {
  const [aboutImages, setAboutImages] = useState<string[]>([]);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
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
    const fetchAboutImages = async () => {
      const { data } = await supabase
        .from('about_images')
        .select('image_url')
        .order('created_at', { ascending: false });

      if (data) {
        setAboutImages(data.map(img => img.image_url));
      }
    };

    fetchAboutImages();
  }, []);

  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1692546058534-cfe9088df103?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
      {/* Content Section */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="bg-opacity-70 bg-black text-white flex-grow pt-40">
          {/* About Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-white mb-8">About GlyceraCare</h1>
            <div className="prose prose-lg text-white pointer-events-auto">
              <p className="mb-6">
                GlyceraCare was founded with a simple mission: to create the finest
                natural soaps using traditional methods and sustainable ingredients. Our journey began in a small artisanal workshop, where we perfected our craft through years of dedication and passion.
              </p>
              <p className="mb-6">
                Every bar of soap we create is a testament to our commitment to quality, sustainability, and natural skincare. We believe that what you put on your skin matters, which is why we carefully select each ingredient for its beneficial properties.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>Commitment to natural ingredients</li>
                <li>Sustainable manufacturing practices</li>
                <li>Traditional soap-making methods</li>
                <li>Environmental responsibility</li>
              </ul>
            </div>
          </div>

          {/* Instagram Gallery */}
          <InstagramGallery />

          {/* Admin Image Manager */}
          {isAdmin && (
            <div className="pointer-events-auto">
              <ImageManager />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
