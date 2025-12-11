import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { applyCoupon, calculateTotals, makeUpiLink } from '../lib/checkoutHelpers';

const availableColors = ['Natural Beige', 'Ivory White', 'Soft Pink', 'Charcoal Grey'];
const availableFragrances = ['Lavender', 'Vanilla', 'Sandalwood', 'Rose', 'Citrus'];

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
    const [otpSent, setOtpSent] = useState(false);
    const [otpCooldown, setOtpCooldown] = useState(0);
    const otpTimerRef = useRef(null);
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
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

    useEffect(() => {
        if (otpCooldown === 0 && otpTimerRef.current) {
            clearInterval(otpTimerRef.current);
            otpTimerRef.current = null;
        }
    }, [otpCooldown]);

    useEffect(() => {
        return () => {
            if (otpTimerRef.current) clearInterval(otpTimerRef.current);
        };
    }, []);

    const validateForm = () => {
        const errs = {};
        if (!formData.name || formData.name.trim().length < 2) errs.name = 'Please enter full name';
        if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile)) errs.mobile = 'Enter valid 10-digit mobile';
        if (!formData.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) errs.email = 'Enter a valid email';
        if (!formData.address1 || formData.address1.trim().length < 5) errs.address1 = 'Enter address';
        if (!formData.city) errs.city = 'City required';
        if (!formData.state) errs.state = 'State required';
        if (!formData.pincode || !/^\d{5,6}$/.test(formData.pincode)) errs.pincode = 'Enter valid pincode';
        if (!termsAccepted) errs.terms = 'Please accept terms and conditions';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return toast.error('Please fix form errors');
        if (!otpVerified) return toast.error('Please verify mobile number with OTP');

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
            const response = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const created = await response.json();
                clearCart();
                if (paymentMethod === 'cod') {
                    toast.success('Order placed successfully! You will pay on delivery.', { duration: 3000 });
                    navigate('/order-confirmation', { state: { order: created } });
                } else {
                    toast.success('Order created. Proceed to payment', { duration: 2500 });
                    navigate('/payment', { state: { order: created } });
                }
            } else {
                toast.error('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Error placing order. Please try again.');
        }
    };

    // OTP functions
    const sendOtp = async () => {
        if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile)) return setErrors(prev => ({ ...prev, mobile: 'Enter valid 10-digit mobile' }));
        try {
            const res = await fetch('http://localhost:3001/api/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.mobile })
            });
            if (res.ok) {
                setOtpSent(true);
                setOtpCooldown(30);
                otpTimerRef.current = setInterval(() => setOtpCooldown(c => Math.max(0, c - 1)), 1000);
                toast.success('OTP sent (mock). Check server console for code.');
            } else {
                toast.error('Failed to send OTP');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to send OTP');
        }
    };

    const verifyOtp = async () => {
        if (!otp) return setErrors(prev => ({ ...prev, otp: 'Enter OTP' }));
        try {
            const res = await fetch('http://localhost:3001/api/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.mobile, otp })
            });
            const data = await res.json();
            if (res.ok && data.valid) {
                setOtpVerified(true);
                toast.success('Mobile verified');
            } else {
                setOtpVerified(false);
                toast.error(data.error || 'Verification failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Verification failed');
        }
    };

    const resendOtp = () => {
        if (otpCooldown > 0) return;
        sendOtp();
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#3B2A23] font-['Inter',_sans-serif] text-[#FFF7ED]">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
                    <div className="text-center space-y-6">
                        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#FFF7ED]/10 backdrop-blur-md border border-[#FFF7ED]/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-6xl text-[#D8A24A]">shopping_cart</span>
                        </div>
                        <h2 className="text-4xl font-['Italiana',_serif] font-bold mb-4">Your Cart is Empty</h2>
                        <p className="text-[#EAD2C0] text-lg mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <Button onClick={() => navigate('/shop')} className="bg-[#D8A24A] text-[#3B2A23] hover:bg-[#D8A24A]/90 font-bold px-8 py-6 text-lg">
                            Explore Our Collection
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#3B2A23] font-['Inter',_sans-serif] text-[#FFF7ED] relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D8A24A]/10 to-transparent"></div>
            </div>

            <div className="relative z-10">
                <Navbar />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Italiana',_serif] text-[#FFF7ED] mb-3 sm:mb-4">Complete Your Order</h1>
                        <p className="text-[#EAD2C0] text-base sm:text-lg">Just a few more steps to get your handcrafted candles delivered</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Checkout Form */}
                        <div className="order-2 lg:order-1">
                            <div className="bg-[#FFF7ED]/10 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-2xl border border-[#FFF7ED]/20 shadow-2xl">
                                <h2 className="text-xl sm:text-2xl font-bold font-['Italiana',_serif] mb-4 sm:mb-6 flex items-center">
                                    <span className="material-symbols-outlined mr-2 sm:mr-3 text-[#D8A24A]">local_shipping</span>
                                    Shipping Details
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className={`w-full p-4 rounded-lg bg-[#3B2A23]/80 border ${errors.name ? 'border-red-400' : 'border-[#FFF7ED]/30'} text-white placeholder-[#EAD2C0]/50 focus:outline-none focus:border-[#D8A24A] focus:ring-2 focus:ring-[#D8A24A]/50 transition-all`}
                                        />
                                        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">Mobile Number *</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="tel"
                                                name="mobile"
                                                required
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                placeholder="Enter 10-digit mobile"
                                                className={`flex-1 p-4 rounded-lg bg-[#3B2A23]/80 border ${errors.mobile ? 'border-red-400' : 'border-[#FFF7ED]/30'} text-white placeholder-[#EAD2C0]/50 focus:outline-none`}
                                            />
                                            <button type="button" onClick={sendOtp} disabled={otpCooldown>0} className="px-4 py-3 rounded-lg bg-[#D8A24A] text-[#3B2A23] font-semibold">
                                                {otpCooldown>0 ? `Resend in ${otpCooldown}s` : (otpSent ? 'Resend OTP' : 'Send OTP')}
                                            </button>
                                        </div>
                                        {errors.mobile && <p className="text-xs text-red-400 mt-1">{errors.mobile}</p>}
                                    </div>

                                    {otpSent && (
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">Enter OTP</label>
                                            <div className="flex gap-2">
                                                <input type="text" value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="6-digit code" className={`flex-1 p-4 rounded-lg bg-[#3B2A23]/80 border ${errors.otp ? 'border-red-400' : 'border-[#FFF7ED]/30'} text-white`} />
                                                <button type="button" onClick={verifyOtp} className="px-4 py-3 rounded-lg bg-green-500 text-white font-semibold">Verify</button>
                                            </div>
                                            {errors.otp && <p className="text-xs text-red-400 mt-1">{errors.otp}</p>}
                                            {otpVerified && <p className="text-xs text-green-300 mt-1">Mobile verified</p>}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your.email@example.com"
                                            className={`w-full p-4 rounded-lg bg-[#3B2A23]/80 border ${errors.email ? 'border-red-400' : 'border-[#FFF7ED]/30'} text-white placeholder-[#EAD2C0]/50 focus:outline-none`}
                                        />
                                        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">Address Line 1 *</label>
                                        <input
                                            type="text"
                                            name="address1"
                                            required
                                            value={formData.address1}
                                            onChange={handleChange}
                                            placeholder="House number and street name"
                                            className={`w-full p-4 rounded-lg bg-[#3B2A23]/80 border ${errors.address1 ? 'border-red-400' : 'border-[#FFF7ED]/30'} text-white placeholder-[#EAD2C0]/50 focus:outline-none`}
                                        />
                                        {errors.address1 && <p className="text-xs text-red-400 mt-1">{errors.address1}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">Address Line 2 (optional)</label>
                                        <input type="text" name="address2" value={formData.address2} onChange={handleChange} placeholder="Apartment, suite, etc." className="w-full p-4 rounded-lg bg-[#3B2A23]/80 border border-[#FFF7ED]/30 text-white" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">Landmark (optional)</label>
                                        <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Near..." className="w-full p-4 rounded-lg bg-[#3B2A23]/80 border border-[#FFF7ED]/30 text-white" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-1">
                                            <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">City *</label>
                                            <input type="text" name="city" value={formData.city} onChange={handleChange} className={`w-full p-4 rounded-lg bg-[#3B2A23]/80 border ${errors.city ? 'border-red-400' : 'border-[#FFF7ED]/30'} text-white`} />
                                            {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">State *</label>
                                            <select name="state" value={formData.state} onChange={handleChange} className={`w-full p-4 rounded-lg bg-[#3B2A23]/80 border ${errors.state ? 'border-red-400' : 'border-[#FFF7ED]/30'} text-white`}>
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
                                            {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">Pincode *</label>
                                            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className={`w-full p-4 rounded-lg bg-[#3B2A23]/80 border ${errors.pincode ? 'border-red-400' : 'border-[#FFF7ED]/30'} text-white`} />
                                            {errors.pincode && <p className="text-xs text-red-400 mt-1">{errors.pincode}</p>}
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
                                            <label className="flex items-center gap-3 p-3 rounded-lg border border-[#FFF7ED]/20 hover:border-[#D8A24A]/50 cursor-pointer transition-all">
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
                                            </label>
                                        </div>
                                    </div>

                                    {/* Courier Company Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">
                                            Courier Preference (Optional)
                                            <span className="text-xs font-normal ml-2 text-[#EAD2C0]/70">For special courier, please specify</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={courierCompany}
                                            onChange={(e) => setCourierCompany(e.target.value)}
                                            placeholder="e.g., Blue Dart, DTDC, or leave blank for standard"
                                            className="w-full p-4 rounded-lg bg-[#3B2A23]/80 border border-[#FFF7ED]/30 text-white placeholder-[#EAD2C0]/50 focus:outline-none focus:border-[#D8A24A]"
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
                                                    className="text-[#D8A24A] underline hover:text-[#D8A24A]/80"
                                                >
                                                    Terms and Conditions
                                                </button>
                                            </label>
                                        </div>
                                        {errors.terms && <p className="text-xs text-red-400 mt-2 ml-7">{errors.terms}</p>}
                                    </div>

                                    <Button type="submit" className="w-full mt-4 bg-[#D8A24A] text-[#3B2A23] hover:bg-[#D8A24A]/90 font-bold py-4 text-lg rounded-xl shadow-lg">
                                        <span className="material-symbols-outlined mr-2">check_circle</span>
                                        Place Order
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="order-1 lg:order-2">
                            <div className="bg-[#FFF7ED]/10 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-2xl border border-[#FFF7ED]/20 shadow-2xl lg:sticky lg:top-24">
                                <h2 className="text-xl sm:text-2xl font-bold font-['Italiana',_serif] mb-4 sm:mb-6 flex items-center">
                                    <span className="material-symbols-outlined mr-2 sm:mr-3 text-[#D8A24A]">receipt_long</span>
                                    Order Summary
                                </h2>
                                <div className="space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                    {cartItems.map((item, index) => {
                                        // Handle both numbers (new) and strings (old legacy data)
                                        const rawPrice = item.price;
                                        const itemPrice = typeof rawPrice === 'number'
                                            ? rawPrice
                                            : parseFloat(String(rawPrice).replace(/[^0-9.]/g, "")) || 0;
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
                                                            <span className="text-sm text-[#EAD2C0]">₹{itemPrice.toFixed(2)}</span>
                                                        </div>
                                                        
                                                        {/* Color and Fragrance Selection */}
                                                        <div className="mt-2 space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <label className="text-xs text-[#EAD2C0] min-w-[60px]">Color:</label>
                                                                <select
                                                                    value={item.color || 'Natural Beige'}
                                                                    onChange={(e) => updateColorFragrance(
                                                                        itemId, 
                                                                        item.color, 
                                                                        item.fragrance,
                                                                        e.target.value,
                                                                        item.fragrance
                                                                    )}
                                                                    className="flex-1 text-xs px-2 py-1 rounded bg-[#3B2A23] border border-[#FFF7ED]/20 text-white"
                                                                >
                                                                    {availableColors.map(color => (
                                                                        <option key={color} value={color}>{color}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
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
                                                                    className="flex-1 text-xs px-2 py-1 rounded bg-[#3B2A23] border border-[#FFF7ED]/20 text-white"
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
                                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 transition-all flex-shrink-0"
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
                                                            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#D8A24A]/20 hover:bg-[#D8A24A]/40 text-[#D8A24A] transition-all"
                                                        >
                                                            <span className="material-symbols-outlined text-base">remove</span>
                                                        </button>
                                                        <span className="text-base font-bold text-[#FFF7ED] min-w-[24px] text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(itemId, item.quantity + 1, item.color, item.fragrance)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#D8A24A]/20 hover:bg-[#D8A24A]/40 text-[#D8A24A] transition-all"
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
                                        <label className="block text-sm text-[#EAD2C0] font-semibold mb-2">Have a coupon?</label>
                                        <div className="flex gap-2">
                                            <input value={couponCode} onChange={(e)=>setCouponCode(e.target.value)} placeholder="Enter Coupon Code" className="flex-1 p-3 rounded-lg bg-[#3B2A23]/80 border border-[#FFF7ED]/30 text-white" />
                                            <button onClick={() => {
                                                const res = applyCoupon(couponCode, getCartTotal());
                                                setCouponResult(res);
                                                if (res.valid) toast.success(res.message); else toast.error(res.message);
                                            }} className="px-4 py-3 bg-[#D8A24A] text-[#3B2A23] rounded-lg font-semibold">Apply</button>
                                        </div>
                                        {couponResult && (
                                            <p className={`text-sm mt-2 ${couponResult.valid ? 'text-green-300' : 'text-red-400'}`}>{couponResult.message}{couponResult.valid ? ` - Saved ₹${couponResult.discount.toFixed(2)}` : ''}</p>
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
            </div>

            {/* Terms and Conditions Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#3B2A23] border-2 border-[#D8A24A]/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="bg-[#D8A24A]/20 border-b border-[#D8A24A]/30 p-6 flex items-center justify-between">
                            <h3 className="text-2xl font-bold font-['Italiana',_serif] text-[#FFF7ED]">Terms and Conditions</h3>
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
                                </div>
                                <div className="mt-6 p-4 rounded-lg bg-[#D8A24A]/10 border border-[#D8A24A]/30">
                                    <p className="text-xs text-[#EAD2C0]">
                                        By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by these conditions.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-[#FFF7ED]/10 p-6 flex gap-3 justify-end">
                            <Button 
                                onClick={() => setShowTermsModal(false)}
                                className="bg-[#FFF7ED]/10 text-[#FFF7ED] hover:bg-[#FFF7ED]/20 border border-[#FFF7ED]/30"
                            >
                                Close
                            </Button>
                            <Button 
                                onClick={() => {
                                    setTermsAccepted(true);
                                    setShowTermsModal(false);
                                    toast.success('Terms accepted');
                                }}
                                className="bg-[#D8A24A] text-[#3B2A23] hover:bg-[#D8A24A]/90"
                            >
                                Accept Terms
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
