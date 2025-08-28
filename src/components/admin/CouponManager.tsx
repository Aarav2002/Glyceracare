import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CouponCode } from '../../types/product';
import { PlusCircle, Edit, Trash, Save, X, Percent, DollarSign, Users, Calendar } from 'lucide-react';

export function CouponManager() {
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [editingCoupon, setEditingCoupon] = useState<CouponCode | null>(null);
  const [newCoupon, setNewCoupon] = useState<Partial<CouponCode>>({
    code: '',
    type: 'percentage',
    value: 0,
    description: '',
    min_order_amount: 0,
    max_discount_amount: 0,
    usage_limit: 0,
    used_count: 0,
    active: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coupon_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon({ ...newCoupon, code: result });
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.description || !newCoupon.value) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('coupon_codes')
        .insert([{
          code: newCoupon.code.toUpperCase(),
          type: newCoupon.type,
          value: newCoupon.value,
          description: newCoupon.description,
          min_order_amount: newCoupon.min_order_amount || null,
          max_discount_amount: newCoupon.max_discount_amount || null,
          usage_limit: newCoupon.usage_limit || null,
          used_count: 0,
          start_date: newCoupon.start_date,
          end_date: newCoupon.end_date,
          active: newCoupon.active
        }])
        .select()
        .single();

      if (error) throw error;

      setCoupons([data, ...coupons]);
      setNewCoupon({
        code: '',
        type: 'percentage',
        value: 0,
        description: '',
        min_order_amount: 0,
        max_discount_amount: 0,
        usage_limit: 0,
        used_count: 0,
        active: true
      });

      alert('Coupon created successfully!');
    } catch (error: any) {
      console.error('Error adding coupon:', error);
      if (error.code === '23505') {
        alert('Coupon code already exists. Please use a different code.');
      } else {
        alert('Failed to create coupon');
      }
    }
  };

  const handleEdit = (coupon: CouponCode) => {
    setEditingCoupon(coupon);
  };

  const handleSaveEdit = async () => {
    if (!editingCoupon) return;

    try {
      const { data, error } = await supabase
        .from('coupon_codes')
        .update({
          code: editingCoupon.code.toUpperCase(),
          type: editingCoupon.type,
          value: editingCoupon.value,
          description: editingCoupon.description,
          min_order_amount: editingCoupon.min_order_amount || null,
          max_discount_amount: editingCoupon.max_discount_amount || null,
          usage_limit: editingCoupon.usage_limit || null,
          start_date: editingCoupon.start_date,
          end_date: editingCoupon.end_date,
          active: editingCoupon.active
        })
        .eq('id', editingCoupon.id)
        .select()
        .single();

      if (error) throw error;

      setCoupons(coupons.map(c => c.id === data.id ? data : c));
      setEditingCoupon(null);
      alert('Coupon updated successfully!');
    } catch (error: any) {
      console.error('Error updating coupon:', error);
      if (error.code === '23505') {
        alert('Coupon code already exists. Please use a different code.');
      } else {
        alert('Failed to update coupon');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const { error } = await supabase
        .from('coupon_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCoupons(coupons.filter(c => c.id !== id));
      alert('Coupon deleted successfully!');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  const toggleActive = async (coupon: CouponCode) => {
    try {
      const { data, error } = await supabase
        .from('coupon_codes')
        .update({ active: !coupon.active })
        .eq('id', coupon.id)
        .select()
        .single();

      if (error) throw error;

      setCoupons(coupons.map(c => c.id === data.id ? data : c));
    } catch (error) {
      console.error('Error toggling coupon status:', error);
    }
  };

  const isExpired = (coupon: CouponCode) => {
    if (!coupon.end_date) return false;
    return new Date(coupon.end_date) < new Date();
  };

  const isUsageLimitReached = (coupon: CouponCode) => {
    if (!coupon.usage_limit) return false;
    return coupon.used_count >= coupon.usage_limit;
  };

  if (loading) return <div className="p-6">Loading coupons...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Coupon Code Management</h2>
      
      {/* Add New Coupon Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Create New Coupon</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Code *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCoupon.code}
                onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                className="flex-1 border p-2 rounded uppercase"
                placeholder="WELCOME10"
                maxLength={20}
              />
              <button
                onClick={generateCouponCode}
                className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 text-sm"
              >
                Generate
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type *
            </label>
            <select
              value={newCoupon.type}
              onChange={e => setNewCoupon({...newCoupon, type: e.target.value as 'percentage' | 'fixed'})}
              className="w-full border p-2 rounded"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value *
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step={newCoupon.type === 'percentage' ? '1' : '0.01'}
                max={newCoupon.type === 'percentage' ? '100' : undefined}
                value={newCoupon.value}
                onChange={e => setNewCoupon({...newCoupon, value: parseFloat(e.target.value) || 0})}
                className="w-full border p-2 rounded pl-8"
                placeholder="Enter value"
              />
              <div className="absolute left-2 top-2 text-gray-500">
                {newCoupon.type === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              value={newCoupon.description}
              onChange={e => setNewCoupon({...newCoupon, description: e.target.value})}
              className="w-full border p-2 rounded"
              placeholder="e.g., Welcome discount for new customers"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Order Amount (Optional)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newCoupon.min_order_amount}
              onChange={e => setNewCoupon({...newCoupon, min_order_amount: parseFloat(e.target.value) || 0})}
              className="w-full border p-2 rounded"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Discount Amount (Optional)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newCoupon.max_discount_amount}
              onChange={e => setNewCoupon({...newCoupon, max_discount_amount: parseFloat(e.target.value) || 0})}
              className="w-full border p-2 rounded"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage Limit (Optional)
            </label>
            <input
              type="number"
              min="0"
              value={newCoupon.usage_limit}
              onChange={e => setNewCoupon({...newCoupon, usage_limit: parseInt(e.target.value) || 0})}
              className="w-full border p-2 rounded"
              placeholder="0 = Unlimited"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date (Optional)
            </label>
            <input
              type="date"
              value={newCoupon.start_date || ''}
              onChange={e => setNewCoupon({...newCoupon, start_date: e.target.value})}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={newCoupon.end_date || ''}
              onChange={e => setNewCoupon({...newCoupon, end_date: e.target.value})}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={newCoupon.active}
              onChange={e => setNewCoupon({...newCoupon, active: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>
        </div>
        
        <button
          onClick={handleAddCoupon}
          className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Coupon
        </button>
      </div>

      {/* Coupons List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Existing Coupons</h3>
        {coupons.map(coupon => (
          <div key={coupon.id} className="bg-white p-4 rounded-lg shadow">
            {editingCoupon?.id === coupon.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={editingCoupon.code}
                    onChange={e => setEditingCoupon({...editingCoupon, code: e.target.value.toUpperCase()})}
                    className="border p-2 rounded uppercase"
                  />
                  <select
                    value={editingCoupon.type}
                    onChange={e => setEditingCoupon({...editingCoupon, type: e.target.value as 'percentage' | 'fixed'})}
                    className="border p-2 rounded"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                  <input
                    type="number"
                    value={editingCoupon.value}
                    onChange={e => setEditingCoupon({...editingCoupon, value: parseFloat(e.target.value) || 0})}
                    className="border p-2 rounded"
                  />
                </div>
                <input
                  type="text"
                  value={editingCoupon.description}
                  onChange={e => setEditingCoupon({...editingCoupon, description: e.target.value})}
                  className="w-full border p-2 rounded"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="number"
                    value={editingCoupon.min_order_amount || ''}
                    onChange={e => setEditingCoupon({...editingCoupon, min_order_amount: parseFloat(e.target.value) || undefined})}
                    className="border p-2 rounded"
                    placeholder="Min order amount"
                  />
                  <input
                    type="number"
                    value={editingCoupon.max_discount_amount || ''}
                    onChange={e => setEditingCoupon({...editingCoupon, max_discount_amount: parseFloat(e.target.value) || undefined})}
                    className="border p-2 rounded"
                    placeholder="Max discount amount"
                  />
                  <input
                    type="number"
                    value={editingCoupon.usage_limit || ''}
                    onChange={e => setEditingCoupon({...editingCoupon, usage_limit: parseInt(e.target.value) || undefined})}
                    className="border p-2 rounded"
                    placeholder="Usage limit"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={editingCoupon.start_date || ''}
                    onChange={e => setEditingCoupon({...editingCoupon, start_date: e.target.value})}
                    className="border p-2 rounded"
                  />
                  <input
                    type="date"
                    value={editingCoupon.end_date || ''}
                    onChange={e => setEditingCoupon({...editingCoupon, end_date: e.target.value})}
                    className="border p-2 rounded"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingCoupon.active}
                    onChange={e => setEditingCoupon({...editingCoupon, active: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm">Active</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCoupon(null)}
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
                    <h4 className="font-bold text-lg font-mono bg-gray-100 px-2 py-1 rounded">
                      {coupon.code}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                    {isExpired(coupon) && (
                      <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                        Expired
                      </span>
                    )}
                    {isUsageLimitReached(coupon) && (
                      <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">
                        Limit Reached
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{coupon.description}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Discount:</strong> {coupon.value}
                      {coupon.type === 'percentage' ? '%' : '₹'} off
                    </p>
                    {coupon.min_order_amount && (
                      <p><strong>Min Order:</strong> ₹{coupon.min_order_amount}</p>
                    )}
                    {coupon.max_discount_amount && (
                      <p><strong>Max Discount:</strong> ₹{coupon.max_discount_amount}</p>
                    )}
                    <div className="flex items-center space-x-4">
                      {coupon.usage_limit && (
                        <p className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {coupon.used_count}/{coupon.usage_limit} used
                        </p>
                      )}
                      {coupon.end_date && (
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Expires: {new Date(coupon.end_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleActive(coupon)}
                    className={`px-3 py-1 rounded text-sm ${
                      coupon.active 
                        ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {coupon.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {coupons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No coupons created yet. Create your first coupon above.
          </div>
        )}
      </div>
    </div>
  );
}