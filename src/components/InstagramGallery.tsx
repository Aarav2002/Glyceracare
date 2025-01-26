import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface GalleryImage {
  id: string;
  image_url: string;
  link: string;
}

export function InstagramGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setImages(data);
    };

    fetchImages();
  }, []);

  return (
    <div className="py-8 bg-gray-800"> {/* Dark background for contrast */}
      <div className="container mx-auto px-4 text-center text-white">
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-6">Instagram Gallery</h2>

        {/* Internal CSS for animation */}
        <style>
          {`
            @keyframes scroll-right-to-left {
              0% {
                transform: translateX(100%);
              }
              100% {
                transform: translateX(-100%);
              }
            }

            .animate-scroll {
              display: flex;
              animation: scroll-right-to-left 30s linear infinite;
            }

            .overflow-x-auto {
              overflow-x: hidden;
            }
          `}
        </style>

        {/* Image Grid Container */}
        <div className="overflow-x-hidden">
          <div className="flex animate-scroll">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative flex-none w-72 h-72 mx-4 group border-2 border-gray-600 rounded-lg"
              >
                <a href={image.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={image.image_url}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
