import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { makeUpiLink } from '../lib/checkoutHelpers';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const Payment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const orderData = state?.orderData || null;
    const amount = orderData?.totals?.total || 0;
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const upiLink = makeUpiLink({ amount: 0 });

    const handleFile = (e) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    const uploadConfirmation = async () => {
        if (!file) return toast.error('Select a screenshot to upload');
        setUploading(true);

        try {
            const fd = new FormData();
            fd.append('screenshot', file);
            fd.append('orderData', JSON.stringify(orderData));

            const res = await fetch(API_ENDPOINTS.CONFIRM_PAYMENT, { method: 'POST', body: fd });
            const data = await res.json();

            if (res.ok) {
                toast.success('Payment received. Order placed.');
                navigate('/order-confirmation', { state: { order: data.order } });
            } else {
                toast.error(data.error || 'Could not confirm payment');
            }
        } catch (err) {
            console.error(err);
            toast.error('Could not confirm payment');
        } finally {
            setUploading(false);
        }
    };

    if (!orderData) {
        return (
            <div className="lp relative min-h-[100dvh] w-full bg-[#2A1D15] text-[#EDE6D8]">
                <Navbar />
                <main className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-10 lg:px-16">
                    <h1 className="lp-display text-4xl leading-[1.1] md:text-5xl">No order to pay</h1>
                    <p className="lp-lede mt-4 max-w-[65ch] text-[#C7BCA8]">Finish checkout first, then come back here.</p>
                    <Link to="/shop" className="lp-btn lp-btn-primary mt-8">
                        Shop candles
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="lp relative min-h-[100dvh] w-full bg-[#2A1D15] text-[#EDE6D8]">
            <Navbar />
            <main className="mx-auto w-full max-w-[1400px] px-5 pb-24 pt-10 sm:px-10 lg:px-16">
                <header className="max-w-xl">
                    <h1 className="lp-display text-4xl leading-[1.1] md:text-5xl">Pay the studio</h1>
                    <p className="lp-lede mt-4 max-w-[65ch] text-[#C7BCA8]">
                        Scan the QR or open UPI, then upload the screenshot.
                    </p>
                </header>

                <p className="mt-8 font-jost text-sm text-[#C7BCA8]">Amount</p>
                <p className="font-jost text-3xl tabular-nums text-[#D3A34E]">₹{amount.toFixed(2)}</p>

                <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-[20px] bg-[#3B2A1E] p-5 sm:p-8">
                        <h2 className="lp-display text-2xl leading-[1.1]">Scan QR</h2>
                        <div className="mt-6 flex justify-center rounded-[12px] bg-[#EDE6D8] p-4">
                            <img src="/IMG_9865.PNG" alt="UPI payment QR code" className="h-auto w-full max-w-[220px]" />
                        </div>
                        <p className="mt-4 font-jost text-sm text-[#C7BCA8]">Open any UPI app and scan.</p>
                    </div>

                    <div className="rounded-[20px] bg-[#3B2A1E] p-5 sm:p-8">
                        <h2 className="lp-display text-2xl leading-[1.1]">Open UPI</h2>
                        <p className="lp-lede mt-3 text-[#C7BCA8]">Opens Google Pay, PhonePe, Paytm, or BHIM on your phone.</p>
                        <a href={upiLink} className="lp-btn lp-btn-primary mt-6 w-full sm:w-auto">
                            Open UPI
                        </a>
                    </div>
                </div>

                <div className="mt-6 rounded-[20px] bg-[#3B2A1E] p-5 sm:p-8">
                    <h2 className="lp-display text-2xl leading-[1.1]">Upload screenshot</h2>
                    <p className="lp-lede mt-3 max-w-[65ch] text-[#C7BCA8]">
                        After you pay, add a photo of the successful transaction.
                    </p>
                    <label className="mt-6 block cursor-pointer">
                        <span className="sr-only">Payment screenshot</span>
                        <div className="rounded-[12px] border border-dashed border-[#D3A34E]/40 px-4 py-8 text-center">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Selected payment screenshot" className="mx-auto max-h-48 rounded-[12px]" />
                            ) : (
                                <p className="font-jost text-sm text-[#C7BCA8]">Tap to choose a PNG or JPG</p>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
                    </label>
                    <button
                        type="button"
                        onClick={uploadConfirmation}
                        disabled={uploading || !file}
                        className="lp-btn lp-btn-primary mt-6 w-full disabled:opacity-50 sm:w-auto"
                    >
                        {uploading ? 'Uploading' : 'Confirm payment'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Payment;
