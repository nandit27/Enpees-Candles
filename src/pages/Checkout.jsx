import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            customer: formData,
            items: cartItems,
            total: getCartTotal(),
            status: 'Pending'
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
                toast.success('Order placed successfully!', {
                    duration: 3000,
                    position: 'top-center',
                    style: {
                        background: '#D8A24A',
                        color: '#3B2A23',
                        fontWeight: 'bold',
                        fontSize: '16px',
                    },
                });
                clearCart();
                setTimeout(() => navigate('/order-confirmation'), 1000);
            } else {
                toast.error('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Error placing order. Please try again.');
        }
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
                                            className="w-full p-4 rounded-lg bg-[#3B2A23]/80 border border-[#FFF7ED]/30 text-white placeholder-[#EAD2C0]/50 focus:outline-none focus:border-[#D8A24A] focus:ring-2 focus:ring-[#D8A24A]/50 transition-all focus:bg-[#3B2A23]/80"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your.email@example.com"
                                            className="w-full p-4 rounded-lg bg-[#3B2A23]/80 border border-[#FFF7ED]/30 text-white placeholder-[#EAD2C0]/50 focus:outline-none focus:border-[#D8A24A] focus:ring-2 focus:ring-[#D8A24A]/50 transition-all focus:bg-[#3B2A23]/80"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">Street Address *</label>
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="House number and street name"
                                            className="w-full p-4 rounded-lg bg-[#3B2A23]/80 border border-[#FFF7ED]/30 text-white placeholder-[#EAD2C0]/50 focus:outline-none focus:border-[#D8A24A] focus:ring-2 focus:ring-[#D8A24A]/50 transition-all focus:bg-[#3B2A23]/80"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="City"
                                                className="w-full p-4 rounded-lg bg-[#3B2A23]/80 border border-[#FFF7ED]/30 text-white placeholder-[#EAD2C0]/50 focus:outline-none focus:border-[#D8A24A] focus:ring-2 focus:ring-[#D8A24A]/50 transition-all focus:bg-[#3B2A23]/80"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-[#EAD2C0]">PIN Code *</label>
                                            <input
                                                type="text"
                                                name="zip"
                                                required
                                                value={formData.zip}
                                                onChange={handleChange}
                                                placeholder="400001"
                                                className="w-full p-4 rounded-lg bg-[#3B2A23]/80 border border-[#FFF7ED]/30 text-white placeholder-[#EAD2C0]/50 focus:outline-none focus:border-[#D8A24A] focus:ring-2 focus:ring-[#D8A24A]/50 transition-all focus:bg-[#3B2A23]/80"
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full mt-8 bg-[#D8A24A] text-[#3B2A23] hover:bg-[#D8A24A]/90 font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#D8A24A]/30 transition-all">
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
                                        const itemPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
                                        const itemTotal = itemPrice * item.quantity;
                                        const itemId = item.id || item.name;
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
                                                    </div>
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => {
                                                            removeFromCart(itemId);
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
                                                                    updateQuantity(itemId, item.quantity - 1);
                                                                } else {
                                                                    removeFromCart(itemId);
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
                                                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
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
                                
                                <div className="mt-6 pt-6 border-t-2 border-[#D8A24A]/30 space-y-3">
                                    <div className="flex justify-between items-center text-[#EAD2C0]">
                                        <span>Subtotal</span>
                                        <span>₹{getCartTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[#EAD2C0]">
                                        <span>Shipping</span>
                                        <span className="text-green-400">FREE</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[#EAD2C0]">
                                        <span>Tax (18% GST)</span>
                                        <span>₹{(getCartTotal() * 0.18).toFixed(2)}</span>
                                    </div>
                                    <div className="pt-4 border-t border-[#FFF7ED]/20 flex justify-between items-center">
                                        <span className="text-2xl font-bold font-['Italiana',_serif] text-[#FFF7ED]">Total</span>
                                        <span className="text-3xl font-bold text-[#D8A24A]">₹{(getCartTotal() * 1.18).toFixed(2)}</span>
                                    </div>
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
        </div>
    );
};

export default Checkout;
