import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import OrderTimeline from '../components/OrderTimeline';
import { API_ENDPOINTS } from '../config/api';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const fetchUserOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(API_ENDPOINTS.USER_ORDERS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                navigate('/login');
                return;
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#3B2A23]">
            <Navbar />
            
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#FFF7ED] mb-8">My Orders</h1>

                {loading ? (
                    <div className="text-center text-[#EAD2C0] py-12">Loading your orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-[#EAD2C0] text-6xl mb-4 block">shopping_bag</span>
                        <p className="text-[#EAD2C0] text-xl mb-4">No orders yet</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-6 py-3 bg-[#D8A24A] text-[#3B2A23] font-bold rounded-lg hover:brightness-110"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-[#FFF7ED]/10 backdrop-blur-sm rounded-xl p-6 border border-[#FFF7ED]/20 cursor-pointer hover:bg-[#FFF7ED]/15 transition-colors"
                                onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-[#FFF7ED]">Order #{order.orderId}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                order.status === 'DELIVERED' ? 'bg-green-500 text-white' :
                                                order.status === 'SHIPPED' ? 'bg-blue-500 text-white' :
                                                order.status === 'CONFIRMED' ? 'bg-yellow-500 text-[#3B2A23]' :
                                                order.status === 'CANCELLED' ? 'bg-red-500 text-white' :
                                                'bg-gray-500 text-white'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-[#EAD2C0] text-sm">
                                            Placed on {formatDate(order.createdAt)}
                                        </p>
                                        <p className="text-[#EAD2C0] text-sm">
                                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[#FFF7ED] font-bold text-xl">₹{order.totals.total}</p>
                                        </div>
                                        <span className={`material-symbols-outlined text-[#EAD2C0] transition-transform ${
                                            selectedOrder?._id === order._id ? 'rotate-180' : ''
                                        }`}>
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded Order Details */}
                                {selectedOrder?._id === order._id && (
                                    <div className="mt-6 pt-6 border-t border-[#FFF7ED]/20">
                                        {/* Partial Order Warning */}
                                        {order.isPartialOrder && order.unavailableItems && order.unavailableItems.length > 0 && (
                                            <div className="mb-6 bg-orange-500/20 border border-orange-400 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="material-symbols-outlined text-orange-400 text-3xl">warning</span>
                                                    <div>
                                                        <h4 className="text-orange-300 font-bold text-lg">Partial Order</h4>
                                                        <p className="text-orange-200 text-sm mt-1">
                                                            Some items from your order were unavailable and will not be shipped. 
                                                            Only the available items listed below will be delivered.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Order Items */}
                                            <div>
                                                <h4 className="text-[#FFF7ED] font-bold mb-4">Order Items</h4>
                                                <div className="space-y-3">
                                                    {order.items.map((item, index) => {
                                                        const isUnavailable = order.unavailableItems?.includes(item._id);
                                                        return (
                                                            <div 
                                                                key={index} 
                                                                className={`flex gap-3 p-3 rounded-lg ${
                                                                    isUnavailable 
                                                                        ? 'bg-red-500/10 border border-red-500/30 opacity-60' 
                                                                        : 'bg-[#FFF7ED]/5'
                                                                }`}
                                                            >
                                                                {item.image && (
                                                                    <img 
                                                                        src={item.image} 
                                                                        alt={item.name} 
                                                                        className="w-16 h-16 object-cover rounded"
                                                                    />
                                                                )}
                                                                <div className="flex-1">
                                                                    <div className="flex items-start justify-between">
                                                                        <p className="text-[#FFF7ED] font-semibold text-sm">{item.name}</p>
                                                                        {isUnavailable && (
                                                                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">Not Available</span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-[#EAD2C0] text-xs">Qty: {item.quantity}</p>
                                                                    {item.color && <p className="text-[#EAD2C0] text-xs">Color: {item.color}</p>}
                                                                    {item.fragrance && <p className="text-[#EAD2C0] text-xs">Fragrance: {item.fragrance}</p>}
                                                                </div>
                                                                <div className={`font-bold text-sm ${isUnavailable ? 'text-[#EAD2C0] line-through' : 'text-[#FFF7ED]'}`}>
                                                                    ₹{item.price * item.quantity}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Shipping Address */}
                                                <div className="mt-6">
                                                    <h4 className="text-[#FFF7ED] font-bold mb-3">Shipping Address</h4>
                                                    <div className="bg-[#FFF7ED]/5 p-4 rounded-lg text-[#EAD2C0] text-sm">
                                                        <p className="font-semibold text-[#FFF7ED]">{order.customer.name}</p>
                                                        <p>{order.customer.address1}</p>
                                                        {order.customer.address2 && <p>{order.customer.address2}</p>}
                                                        {order.customer.landmark && <p>Landmark: {order.customer.landmark}</p>}
                                                        <p>{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
                                                        <p className="mt-2">Mobile: {order.customer.mobile}</p>
                                                        <p>Email: {order.customer.email}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Timeline */}
                                            <div>
                                                <h4 className="text-[#FFF7ED] font-bold mb-4">Order Status</h4>
                                                <OrderTimeline order={order} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserOrders;
