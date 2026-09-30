import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import studioWall from '../assets/textures/studio-wall.jpg';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const CONTACT_INFO = {
    company: 'ENPEE HANDCRAFTS',
    address: 'Office No. 412, Aqua Corel, Nr. Kataria Chokdi, 2nd Ring Road, Mota Mava, Rajkot - 360005, Gujarat',
    phone: '+91 91739 58589 / +91 94088 66266',
    whatsapp: '919173958589',
    email: 'enpeecandles@gmail.com',
    gstin: '24ERGPB1394P1ZH',
};

const TABS = [
    { id: 'general', label: 'General' },
    { id: 'trade', label: 'Trade' },
    { id: 'bulk', label: 'Bulk' },
];

const toastOk = {
    duration: 4000,
    position: 'top-center',
    style: { background: '#4A2A1A', color: '#FAF6EF', fontWeight: '600' },
};

const Field = ({ label, hint, children }) => (
    <label className="flex flex-col gap-2">
        <span className="font-jost text-sm text-[#4A2A1A]">{label}</span>
        {children}
        {hint ? <span className="font-jost text-xs text-[#4A2A1A]/70">{hint}</span> : null}
    </label>
);

const ContactUs = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [products, setProducts] = useState([]);
    const [generalForm, setGeneralForm] = useState({ name: '', email: '', message: '' });
    const [tradeForm, setTradeForm] = useState({
        name: '',
        contactNo: '',
        companyName: '',
        email: '',
        remarks: '',
    });
    const [bulkForm, setBulkForm] = useState({
        name: '',
        companyName: '',
        phoneNo: '',
        email: '',
        categoryCode: 'option1',
        items: [{ productName: '', quantity: '' }],
    });

    useEffect(() => {
        fetch(API_ENDPOINTS.PRODUCTS)
            .then((res) => res.json())
            .then((data) => setProducts(Array.isArray(data) ? data : []))
            .catch((err) => console.error('Error fetching products:', err));
    }, []);

    const handleGeneralSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_ENDPOINTS.GENERAL_INQUIRY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(generalForm),
            });
            if (response.ok) {
                toast.success('Message sent. We will reply shortly.', toastOk);
                setGeneralForm({ name: '', email: '', message: '' });
            } else {
                toast.error('Could not send the message. Try again.');
            }
        } catch (error) {
            console.error('Error submitting general inquiry:', error);
            toast.error('Could not send the message. Try again.');
        }
    };

    const handleTradeSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_ENDPOINTS.TRADE_INQUIRY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tradeForm),
            });
            if (response.ok) {
                toast.success('Trade inquiry sent. We will WhatsApp you within 24 hours.', toastOk);
                setTradeForm({ name: '', contactNo: '', companyName: '', email: '', remarks: '' });
            } else {
                toast.error('Could not send the inquiry. Try again.');
            }
        } catch (error) {
            console.error('Error submitting trade inquiry:', error);
            toast.error('Could not send the inquiry. Try again.');
        }
    };

    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        const totalQuantity = bulkForm.items.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);

        if (totalQuantity <= 100) {
            toast.error('Bulk orders need more than 100 pieces in total.');
            return;
        }

        const hasEmptyFields = bulkForm.items.some((item) => !item.productName.trim() || !item.quantity);
        if (hasEmptyFields) {
            toast.error('Fill in every product and quantity.');
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.BULK_INQUIRY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...bulkForm, totalQuantity }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Bulk inquiry sent. We will contact you soon.', toastOk);
                setBulkForm({
                    name: '',
                    companyName: '',
                    phoneNo: '',
                    email: '',
                    categoryCode: 'option1',
                    items: [{ productName: '', quantity: '' }],
                });
            } else {
                toast.error(data.error || 'Could not send the inquiry. Try again.');
            }
        } catch (error) {
            console.error('Error submitting bulk order inquiry:', error);
            toast.error('Could not send the inquiry. Try again.');
        }
    };

    const addBulkItem = () => {
        setBulkForm({
            ...bulkForm,
            items: [...bulkForm.items, { productName: '', quantity: '' }],
        });
    };

    const removeBulkItem = (index) => {
        const newItems = bulkForm.items.filter((_, i) => i !== index);
        setBulkForm({
            ...bulkForm,
            items: newItems.length > 0 ? newItems : [{ productName: '', quantity: '' }],
        });
    };

    const updateBulkItem = (index, field, value) => {
        const newItems = [...bulkForm.items];
        newItems[index][field] = value;
        setBulkForm({ ...bulkForm, items: newItems });
    };

    const totalPieces = bulkForm.items.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);

    return (
        <div className="lp relative min-h-[100dvh] w-full overflow-x-hidden bg-[#FAF6EF] text-[#4A2A1A]">
            <div className="pointer-events-none absolute inset-0">
                <img src={studioWall} alt="" className="h-full w-full object-cover opacity-25" />
                <div className="absolute inset-0 bg-[#FAF6EF]/75" />
            </div>

            <div className="relative z-10">
                <Navbar />
                <main id="main-content" className="mx-auto w-full max-w-[1400px] px-5 pb-24 pt-10 sm:px-10 lg:px-16">
                    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
                        <div className="lg:col-span-7">
                            <h1 className="lp-display text-4xl leading-[1.1] md:text-5xl">Write to us</h1>
                            <p className="lp-lede mt-4 max-w-[65ch] text-[#4A2A1A]/70">
                                Tell us what you need. We reply on WhatsApp and email.
                            </p>

                            <div className="lp-seg mt-8 max-w-md" role="tablist" aria-label="Inquiry type">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={activeTab === tab.id}
                                        data-on={activeTab === tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {activeTab === 'general' && (
                                <form className="mt-8 max-w-xl space-y-5" onSubmit={handleGeneralSubmit}>
                                    <Field label="Full name">
                                        <input
                                            className="lp-field"
                                            name="name"
                                            type="text"
                                            required
                                            autoComplete="name"
                                            value={generalForm.name}
                                            onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                                        />
                                    </Field>
                                    <Field label="Email">
                                        <input
                                            className="lp-field"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={generalForm.email}
                                            onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                                        />
                                    </Field>
                                    <Field label="Message">
                                        <textarea
                                            className="lp-field"
                                            name="message"
                                            required
                                            value={generalForm.message}
                                            onChange={(e) => setGeneralForm({ ...generalForm, message: e.target.value })}
                                        />
                                    </Field>
                                    <button type="submit" className="lp-btn lp-btn-primary">
                                        Send
                                    </button>
                                </form>
                            )}

                            {activeTab === 'trade' && (
                                <form className="mt-8 max-w-xl space-y-5" onSubmit={handleTradeSubmit}>
                                    <Field label="Name">
                                        <input
                                            className="lp-field"
                                            type="text"
                                            required
                                            autoComplete="name"
                                            value={tradeForm.name}
                                            onChange={(e) => setTradeForm({ ...tradeForm, name: e.target.value })}
                                        />
                                    </Field>
                                    <Field label="Contact number">
                                        <input
                                            className="lp-field"
                                            type="tel"
                                            required
                                            autoComplete="tel"
                                            value={tradeForm.contactNo}
                                            onChange={(e) => setTradeForm({ ...tradeForm, contactNo: e.target.value })}
                                        />
                                    </Field>
                                    <Field label="Company name">
                                        <input
                                            className="lp-field"
                                            type="text"
                                            required
                                            autoComplete="organization"
                                            value={tradeForm.companyName}
                                            onChange={(e) => setTradeForm({ ...tradeForm, companyName: e.target.value })}
                                        />
                                    </Field>
                                    <Field label="Email">
                                        <input
                                            className="lp-field"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={tradeForm.email}
                                            onChange={(e) => setTradeForm({ ...tradeForm, email: e.target.value })}
                                        />
                                    </Field>
                                    <Field label="Remarks" hint="We will contact you on WhatsApp within 24 hours.">
                                        <textarea
                                            className="lp-field"
                                            value={tradeForm.remarks}
                                            onChange={(e) => setTradeForm({ ...tradeForm, remarks: e.target.value })}
                                        />
                                    </Field>
                                    <button type="submit" className="lp-btn lp-btn-primary">
                                        Send
                                    </button>
                                </form>
                            )}

                            {activeTab === 'bulk' && (
                                <form className="mt-8 max-w-xl space-y-5" onSubmit={handleBulkSubmit}>
                                    <Field label="Name">
                                        <input
                                            className="lp-field"
                                            type="text"
                                            required
                                            autoComplete="name"
                                            value={bulkForm.name}
                                            onChange={(e) => setBulkForm({ ...bulkForm, name: e.target.value })}
                                        />
                                    </Field>
                                    <Field label="Company name">
                                        <input
                                            className="lp-field"
                                            type="text"
                                            required
                                            autoComplete="organization"
                                            value={bulkForm.companyName}
                                            onChange={(e) => setBulkForm({ ...bulkForm, companyName: e.target.value })}
                                        />
                                    </Field>
                                    <Field label="Phone">
                                        <input
                                            className="lp-field"
                                            type="tel"
                                            required
                                            autoComplete="tel"
                                            value={bulkForm.phoneNo}
                                            onChange={(e) => setBulkForm({ ...bulkForm, phoneNo: e.target.value })}
                                        />
                                    </Field>
                                    <Field label="Email">
                                        <input
                                            className="lp-field"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={bulkForm.email}
                                            onChange={(e) => setBulkForm({ ...bulkForm, email: e.target.value })}
                                        />
                                    </Field>

                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="font-jost text-sm text-[#4A2A1A]">Items and quantities</p>
                                            <button
                                                type="button"
                                                onClick={addBulkItem}
                                                className="font-jost text-sm text-[#4A2A1A] hover:text-[#4A2A1A]"
                                            >
                                                Add item
                                            </button>
                                        </div>
                                        {bulkForm.items.map((item, index) => (
                                            <div key={index} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_7rem_auto]">
                                                <label className="flex flex-col gap-2">
                                                    <span className="font-jost text-sm text-[#4A2A1A]">Product</span>
                                                    <select
                                                        className="lp-field"
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
                                                </label>
                                                <label className="flex flex-col gap-2">
                                                    <span className="font-jost text-sm text-[#4A2A1A]">Qty</span>
                                                    <input
                                                        className="lp-field"
                                                        type="number"
                                                        min="1"
                                                        required
                                                        value={item.quantity}
                                                        onChange={(e) => updateBulkItem(index, 'quantity', e.target.value)}
                                                        aria-label="Quantity"
                                                    />
                                                </label>
                                                {bulkForm.items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeBulkItem(index)}
                                                        aria-label="Remove item"
                                                        className="flex h-12 w-12 items-center justify-center rounded-[12px] text-[#4A2A1A]/70 hover:text-[#4A2A1A]"
                                                    >
                                                        <span className="material-symbols-outlined" aria-hidden="true">
                                                            delete
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <div className="flex items-center justify-between rounded-[12px] bg-[#EDE0C8] px-4 py-3">
                                            <p className="font-jost text-sm text-[#4A2A1A]/70">Total pieces</p>
                                            <p className="font-jost text-lg tabular-nums text-[#4A2A1A]">{totalPieces}</p>
                                        </div>
                                        <p className="font-jost text-xs text-[#4A2A1A]/70">
                                            Total must be more than 100 pieces.
                                        </p>
                                    </div>
                                    <button type="submit" className="lp-btn lp-btn-primary">
                                        Send
                                    </button>
                                </form>
                            )}
                        </div>

                        <aside className="lg:col-span-5">
                            <div className="overflow-hidden rounded-[20px] bg-[#EDE0C8]">
                                <div className="relative aspect-[4/3]">
                                    <img src={studioWall} alt="Fleroma studio wall" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6EF] to-transparent" />
                                </div>
                                <div className="space-y-6 p-6 sm:p-8">
                                    <div>
                                        <p className="lp-display text-2xl leading-[1.1]">{CONTACT_INFO.company}</p>
                                        <p className="mt-2 font-jost text-sm text-[#4A2A1A]/70">
                                            GSTIN {CONTACT_INFO.gstin}. MSME registered.
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-jost text-sm text-[#4A2A1A]/70">Email</p>
                                        <a
                                            href={`mailto:${CONTACT_INFO.email}`}
                                            className="mt-1 block font-jost text-[#4A2A1A] hover:text-[#4A2A1A]"
                                        >
                                            {CONTACT_INFO.email}
                                        </a>
                                    </div>
                                    <div>
                                        <p className="font-jost text-sm text-[#4A2A1A]/70">Phone</p>
                                        <a
                                            href="tel:+919173958589"
                                            className="mt-1 block font-jost text-[#4A2A1A] hover:text-[#4A2A1A]"
                                        >
                                            {CONTACT_INFO.phone}
                                        </a>
                                    </div>
                                    <div>
                                        <p className="font-jost text-sm text-[#4A2A1A]/70">Studio</p>
                                        <p className="mt-1 max-w-[40ch] font-jost text-sm text-[#4A2A1A]">{CONTACT_INFO.address}</p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ContactUs;
