import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckoutFormData, ShippingAddress, ShippingMethod } from '../types/order';
import { calculateCartTotal, formatPrice, applyCouponCode } from '../utils/priceCalculations';
import { CouponCode } from '../types/product';
import { supabase } from '../lib/supabase';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Lock,
  Tag,
  ShoppingBag,
  CheckCircle,
  LogIn,
  AlertCircle
} from 'lucide-react';

export function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: user?.email || '',
    shipping_address: {
      first_name: '',
      last_name: '',
      company: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      phone: ''
    },
    use_same_address: true,
    shipping_method: 'standard',
    payment_method: 'razorpay',
    coupon_code: '',
    notes: ''
  });

  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const shippingMethods: ShippingMethod[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      cost: 0,
      estimated_days: '5-7 days',
      active: true
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      cost: 150,
      estimated_days: '2-3 days',
      active: true
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Next business day',
      cost: 300,
      estimated_days: '1 day',
      active: true
    }
  ];

  const selectedShippingMethod = shippingMethods.find(m => m.id === formData.shipping_method);
  const shippingCost = selectedShippingMethod?.cost || 0;

  // Calculate cart totals
  const cartItems = items.map(item => ({
    quantity: item.quantity,
    originalPrice: item.originalPrice || parseFloat(item.price.replace('₹', '')),
    discount: undefined // Product discounts already applied in price
  }));

  const cartCalculation = calculateCartTotal(cartItems, appliedCoupon || undefined, shippingCost);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // Authentication validation - redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      // User is not logged in
      return;
    }
  }, [user]);

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to proceed with checkout. Please sign in to continue with your purchase.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 transition-colors font-medium flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Go to Login
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Back to Cart
            </button>
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Why do I need to login?</strong><br />
              We need your account information to process your order, send confirmation emails, and provide order tracking.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (section: keyof CheckoutFormData, field: string, value: any) => {
    if (section === 'shipping_address') {
      setFormData(prev => ({
        ...prev,
        shipping_address: {
          ...prev.shipping_address,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const applyCoupon = async () => {
    if (!formData.coupon_code?.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('coupon_codes')
        .select('*')
        .eq('code', formData.coupon_code!.toUpperCase())
        .eq('active', true)
        .single();

      if (error || !data) {
        setCouponError('Invalid coupon code');
        return;
      }

      const discountAmount = applyCouponCode(cartCalculation.subtotal, data);
      if (discountAmount === 0) {
        setCouponError('Coupon is not applicable to this order');
        return;
      }

      setAppliedCoupon(data);
      setCouponError('');
    } catch (error) {
      setCouponError('Error applying coupon');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setFormData(prev => ({ ...prev, coupon_code: '' }));
    setCouponError('');
  };

  const validateForm = (): boolean => {
    // Double-check authentication before placing order
    if (!user) {
      alert('You must be logged in to place an order');
      navigate('/');
      return false;
    }

    const { shipping_address } = formData;
    const required = ['first_name', 'last_name', 'address_line_1', 'city', 'state', 'postal_code'];
    
    for (const field of required) {
      if (!shipping_address[field as keyof ShippingAddress]) {
        alert(`Please fill in ${field.replace('_', ' ')}`);
        return false;
      }
    }

    if (!formData.email) {
      alert('Please provide an email address');
      return false;
    }

    return true;
  };

  const placeOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderNumber = `GC${Date.now()}`;
      const finalCalculation = calculateCartTotal(cartItems, appliedCoupon || undefined, shippingCost);

      const orderData = {
        order_number: orderNumber,
        user_id: user?.id,
        status: 'pending',
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          weight: item.weight,
          quantity: item.quantity,
          unit_price: item.originalPrice || parseFloat(item.price.replace('₹', '')),
          discount_amount: item.discount || 0,
          total_price: (item.originalPrice || parseFloat(item.price.replace('₹', ''))) * item.quantity
        })),
        subtotal: finalCalculation.subtotal,
        discount_amount: finalCalculation.discountAmount,
        coupon_discount: finalCalculation.couponDiscount,
        tax_amount: finalCalculation.taxAmount,
        shipping_cost: finalCalculation.shippingCost,
        total_amount: finalCalculation.totalAmount,
        shipping_address: formData.shipping_address,
        shipping_method: formData.shipping_method,
        payment_status: 'pending',
        payment_method: formData.payment_method,
        coupon_code: appliedCoupon?.code,
        notes: formData.notes
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      // Update coupon usage if applied
      if (appliedCoupon) {
        await supabase
          .from('coupon_codes')
          .update({ used_count: appliedCoupon.used_count + 1 })
          .eq('id', appliedCoupon.id);
      }

      setOrderId(data.id);
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono text-lg font-semibold text-gray-900">{orderId}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Information
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email' as any, 'email', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address.first_name}
                      onChange={(e) => handleInputChange('shipping_address', 'first_name', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address.last_name}
                      onChange={(e) => handleInputChange('shipping_address', 'last_name', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address.company}
                      onChange={(e) => handleInputChange('shipping_address', 'company', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address.address_line_1}
                      onChange={(e) => handleInputChange('shipping_address', 'address_line_1', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address.address_line_2}
                      onChange={(e) => handleInputChange('shipping_address', 'address_line_2', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address.city}
                      onChange={(e) => handleInputChange('shipping_address', 'city', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address.state}
                      onChange={(e) => handleInputChange('shipping_address', 'state', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address.postal_code}
                      onChange={(e) => handleInputChange('shipping_address', 'postal_code', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.shipping_address.phone}
                      onChange={(e) => handleInputChange('shipping_address', 'phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Method
                </h2>
                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <label key={method.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="shipping_method"
                        value={method.id}
                        checked={formData.shipping_method === method.id}
                        onChange={(e) => handleInputChange('shipping_method' as any, 'shipping_method', e.target.value)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{method.name}</span>
                          <span className="font-medium">
                            {method.cost === 0 ? 'Free' : formatPrice(method.cost)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="razorpay"
                      checked={formData.payment_method === 'razorpay'}
                      onChange={(e) => handleInputChange('payment_method' as any, 'payment_method', e.target.value)}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <span className="font-medium">Credit/Debit Card</span>
                      <p className="text-sm text-gray-500">Secure payment via Razorpay</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={formData.payment_method === 'cod'}
                      onChange={(e) => handleInputChange('payment_method' as any, 'payment_method', e.target.value)}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Order Summary
                </h2>
                
                {/* Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.weight}`} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500">{item.weight} × {item.quantity}</p>
                      </div>
                      <p className="font-medium">{item.price}</p>
                    </div>
                  ))}
                </div>

                {/* Coupon Code */}
                <div className="border-t pt-4 mb-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    Coupon Code
                  </h3>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-2">
                      <span className="text-green-800 font-medium">{appliedCoupon.code}</span>
                      <button
                        onClick={removeCoupon}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.coupon_code}
                        onChange={(e) => handleInputChange('coupon_code' as any, 'coupon_code', e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                      <button
                        onClick={applyCoupon}
                        className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-red-600 text-sm mt-1">{couponError}</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartCalculation.subtotal)}</span>
                  </div>
                  {cartCalculation.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Product Discounts</span>
                      <span>-{formatPrice(cartCalculation.discountAmount)}</span>
                    </div>
                  )}
                  {cartCalculation.couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon Discount</span>
                      <span>-{formatPrice(cartCalculation.couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST 18%)</span>
                    <span>{formatPrice(cartCalculation.taxAmount)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(cartCalculation.totalAmount)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 transition-colors font-medium flex items-center justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Lock className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-2">
                  Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}