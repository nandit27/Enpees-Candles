import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { applyCoupon, calculateTotals } from '../lib/checkoutHelpers';
import { API_ENDPOINTS } from '../config/api';

const availableColors = ['Natural Beige', 'Ivory White', 'Soft Pink', 'Charcoal Grey', 'Others'];
const availableFragrances = ['Woody Flora', 'Peach Miami', 'Jasmine', 'Mogra', 'Berry Blast', 'Kesar Chandan', 'British Rose', 'Vanilla', 'English Lavender'];

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart, updateQuantity, updateColorFragrance, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        address1: '',
        address2: '',
        landmark: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [errors, setErrors] = useState({});
    const [couponCode, setCouponCode] = useState('');
    const [couponResult, setCouponResult] = useState(null);
    const [giftWrap, setGiftWrap] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'
    const [courierCompany, setCourierCompany] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };



    const validateForm = () => {
        const errs = {};
        
        // Name validation
        if (!formData.name || formData.name.trim().length < 2) {
            errs.name = 'Please enter full name (minimum 2 characters)';
        }
        
        // Strict mobile validation (Indian format)
        if (!formData.mobile) {
            errs.mobile = 'Mobile number is required';
        } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
            errs.mobile = 'Enter valid 10-digit Indian mobile number starting with 6-9';
        }
        
        // Email validation (optional, but validate format if provided)
        if (formData.email && formData.email.trim()) {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(formData.email)) {
                errs.email = 'Enter a valid email address (e.g., name@example.com)';
            } else if (formData.email.length > 254) {
                errs.email = 'Email address is too long';
            }
        }
        
        // Address validation
        if (!formData.address1 || formData.address1.trim().length < 5) {
            errs.address1 = 'Enter complete address (minimum 5 characters)';
        }
        
        if (!formData.city || formData.city.trim().length < 2) {
            errs.city = 'City is required';
        }
        
        if (!formData.state) {
            errs.state = 'State is required';
        }
        
        // Pincode validation (5-6 digits)
        if (!formData.pincode) {
            errs.pincode = 'Pincode is required';
        } else if (!/^\d{5,6}$/.test(formData.pincode)) {
            errs.pincode = 'Enter valid 5-6 digit pincode';
        }
        
        // Terms validation
        if (!termsAccepted) {
            errs.terms = 'Please accept terms and conditions to proceed';
        }
        
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        const subtotal = getCartTotal();
        const couponDiscount = couponResult && couponResult.valid ? couponResult.discount : 0;
        const codCharge = paymentMethod === 'cod' ? 50 : 0;
        const totals = calculateTotals(subtotal, { giftWrap, couponDiscount, codCharge });

        const orderData = {
            customer: formData,
            items: cartItems,
            totals,
            status: 'Pending',
            giftWrapApplied: giftWrap,
            coupon: couponResult && couponResult.valid ? couponCode.trim().toUpperCase() : null,
            paymentMethod,
            courierCompany: courierCompany || 'Standard',
            termsAccepted
        };

        try {
            // For online payments, don't create order yet - pass data to payment page
            // For COD, create order immediately
            if (paymentMethod === 'cod') {
                const response = await fetch(API_ENDPOINTS.ORDERS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

                if (response.ok) {
                    const created = await response.json();
                    clearCart();
                    toast.success('Order placed successfully! You will pay on delivery.', { duration: 3000 });
                    navigate('/order-confirmation', { state: { order: created } });
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.error || 'Failed to place order. Please try again.');
                }
            } else {
                // Online payment - pass order data without creating order
                clearCart();
                toast.success('Proceed to payment', { duration: 2500 });
                navigate('/payment', { state: { orderData: orderData } });
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Error placing order. Please try again.');
        }
    };



    if (cartItems.length === 0) {
        return (
            <div className="lp relative min-h-[100dvh] w-full bg-[#2A1D15] text-[#EDE6D8]">
                <Navbar />
                <main className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-10 lg:px-16">
                    <h1 className="lp-display text-4xl leading-[1.1] md:text-5xl">Your bag is empty</h1>
                    <p className="lp-lede mt-4 max-w-[65ch] text-[#C7BCA8]">
                        Add a candle from the shop, then come back to check out.
                    </p>
                    <Link to="/shop" className="lp-btn lp-btn-primary mt-8">
                        Shop candles
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="lp relative min-h-[100dvh] w-full bg-[#2A1D15] text-[#EDE6D8]">
            <Navbar />
            <div className="mx-auto w-full max-w-[1400px] px-5 pb-24 pt-10 sm:px-10 lg:px-16">
                    <header className="max-w-xl">
                        <h1 className="lp-display text-4xl leading-[1.1] md:text-5xl">Checkout</h1>
                        <p className="lp-lede mt-4 max-w-[65ch] text-[#C7BCA8]">
                            Confirm the bag, then tell us where to send it.
                        </p>
                    </header>

                    <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Checkout Form */}
                        <div className="order-2 lg:order-1">
                            <div className="rounded-[20px] bg-[#3B2A1E] p-5 sm:p-8">
                                <h2 className="lp-display text-2xl leading-[1.1] sm:text-3xl">
                                    Shipping
                                </h2>
                            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="mb-2 block font-jost text-sm text-[#C7BCA8]">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className={`lp-field ${errors.name ? '!border-[#E8B4B4]' : ''}`}
                                        />
                                        {errors.name && <p className="text-xs text-[#E8B4B4] mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block font-jost text-sm text-[#C7BCA8]">Mobile Number *</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            required
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            placeholder="Enter 10-digit mobile"
                                            className={`lp-field ${errors.mobile ? '!border-[#E8B4B4]' : ''}`}
                                        />
                                        {errors.mobile && <p className="text-xs text-[#E8B4B4] mt-1">{errors.mobile}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block font-jost text-sm text-[#C7BCA8]">Email Address (Optional)</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your.email@example.com"
                                            className={`lp-field ${errors.email ? '!border-[#E8B4B4]' : ''}`}
                                        />
                                        {errors.email && <p className="text-xs text-[#E8B4B4] mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block font-jost text-sm text-[#C7BCA8]">Address Line 1 *</label>
                                        <input
                                            type="text"
                                            name="address1"
                                            required
                                            value={formData.address1}
                                            onChange={handleChange}
                                            placeholder="House number and street name"
                                            className={`lp-field ${errors.address1 ? '!border-[#E8B4B4]' : ''}`}
                                        />
                                        {errors.address1 && <p className="text-xs text-[#E8B4B4] mt-1">{errors.address1}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block font-jost text-sm text-[#C7BCA8]">Address Line 2 (optional)</label>
                                        <input type="text" name="address2" value={formData.address2} onChange={handleChange} className="lp-field" />
                                    </div>

                                    <div>
                                        <label className="mb-2 block font-jost text-sm text-[#C7BCA8]">Landmark (optional)</label>
                                        <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="lp-field" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-1">
                                            <label className="mb-2 block font-jost text-sm text-[#C7BCA8]">City *</label>
                                            <input type="text" name="city" value={formData.city} onChange={handleChange} className={`lp-field ${errors.city ? '!border-[#E8B4B4]' : ''}`} />
                                            {errors.city && <p className="mt-1 font-jost text-xs text-[#E8B4B4]">{errors.city}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="mb-2 block font-jost text-sm text-[#C7BCA8]">State *</label>
                                            <select name="state" value={formData.state} onChange={handleChange} className={`lp-field ${errors.state ? '!border-[#E8B4B4]' : ''}`}>
                                                <option value="">Select state</option>
                                                <option>Andhra Pradesh</option>
                                                <option>Arunachal Pradesh</option>
                                                <option>Assam</option>
                                                <option>Bihar</option>
                                                <option>Chhattisgarh</option>
                                                <option>Goa</option>
                                                <option>Gujarat</option>
                                                <option>Haryana</option>
                                                <option>Himachal Pradesh</option>
                                                <option>Jharkhand</option>
                                                <option>Karnataka</option>
                                                <option>Kerala</option>
                                                <option>Madhya Pradesh</option>
                                                <option>Maharashtra</option>
                                                <option>Manipur</option>
                                                <option>Meghalaya</option>
                                                <option>Mizoram</option>
                                                <option>Nagaland</option>
                                                <option>Odisha</option>
                                                <option>Punjab</option>
                                                <option>Rajasthan</option>
                                                <option>Sikkim</option>
                                                <option>Tamil Nadu</option>
                                                <option>Telangana</option>
                                                <option>Tripura</option>
                                                <option>Uttar Pradesh</option>
                                                <option>Uttarakhand</option>
                                                <option>West Bengal</option>
                                                <option>Andaman and Nicobar Islands</option>
                                                <option>Chandigarh</option>
                                                <option>Dadra and Nagar Haveli and Daman and Diu</option>
                                                <option>Delhi</option>
                                                <option>Jammu and Kashmir</option>
                                                <option>Ladakh</option>
                                                <option>Lakshadweep</option>
                                                <option>Puducherry</option>
                                            </select>
                                            {errors.state && <p className="text-xs text-[#E8B4B4] mt-1">{errors.state}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="mb-2 block font-jost text-sm text-[#C7BCA8]">Pincode *</label>
                                            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className={`lp-field ${errors.pincode ? '!border-[#E8B4B4]' : ''}`} />
                                            {errors.pincode && <p className="mt-1 font-jost text-xs text-[#E8B4B4]">{errors.pincode}</p>}
                                        </div>
                                    </div>

                                    {/* Payment Method Selection */}
                                    <div className="p-4 rounded-xl bg-[#3B2A23]/50 border border-[#FFF7ED]/10">
                                        <label className="block text-sm font-semibold mb-3 text-[#EAD2C0]">Payment Method *</label>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 p-3 rounded-lg border border-[#FFF7ED]/20 hover:border-[#D8A24A]/50 cursor-pointer transition-all">
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    value="online" 
                                                    checked={paymentMethod === 'online'} 
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="w-4 h-4"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-white">Online Payment (UPI/QR)</p>
                                                    <p className="text-xs text-[#EAD2C0]">Pay via UPI, QR code</p>
                                                </div>
                                            </label>
                                            {/* <label className="flex items-center gap-3 p-3 rounded-lg border border-[#FFF7ED]/20 hover:border-[#D8A24A]/50 cursor-pointer transition-all">
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    value="cod" 
                                                    checked={paymentMethod === 'cod'} 
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="w-4 h-4"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-white">Cash on Delivery (COD)</p>
                                                    <p className="text-xs text-[#EAD2C0]">Pay when you receive (+₹50 extra)</p>
                                                </div>
                                            </label> */}
                                        </div>
                                    </div>

                                    {/* Courier Company Selection */}
                                    <div>
                                        <label className="mb-2 block font-jost text-sm text-[#C7BCA8]">
                                            Courier Preference (Optional)
                                            <span className="text-xs font-normal ml-2 text-[#EAD2C0]/70">For special courier, please specify</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={courierCompany}
                                            onChange={(e) => setCourierCompany(e.target.value)}
                                            placeholder="e.g., Blue Dart, DTDC, or leave blank for standard"
                                            className="lp-field"
                                        />
                                    </div>

                                    {/* Terms and Conditions */}
                                    <div className="p-4 rounded-xl bg-[#3B2A23]/50 border border-[#FFF7ED]/10">
                                        <div className="flex items-start gap-3">
                                            <input 
                                                id="terms" 
                                                type="checkbox" 
                                                checked={termsAccepted} 
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                className="w-4 h-4 mt-1"
                                            />
                                            <label htmlFor="terms" className="text-sm text-[#EAD2C0] flex-1">
                                                I accept the{' '}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowTermsModal(true)}
                                                    className="text-[#D3A34E] underline hover:text-[#EDE6D8]"
                                                >
                                                    Terms and Conditions
                                                </button>
                                            </label>
                                        </div>
                                        {errors.terms && <p className="text-xs text-[#E8B4B4] mt-2 ml-7">{errors.terms}</p>}
                                    </div>

                                    <button type="submit" className="lp-btn lp-btn-primary mt-4 w-full">
                                        Place order
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="order-1 lg:order-2">
                            <div className="rounded-[20px] bg-[#3B2A1E] p-5 sm:p-8 lg:sticky lg:top-24">
                                <h2 className="lp-display text-2xl leading-[1.1] sm:text-3xl">
                                    Your bag
                                </h2>
                                <div className="mt-6 space-y-3 sm:space-y-4 max-h-[min(50vh,400px)] overflow-y-auto pr-1">
                                    {cartItems.map((item, index) => {
                                        // Handle both numbers (new) and strings (old legacy data)
                                        // Use offer price if available
                                        const rawPrice = item.offerPrice || item.price;
                                        const itemPrice = typeof rawPrice === 'number'
                                            ? rawPrice
                                            : parseFloat(String(rawPrice).replace(/[^0-9.]/g, "")) || 0;
                                        const regularPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
                                        const itemTotal = itemPrice * item.quantity;
                                        const itemId = item.id || item._id || item.name;
                                        return (
                                            <div key={index} className="flex flex-col gap-3 p-4 rounded-lg bg-[#3B2A23]/50 border border-[#FFF7ED]/10 hover:border-[#D8A24A]/50 transition-all">
                                                {/* Top row with image, name, and delete button */}
                                                <div className="flex items-start gap-4">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                                        />
                                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-[#FFF7ED]">{item.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {item.offerPrice ? (
                                                <>
                                                    <span className="text-sm font-bold text-[#D3A34E]">₹{item.offerPrice}</span>
                                                    <span className="text-xs text-[#EAD2C0]/60 line-through">₹{regularPrice.toFixed(2)}</span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-[#EAD2C0]">₹{itemPrice.toFixed(2)}</span>
                                            )}
                                        </div>                                                        {/* Color and Fragrance Selection */}
                                                        <div className="mt-2 space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <label className="text-xs text-[#EAD2C0] min-w-[60px]">Color:</label>
                                                                <select
                                                                    value={availableColors.includes(item.color) ? item.color : 'Others'}
                                                                    onChange={(e) => {
                                                                        if (e.target.value !== 'Others') {
                                                                            updateColorFragrance(
                                                                                itemId, 
                                                                                item.color, 
                                                                                item.fragrance,
                                                                                e.target.value,
                                                                                item.fragrance
                                                                            );
                                                                        } else {
                                                                            // Switch to Others mode
                                                                            updateColorFragrance(
                                                                                itemId, 
                                                                                item.color, 
                                                                                item.fragrance,
                                                                                '',
                                                                                item.fragrance
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="lp-field !min-h-10 flex-1 py-2 text-sm"
                                                                >
                                                                    {availableColors.map(color => (
                                                                        <option key={color} value={color}>{color}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            {!availableColors.includes(item.color) && (
                                                                <div className="flex items-start gap-2">
                                                                    <label className="text-xs text-[#EAD2C0] min-w-[60px] pt-1">Custom:</label>
                                                                    <input
                                                                        type="text"
                                                                        value={item.color || ''}
                                                                        onChange={(e) => updateColorFragrance(
                                                                            itemId, 
                                                                            item.color, 
                                                                            item.fragrance,
                                                                            e.target.value,
                                                                            item.fragrance
                                                                        )}
                                                                        className="lp-field !min-h-10 flex-1 py-2 text-sm"
                                                                        placeholder="Enter custom color"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-2">
                                                                <label className="text-xs text-[#EAD2C0] min-w-[60px]">Fragrance:</label>
                                                                <select
                                                                    value={item.fragrance || 'Lavender'}
                                                                    onChange={(e) => updateColorFragrance(
                                                                        itemId,
                                                                        item.color,
                                                                        item.fragrance,
                                                                        item.color,
                                                                        e.target.value
                                                                    )}
                                                                    className="lp-field !min-h-10 flex-1 py-2 text-sm"
                                                                >
                                                                    {availableFragrances.map(fragrance => (
                                                                        <option key={fragrance} value={fragrance}>{fragrance}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => {
                                                            removeFromCart(itemId, item.color, item.fragrance);
                                                            toast.success('Item removed from cart', {
                                                                duration: 2000,
                                                                position: 'bottom-right',
                                                                style: {
                                                                    background: '#D8A24A',
                                                                    color: '#3B2A23',
                                                                    fontWeight: 'bold',
                                                                },
                                                            });
                                                        }}
                                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#C7BCA8] hover:text-[#EDE6D8]"
                                                        aria-label="Remove item"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">close</span>
                                                    </button>
                                                </div>

                                                {/* Bottom row with quantity controls and total */}
                                                <div className="flex items-center justify-between">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => {
                                                                if (item.quantity > 1) {
                                                                    updateQuantity(itemId, item.quantity - 1, item.color, item.fragrance);
                                                                } else {
                                                                    removeFromCart(itemId, item.color, item.fragrance);
                                                                    toast.success('Item removed from cart', {
                                                                        duration: 2000,
                                                                        position: 'bottom-right',
                                                                        style: {
                                                                            background: '#D8A24A',
                                                                            color: '#3B2A23',
                                                                            fontWeight: 'bold',
                                                                        },
                                                                    });
                                                                }
                                                            }}
                                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D3A34E]/20 text-[#D3A34E] transition-transform active:scale-[0.98]"
                                                        >
                                                            <span className="material-symbols-outlined text-base">remove</span>
                                                        </button>
                                                        <span className="text-base font-bold text-[#FFF7ED] min-w-[24px] text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(itemId, item.quantity + 1, item.color, item.fragrance)}
                                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D3A34E]/20 text-[#D3A34E] transition-transform active:scale-[0.98]"
                                                        >
                                                            <span className="material-symbols-outlined text-base">add</span>
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-lg text-[#D8A24A]">₹{itemTotal.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input id="giftwrap" type="checkbox" checked={giftWrap} onChange={(e)=>setGiftWrap(e.target.checked)} className="w-4 h-4" />
                                        <label htmlFor="giftwrap" className="text-sm text-[#EAD2C0]">Add Gift Wrapping (₹100 extra)</label>
                                        {giftWrap && <span className="ml-2 text-xs px-2 py-1 bg-[#D8A24A]/20 rounded text-[#D8A24A]">Gift wrap applied</span>}
                                    </div>

                                    <div className="mt-3">
                                        <label className="mb-2 block font-jost text-sm text-[#C7BCA8]">Coupon</label>
                                        <div className="flex flex-col gap-2 sm:flex-row">
                                            <input value={couponCode} onChange={(e)=>setCouponCode(e.target.value)} className="lp-field flex-1" aria-label="Coupon code" />
                                            <button type="button" onClick={() => {
                                                const res = applyCoupon(couponCode, getCartTotal());
                                                setCouponResult(res);
                                                if (res.valid) toast.success(res.message); else toast.error(res.message);
                                            }} className="lp-btn lp-btn-ghost shrink-0">Apply</button>
                                        </div>
                                        {couponResult && (
                                            <p className={`mt-2 font-jost text-sm ${couponResult.valid ? 'text-[#D3A34E]' : 'text-[#E8B4B4]'}`}>{couponResult.message}{couponResult.valid ? ` Saved ₹${couponResult.discount.toFixed(2)}` : ''}</p>
                                        )}
                                    </div>

                                    {/* computed totals */}
                                    {(() => {
                                        const subtotal = getCartTotal();
                                        const couponDiscount = couponResult && couponResult.valid ? couponResult.discount : 0;
                                        const codCharge = paymentMethod === 'cod' ? 50 : 0;
                                        const t = calculateTotals(subtotal, { giftWrap, couponDiscount, codCharge });
                                        return (
                                            <div className="mt-4 pt-4 border-t-2 border-[#D8A24A]/30 space-y-2">
                                                <div className="flex justify-between items-center text-[#EAD2C0]"><span>Subtotal</span><span>₹{t.subtotal.toFixed(2)}</span></div>
                                                <div className="flex justify-between items-center text-[#EAD2C0]"><span>Shipping</span><span>₹{t.shipping.toFixed(2)}</span></div>
                                                {/* <div className="flex justify-between items-center text-[#EAD2C0]"><span>Tax (18% GST)</span><span>₹{t.tax.toFixed(2)}</span></div> */}
                                                {t.couponDiscount > 0 && <div className="flex justify-between items-center text-[#EAD2C0]"><span>Coupon</span><span className="text-green-300">-₹{t.couponDiscount.toFixed(2)}</span></div>}
                                                {t.gift > 0 && <div className="flex justify-between items-center text-[#EAD2C0]"><span>Gift Wrap</span><span>₹{t.gift.toFixed(2)}</span></div>}
                                                {t.cod > 0 && <div className="flex justify-between items-center text-[#EAD2C0]"><span>COD Charges</span><span>₹{t.cod.toFixed(2)}</span></div>}
                                                <div className="pt-4 border-t border-[#FFF7ED]/20 flex justify-between items-center"><span className="text-2xl font-bold text-[#FFF7ED]">Total</span><span className="text-3xl font-bold text-[#D8A24A]">₹{t.total.toFixed(2)}</span></div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                <div className="mt-6 p-4 rounded-lg bg-[#D8A24A]/10 border border-[#D8A24A]/30">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-[#D8A24A]">info</span>
                                        <div className="text-sm text-[#EAD2C0]">
                                            <p className="font-semibold mb-1">Secure Checkout</p>
                                            <p className="text-xs">Your payment information is encrypted and secure.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            {/* Terms and Conditions Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4 bg-[#1F150E]/90">
                    <div className="bg-[#2A1D15] w-full max-h-[90dvh] overflow-hidden rounded-t-[20px] sm:max-w-2xl sm:rounded-[20px]">
                        <div className="bg-[#D8A24A]/20 border-b border-[#D8A24A]/30 p-6 flex items-center justify-between">
                            <h3 className="lp-display text-2xl leading-[1.1] text-[#EDE6D8]">Terms</h3>
                            <button 
                                onClick={() => setShowTermsModal(false)}
                                className="w-10 h-10 rounded-full bg-[#FFF7ED]/10 hover:bg-[#FFF7ED]/20 flex items-center justify-center transition-all"
                            >
                                <span className="material-symbols-outlined text-[#FFF7ED]">close</span>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
                            <div className="space-y-4 text-[#EAD2C0]">
                                <p className="text-sm leading-relaxed">
                                    Please read and accept the following terms and conditions before placing your order:
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-[#FFF7ED]/5">
                                        <span className="text-[#D8A24A] font-bold mt-0.5">1.</span>
                                        <p className="flex-1 text-sm"><strong>No Returns:</strong> Goods once sold will not be taken back or exchanged.</p>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-[#FFF7ED]/5">
                                        <span className="text-[#D8A24A] font-bold mt-0.5">2.</span>
                                        <p className="flex-1 text-sm"><strong>Transportation Damage:</strong> We are not responsible for any damage or loss during transportation. Please inspect your order upon delivery.</p>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-[#FFF7ED]/5">
                                        <span className="text-[#D8A24A] font-bold mt-0.5">3.</span>
                                        <p className="flex-1 text-sm"><strong>Delivery Delays:</strong> We are not responsible for any delays by the courier service due to transportation issues beyond our control.</p>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-[#FFF7ED]/5">
                                        <span className="text-[#D8A24A] font-bold mt-0.5">4.</span>
                                        <p className="flex-1 text-sm"><strong>No Return Policy:</strong> All sales are final. We do not accept returns or provide refunds.</p>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-[#FFF7ED]/5">
                                        <span className="text-[#D8A24A] font-bold mt-0.5">5.</span>
                                        <p className="flex-1 text-sm"><strong>Order Cancellation:</strong> Once order is dispatched, it cannot be cancelled. For cancellation requests before dispatch, contact us on WhatsApp at <a href="https://wa.me/919173958589" className="text-[#D8A24A] underline hover:text-[#D8A24A]/80" target="_blank" rel="noopener noreferrer">9173958589</a>.</p>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-[#FFF7ED]/5">
                                        <span className="text-[#D8A24A] font-bold mt-0.5">6.</span>
                                        <p className="flex-1 text-sm"><strong>Custom Packaging:</strong> For specific requirements in packaging, extra charges will apply and will be communicated to you before processing.</p>
                                    </div>
                                </div>
                                <div className="mt-6 p-4 rounded-lg bg-[#D8A24A]/10 border border-[#D8A24A]/30">
                                    <p className="text-xs text-[#EAD2C0]">
                                        By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by these conditions.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-[#D3A34E]/20 p-4 sm:p-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setShowTermsModal(false)}
                                className="lp-btn lp-btn-ghost w-full sm:w-auto"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setTermsAccepted(true);
                                    setShowTermsModal(false);
                                    toast.success('Terms accepted');
                                }}
                                className="lp-btn lp-btn-primary w-full sm:w-auto"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
