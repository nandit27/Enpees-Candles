import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const ProductPage = () => {
    const location = useLocation();
    const { product } = location.state || {};
    const [quantity, setQuantity] = useState(1);

    // Default data if no product is passed (for testing/direct access)
    const displayProduct = product || {
        title: "Midnight Oud & Amber",
        price: "$48.00",
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
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-6 md:px-10 lg:px-20 py-4">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 text-white">
                            <span className="material-symbols-outlined text-xl">local_fire_department</span>
                            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Enpees Candles</h2>
                        </div>
                        <div className="hidden md:flex items-center gap-9">
                            <Link className="text-white/80 hover:text-white text-sm font-medium leading-normal" to="/shop">Shop All</Link>
                            <Link className="text-white/80 hover:text-white text-sm font-medium leading-normal" to="#">New Arrivals</Link>
                            <Link className="text-white/80 hover:text-white text-sm font-medium leading-normal" to="#">Collections</Link>
                            <Link className="text-white/80 hover:text-white text-sm font-medium leading-normal" to="/contact">About Us</Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/10 text-white hover:bg-white/20">
                            <span className="material-symbols-outlined text-xl">search</span>
                        </button>
                        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/10 text-white hover:bg-white/20">
                            <span className="material-symbols-outlined text-xl">person</span>
                        </button>
                        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/10 text-white hover:bg-white/20">
                            <span className="material-symbols-outlined text-xl">shopping_bag</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1">
                    <div className="container mx-auto px-4 py-8 lg:py-16">
                        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 xl:gap-16">
                            {/* Product Images */}
                            <div className="lg:col-span-6 space-y-4">
                                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
                                    <img
                                        className="w-full h-full object-cover"
                                        alt={displayProduct.title}
                                        src={displayProduct.image}
                                    />
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-[#d9a24a]/80">
                                        <img className="w-full h-full object-cover" alt="Thumbnail 1" src={displayProduct.image} />
                                    </div>
                                    <div className="aspect-square w-full overflow-hidden rounded-lg opacity-70 hover:opacity-100 transition-opacity">
                                        <img className="w-full h-full object-cover" alt="Thumbnail 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEd_zbQLcaR6FBwZQpU7sRMEWZrqIwQlL6gJl9ZfjO-Vbzyj6Dq2fHJ1s2QjpG763D6kDn6S30t1QGIpaqjSFTy3N_81UMOOeP9ZkRrvSf2WyYK9-jnzbD18pd0wAgXGJ1Di8hww0LphINx7rhPvf3hlAVbWE3MQkW7sKaXpJhzPy3PMrirm-TKruq9Z6NEK9xYyIJFx8mFaj923gLfKxB6Y-nViv-3rARkh8OmnBl5uYTIKElPmq4hsW5R3KVqKmLUUXQcEAtp2dO" />
                                    </div>
                                    <div className="aspect-square w-full overflow-hidden rounded-lg opacity-70 hover:opacity-100 transition-opacity">
                                        <img className="w-full h-full object-cover" alt="Thumbnail 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvuT6Ar9TNZLc5DLOGgm3cFFZhyER3MiuZ4SJBKXUWbPTvtveEs9KDd3trrqTaw9QhsspzdwYhzQo9UVIcSWVXiqfqs9nRJiQFxkuslPf3kJW5AWvrJIdh8--SxU6ipCtsO0GTifgfEHcMzREA4GJigKPUyQ0vSYLBqSeocHatIlO03iG1e82WwG69VdtchjRIsYU2y5I2whYbY28-L54tFCbc-gfJKEhAT8r-wxTO3l-00Jg1wPwiptze_U8h70bNvGIwGnfI-h1g" />
                                    </div>
                                    <div className="aspect-square w-full overflow-hidden rounded-lg opacity-70 hover:opacity-100 transition-opacity">
                                        <img className="w-full h-full object-cover" alt="Thumbnail 4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW_POPECIEPYXiweXqm0IpjUQ35GbZghD3SltlCq7DUJ-jyNthnwS2H_To2D1SjAX-rij5Ty4Eb3QEOBIyY0ov6z2bLxbHMJsJcZqcGDcObsORL1jYSLlz1O1MmZAqXIFiLVbPSUUkPOOTv_SfFRNZvBjiV9EZICVIIaiN-kY_qs0adAX1qsxLhyfAOkU66cgwUAb1sCyZfis8TARb7cD2PLWet2h1b4NYbsq_LP-HfYU2NjDj6beMk7577UhDhen2MFzXBXn8SVRS" />
                                    </div>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="lg:col-span-4 lg:pt-8">
                                <div className="bg-[#FFF7ED]/80 backdrop-blur-[16px] rounded-xl p-6 md:p-8 shadow-2xl shadow-black/30 border border-white/20">
                                    <div className="flex flex-col space-y-6">
                                        <div>
                                            <h1 className="text-4xl lg:text-5xl font-['Italiana',_serif] text-[#554B47]">{displayProduct.title}</h1>
                                            <p className="mt-2 text-2xl text-[#554B47]/90">{displayProduct.price}</p>
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
                                                <li><strong className="font-semibold text-[#554B47]/90">Origin:</strong> Hand-poured in the USA</li>
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
                            {/* Recommendation 1 */}
                            <div className="group cursor-pointer">
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Sandalwood Suede" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdEiWyuEHldJcLtRXevMZ8g4a57zsvkbORhsVfayHiyD0FfiPa_zIkuuKkkZCrYVZFhKtRFiYZeyw8elg97kVmInRBrWoHGHKxUoeuLa9GEOA8JI57K2mmrUZLZShbaX0dOYEllqjLVCC5MKdZd-eFwAbEwg_bZidGYFEXR1_XMw43rppycGqMKzpQJFk7ghYofR9gDNAPsEbXETiVaXLkM8JVKmHXqvOfc0iAC-UkA1sOgW1gKcpLgCa0AcO5Ar7BzC8-U2FrhsGm" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="font-['Italiana',_serif] text-xl">Sandalwood Suede</h3>
                                        <p className="text-sm opacity-80">$45.00</p>
                                    </div>
                                </div>
                            </div>
                            {/* Recommendation 2 */}
                            <div className="group cursor-pointer">
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Velvet Tonka" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx5uLgNGsh8sSKdK272H3A1xNDwqhXaLSnv4nBcLkUgwyzWTZr_oO-TUlfBjo_axCZHr8s_GImo5E1r7ImzsB4DQmyBWnQBf3LpBpq7HGbgHIr-opLyxgErW5rXsLHfjQqlDIpibZPsozLY7xiXLZ6Iil0XKUZI2tc-e99dO25UkUS3xeEPcZzr9hAvWaI-IDBKO1WiPWt6fUFaNJcEg9cbqfOcyAcYF25H05zVGwSKCk0CHj09S14Cd6ignVTn6lruWTO_DTUwzVP" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="font-['Italiana',_serif] text-xl">Velvet Tonka</h3>
                                        <p className="text-sm opacity-80">$52.00</p>
                                    </div>
                                </div>
                            </div>
                            {/* Recommendation 3 */}
                            <div className="group cursor-pointer">
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Golden Myrrh" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBomaWUhwdv3kcn4Ow0VAAdhQnM1KYvixn19-sV2Nm3FqDz7hk3AT-SUcSwK1ZGa9PoQNFF6a3xMH1lI-La7KUlqEbfZHR8VDO90nuYcCCVmvSIqM-0-ZEbj5U3sgEZXGWA1DQPDtZfM-qIlfJanV_7GhOoGEXMLj-l6Ey0RraqCDTpyoUAx31xvtH3ZUJ7C8dwQk8ZTXVLEAvlt1QmGw81ziM6BIWMV9MX9cpr4gmKHnVcmPQHzKK4wCBPrQrsi_72QwTpmSfz7jkU" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="font-['Italiana',_serif] text-xl">Golden Myrrh</h3>
                                        <p className="text-sm opacity-80">$48.00</p>
                                    </div>
                                </div>
                            </div>
                            {/* Recommendation 4 */}
                            <div className="group cursor-pointer">
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Spiced Ember" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuzySejn8LXvBqVUOOj3SHvBC5V8Y5g7OERg8a0YXzzS2gSv87rNIjeJ5QoJuZjc8KSHaYiWYHs99HZ3smaGL_Ff4_nJJQAIQRex_Oc5hEf605Cb969tXINmvEmzEactG5IE-RehCpuFwXgsXwZm8hgsm4d7xXKFW56ID1bkpSd3tv9wjVuJLLez_kKWdNEmhAByj2IrIqs-JM7-V9up0C-daihiPrVMzMUipe1gt56vLCIGCKzE4Se0X9967_489TMR8q68Wp8hY7" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="font-['Italiana',_serif] text-xl">Spiced Ember</h3>
                                        <p className="text-sm opacity-80">$45.00</p>
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

export default ProductPage;
