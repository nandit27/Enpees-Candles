import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import OrderTimeline from '../components/OrderTimeline';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleTrackOrder = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) {
            setError('Please enter an order ID');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_ENDPOINTS.TRACK_ORDER}/${orderId.trim()}`);
            if (response.ok) {
                const data = await response.json();
                setOrder(data);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Order not found');
                setOrder(null);
            }
        } catch (err) {
            console.error('Error tracking order:', err);
            setError('Failed to track order. Please try again.');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#3B2A23] font-['Inter',_sans-serif] text-[#FFF7ED]">
            <Navbar />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-5xl">
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Italiana',_serif] text-[#FFF7ED] mb-3 sm:mb-4">
                        Track Your Order
                    </h1>
                    <p className="text-[#EAD2C0] text-base sm:text-lg">
                        Enter your order ID to track your order status
                    </p>
                </div>

                {/* Order ID Input Form */}
                <div className="bg-[#FFF7ED]/10 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#FFF7ED]/20 shadow-2xl mb-8">
                    <form onSubmit={handleTrackOrder} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#EAD2C0] mb-2">
                                Order ID
                            </label>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="e.g., 143028022612"
                                className="w-full px-4 py-3 rounded-lg bg-[#3B2A23]/50 border border-[#FFF7ED]/20 text-[#FFF7ED] placeholder-[#EAD2C0]/50 focus:outline-none focus:border-[#D8A24A] transition-colors"
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-400">{error}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#D8A24A] text-[#3B2A23] hover:bg-[#D8A24A]/90 font-bold py-3"
                        >
                            {loading ? 'Tracking...' : 'Track Order'}
                        </Button>
                    </form>
                </div>

                {/* Order Details */}
                {order && (
                    <div className="space-y-6">
                        {/* Order Info */}
                        <div className="bg-[#FFF7ED]/10 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-[#FFF7ED]/20">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold font-['Italiana',_serif] mb-2">
                                        Order Details
                                    </h2>
                                    <p className="text-[#EAD2C0] text-sm">
                                        Order ID: <span className="text-[#D8A24A] font-semibold">{order.orderId}</span>
                                    </p>
                                </div>
                                <div className={`px-4 py-2 rounded-lg font-semibold ${
                                    order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' :
                                    order.status === 'SHIPPED' ? 'bg-blue-500/20 text-blue-400' :
                                    order.status === 'CONFIRMED' ? 'bg-yellow-500/20 text-yellow-400' :
                                    order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                                    'bg-gray-500/20 text-gray-400'
                                }`}>
                                    {order.status}
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-[#D8A24A]">Customer Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-[#EAD2C0]">Name:</span> {order.customer.name}</p>
                                        <p><span className="text-[#EAD2C0]">Email:</span> {order.customer.email}</p>
                                        <p><span className="text-[#EAD2C0]">Mobile:</span> {order.customer.mobile}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-[#D8A24A]">Delivery Address</h3>
                                    <div className="space-y-1 text-sm">
                                        <p>{order.customer.address1}</p>
                                        {order.customer.address2 && <p>{order.customer.address2}</p>}
                                        {order.customer.landmark && <p>{order.customer.landmark}</p>}
                                        <p>{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 text-[#D8A24A]">Order Items</h3>
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-[#3B2A23]/50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                {item.image && (
                                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                                )}
                                                <div>
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-sm text-[#EAD2C0]">
                                                        Qty: {item.quantity} × ₹{item.offerPrice || item.price}
                                                    </p>
                                                    {item.color && <p className="text-xs text-[#EAD2C0]">Color: {item.color}</p>}
                                                    {item.fragrance && <p className="text-xs text-[#EAD2C0]">Fragrance: {item.fragrance}</p>}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">₹{(item.quantity * (item.offerPrice || item.price)).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Totals */}
                            <div className="border-t border-[#FFF7ED]/20 pt-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[#EAD2C0]">Subtotal:</span>
                                        <span>₹{order.totals.subtotal.toFixed(2)}</span>
                                    </div>
                                    {order.totals.giftWrap > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-[#EAD2C0]">Gift Wrap:</span>
                                            <span>₹{order.totals.giftWrap.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {order.totals.shipping > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-[#EAD2C0]">Shipping:</span>
                                            <span>₹{order.totals.shipping.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {order.totals.discount > 0 && (
                                        <div className="flex justify-between text-green-400">
                                            <span>Discount:</span>
                                            <span>-₹{order.totals.discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {order.totals.codCharge > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-[#EAD2C0]">COD Charge:</span>
                                            <span>₹{order.totals.codCharge.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {order.totals.gst > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-[#EAD2C0]">GST (18%):</span>
                                            <span>₹{order.totals.gst.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xl font-bold pt-2 border-t border-[#FFF7ED]/20">
                                        <span className="text-[#D8A24A]">Total:</span>
                                        <span className="text-[#D8A24A]">₹{order.totals.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Info */}
                            {order.trackingId && (
                                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <p className="text-sm mb-1 text-[#EAD2C0]">Tracking ID:</p>
                                    <p className="font-semibold text-blue-400">{order.trackingId}</p>
                                    {order.trackingLink && (
                                        <a
                                            href={order.trackingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-400 hover:text-blue-300 underline mt-2 inline-block"
                                        >
                                            Track on Courier Website
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-[#FFF7ED]/10 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-[#FFF7ED]/20">
                            <h2 className="text-2xl font-bold font-['Italiana',_serif] mb-6">Order Timeline</h2>
                            <OrderTimeline order={order} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
