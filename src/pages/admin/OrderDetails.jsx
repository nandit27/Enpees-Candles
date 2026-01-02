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
    const [showPartialOrderModal, setShowPartialOrderModal] = useState(false);
    const [trackingId, setTrackingId] = useState('');
    const [trackingLink, setTrackingLink] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [unavailableItems, setUnavailableItems] = useState([]);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.ADMIN_ORDER_BY_ID(orderId), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
            if (error.message.includes('401')) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOrder = async () => {
        if (!window.confirm('Confirm this order?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.CONFIRM_ORDER(orderId), {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
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
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.SHIP_ORDER(orderId), {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
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
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.DELIVER_ORDER(orderId), {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
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
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.CANCEL_ORDER(orderId), {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
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

    const handlePartialOrder = async () => {
        if (unavailableItems.length === 0) {
            alert('Please select at least one unavailable item');
            return;
        }

        if (unavailableItems.length === order.items.length) {
            alert('Cannot process partial order. All items are unavailable. Please cancel the order instead.');
            return;
        }

        if (!window.confirm('Mark this order as partial and proceed to shipping? Customer will be notified about unavailable items.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.PARTIAL_ORDER(orderId), {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ unavailableItems })
            });
            const updatedOrder = await response.json();
            setOrder(updatedOrder);
            setShowPartialOrderModal(false);
            setUnavailableItems([]);
            alert('Partial order processed! Customer has been notified about unavailable items.');
        } catch (error) {
            console.error('Error processing partial order:', error);
            alert('Failed to process partial order');
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

    const canConfirm = order.status === 'PENDING';
    const canShip = order.status === 'CONFIRMED';
    const canDeliver = order.status === 'SHIPPED';
    const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);

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

            {/* Partial Order Alert */}
            {order.isPartialOrder && order.unavailableItems && order.unavailableItems.length > 0 && (
                <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
                    <div className="bg-orange-500/20 border border-orange-400 rounded-xl p-4 sm:p-6">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-orange-400 text-3xl">warning</span>
                            <div className="flex-1">
                                <h3 className="text-orange-300 font-bold text-lg mb-2">Partial Order Processed</h3>
                                <p className="text-orange-200 text-sm mb-3">
                                    {order.unavailableItems.length} item(s) marked as unavailable. 
                                    Customer has been notified via email that only the available items will be shipped.
                                </p>
                                {order.refundAmount > 0 && (
                                    <div className="bg-blue-500/30 border border-blue-400 rounded-lg p-3 mt-3">
                                        <p className="text-blue-200 text-lg font-bold">
                                            💰 Refund Amount: ₹{order.refundAmount.toFixed(2)}
                                        </p>
                                        <p className="text-blue-200 text-xs mt-1">
                                            To be initiated within 3-6 business days
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                            {order.courierCompany && (
                                <div className="sm:col-span-2">
                                    <p className="text-sm text-[#EAD2C0]/70">Courier Preference</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="material-symbols-outlined text-[#D8A24A] text-xl">local_shipping</span>
                                        <p className="font-semibold text-[#D8A24A]">{order.courierCompany}</p>
                                    </div>
                                </div>
                            )}
                            {order.giftWrapApplied && (
                                <div className="sm:col-span-2">
                                    <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-3 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-purple-400 text-2xl">redeem</span>
                                        <div>
                                            <p className="font-bold text-purple-300">Gift Wrapping Requested</p>
                                            <p className="text-xs text-purple-200">Please pack this order with gift wrapping (+₹100)</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-[#FFF7ED]/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-[#FFF7ED]/20">
                        <h2 className="text-lg sm:text-xl font-bold text-[#FFF7ED] mb-3 sm:mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => {
                                const isUnavailable = order.unavailableItems?.includes(item._id);
                                return (
                                    <div 
                                        key={index} 
                                        className={`flex gap-4 pb-4 border-b border-[#FFF7ED]/10 last:border-0 ${
                                            isUnavailable ? 'opacity-60' : ''
                                        }`}
                                    >
                                        {item.image && (
                                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-[#FFF7ED] font-semibold">{item.name}</h3>
                                                {isUnavailable && (
                                                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded ml-2">Not Available</span>
                                                )}
                                            </div>
                                            <p className="text-[#EAD2C0] text-sm">Quantity: {item.quantity}</p>
                                            <p className="text-[#EAD2C0] text-sm">Color: {item.color}</p>
                                            <p className="text-[#EAD2C0] text-sm">Fragrance: {item.fragrance}</p>
                                            {item.offerPrice ? (
                                                <div className="mt-1">
                                                    <p className="text-xs text-[#EAD2C0]/60 line-through">M.R.P: ₹{item.price}</p>
                                                    <p className={`font-semibold ${isUnavailable ? 'text-[#EAD2C0] line-through' : 'text-red-400'}`}>
                                                        ₹{item.offerPrice} x {item.quantity} = ₹{item.offerPrice * item.quantity}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className={`font-semibold mt-1 ${isUnavailable ? 'text-[#EAD2C0] line-through' : 'text-[#D8A24A]'}`}>
                                                    ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
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

                    {/* Payment Screenshot */}
                    {order.paymentScreenshot && (
                        <div className="bg-[#FFF7ED]/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-[#FFF7ED]/20">
                            <h2 className="text-lg sm:text-xl font-bold text-[#FFF7ED] mb-4">Payment Confirmation</h2>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="material-symbols-outlined text-green-400">verified</span>
                                <p className="text-[#EAD2C0] text-sm">Customer uploaded payment screenshot</p>
                            </div>
                            <a 
                                href={order.paymentScreenshot} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <img 
                                    src={order.paymentScreenshot} 
                                    alt="Payment Screenshot" 
                                    className="w-full max-w-md rounded-lg border border-[#FFF7ED]/20 hover:border-[#D8A24A]/50 transition-all cursor-pointer"
                                />
                                <p className="text-xs text-[#EAD2C0] mt-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    Click to view full size
                                </p>
                            </a>
                        </div>
                    )}
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

                            {canConfirm && (
                                <button
                                    onClick={() => setShowPartialOrderModal(true)}
                                    className="w-full py-2 sm:py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm sm:text-base font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">inventory_2</span>
                                    Process Partial Order
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

            {/* Partial Order Modal */}
            {showPartialOrderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-[#3B2A23] rounded-xl border border-[#FFF7ED]/20 w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-[#FFF7ED] mb-4">Process Partial Order</h2>
                        <p className="text-[#EAD2C0] text-sm mb-4">
                            Select items that are <strong>NOT AVAILABLE</strong> for this order. The remaining items will be shipped to the customer.
                        </p>
                        <div className="space-y-4">
                            {/* Unavailable Items Section */}
                            <div className="border border-[#FFF7ED]/20 rounded-lg p-4">
                                <label className="block text-[#EAD2C0] mb-3 font-semibold">Mark Unavailable Items *</label>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {order.items.map((item, index) => (
                                        <label key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#FFF7ED]/5 cursor-pointer border border-[#FFF7ED]/10">
                                            <input
                                                type="checkbox"
                                                checked={unavailableItems.includes(item._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setUnavailableItems([...unavailableItems, item._id]);
                                                    } else {
                                                        setUnavailableItems(unavailableItems.filter(id => id !== item._id));
                                                    }
                                                }}
                                                className="mt-1 w-4 h-4"
                                            />
                                            <div className="flex-1">
                                                <p className="text-[#FFF7ED] text-sm font-medium">{item.name}</p>
                                                <p className="text-[#EAD2C0] text-xs">
                                                    Qty: {item.quantity} | Color: {item.color} | Fragrance: {item.fragrance}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Summary */}
                            {unavailableItems.length > 0 && (
                                <div className="bg-orange-500/20 border border-orange-400/50 rounded-lg p-3">
                                    <p className="text-orange-200 text-sm">
                                        <strong>{unavailableItems.length}</strong> item(s) marked as unavailable
                                        <br />
                                        <strong>{order.items.length - unavailableItems.length}</strong> item(s) will be shipped
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowPartialOrderModal(false);
                                    setUnavailableItems([]);
                                }}
                                className="flex-1 py-2 bg-[#FFF7ED]/10 hover:bg-[#FFF7ED]/20 text-[#EAD2C0] rounded-lg"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handlePartialOrder}
                                className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg"
                            >
                                Process Partial Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
