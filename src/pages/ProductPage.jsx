import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ProductPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product } = location.state || {};
    const [quantity, setQuantity] = useState(1);

    // Default data if no product is passed (for testing/direct access)
    const displayProduct = product || {
        name: "Midnight Oud & Amber",
        price: "₹48",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEOfWOOey5rqQmyCAqamzZ73LChNVerTn6yo_mld0ewxamJLmvd8DSi-nKsQ9VdLu0h62HrYTTAGjmc27tyXlEF6LDA63twxPVGx5ogTgCTyW0o6Qc7ChMp31DVCf4bpeN7LTi1cAadSYKE4MJpBJBQ_jmr5cBscOgvkw3Z1gVcB4-oBnQOQ6J3iyTu7JU0HEyS6QicUgTnytOepGSGpAQgncZmkgqrMeR1C88xV6ELZbQnBaMEr3M_Y84UluZv21qyx1wVPMKCtPb",
        collection: "Signature Collection",
        description: "An intoxicating blend of rare oud wood and golden amber. This candle evokes the warmth of a crackling fire on a cool midnight, wrapped in a blanket of rich, resinous aromas."
    };

    return (
        <div className="relative min-h-screen w-full bg-[#3B2A23] font-['Inter',_sans-serif] text-[#554B47]">
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
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-16">
                        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 sm:gap-8 xl:gap-16">
                            {/* Product Images */}
                            <div className="lg:col-span-6 space-y-4">
                                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
                                    <img
                                        className="w-full h-full object-cover"
                                        alt={displayProduct.name}
                                        src={displayProduct.image}
                                    />
                                </div>

                            </div>

                            {/* Product Details */}
                            <div className="lg:col-span-4 lg:pt-8">
                                <div className="bg-[#FFF7ED]/80 backdrop-blur-[16px] rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-black/30 border border-white/20">
                                    <div className="flex flex-col space-y-4 sm:space-y-6">
                                        <div>
                                            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-['Italiana',_serif] text-[#554B47]">{displayProduct.name}</h1>
                                            <p className="mt-2 text-xl sm:text-2xl text-[#554B47]/90">
                                                {typeof displayProduct.price === 'string' ? displayProduct.price : `₹${displayProduct.price}`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-0.5">
                                                <span className="material-symbols-outlined text-[#d9a24a] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-[#d9a24a] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-[#d9a24a] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-[#d9a24a] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-[#d9a24a]/50 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                                            </div>
                                            <a className="text-sm text-[#554B47]/70 hover:text-[#554B47] underline" href="#">128 reviews</a>
                                        </div>
                                        <p className="text-base leading-relaxed text-[#554B47]/90">
                                            {displayProduct.description || "An intoxicating blend of rare oud wood and golden amber. This candle evokes the warmth of a crackling fire on a cool midnight, wrapped in a blanket of rich, resinous aromas."}
                                        </p>
                                        <div className="border-t border-[#554B47]/20 pt-6">
                                            <h2 className="text-2xl font-['Italiana',_serif] text-[#554B47] mb-3">Scent Profile</h2>
                                            <div className="space-y-2 text-sm text-[#554B47]/80">
                                                <p><strong className="font-semibold text-[#554B47]/90">Top:</strong> Saffron, Black Currant</p>
                                                <p><strong className="font-semibold text-[#554B47]/90">Middle:</strong> Rose, Incense</p>
                                                <p><strong className="font-semibold text-[#554B47]/90">Base:</strong> Oud Wood, Amber, Sandalwood</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center rounded-lg border border-[#554B47]/20">
                                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-[#554B47]/60 hover:text-[#554B47]">-</button>
                                                <input className="w-10 text-center bg-transparent border-0 text-[#554B47] focus:ring-0" type="text" value={quantity} readOnly />
                                                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-[#554B47]/60 hover:text-[#554B47]">+</button>
                                            </div>
                                            <button className="flex-1 bg-[#d9a24a] text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-[#d9a24a]/30 hover:brightness-110 transition-all">Add to Cart</button>
                                        </div>
                                        <div className="border-t border-[#554B47]/20 pt-6 space-y-3">
                                            <h3 className="text-xl font-['Italiana',_serif] text-[#554B47]">Specifications</h3>
                                            <ul className="space-y-2 text-sm text-[#554B47]/80 list-none">
                                                <li><strong className="font-semibold text-[#554B47]/90">Wax:</strong> 100% Natural Soy Wax Blend</li>
                                                <li><strong className="font-semibold text-[#554B47]/90">Wick:</strong> Lead-free Cotton Wick</li>
                                                <li><strong className="font-semibold text-[#554B47]/90">Burn Time:</strong> Approx. 50-60 hours</li>
                                                <li><strong className="font-semibold text-[#554B47]/90">Dimensions:</strong> 3.5" W x 4" H</li>

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
                            {[
                                {
                                    title: "Sandalwood Suede",
                                    price: "₹90",
                                    image: "/src/assets/Chai_Biscuit_Glass_Candle___90.webp",
                                    collection: "Gourmet Collection",
                                    description: "A warm and inviting sandalwood scent with notes of suede."
                                },
                                {
                                    title: "Velvet Tonka",
                                    price: "₹60",
                                    image: "/src/assets/Teddy_Heart_Candle__60.webp",
                                    collection: "Cute Collection",
                                    description: "Smooth tonka bean blended with velvet musk."
                                },
                                {
                                    title: "Golden Myrrh",
                                    price: "₹199",
                                    image: "/src/assets/Flower_Glass_Jar_Candle__199.webp",
                                    collection: "Premium Collection",
                                    description: "Rich myrrh with golden amber notes."
                                },
                                {
                                    title: "Spiced Ember",
                                    price: "₹15",
                                    image: "/src/assets/Diya_Scented_Candle__15.webp",
                                    collection: "Festival Collection",
                                    description: "Spicy embers glowing in the dark."
                                }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="group cursor-pointer"
                                    onClick={() => {
                                        navigate('/product', { state: { product: item } });
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                                        <img
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            alt={item.title}
                                            src={item.image}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h3 className="font-['Italiana',_serif] text-xl">{item.title}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProductPage;
