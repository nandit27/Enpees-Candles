import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LazyImage from '../components/LazyImage';
import { useCart } from '../context/CartContext';
import toast, { Toaster } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const ProductPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product: initialProduct } = location.state || {};
    const [product, setProduct] = useState(initialProduct);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('Natural Beige');
    const [selectedFragrance, setSelectedFragrance] = useState('Woody Flora');
    const [showZoomModal, setShowZoomModal] = useState(false);
    const [customColor, setCustomColor] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { addToCart } = useCart();

    const availableColors = ['Natural Beige', 'Ivory White', 'Soft Pink', 'Charcoal Grey', 'Others'];
    const availableFragrances = ['Woody Flora', 'Peach Miami', 'Jasmine', 'Mogra', 'Berry Blast', 'Kesar Chandan', 'British Rose', 'Vanilla', 'English Lavender'];

    // Fetch latest product data if product ID is available
    useEffect(() => {
        if (initialProduct && initialProduct._id) {
            fetch(API_ENDPOINTS.PRODUCT_BY_ID(initialProduct._id))
                .then(res => res.json())
                .then(data => setProduct(data))
                .catch(err => console.error('Error fetching product:', err));
        }
    }, [initialProduct]);

    // Fetch related products
    useEffect(() => {
        fetch(API_ENDPOINTS.PRODUCTS)
            .then(res => res.json())
            .then(data => {
                // Filter products: same category but different product, or just random if no product
                let filtered = data;
                if (product && product._id) {
                    filtered = data.filter(p => p._id !== product._id);
                    // Prefer same category
                    const sameCategory = filtered.filter(p => p.category === product.category);
                    if (sameCategory.length >= 4) {
                        filtered = sameCategory;
                    }
                }
                // Get random 4 products
                const shuffled = filtered.sort(() => 0.5 - Math.random());
                setRelatedProducts(shuffled.slice(0, 4));
            })
            .catch(err => console.error('Error fetching related products:', err));
    }, [product]);

    // Default data if no product is passed (for testing/direct access)
    const displayProduct = product || {
        name: "Midnight Oud & Amber",
        price: 48,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEOfWOOey5rqQmyCAqamzZ73LChNVerTn6yo_mld0ewxamJLmvd8DSi-nKsQ9VdLu0h62HrYTTAGjmc27tyXlEF6LDA63twxPVGx5ogTgCTyW0o6Qc7ChMp31DVCf4bpeN7LTi1cAadSYKE4MJpBJBQ_jmr5cBscOgvkw3Z1gVcB4-oBnQOQ6J3iyTu7JU0HEyS6QicUgTnytOepGSGpAQgncZmkgqrMeR1C88xV6ELZbQnBaMEr3M_Y84UluZv21qyx1wVPMKCtPb",
        collection: "Signature Collection",
        description: "An intoxicating blend of rare oud wood and golden amber. This candle evokes the warmth of a crackling fire on a cool midnight, wrapped in a blanket of rich, resinous aromas."
    };

    const handleAddToCart = () => {
        const colorToUse = selectedColor === 'Others' ? customColor : selectedColor;
        if (selectedColor === 'Others' && !customColor.trim()) {
            toast.error('Please specify a custom color');
            return;
        }
        for (let i = 0; i < quantity; i++) {
            addToCart(displayProduct, colorToUse, selectedFragrance);
        }
        toast.success(`Added ${quantity} ${displayProduct.name} to cart!`);
    };

    return (
        <div className="relative min-h-screen w-full bg-[#3B2A23] font-['Inter',_sans-serif] text-[#554B47]">
            <Toaster position="top-center" />
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    className="h-full w-full object-cover opacity-80"
                    alt="A warm, cinematic shot of a luxury candle burning in a dark, moody setting."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrolg_tSgwWpWDmbj62biwA6sU3qvHVhuaCo2ycTOxn3L0AWjeiWZ-GbPs3BCInN3qwnJLvyTYHT2Qels1F-1LFrblOEUDm_fk4bgSLd_oppkWcc9jLr_MjXB58cpx0znqfgQ7G9uWmtRCeZeiMs6Pt-q0rVnSkp3i3mAMWstsdi7xptESL15lR6v4fBQo1-PObYbX1vFSceNy5v-wGnXp-S9EwmRkps5QS679Oy9qCrTVlJWvGJ3JwwF97HZLA0u3CjtA1I4DXvQp"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3B2A23]/80 via-transparent to-[#3B2A23]/20"></div>
            </div>

            <div className="relative z-10 flex h-auto min-h-screen w-full flex-col">
                {/* Header */}
                <Navbar />

                <main className="flex-1">
                    <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6 lg:gap-12">
                            {/* Product Images - Compact on Mobile */}
                            <div className="lg:col-span-6 space-y-3">
                                <div 
                                    className="relative aspect-square sm:aspect-[4/5] w-full overflow-hidden rounded-lg sm:rounded-xl cursor-pointer group"
                                    onClick={() => setShowZoomModal(true)}
                                >
                                    <LazyImage
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        alt={displayProduct.name}
                                        src={displayProduct.image}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-5xl opacity-0 group-hover:opacity-100 transition-opacity">zoom_in</span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        Click to view full size
                                    </div>
                                </div>

                            </div>

                            {/* Product Details - Compact on Mobile */}
                            <div className="lg:col-span-4 lg:pt-6">
                                <div className="bg-[#FFF7ED]/80 backdrop-blur-[16px] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-xl sm:shadow-2xl shadow-black/20 sm:shadow-black/30 border border-white/20">
                                    <div className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-6">
                                        <div>
                                            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-['Italiana',_serif] text-[#554B47] leading-tight">{displayProduct.name}</h1>
                                            {displayProduct.offerPrice ? (
                                                <div className="mt-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">Limited time deal</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-red-600 text-sm font-bold">-{Math.round((1 - displayProduct.offerPrice / displayProduct.price) * 100)}%</span>
                                                        <span className="text-2xl sm:text-3xl lg:text-4xl text-[#554B47] font-bold">₹{displayProduct.offerPrice}</span>
                                                    </div>
                                                    <p className="text-sm text-[#554B47]/60 mt-1">
                                                        M.R.P: <span className="line-through">₹{displayProduct.price}</span>
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="mt-1 sm:mt-2 text-lg sm:text-xl lg:text-2xl text-[#554B47]/90 font-semibold">
                                                    {typeof displayProduct.price === 'string' ? displayProduct.price : `₹${displayProduct.price}`}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="flex items-center gap-0.5">
                                                <span className="material-symbols-outlined text-[#d9a24a] text-sm sm:text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-[#d9a24a] text-sm sm:text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-[#d9a24a] text-sm sm:text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-[#d9a24a] text-sm sm:text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-[#d9a24a]/50 text-sm sm:text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                                            </div>
                                            <a className="text-xs sm:text-sm text-[#554B47]/70 hover:text-[#554B47] underline" href="#">128 reviews</a>
                                        </div>
                                        <p className="text-sm sm:text-base leading-relaxed text-[#554B47]/90">
                                            {displayProduct.description || "An intoxicating blend of rare oud wood and golden amber. This candle evokes the warmth of a crackling fire on a cool midnight, wrapped in a blanket of rich, resinous aromas."}
                                        </p>
                                        
                                        {/* Bulk Order Info */}
                                        <div className="bg-[#d9a24a]/10 border border-[#d9a24a]/30 rounded-lg p-3 sm:p-4">
                                            <p className="text-xs sm:text-sm text-[#554B47] flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[#d9a24a]">info</span>
                                                <span>For orders of 100+ units, please contact us for <strong>bulk pricing</strong></span>
                                            </p>
                                        </div>

                                        {/* Color Selection */}
                                        <div className="border-t border-[#554B47]/20 pt-3 sm:pt-4">
                                            <h3 className="text-base sm:text-lg font-semibold text-[#554B47] mb-2">Select Color</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {availableColors.map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`px-3 py-2 rounded-lg border text-xs sm:text-sm transition-all ${
                                                            selectedColor === color
                                                                ? 'bg-[#d9a24a] text-white border-[#d9a24a]'
                                                                : 'bg-white/50 text-[#554B47] border-[#554B47]/20 hover:border-[#d9a24a]/50'
                                                        }`}
                                                    >
                                                        {color}
                                                    </button>
                                                ))}
                                            </div>
                                            {selectedColor === 'Others' && (
                                                <div className="mt-3">
                                                    <textarea
                                                        value={customColor}
                                                        onChange={(e) => setCustomColor(e.target.value)}
                                                        placeholder="Please specify your desired color"
                                                        className="w-full p-3 rounded-lg border border-[#554B47]/20 bg-white/50 text-[#554B47] placeholder-[#554B47]/50 focus:outline-none focus:border-[#d9a24a] focus:ring-2 focus:ring-[#d9a24a]/50 text-sm"
                                                        rows="2"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Fragrance Selection */}
                                        <div className="border-t border-[#554B47]/20 pt-3 sm:pt-4">
                                            <h3 className="text-base sm:text-lg font-semibold text-[#554B47] mb-2">Select Fragrance</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {availableFragrances.map((fragrance) => (
                                                    <button
                                                        key={fragrance}
                                                        onClick={() => setSelectedFragrance(fragrance)}
                                                        className={`px-3 py-2 rounded-lg border text-xs sm:text-sm transition-all ${
                                                            selectedFragrance === fragrance
                                                                ? 'bg-[#d9a24a] text-white border-[#d9a24a]'
                                                                : 'bg-white/50 text-[#554B47] border-[#554B47]/20 hover:border-[#d9a24a]/50'
                                                        }`}
                                                    >
                                                        {fragrance}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t border-[#554B47]/20 pt-3 sm:pt-4 lg:pt-6">
                                            <h2 className="text-lg sm:text-xl lg:text-2xl font-['Italiana',_serif] text-[#554B47] mb-2 sm:mb-3">Dimensions</h2>
                                            {displayProduct.dimensions ? (
                                                <div className="bg-white/50 rounded-lg p-3">
                                                    <p className="text-sm font-semibold text-[#554B47] text-center">{displayProduct.dimensions}</p>
                                                </div>
                                            ) : (
                                                <div className="bg-white/50 rounded-lg p-3">
                                                    <p className="text-sm text-[#554B47]/60 text-center">Not specified</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                                            <div className="flex items-center rounded-lg border border-[#554B47]/20">
                                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 sm:px-3 py-1.5 sm:py-2 text-[#554B47]/60 hover:text-[#554B47] text-sm sm:text-base">-</button>
                                                <input className="w-8 sm:w-10 text-center bg-transparent border-0 text-[#554B47] focus:ring-0 text-sm sm:text-base" type="text" value={quantity} readOnly />
                                                <button onClick={() => setQuantity(quantity + 1)} className="px-2 sm:px-3 py-1.5 sm:py-2 text-[#554B47]/60 hover:text-[#554B47] text-sm sm:text-base">+</button>
                                            </div>
                                            <button 
                                                onClick={handleAddToCart}
                                                className="flex-1 bg-[#d9a24a] text-white font-bold py-2 sm:py-2.5 lg:py-3 px-4 sm:px-5 lg:px-6 rounded-lg shadow-lg shadow-[#d9a24a]/30 hover:brightness-110 transition-all text-sm sm:text-base">
                                                Add to Cart
                                            </button>
                                        </div>
                                        <div className="border-t border-[#554B47]/20 pt-3 sm:pt-4 lg:pt-6 space-y-2 sm:space-y-3">
                                            <h3 className="text-base sm:text-lg lg:text-xl font-['Italiana',_serif] text-[#554B47]">Specifications</h3>
                                            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-[#554B47]/80 list-none">
                                                <li><strong className="font-semibold text-[#554B47]/90">Wax:</strong> {displayProduct.specifications?.wax || '100% Natural Soy Wax Blend'}</li>
                                                <li><strong className="font-semibold text-[#554B47]/90">Wick:</strong> Lead-free Cotton Wick</li>
                                                <li><strong className="font-semibold text-[#554B47]/90">Burn Time:</strong> {displayProduct.specifications?.burningTime || 'Approx. 50-60 hours'}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Reviews */}
                    <div className="mt-16 lg:mt-24 px-4 sm:px-10 md:px-20 lg:px-40">
                        <div className="bg-[#FFF7ED]/70 backdrop-blur-[16px] rounded-xl p-6 md:p-8 shadow-2xl shadow-black/30 border border-white/20">
                            <h2 className="text-3xl lg:text-4xl font-['Italiana',_serif] text-[#554B47] mb-8 text-center">Customer Reviews</h2>
                            <div className="space-y-8 max-w-4xl mx-auto">
                                <div className="border-b border-[#554B47]/20 pb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-bold text-[#554B47]">Eleanor Vance</p>
                                        <div className="flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-[#d9a24a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[#d9a24a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[#d9a24a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[#d9a24a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[#d9a24a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        </div>
                                    </div>
                                    <p className="text-[#554B47]/80 leading-relaxed">"Absolutely divine. The scent fills the entire room without being overpowering. It's the perfect balance of warmth and luxury. The glass vessel is also stunningly beautiful."</p>
                                </div>
                                <div className="border-b border-[#554B47]/20 pb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-bold text-[#554B47]">Marcus Thorne</p>
                                        <div className="flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-[#d9a24a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[#d9a24a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[#d9a24a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[#d9a24a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[#d9a24a]/50 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        </div>
                                    </div>
                                    <p className="text-[#554B47]/80 leading-relaxed">"A truly high-quality candle. It burns cleanly and the scent is very complex and sophisticated. I only wish it had a slightly stronger throw for a larger space."</p>
                                </div>
                                <div className="text-center mt-8">
                                    <a className="text-[#d9a24a] font-semibold hover:underline" href="#">View All Reviews</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* You Might Also Love */}
                    <div className="mt-16 lg:mt-24 px-4 sm:px-10 md:px-20 lg:px-40 pb-24">
                        <h2 className="text-3xl lg:text-4xl font-['Italiana',_serif] text-white mb-8 text-center">You Might Also Love</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className="group cursor-pointer"
                                    onClick={() => {
                                        navigate('/product', { state: { product: item } });
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                                        <LazyImage
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            alt={item.name}
                                            src={item.image}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h3 className="font-['Italiana',_serif] text-xl">{item.name}</h3>
                                            <p className="text-sm mt-1">₹{item.offerPrice || item.price}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Zoom Modal */}
            {showZoomModal && (
                <div 
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setShowZoomModal(false)}
                >
                    <button 
                        className="absolute top-4 right-4 text-white hover:text-[#D8A24A] transition-colors"
                        onClick={() => setShowZoomModal(false)}
                    >
                        <span className="material-symbols-outlined text-4xl">close</span>
                    </button>
                    <img 
                        src={displayProduct.image} 
                        alt={displayProduct.name}
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductPage;
