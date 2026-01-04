import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import heroBg from '../assets/hero-bg.png';
import productPlaceholder from '../assets/product-placeholder.png';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const CONTACT_INFO = {
    address: 'Sanidhya, Fieldmarshal road, Mota Mava, Rajkot - 360005',
    phone: '+91 91739 58589',
    email: 'contact@enpeescandles.com'
};

const ContactUs = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [products, setProducts] = useState([]);

    // Fetch products for dropdown
    useEffect(() => {
        fetch(API_ENDPOINTS.PRODUCTS)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    // General Contact Form State
    const [generalForm, setGeneralForm] = useState({ name: '', email: '', message: '' });

    // Trade Inquiry Form State
    const [tradeForm, setTradeForm] = useState({
        name: '',
        contactNo: '',
        companyName: '',
        email: '',
        remarks: ''
    });

    // Bulk Order Form State
    const [bulkForm, setBulkForm] = useState({
        name: '',
        companyName: '',
        phoneNo: '',
        email: '',
        categoryCode: 'option1',
        items: [{ productName: '', quantity: '' }]
    });

    const handleGeneralSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_ENDPOINTS.GENERAL_INQUIRY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(generalForm)
            });

            if (response.ok) {
                toast.success('Message sent successfully! We\'ll get back to you soon.', {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: '#D8A24A',
                        color: '#3B2A23',
                        fontWeight: 'bold',
                    },
                });
                setGeneralForm({ name: '', email: '', message: '' });
            } else {
                toast.error('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting general inquiry:', error);
            toast.error('Error sending message. Please try again.');
        }
    };

    const handleTradeSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_ENDPOINTS.TRADE_INQUIRY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tradeForm)
            });

            if (response.ok) {
                toast.success('Trade inquiry submitted! We\'ll contact you on WhatsApp within 24 hours.', {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: '#D8A24A',
                        color: '#3B2A23',
                        fontWeight: 'bold',
                    },
                });
                setTradeForm({ name: '', contactNo: '', companyName: '', email: '', remarks: '' });
            } else {
                toast.error('Failed to submit inquiry. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting trade inquiry:', error);
            toast.error('Error submitting inquiry. Please try again.');
        }
    };

    const handleBulkSubmit = async (e) => {
        e.preventDefault();

        // Calculate total quantity across all items
        const totalQuantity = bulkForm.items.reduce((sum, item) => {
            const qty = parseInt(item.quantity) || 0;
            return sum + qty;
        }, 0);

        // Client-side validation for total quantity
        if (totalQuantity <= 100) {
            toast.error('Total quantity must be more than 100 pieces for bulk orders.', {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: 'white',
                    fontWeight: 'bold',
                },
            });
            return;
        }

        // Validate that all items have both name and quantity
        const hasEmptyFields = bulkForm.items.some(item => !item.productName.trim() || !item.quantity);
        if (hasEmptyFields) {
            toast.error('Please fill in all product names and quantities.', {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: 'white',
                    fontWeight: 'bold',
                },
            });
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.BULK_INQUIRY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...bulkForm, totalQuantity })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Bulk order inquiry submitted successfully! We\'ll contact you soon.', {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: '#D8A24A',
                        color: '#3B2A23',
                        fontWeight: 'bold',
                    },
                });
                setBulkForm({ name: '', companyName: '', phoneNo: '', email: '', categoryCode: 'option1', items: [{ productName: '', quantity: '' }] });
            } else {
                toast.error(data.error || 'Failed to submit inquiry. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting bulk order inquiry:', error);
            toast.error('Error submitting inquiry. Please try again.');
        }
    };

    // Helper functions for managing items in bulk order form
    const addBulkItem = () => {
        setBulkForm({
            ...bulkForm,
            items: [...bulkForm.items, { productName: '', quantity: '' }]
        });
    };

    const removeBulkItem = (index) => {
        const newItems = bulkForm.items.filter((_, i) => i !== index);
        setBulkForm({
            ...bulkForm,
            items: newItems.length > 0 ? newItems : [{ productName: '', quantity: '' }]
        });
    };

    const updateBulkItem = (index, field, value) => {
        const newItems = [...bulkForm.items];
        newItems[index][field] = value;
        setBulkForm({
            ...bulkForm,
            items: newItems
        });
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#f8f7f6] dark:bg-[#201b12] overflow-x-hidden font-['Inter',_sans-serif]">
            {/* Full-bleed Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroBg})` }}
                ></div>
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            <div className="relative z-10 flex h-full grow flex-col">
                <Navbar />
                {/* Main Content */}
                <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    {/* Central Glassmorphic Card */}
                    <div className="w-full max-w-6xl rounded-xl bg-[#FFF7ED]/70 backdrop-blur-lg shadow-2xl ring-1 ring-white/20 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left side: Forms with Tabs */}
                            <div className="p-8 md:p-12">
                                <h1 className="font-['Italiana',_serif] text-4xl sm:text-5xl font-black leading-tight tracking-wide text-[#554B47] mb-2">
                                    Get in Touch
                                </h1>
                                <p className="text-[#554B47]/80 mb-6">
                                    Choose the type of inquiry below and we'll get back to you shortly.
                                </p>

                                {/* Tabs */}
                                <div className="flex gap-2 mb-6 border-b border-[#EAD2C0]/30">
                                    <button
                                        onClick={() => setActiveTab('general')}
                                        className={`px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'general'
                                            ? 'text-[#9F7A54] border-b-2 border-[#9F7A54]'
                                            : 'text-[#554B47]/60 hover:text-[#554B47]'
                                            }`}
                                    >
                                        General Contact
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('trade')}
                                        className={`px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'trade'
                                            ? 'text-[#9F7A54] border-b-2 border-[#9F7A54]'
                                            : 'text-[#554B47]/60 hover:text-[#554B47]'
                                            }`}
                                    >
                                        Trade Inquiries
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('bulk')}
                                        className={`px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'bulk'
                                            ? 'text-[#9F7A54] border-b-2 border-[#9F7A54]'
                                            : 'text-[#554B47]/60 hover:text-[#554B47]'
                                            }`}
                                    >
                                        Bulk Orders
                                    </button>
                                </div>

                                {/* General Contact Form */}
                                {activeTab === 'general' && (
                                    <form className="space-y-6" onSubmit={handleGeneralSubmit}>
                                        <label className="flex flex-col">
                                            <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Full Name *</p>
                                            <input
                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-14 placeholder:text-[#554B47]/50 px-4 text-base font-normal leading-normal"
                                                name="name"
                                                placeholder="Enter your full name"
                                                type="text"
                                                required
                                                value={generalForm.name}
                                                onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                                            />
                                        </label>
                                        <label className="flex flex-col">
                                            <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Email Address *</p>
                                            <input
                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-14 placeholder:text-[#554B47]/50 px-4 text-base font-normal leading-normal"
                                                name="email"
                                                placeholder="Enter your email address"
                                                type="email"
                                                required
                                                value={generalForm.email}
                                                onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                                            />
                                        </label>
                                        <label className="flex flex-col">
                                            <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Message *</p>
                                            <textarea
                                                className="flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 placeholder:text-[#554B47]/50 p-4 text-base font-normal leading-normal min-h-[140px]"
                                                name="message"
                                                placeholder="Your message..."
                                                rows="5"
                                                required
                                                value={generalForm.message}
                                                onChange={(e) => setGeneralForm({ ...generalForm, message: e.target.value })}
                                            ></textarea>
                                        </label>
                                        <div>
                                            <button
                                                className="w-full flex items-center justify-center rounded-lg h-14 px-6 bg-[#9F7A54] text-white font-bold leading-normal tracking-wide shadow-lg hover:bg-[#8A6A4A] transition-all duration-200"
                                                type="submit"
                                            >
                                                Send Message
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Trade Inquiries Form */}
                                {activeTab === 'trade' && (
                                    <form className="space-y-6" onSubmit={handleTradeSubmit}>
                                        <label className="flex flex-col">
                                            <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Name *</p>
                                            <input
                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-14 placeholder:text-[#554B47]/50 px-4 text-base font-normal leading-normal"
                                                placeholder="Enter your name"
                                                type="text"
                                                required
                                                value={tradeForm.name}
                                                onChange={(e) => setTradeForm({ ...tradeForm, name: e.target.value })}
                                            />
                                        </label>
                                        <label className="flex flex-col">
                                            <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Contact No *</p>
                                            <input
                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-14 placeholder:text-[#554B47]/50 px-4 text-base font-normal leading-normal"
                                                placeholder="Enter your contact number"
                                                type="tel"
                                                required
                                                value={tradeForm.contactNo}
                                                onChange={(e) => setTradeForm({ ...tradeForm, contactNo: e.target.value })}
                                            />
                                        </label>
                                        <label className="flex flex-col">
                                            <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Company Name *</p>
                                            <input
                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-14 placeholder:text-[#554B47]/50 px-4 text-base font-normal leading-normal"
                                                placeholder="Enter your company name"
                                                type="text"
                                                required
                                                value={tradeForm.companyName}
                                                onChange={(e) => setTradeForm({ ...tradeForm, companyName: e.target.value })}
                                            />
                                        </label>
                                        <label className="flex flex-col">
                                            <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Email *</p>
                                            <input
                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-14 placeholder:text-[#554B47]/50 px-4 text-base font-normal leading-normal"
                                                placeholder="Enter your email address"
                                                type="email"
                                                required
                                                value={tradeForm.email}
                                                onChange={(e) => setTradeForm({ ...tradeForm, email: e.target.value })}
                                            />
                                        </label>
                                        <label className="flex flex-col">
                                            <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Remarks</p>
                                            <textarea
                                                className="flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 placeholder:text-[#554B47]/50 p-4 text-base font-normal leading-normal min-h-[120px]"
                                                placeholder="What is the purpose of your inquiry?"
                                                rows="4"
                                                value={tradeForm.remarks}
                                                onChange={(e) => setTradeForm({ ...tradeForm, remarks: e.target.value })}
                                            ></textarea>
                                            <p className="text-xs text-[#554B47]/60 mt-2 italic">
                                                * We will contact you in 24hrs on WhatsApp
                                            </p>
                                        </label>
                                        <div>
                                            <button
                                                className="w-full flex items-center justify-center rounded-lg h-14 px-6 bg-[#9F7A54] text-white font-bold leading-normal tracking-wide shadow-lg hover:bg-[#8A6A4A] transition-all duration-200"
                                                type="submit"
                                            >
                                                Send Inquiry
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Bulk Order Form */}
                                {activeTab === 'bulk' && (
                                    <form className="space-y-6" onSubmit={handleBulkSubmit}>
                                        <label className="flex flex-col">
                                            <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Name *</p>
                                            <input
                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-14 placeholder:text-[#554B47]/50 px-4 text-base font-normal leading-normal"
                                                placeholder="Enter your name"
                                                type="text"
                                                required
                                                value={bulkForm.name}
                                                onChange={(e) => setBulkForm({ ...bulkForm, name: e.target.value })}
                                            />
                                        </label>
                                        <label className="flex flex-col">
                                            <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Company Name *</p>
                                            <input
                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-14 placeholder:text-[#554B47]/50 px-4 text-base font-normal leading-normal"
                                                placeholder="Enter your company name"
                                                type="text"
                                                required
                                                value={bulkForm.companyName}
                                                onChange={(e) => setBulkForm({ ...bulkForm, companyName: e.target.value })}
                                            />
                                        </label>
                                        <label className="flex flex-col">
                                            <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Phone No *</p>
                                            <input
                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-14 placeholder:text-[#554B47]/50 px-4 text-base font-normal leading-normal"
                                                placeholder="Enter your phone number"
                                                type="tel"
                                                required
                                                value={bulkForm.phoneNo}
                                                onChange={(e) => setBulkForm({ ...bulkForm, phoneNo: e.target.value })}
                                            />
                                        </label>
                                        <label className="flex flex-col">
                                            <p className="text-[#554B47] text-sm font-medium leading-normal pb-2">Email *</p>
                                            <input
                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-14 placeholder:text-[#554B47]/50 px-4 text-base font-normal leading-normal"
                                                placeholder="Enter your email address"
                                                type="email"
                                                required
                                                value={bulkForm.email}
                                                onChange={(e) => setBulkForm({ ...bulkForm, email: e.target.value })}
                                            />
                                        </label>

                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center pb-2">
                                                <p className="text-[#554B47] text-sm font-medium leading-normal">Items & Quantities *</p>
                                                <button
                                                    type="button"
                                                    onClick={addBulkItem}
                                                    className="text-[#9F7A54] hover:text-[#8A6A4A] text-sm font-semibold flex items-center gap-1"
                                                >
                                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                                    Add Item
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {bulkForm.items.map((item, index) => (
                                                    <div key={index} className="flex gap-2 items-start">
                                                        <div className="flex-1">
                                                            <select
                                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-14 placeholder:text-[#554B47]/50 px-4 text-base font-normal leading-normal"
                                                                required
                                                                value={item.productName}
                                                                onChange={(e) => updateBulkItem(index, 'productName', e.target.value)}
                                                            >
                                                                <option value="">Select a product</option>
                                                                {products.map((product) => (
                                                                    <option key={product._id} value={product.name}>
                                                                        {product.name} - ₹{product.price}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="w-32">
                                                            <input
                                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#554B47] focus:outline-none focus:ring-2 focus:ring-[#9F7A54]/50 border border-[#EAD2C0]/50 bg-[#FFF7ED]/50 h-14 placeholder:text-[#554B47]/50 px-4 text-base font-normal leading-normal"
                                                                placeholder="Qty"
                                                                type="number"
                                                                min="1"
                                                                required
                                                                value={item.quantity}
                                                                onChange={(e) => updateBulkItem(index, 'quantity', e.target.value)}
                                                            />
                                                        </div>
                                                        {bulkForm.items.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeBulkItem(index)}
                                                                className="h-14 w-14 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                                            >
                                                                <span className="material-symbols-outlined">delete</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between mt-3 p-4 bg-[#9F7A54]/10 rounded-lg border border-[#9F7A54]/30">
                                                <p className="text-[#554B47] text-sm font-semibold">Total Quantity:</p>
                                                <p className="text-[#9F7A54] text-lg font-bold">
                                                    {bulkForm.items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)} pieces
                                                </p>
                                            </div>
                                            <p className="text-xs text-[#554B47]/60 mt-2 italic">
                                                * Total quantity must be more than 100 pieces
                                            </p>
                                        </div>
                                        <div>
                                            <button
                                                className="w-full flex items-center justify-center rounded-lg h-14 px-6 bg-[#9F7A54] text-white font-bold leading-normal tracking-wide shadow-lg hover:bg-[#8A6A4A] transition-all duration-200"
                                                type="submit"
                                            >
                                                Send Inquiry
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Right side: Image and Contact Info */}
                            <div className="relative min-h-[300px] lg:min-h-full">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${productPlaceholder})` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/60 lg:via-black/20 lg:to-transparent"></div>
                                <div className="relative flex flex-col justify-end h-full p-8 text-white">
                                    <div className="space-y-5">
                                        <div className="flex items-start gap-4">
                                            <span className="material-symbols-outlined mt-1 text-[#C9A875]">mail</span>
                                            <div>
                                                <p className="font-semibold">Email</p>
                                                <p className="text-white/80 text-sm">{CONTACT_INFO.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <span className="material-symbols-outlined mt-1 text-[#C9A875]">call</span>
                                            <div>
                                                <p className="font-semibold">Phone</p>
                                                <a href={`tel:${CONTACT_INFO.phone}`} className="text-white/80 text-sm hover:text-[#C9A875] transition-colors">{CONTACT_INFO.phone}</a>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <span className="material-symbols-outlined mt-1 text-[#C9A875]">location_on</span>
                                            <div>
                                                <p className="font-semibold">Address</p>
                                                <p className="text-white/80 text-sm">{CONTACT_INFO.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ContactUs;
