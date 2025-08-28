import { Discount, CouponCode } from '../types/product';

export interface PriceCalculation {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  discountPercentage: number;
}

export interface CartCalculation {
  subtotal: number;
  discountAmount: number;
  couponDiscount: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
}

export function calculateDiscountedPrice(originalPrice: number, discount?: Discount): PriceCalculation {
  if (!discount || !discount.active) {
    return {
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      discountPercentage: 0
    };
  }

  // Check if discount is valid (within date range)
  const now = new Date();
  if (discount.start_date && new Date(discount.start_date) > now) {
    return {
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      discountPercentage: 0
    };
  }

  if (discount.end_date && new Date(discount.end_date) < now) {
    return {
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      discountPercentage: 0
    };
  }

  let discountAmount = 0;
  
  if (discount.type === 'percentage') {
    discountAmount = (originalPrice * discount.value) / 100;
  } else if (discount.type === 'fixed') {
    discountAmount = Math.min(discount.value, originalPrice);
  }

  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const discountPercentage = originalPrice > 0 ? (discountAmount / originalPrice) * 100 : 0;

  return {
    originalPrice,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
    discountPercentage: Math.round(discountPercentage * 100) / 100
  };
}

export function applyCouponCode(subtotal: number, coupon?: CouponCode): number {
  if (!coupon || !coupon.active) {
    return 0;
  }

  // Check if coupon is valid (within date range)
  const now = new Date();
  if (coupon.start_date && new Date(coupon.start_date) > now) {
    return 0;
  }

  if (coupon.end_date && new Date(coupon.end_date) < now) {
    return 0;
  }

  // Check minimum order amount
  if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
    return 0;
  }

  // Check usage limit
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return 0;
  }

  let discountAmount = 0;
  
  if (coupon.type === 'percentage') {
    discountAmount = (subtotal * coupon.value) / 100;
  } else if (coupon.type === 'fixed') {
    discountAmount = coupon.value;
  }

  // Apply maximum discount limit
  if (coupon.max_discount_amount) {
    discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
  }

  return Math.min(discountAmount, subtotal);
}

export function calculateCartTotal(
  items: Array<{
    quantity: number;
    originalPrice: number;
    discount?: Discount;
  }>,
  coupon?: CouponCode,
  shippingCost: number = 0,
  taxRate: number = 0.18 // 18% GST
): CartCalculation {
  let subtotal = 0;
  let totalDiscountAmount = 0;

  // Calculate subtotal and item discounts
  items.forEach(item => {
    const itemTotal = item.originalPrice * item.quantity;
    subtotal += itemTotal;

    const priceCalc = calculateDiscountedPrice(item.originalPrice, item.discount);
    totalDiscountAmount += priceCalc.discountAmount * item.quantity;
  });

  // Apply coupon discount
  const couponDiscount = applyCouponCode(subtotal - totalDiscountAmount, coupon);

  // Calculate tax on discounted amount
  const taxableAmount = subtotal - totalDiscountAmount - couponDiscount;
  const taxAmount = taxableAmount * taxRate;

  // Calculate final total
  const totalAmount = taxableAmount + taxAmount + shippingCost;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(totalDiscountAmount * 100) / 100,
    couponDiscount: Math.round(couponDiscount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    shippingCost: Math.round(shippingCost * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100
  };
}

export function formatPrice(amount: number, currency: string = '₹'): string {
  return `${currency}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function calculateSavings(originalPrice: number, finalPrice: number): {
  amount: number;
  percentage: number;
} {
  const amount = originalPrice - finalPrice;
  const percentage = originalPrice > 0 ? (amount / originalPrice) * 100 : 0;
  
  return {
    amount: Math.round(amount * 100) / 100,
    percentage: Math.round(percentage * 100) / 100
  };
}