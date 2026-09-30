import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import OrderTimeline from '../components/OrderTimeline';
import { API_ENDPOINTS } from '../config/api';

const statusLabel = (status) => {
    if (status === 'DELIVERED') return 'Delivered';
    if (status === 'SHIPPED') return 'Shipped';
    if (status === 'CONFIRMED') return 'Confirmed';
    if (status === 'CANCELLED') return 'Cancelled';
    return status || 'Pending';
};

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrackOrder = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) {
            setError('Enter an order ID');
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
            setError('Could not track this order. Try again.');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lp relative min-h-[100dvh] w-full bg-[#FAF6EF] text-[#4A2A1A]">
            <Navbar />

            <main id="main-content" className="mx-auto w-full max-w-[1400px] px-5 pb-24 pt-10 sm:px-10 lg:px-16">
                <header className="max-w-xl">
                    <h1 className="lp-display text-4xl leading-[1.1] md:text-5xl">Track order</h1>
                    <p className="lp-lede mt-4 max-w-[65ch] text-[#4A2A1A]/70">
                        Enter the order ID from your confirmation. We will show where it is.
                    </p>
                </header>

                <form onSubmit={handleTrackOrder} className="mt-10 max-w-xl space-y-5">
                    <label className="flex flex-col gap-2">
                        <span className="font-jost text-sm text-[#4A2A1A]">Order ID</span>
                        <input
                            className="lp-field"
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            autoComplete="off"
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? 'track-error' : undefined}
                        />
                    </label>
                    {error && (
                        <p id="track-error" className="font-jost text-sm text-red-700">
                            {error}
                        </p>
                    )}
                    <button type="submit" disabled={loading} className="lp-btn lp-btn-primary">
                        {loading ? 'Looking up' : 'Track'}
                    </button>
                </form>

                {order && (
                    <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
                        <section className="rounded-[20px] bg-[#EDE0C8] p-5 sm:p-8 lg:col-span-7">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="lp-display text-2xl leading-[1.1] sm:text-3xl">Order {order.orderId}</h2>
                                    <p className="mt-2 font-jost text-sm text-[#4A2A1A]/70">
                                        {order.paymentMethod === 'cod' ? 'Pay on delivery' : 'Paid online'}
                                    </p>
                                </div>
                                <p className="inline-flex w-fit items-center rounded-full bg-[#4A2A1A] px-3 py-1 font-jost text-sm font-semibold text-[#FAF6EF]">
                                    {statusLabel(order.status)}
                                </p>
                            </div>

                            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                                <div>
                                    <p className="font-jost text-sm text-[#4A2A1A]/70">Customer</p>
                                    <p className="mt-2 font-jost text-[#4A2A1A]">{order.customer.name}</p>
                                    {order.customer.email && (
                                        <p className="mt-1 break-all font-jost text-sm text-[#4A2A1A]/70">{order.customer.email}</p>
                                    )}
                                    <p className="mt-1 font-jost text-sm text-[#4A2A1A]/70">{order.customer.mobile}</p>
                                </div>
                                <div>
                                    <p className="font-jost text-sm text-[#4A2A1A]/70">Delivery</p>
                                    <p className="mt-2 font-jost text-sm text-[#4A2A1A]">{order.customer.address1}</p>
                                    {order.customer.address2 && (
                                        <p className="font-jost text-sm text-[#4A2A1A]">{order.customer.address2}</p>
                                    )}
                                    {order.customer.landmark && (
                                        <p className="font-jost text-sm text-[#4A2A1A]/70">{order.customer.landmark}</p>
                                    )}
                                    <p className="font-jost text-sm text-[#4A2A1A]">
                                        {order.customer.city}, {order.customer.state} {order.customer.pincode}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 rounded-[12px] bg-[#EDE0C8] p-3 sm:gap-4"
                                    >
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-16 w-16 shrink-0 rounded-[12px] object-cover sm:h-20 sm:w-20"
                                            />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="font-jost text-sm text-[#4A2A1A] sm:text-base">{item.name}</p>
                                            <p className="mt-1 font-jost text-xs text-[#4A2A1A]/70 sm:text-sm">
                                                Qty {item.quantity} · ₹{item.offerPrice || item.price}
                                            </p>
                                            {(item.color || item.fragrance) && (
                                                <p className="mt-0.5 font-jost text-xs text-[#4A2A1A]/70">
                                                    {[item.color, item.fragrance].filter(Boolean).join(', ')}
                                                </p>
                                            )}
                                        </div>
                                        <p className="shrink-0 font-jost tabular-nums text-[#4A2A1A]">
                                            ₹{(item.quantity * (item.offerPrice || item.price)).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-2 border-t border-[#4A2A1A]/20 pt-4 font-jost text-sm">
                                <div className="flex justify-between text-[#4A2A1A]/70">
                                    <span>Subtotal</span>
                                    <span>₹{order.totals.subtotal.toFixed(2)}</span>
                                </div>
                                {order.totals.giftWrap > 0 && (
                                    <div className="flex justify-between text-[#4A2A1A]/70">
                                        <span>Gift wrap</span>
                                        <span>₹{order.totals.giftWrap.toFixed(2)}</span>
                                    </div>
                                )}
                                {order.totals.shipping > 0 && (
                                    <div className="flex justify-between text-[#4A2A1A]/70">
                                        <span>Shipping</span>
                                        <span>₹{order.totals.shipping.toFixed(2)}</span>
                                    </div>
                                )}
                                {order.totals.discount > 0 && (
                                    <div className="flex justify-between text-[#4A2A1A]/70">
                                        <span>Discount</span>
                                        <span>-₹{order.totals.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                {order.totals.codCharge > 0 && (
                                    <div className="flex justify-between text-[#4A2A1A]/70">
                                        <span>COD</span>
                                        <span>₹{order.totals.codCharge.toFixed(2)}</span>
                                    </div>
                                )}
                                {order.totals.gst > 0 && (
                                    <div className="flex justify-between text-[#4A2A1A]/70">
                                        <span>GST</span>
                                        <span>₹{order.totals.gst.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 text-base text-[#4A2A1A]">
                                    <span>Total</span>
                                    <span className="tabular-nums text-[#4A2A1A]">₹{order.totals.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {order.trackingId && (
                                <div className="mt-6 rounded-[12px] bg-[#EDE0C8] p-4">
                                    <p className="font-jost text-sm text-[#4A2A1A]/70">Courier tracking</p>
                                    <p className="mt-1 break-all font-jost text-[#4A2A1A]">{order.trackingId}</p>
                                    {order.trackingLink && (
                                        <a
                                            href={order.trackingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-block font-jost text-sm text-[#4A2A1A] hover:text-[#4A2A1A]"
                                        >
                                            Open courier site
                                        </a>
                                    )}
                                </div>
                            )}
                        </section>

                        <section className="rounded-[20px] bg-[#EDE0C8] p-5 sm:p-8 lg:col-span-5">
                            <h2 className="lp-display text-2xl leading-[1.1] sm:text-3xl">Timeline</h2>
                            <div className="mt-6">
                                <OrderTimeline order={order} />
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TrackOrder;
