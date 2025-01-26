import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Trash, Loader2, Edit, Plus } from 'lucide-react';

interface Image {
  id: string;
  image_url: string;
  link?: string;
}

export function ImageManager() {
  const [galleryImages, setGalleryImages] = useState<Image[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  // Fetch images from the gallery_images table
  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
    } else {
      setGalleryImages(data || []);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle file upload to Supabase Storage and insert record into gallery_images table
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // Upload the image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('gallery') // Your bucket name is 'gallery'
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('gallery') // Your bucket name is 'gallery'
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      if (publicUrl) {
        // Insert the public URL into the gallery_images table
        const { error: insertError } = await supabase
          .from('gallery_images')
          .insert([{ image_url: publicUrl, link: 'https://www.instagram.com/glyceracare' }]);

        if (insertError) throw insertError;

        fetchImages(); // Refresh the gallery
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  // Handle image deletion
  const handleDelete = async (id: string) => {
    try {
      const imageToDelete = galleryImages.find((img) => img.id === id);
      if (!imageToDelete) return;

      // Extract file path from image_url for deletion
      const filePath = imageToDelete.image_url.split('/').slice(-2).join('/');

      // Remove the image from storage
      const { error: storageError } = await supabase.storage
        .from('gallery') // Your bucket name is 'gallery'
        .remove([filePath]);

      if (storageError) throw storageError;

      // Remove the image record from the database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      fetchImages(); // Refresh the gallery
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Gallery Images</h2>

        {/* Upload Section */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            {selectedFile ? selectedFile.name : 'Select Image'}
          </label>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            Upload
          </button>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.image_url}
                alt="Gallery"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => handleDelete(image.id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
