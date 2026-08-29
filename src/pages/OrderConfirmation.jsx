import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OrderConfirmation = () => {
    const location = useLocation();
    const order = location.state?.order;

    return (
        <div className="lp relative min-h-[100dvh] w-full bg-[#2A1D15] text-[#EDE6D8]">
            <Navbar />
            <main className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-10 lg:px-16">
                <div className="max-w-lg">
                    <h1 className="lp-display text-4xl leading-[1.1] md:text-5xl">Order confirmed</h1>
                    <p className="lp-lede mt-4 max-w-[65ch] text-[#C7BCA8]">
                        Thank you. The studio has the order and will start the pour.
                    </p>

                    {order?.orderId && (
                        <div className="mt-8 rounded-[20px] bg-[#3B2A1E] p-6">
                            <p className="font-jost text-sm text-[#C7BCA8]">Order ID</p>
                            <p className="mt-2 font-jost text-2xl tabular-nums tracking-wide text-[#D3A34E]">
                                {order.orderId}
                            </p>
                            <p className="mt-2 font-jost text-sm text-[#C7BCA8]">Save this ID to track the parcel.</p>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link to="/track-order" className="lp-btn lp-btn-primary">
                            Track order
                        </Link>
                        <Link to="/shop" className="lp-btn lp-btn-ghost">
                            Shop candles
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderConfirmation;
