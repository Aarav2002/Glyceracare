export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  weight: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total_price: number;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  order_number: string;
  email: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  
  // Pricing
  subtotal: number;
  discount_amount: number;
  coupon_discount: number;
  tax_amount: number;
  shipping_cost: number;
  total_amount: number;
  
  // Shipping
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  shipping_method: string;
  
  // Payment
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  payment_id?: string;
  
  // Coupon
  coupon_code?: string;
  
  // Dates
  created_at: string;
  updated_at: string;
  shipped_at?: string;
  delivered_at?: string;
  
  // Notes
  notes?: string;
  admin_notes?: string;
}

export interface CheckoutFormData {
  email: string;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  use_same_address: boolean;
  shipping_method: string;
  payment_method: string;
  coupon_code?: string;
  notes?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  cost: number;
  estimated_days: string;
  active: boolean;
}