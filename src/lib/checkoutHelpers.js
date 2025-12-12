// Helpers for checkout: coupons, shipping, totals, OTP utils (frontend helpers)

export const COUPONS = {
  WELCOME10: { type: 'percent', value: 10, expires: null },
  FLAT50: { type: 'flat', value: 50, expires: null }
};

export function applyCoupon(code, subtotal) {
  if (!code) return { valid: false, message: 'Enter coupon code' };
  const key = String(code).trim().toUpperCase();
  const coupon = COUPONS[key];
  if (!coupon) return { valid: false, message: 'Invalid or expired coupon' };
  if (coupon.type === 'percent') {
    const discount = (subtotal * coupon.value) / 100;
    return { valid: true, discount, newTotal: Math.max(0, subtotal - discount), message: 'Coupon applied successfully' };
  }
  if (coupon.type === 'flat') {
    const discount = coupon.value;
    return { valid: true, discount, newTotal: Math.max(0, subtotal - discount), message: 'Coupon applied successfully' };
  }
  return { valid: false, message: 'Invalid coupon type' };
}

// Shipping fee calculator based on order value tiers
export function calculateShipping(subtotal) {
  // Based on order value ranges:
  if (subtotal >= 10000) return 0; // Free shipping
  if (subtotal >= 8000) return 1000;
  if (subtotal >= 6000) return 900;
  if (subtotal >= 5000) return 750;
  if (subtotal >= 4000) return 600;
  if (subtotal >= 3500) return 480;
  if (subtotal >= 3000) return 400;
  if (subtotal >= 2500) return 350;
  if (subtotal >= 2000) return 300;
  if (subtotal >= 1500) return 250;
  if (subtotal >= 1000) return 200;
  if (subtotal >= 701) return 150;
  if (subtotal >= 300) return 120;
  return 70; // Below 300
}

// Totals calculator
export function calculateTotals(subtotal, options = {}) {
  const { giftWrap = false, couponDiscount = 0, codCharge = 0 } = options;
  const shipping = calculateShipping(subtotal);
  const gift = giftWrap ? 100 : 0; // gift wrap fixed fee
  const cod = codCharge; // COD charge if applicable
  const total = Math.max(0, subtotal - couponDiscount) + shipping + gift + cod;
  return { subtotal, shipping, gift, couponDiscount, cod, total };
}

// Helper to create UPI link (upi://pay?pa=...&pn=...)
export function makeUpiLink({ pa = 'merchant@upi', pn = 'Enpees Candles', amount = 0, tn = 'Order Payment' } = {}) {
  const url = `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(tn)}`;
  return url;
}

export default {
  applyCoupon,
  calculateShipping,
  calculateTotals,
  makeUpiLink
};
