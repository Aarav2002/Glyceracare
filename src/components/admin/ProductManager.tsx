// src/components/admin/ProductManager.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PlusCircle, Edit, Trash, Save, X } from 'lucide-react';
import type { WeightOption } from '../../types/product';
import { categories } from '../../data/products';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  image_url: string;
  weights: Record<WeightOption, number>;
  minQuantity: number;
}

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: 'Floral',
    image_url: '',
    minQuantity: 1,
    weights: {
      '50gm': 0,
      '75gm': 0,
      '100gm': 0
    } as Record<WeightOption, number>
  });
  const [uploading, setUploading] = useState(false);
  const [weightOptions, setWeightOptions] = useState<string[]>(['50gm', '75gm', '100gm']);
  const [newWeight, setNewWeight] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (data) {
      const transformedData = data.map(product => ({
        ...product,
        minQuantity: product.min_quantity
      }));
      setProducts(transformedData);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      if (isEditing && editingProduct) {
        setEditingProduct({
          ...editingProduct,
          image_url: data.publicUrl
        });
      } else {
        setNewProduct({
          ...newProduct,
          image_url: data.publicUrl
        });
      }

      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image!');
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: newProduct.name,
          description: newProduct.description,
          category: newProduct.category,
          image_url: newProduct.image_url,
          min_quantity: newProduct.minQuantity,
          weights: newProduct.weights
        }])
        .select()
        .single();

      if (error) throw error;

      setProducts([...products, data]);
      setNewProduct({
        name: '',
        description: '',
        category: 'Floral',
        image_url: '',
        minQuantity: 1,
        weights: {
          '50gm': 0,
          '75gm': 0,
          '100gm': 0
        } as Record<WeightOption, number>
      });

      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({
      ...product,
      minQuantity: product.minQuantity
    });
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          category: editingProduct.category,
          image_url: editingProduct.image_url,
          min_quantity: editingProduct.minQuantity || 1,
          weights: editingProduct.weights
        })
        .eq('id', editingProduct.id)
        .select()
        .single();

      if (error) throw error;

      setProducts(products.map(p => p.id === data.id ? data : p));
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleAddWeight = () => {
    if (newWeight && !weightOptions.includes(newWeight)) {
      setWeightOptions([...weightOptions, newWeight]);
      setNewProduct({
        ...newProduct,
        weights: {
          ...newProduct.weights,
          [newWeight]: 0
        } as Record<WeightOption, number>
      });
      setNewWeight('');
    }
  };

  const handleRemoveWeight = (weightToRemove: string) => {
    setWeightOptions(weightOptions.filter(w => w !== weightToRemove));
    const updatedWeights = { ...newProduct.weights } as Record<string, number>;
    delete updatedWeights[weightToRemove];
    setNewProduct({
      ...newProduct,
      weights: updatedWeights as Record<WeightOption, number>
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      
      {/* Add New Product Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            className="border p-2 rounded"
          />
          
          {/* Image Upload */}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, false)}
              className="border p-2 rounded"
              disabled={uploading}
            />
            {uploading && <span>Uploading...</span>}
          </div>

          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={e => setNewProduct({...newProduct, description: e.target.value})}
            className="border p-2 rounded md:col-span-2"
          />
          <select
            value={newProduct.category}
            onChange={e => setNewProduct({...newProduct, category: e.target.value})}
            className="border p-2 rounded"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          {/* Minimum Quantity Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Minimum Quantity
            </label>
            <input
              type="number"
              min="1"
              value={newProduct.minQuantity}
              onChange={(e) => setNewProduct({
                ...newProduct,
                minQuantity: Math.max(1, parseInt(e.target.value) || 1)
              })}
              className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          
          {/* Weight prices inputs */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weights and Prices
            </label>
            
            {/* Add new weight input */}
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Add new weight (e.g., 150gm)"
                className="border p-2 rounded"
              />
              <button
                onClick={handleAddWeight}
                className="bg-teal-600 text-white px-3 py-2 rounded hover:bg-teal-700"
              >
                Add Weight
              </button>
            </div>

            {/* Weight prices inputs */}
            <div className="grid gap-4">
              {weightOptions.map(weight => (
                <div key={weight} className="flex items-center space-x-4">
                  <label className="w-20">{weight}:</label>
                  <input
                    type="text"
                    value={newProduct.weights?.[weight as WeightOption] || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        setNewProduct({
                          ...newProduct,
                          weights: {
                            ...newProduct.weights,
                            [weight]: value === '' ? 0 : parseFloat(value)
                          } as Record<WeightOption, number>
                        });
                      }
                    }}
                    className="border p-2 rounded w-32"
                    placeholder="Enter price"
                  />
                  <button
                    onClick={() => handleRemoveWeight(weight)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleAddProduct}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 md:col-span-2"
          >
            <PlusCircle className="inline-block mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow mb-4">
            {editingProduct?.id === product.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="border p-2 rounded"
                />
                <textarea
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="border p-2 rounded md:col-span-2"
                />
                
                {/* Add Min Quantity Edit Field */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    Min Quantity:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct?.minQuantity ?? product.minQuantity}
                    onChange={e => setEditingProduct({
                      ...editingProduct,
                      minQuantity: Math.max(1, parseInt(e.target.value) || 1)
                    })}
                    className="border p-2 rounded w-24"
                  />
                </div>

                {/* Add new weight input for editing */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manage Weights
                  </label>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="text"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      placeholder="Add new weight (e.g., 150gm)"
                      className="border p-2 rounded"
                    />
                    <button
                      onClick={() => {
                        if (newWeight && editingProduct) {
                          setEditingProduct({
                            ...editingProduct,
                            weights: {
                              ...editingProduct.weights,
                              [newWeight]: 0
                            } as Record<WeightOption, number>
                          });
                          setNewWeight('');
                        }
                      }}
                      className="bg-teal-600 text-white px-3 py-2 rounded hover:bg-teal-700"
                    >
                      Add Weight
                    </button>
                  </div>

                  {/* Weight prices inputs */}
                  <div className="grid gap-4">
                    {Object.entries(editingProduct.weights).map(([weight, price]) => (
                      <div key={weight} className="flex items-center space-x-4">
                        <label className="w-20">{weight}:</label>
                        <input
                          type="text"
                          value={price}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                              setEditingProduct({
                                ...editingProduct,
                                weights: {
                                  ...editingProduct.weights,
                                  [weight]: value === '' ? 0 : parseFloat(value)
                                } as Record<WeightOption, number>
                              });
                            }
                          }}
                          className="border p-2 rounded w-32"
                          placeholder="Enter price"
                        />
                        <button
                          onClick={() => {
                            const updatedWeights = { ...editingProduct.weights } as Record<string, number>;
                            delete updatedWeights[weight];
                            setEditingProduct({
                              ...editingProduct,
                              weights: updatedWeights as Record<WeightOption, number>
                            });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 md:col-span-2">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                  >
                    <Save className="inline-block mr-2" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    <X className="inline-block mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Min Quantity: {product.minQuantity}</p>
                    {Object.entries(product.weights).map(([weight, price]) => (
                      <span key={weight} className="mr-4">
                        {weight}: ₹{price}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

