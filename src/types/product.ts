export type WeightOption = '50gm' | '75gm' | '100gm';

export interface Discount {
  id: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  start_date?: string;
  end_date?: string;
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  image_url: string;
  min_quantity: number;
  weights: {
    [key: string]: number;
  };
  discount_id?: string;
  discount?: Discount;
  stock_quantity?: number;
  sku?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductWithVariants {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  category: string;
  weights: Record<WeightOption, number>;
  discount?: Discount;
}

export interface CouponCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  start_date?: string;
  end_date?: string;
  active: boolean;
  created_at: string;
}