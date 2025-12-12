import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';

const OrderConfirmation = () => {
    return (
        <div className="min-h-screen bg-[#3B2A23] font-['Inter',_sans-serif] text-[#FFF7ED]">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center px-4">
                <div className="bg-[#FFF7ED]/10 p-8 rounded-2xl backdrop-blur-sm border border-[#FFF7ED]/20 max-w-md w-full">
                    <span className="material-symbols-outlined text-6xl text-[#D8A24A] mb-4">check_circle</span>
                    <h1 className="text-3xl font-bold mb-2 font-['Italiana',_serif]">Order Confirmed!</h1>
                    <p className="text-[#EAD2C0] mb-8">Thank you for your purchase. Your order has been received and is being processed. You will receive a confirmation email shortly.</p>
                    <div className="space-y-3">
                        <Link to="/my-orders" className="block">
                            <Button className="w-full bg-[#D8A24A] text-[#3B2A23] hover:bg-[#D8A24A]/90 font-bold">
                                Track Your Order
                            </Button>
                        </Link>
                        <Link to="/" className="block">
                            <Button variant="outline" className="w-full border-[#EAD2C0] text-[#EAD2C0] hover:bg-[#FFF7ED]/10">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
