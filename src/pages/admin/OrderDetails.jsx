import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderTimeline from '../../components/OrderTimeline';
import { API_ENDPOINTS } from '../../config/api';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [trackingId, setTrackingId] = useState('');
    const [trackingLink, setTrackingLink] = useState('');
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.ADMIN_ORDER_BY_ID(orderId));
            const data = await response.json();
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOrder = async () => {
        if (!window.confirm('Confirm this order?')) return;

        try {
            const response = await fetch(API_ENDPOINTS.CONFIRM_ORDER(orderId), {
                method: 'PATCH'
            });
            const updatedOrder = await response.json();
            setOrder(updatedOrder);
            alert('Order confirmed! Email sent to customer.');
        } catch (error) {
            console.error('Error confirming order:', error);
            alert('Failed to confirm order');
        }
    };

    const handleShipOrder = async () => {
        if (!trackingId.trim()) {
            alert('Please enter a tracking ID');
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.SHIP_ORDER(orderId), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingId, trackingLink })
            });
            const updatedOrder = await response.json();
            setOrder(updatedOrder);
            setShowTrackingModal(false);
            setTrackingId('');
            setTrackingLink('');
            alert('Order marked as shipped! Email sent to customer.');
        } catch (error) {
            console.error('Error shipping order:', error);
            alert('Failed to ship order');
        }
    };

    const handleDeliverOrder = async () => {
        if (!window.confirm('Mark this order as delivered?')) return;

        try {
            const response = await fetch(API_ENDPOINTS.DELIVER_ORDER(orderId), {
                method: 'PATCH'
            });
            const updatedOrder = await response.json();
            setOrder(updatedOrder);
            alert('Order marked as delivered! Email sent to customer.');
        } catch (error) {
            console.error('Error delivering order:', error);
            alert('Failed to mark as delivered');
        }
    };

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            alert('Please enter a cancellation reason');
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.CANCEL_ORDER(orderId), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: cancelReason })
            });
            const updatedOrder = await response.json();
            setOrder(updatedOrder);
            setShowCancelModal(false);
            setCancelReason('');
            alert('Order cancelled! Email sent to customer.');
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#3B2A23]">
                <div className="text-[#FFF7ED] text-xl">Loading order details...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#3B2A23]">
                <div className="text-[#FFF7ED] text-xl">Order not found</div>
            </div>
        );
    }

    const canConfirm = order.status === 'PLACED';
    const canShip = order.status === 'CONFIRMED';
    const canDeliver = order.status === 'SHIPPED';
    const canCancel = ['PLACED', 'CONFIRMED'].includes(order.status);

    return (
        <div className="min-h-screen bg-[#3B2A23] p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-[#EAD2C0] hover:text-[#FFF7ED] mb-3 sm:mb-4 text-sm sm:text-base"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Orders
                </button>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#FFF7ED]">Order Details</h1>
                        <p className="text-[#EAD2C0] mt-1 text-sm sm:text-base">Order ID: {order.orderId}</p>
                    </div>
                    <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm ${
                        order.status === 'DELIVERED' ? 'bg-green-500 text-white' :
                        order.status === 'SHIPPED' ? 'bg-blue-500 text-white' :
                        order.status === 'CONFIRMED' ? 'bg-yellow-500 text-[#3B2A23]' :
                        order.status === 'CANCELLED' ? 'bg-red-500 text-white' :
                        'bg-gray-500 text-white'
                    }`}>
                        {order.status}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column - Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Details */}
                    <div className="bg-[#FFF7ED]/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-[#FFF7ED]/20">
                        <h2 className="text-lg sm:text-xl font-bold text-[#FFF7ED] mb-3 sm:mb-4">Customer Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#EAD2C0]">
                            <div>
                                <p className="text-sm text-[#EAD2C0]/70">Name</p>
                                <p className="font-semibold">{order.customer.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#EAD2C0]/70">Email</p>
                                <p className="font-semibold">{order.customer.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#EAD2C0]/70">Mobile</p>
                                <p className="font-semibold">{order.customer.mobile}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-sm text-[#EAD2C0]/70">Address</p>
                                <p className="font-semibold">
                                    {order.customer.address1}, {order.customer.address2 && `${order.customer.address2}, `}
                                    {order.customer.landmark && `${order.customer.landmark}, `}
                                    {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-[#FFF7ED]/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-[#FFF7ED]/20">
                        <h2 className="text-lg sm:text-xl font-bold text-[#FFF7ED] mb-3 sm:mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex gap-4 pb-4 border-b border-[#FFF7ED]/10 last:border-0">
                                    {item.image && (
                                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                    )}
                                    <div className="flex-1">
                                        <p className="text-[#FFF7ED] font-semibold">{item.name}</p>
                                        <p className="text-[#EAD2C0] text-sm">Quantity: {item.quantity}</p>
                                        {item.color && <p className="text-[#EAD2C0] text-sm">Color: {item.color}</p>}
                                        {item.fragrance && <p className="text-[#EAD2C0] text-sm">Fragrance: {item.fragrance}</p>}
                                    </div>
                                    <div className="text-[#FFF7ED] font-bold">₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-[#FFF7ED]/20">
                            <div className="flex justify-between text-[#EAD2C0] mb-2">
                                <span>Subtotal</span>
                                <span>₹{order.totals.subtotal}</span>
                            </div>
                            {order.totals.shipping > 0 && (
                                <div className="flex justify-between text-[#EAD2C0] mb-2">
                                    <span>Shipping</span>
                                    <span>₹{order.totals.shipping}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-[#FFF7ED] font-bold text-lg mt-4">
                                <span>Total</span>
                                <span>₹{order.totals.total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-[#FFF7ED]/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-[#FFF7ED]/20">
                        <h2 className="text-lg sm:text-xl font-bold text-[#FFF7ED] mb-4 sm:mb-6">Order Timeline</h2>
                        <OrderTimeline order={order} />
                    </div>
                </div>

                {/* Right Column - Actions */}
                <div className="space-y-4 sm:space-y-6">
                    <div className="bg-[#FFF7ED]/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-[#FFF7ED]/20 lg:sticky lg:top-6">
                        <h2 className="text-lg sm:text-xl font-bold text-[#FFF7ED] mb-3 sm:mb-4">Actions</h2>
                        <div className="space-y-2 sm:space-y-3">
                            {canConfirm && (
                                <button
                                    onClick={handleConfirmOrder}
                                    className="w-full py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">verified</span>
                                    Confirm Order
                                </button>
                            )}

                            {canShip && (
                                <button
                                    onClick={() => setShowTrackingModal(true)}
                                    className="w-full py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">local_shipping</span>
                                    Mark as Shipped
                                </button>
                            )}

                            {canDeliver && (
                                <button
                                    onClick={handleDeliverOrder}
                                    className="w-full py-2 sm:py-3 bg-[#D8A24A] hover:bg-[#D8A24A]/90 text-[#3B2A23] text-sm sm:text-base font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">check_circle</span>
                                    Mark as Delivered
                                </button>
                            )}

                            {canCancel && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="w-full py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">cancel</span>
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracking Modal */}
            {showTrackingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-[#3B2A23] rounded-xl border border-[#FFF7ED]/20 w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold text-[#FFF7ED] mb-4">Enter Tracking Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[#EAD2C0] mb-2">Tracking ID *</label>
                                <input
                                    type="text"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-[#FFF7ED] placeholder-[#EAD2C0]/50"
                                    placeholder="Enter tracking ID"
                                />
                            </div>
                            <div>
                                <label className="block text-[#EAD2C0] mb-2">Tracking Link (Optional)</label>
                                <input
                                    type="url"
                                    value={trackingLink}
                                    onChange={(e) => setTrackingLink(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-[#FFF7ED] placeholder-[#EAD2C0]/50"
                                    placeholder="https://tracking.example.com/..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowTrackingModal(false)}
                                className="flex-1 py-2 bg-[#FFF7ED]/10 hover:bg-[#FFF7ED]/20 text-[#EAD2C0] rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleShipOrder}
                                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                            >
                                Ship Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-[#3B2A23] rounded-xl border border-[#FFF7ED]/20 w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold text-[#FFF7ED] mb-4">Cancel Order</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[#EAD2C0] mb-2">Cancellation Reason *</label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-[#FFF7ED] placeholder-[#EAD2C0]/50 min-h-[100px]"
                                    placeholder="Enter reason for cancellation..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 py-2 bg-[#FFF7ED]/10 hover:bg-[#FFF7ED]/20 text-[#EAD2C0] rounded-lg"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
                            >
                                Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
