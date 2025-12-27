import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { makeUpiLink } from '../lib/checkoutHelpers';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order || null;
  const amount = order?.totals?.total || 0;
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const upiLink = makeUpiLink({ amount: amount.toFixed(2) });

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
    const fd = new FormData();
    fd.append('screenshot', file);
    if (order?.orderId) fd.append('orderId', order.orderId);
    try {
      const res = await fetch(API_ENDPOINTS.CONFIRM_PAYMENT, { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        toast.success('Payment confirmation uploaded successfully!');
        navigate('/order-confirmation');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally { setUploading(false); }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[#3B2A23] font-['Inter',_sans-serif] text-[#FFF7ED]">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center space-y-6">
            <span className="material-symbols-outlined text-6xl text-[#D8A24A]">error</span>
            <h2 className="text-4xl font-['Italiana',_serif] font-bold">No Order Found</h2>
            <p className="text-[#EAD2C0] text-lg">Please complete checkout first.</p>
            <Button onClick={() => navigate('/shop')} className="bg-[#D8A24A] text-[#3B2A23] hover:bg-[#D8A24A]/90">
              Go to Shop
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3B2A23] font-['Inter',_sans-serif] text-[#FFF7ED] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D8A24A]/10 to-transparent"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-5xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Italiana',_serif] text-[#FFF7ED] mb-3 sm:mb-4">Complete Payment</h1>
            <p className="text-[#EAD2C0] text-base sm:text-lg">Choose your preferred payment method below</p>
          </div>

          <div className="bg-[#FFF7ED]/10 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#FFF7ED]/20 shadow-2xl space-y-8">
            {/* Order Summary */}
            <div className="p-6 rounded-xl bg-[#3B2A23]/50 border border-[#FFF7ED]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#EAD2C0] mb-1">Order ID</p>
                  <p className="text-lg font-semibold">{order?.orderId || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#EAD2C0] mb-1">Amount to Pay</p>
                  <p className="text-3xl font-bold text-[#D8A24A]">₹{amount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QR Code Payment */}
              <div className="p-6 bg-[#3B2A23]/50 rounded-xl border border-[#FFF7ED]/10 hover:border-[#D8A24A]/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-[#D8A24A] text-3xl">qr_code_2</span>
                  <h3 className="text-xl font-bold font-['Italiana',_serif]">Scan QR to Pay</h3>
                </div>
                <div className="w-full flex items-center justify-center p-6 bg-white rounded-xl">
                  {/* QR Code Placeholder - In production, generate actual QR with payment gateway */}
                  <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="200" fill="#FFF7ED" rx="8"/>
                    {/* Simple QR-like pattern */}
                    <rect x="20" y="20" width="60" height="60" fill="#3B2A23" rx="4"/>
                    <rect x="120" y="20" width="60" height="60" fill="#3B2A23" rx="4"/>
                    <rect x="20" y="120" width="60" height="60" fill="#3B2A23" rx="4"/>
                    <rect x="35" y="35" width="30" height="30" fill="#FFF7ED" rx="2"/>
                    <rect x="135" y="35" width="30" height="30" fill="#FFF7ED" rx="2"/>
                    <rect x="35" y="135" width="30" height="30" fill="#FFF7ED" rx="2"/>
                    <rect x="100" y="90" width="80" height="80" fill="#3B2A23" rx="4"/>
                    <text x="50%" y="92%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fill="#3B2A23" fontWeight="bold">₹{amount.toFixed(2)}</text>
                  </svg>
                </div>
                <p className="text-sm text-[#EAD2C0] text-center mt-4">Open any UPI app and scan to pay</p>
              </div>

              {/* UPI Link Payment */}
              <div className="p-6 bg-[#3B2A23]/50 rounded-xl border border-[#FFF7ED]/10 hover:border-[#D8A24A]/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-[#D8A24A] text-3xl">payments</span>
                  <h3 className="text-xl font-bold font-['Italiana',_serif]">Pay via UPI App</h3>
                </div>
                <p className="text-sm text-[#EAD2C0] mb-6">Click the button below to open your preferred UPI app and complete the payment instantly.</p>
                <a 
                  href={upiLink} 
                  className="block w-full px-6 py-4 rounded-xl bg-[#D8A24A] text-[#3B2A23] font-bold text-center hover:bg-[#D8A24A]/90 transition-all shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">open_in_new</span>
                    Open UPI App
                  </span>
                </a>
                <div className="mt-6 space-y-2">
                  <p className="text-xs text-[#EAD2C0] font-semibold">Supported Apps:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#FFF7ED]/10 rounded-full text-xs">Google Pay</span>
                    <span className="px-3 py-1 bg-[#FFF7ED]/10 rounded-full text-xs">PhonePe</span>
                    <span className="px-3 py-1 bg-[#FFF7ED]/10 rounded-full text-xs">Paytm</span>
                    <span className="px-3 py-1 bg-[#FFF7ED]/10 rounded-full text-xs">BHIM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Payment Confirmation */}
            <div className="p-6 sm:p-8 bg-[#3B2A23]/50 rounded-xl border border-[#FFF7ED]/10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#D8A24A] text-3xl">upload_file</span>
                <h3 className="text-xl font-bold font-['Italiana',_serif]">Upload Payment Screenshot</h3>
              </div>
              <p className="text-sm text-[#EAD2C0] mb-4">After completing the payment, upload a screenshot of your transaction for verification.</p>
              
              <label className="block w-full cursor-pointer">
                <div className="border-2 border-dashed border-[#FFF7ED]/30 rounded-xl p-8 text-center hover:border-[#D8A24A]/50 transition-all">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                      <p className="text-sm text-[#D8A24A]">✓ Screenshot selected</p>
                    </div>
                  ) : (
                    <div>
                      <span className="material-symbols-outlined text-5xl text-[#D8A24A] mb-3 block">add_photo_alternate</span>
                      <p className="text-[#EAD2C0] mb-2">Click to select screenshot</p>
                      <p className="text-xs text-[#EAD2C0]/70">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFile} 
                  className="hidden"
                />
              </label>

              <Button 
                onClick={uploadConfirmation} 
                disabled={uploading || !file}
                className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-4 text-lg rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span>
                    Confirm Payment
                  </span>
                )}
              </Button>
            </div>

            {/* Help Section */}
            <div className="p-6 rounded-xl bg-[#D8A24A]/10 border border-[#D8A24A]/30">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#D8A24A]">info</span>
                <div className="text-sm text-[#EAD2C0]">
                  <p className="font-semibold mb-2">Payment Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Complete payment using QR code or UPI link</li>
                    <li>Take a screenshot of the successful transaction</li>
                    <li>Upload the screenshot above and confirm</li>
                    <li>We will verify and process your order within 24 hours</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
