import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Discount } from '../../types/product';
import { PlusCircle, Edit, Trash, Save, X, Percent, DollarSign } from 'lucide-react';

export function DiscountManager() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({
    type: 'percentage',
    value: 0,
    description: '',
    active: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscounts(data || []);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDiscount = async () => {
    if (!newDiscount.description || !newDiscount.value) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('discounts')
        .insert([{
          type: newDiscount.type,
          value: newDiscount.value,
          description: newDiscount.description,
          start_date: newDiscount.start_date,
          end_date: newDiscount.end_date,
          active: newDiscount.active
        }])
        .select()
        .single();

      if (error) throw error;

      setDiscounts([data, ...discounts]);
      setNewDiscount({
        type: 'percentage',
        value: 0,
        description: '',
        active: true
      });

      alert('Discount created successfully!');
    } catch (error) {
      console.error('Error adding discount:', error);
      alert('Failed to create discount');
    }
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
  };

  const handleSaveEdit = async () => {
    if (!editingDiscount) return;

    try {
      const { data, error } = await supabase
        .from('discounts')
        .update({
          type: editingDiscount.type,
          value: editingDiscount.value,
          description: editingDiscount.description,
          start_date: editingDiscount.start_date,
          end_date: editingDiscount.end_date,
          active: editingDiscount.active
        })
        .eq('id', editingDiscount.id)
        .select()
        .single();

      if (error) throw error;

      setDiscounts(discounts.map(d => d.id === data.id ? data : d));
      setEditingDiscount(null);
      alert('Discount updated successfully!');
    } catch (error) {
      console.error('Error updating discount:', error);
      alert('Failed to update discount');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this discount?')) return;

    try {
      const { error } = await supabase
        .from('discounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDiscounts(discounts.filter(d => d.id !== id));
      alert('Discount deleted successfully!');
    } catch (error) {
      console.error('Error deleting discount:', error);
      alert('Failed to delete discount');
    }
  };

  const toggleActive = async (discount: Discount) => {
    try {
      const { data, error } = await supabase
        .from('discounts')
        .update({ active: !discount.active })
        .eq('id', discount.id)
        .select()
        .single();

      if (error) throw error;

      setDiscounts(discounts.map(d => d.id === data.id ? data : d));
    } catch (error) {
      console.error('Error toggling discount status:', error);
    }
  };

  if (loading) return <div className="p-6">Loading discounts...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Discount Management</h2>
      
      {/* Add New Discount Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Create New Discount</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type
            </label>
            <select
              value={newDiscount.type}
              onChange={e => setNewDiscount({...newDiscount, type: e.target.value as 'percentage' | 'fixed'})}
              className="w-full border p-2 rounded"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step={newDiscount.type === 'percentage' ? '1' : '0.01'}
                max={newDiscount.type === 'percentage' ? '100' : undefined}
                value={newDiscount.value}
                onChange={e => setNewDiscount({...newDiscount, value: parseFloat(e.target.value) || 0})}
                className="w-full border p-2 rounded pl-8"
                placeholder="Enter value"
              />
              <div className="absolute left-2 top-2 text-gray-500">
                {newDiscount.type === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={newDiscount.description}
              onChange={e => setNewDiscount({...newDiscount, description: e.target.value})}
              className="w-full border p-2 rounded"
              placeholder="e.g., Summer Sale"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date (Optional)
            </label>
            <input
              type="date"
              value={newDiscount.start_date || ''}
              onChange={e => setNewDiscount({...newDiscount, start_date: e.target.value})}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={newDiscount.end_date || ''}
              onChange={e => setNewDiscount({...newDiscount, end_date: e.target.value})}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={newDiscount.active}
              onChange={e => setNewDiscount({...newDiscount, active: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>
        </div>
        
        <button
          onClick={handleAddDiscount}
          className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Discount
        </button>
      </div>

      {/* Discounts List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Existing Discounts</h3>
        {discounts.map(discount => (
          <div key={discount.id} className="bg-white p-4 rounded-lg shadow">
            {editingDiscount?.id === discount.id ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <select
                    value={editingDiscount.type}
                    onChange={e => setEditingDiscount({...editingDiscount, type: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full border p-2 rounded"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    step={editingDiscount.type === 'percentage' ? '1' : '0.01'}
                    max={editingDiscount.type === 'percentage' ? '100' : undefined}
                    value={editingDiscount.value}
                    onChange={e => setEditingDiscount({...editingDiscount, value: parseFloat(e.target.value) || 0})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={editingDiscount.description}
                    onChange={e => setEditingDiscount({...editingDiscount, description: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={editingDiscount.start_date || ''}
                    onChange={e => setEditingDiscount({...editingDiscount, start_date: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={editingDiscount.end_date || ''}
                    onChange={e => setEditingDiscount({...editingDiscount, end_date: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingDiscount.active}
                    onChange={e => setEditingDiscount({...editingDiscount, active: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm">Active</span>
                </div>
                <div className="md:col-span-3 flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingDiscount(null)}
                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold">{discount.description}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      discount.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {discount.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Discount:</strong> {discount.value}
                      {discount.type === 'percentage' ? '%' : '₹'} off
                    </p>
                    {discount.start_date && (
                      <p><strong>Start:</strong> {new Date(discount.start_date).toLocaleDateString()}</p>
                    )}
                    {discount.end_date && (
                      <p><strong>End:</strong> {new Date(discount.end_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleActive(discount)}
                    className={`px-3 py-1 rounded text-sm ${
                      discount.active 
                        ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {discount.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(discount)}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(discount.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {discounts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No discounts created yet. Create your first discount above.
          </div>
        )}
      </div>
    </div>
  );
}