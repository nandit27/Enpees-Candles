import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LazyImage from '../components/LazyImage';
import CatalogCard from '../components/CatalogCard';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';
import flowerCandle from '../assets/Flower_Glass_Jar_Candle__199.webp';

const WHATSAPP_NUMBER = '919173958589';

const COLOR_SWATCHES = [
    { name: 'Natural Beige', hex: '#C9B896', short: 'Beige' },
    { name: 'Ivory White', hex: '#4A2A1A', short: 'Ivory' },
    { name: 'Soft Pink', hex: '#D9A3A8', short: 'Pink' },
    { name: 'Charcoal Grey', hex: '#3D3834', short: 'Charcoal' },
];

const DEFAULT_FRAGRANCES = [
    'Woody Flora',
    'Peach Miami',
    'Jasmine',
    'Mogra',
    'Berry Blast',
    'Kesar Chandan',
    'British Rose',
    'Vanilla',
    'English Lavender',
];

const colorEntry = (c) =>
    typeof c === 'string' ? { name: c, hex: '' } : { name: c?.name || '', hex: c?.hex || '' };

const colorShort = (name) => {
    if (name === 'Others') return 'Custom';
    const found = COLOR_SWATCHES.find((c) => c.name.toLowerCase() === name.toLowerCase());
    return found?.short || name;
};

// Per-product hex wins, then the house swatch book, then a neutral fallback.
const colorHex = (name, hexMap) => {
    if (!name) return '#C9B896';
    if (name.startsWith('#')) return name;
    if (hexMap && hexMap[name]) return hexMap[name];
    const found = COLOR_SWATCHES.find((c) => c.name.toLowerCase() === name.toLowerCase());
    return found?.hex || '#C9B896';
};

const productHexMap = (product) => {
    const map = {};
    (product?.colors || []).forEach((c) => {
        const { name, hex } = colorEntry(c);
        if (name && hex) map[name] = hex;
    });
    return map;
};

const resolveColors = (product) => {
    const fromApi = (product?.colors || []).map((c) => colorEntry(c).name).filter(Boolean);
    if (fromApi.length === 0) return [...COLOR_SWATCHES.map((c) => c.name), 'Others'];
    return fromApi.includes('Others') ? fromApi : [...fromApi, 'Others'];
};

const resolveFragrances = (product, globals) => {
    const fromApi = (product?.fragrances || []).filter(Boolean);
    const base = fromApi.length > 0 ? fromApi : globals.length > 0 ? globals : DEFAULT_FRAGRANCES;
    return base.includes('Others') ? base : [...base, 'Others'];
};

const ProductPage = () => {
    const location = useLocation();
    const { product: initialProduct } = location.state || {};
    const [product, setProduct] = useState(initialProduct || null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('Natural Beige');
    const [selectedFragrance, setSelectedFragrance] = useState('Woody Flora');
    const [showZoomModal, setShowZoomModal] = useState(false);
    const [customColor, setCustomColor] = useState('');
    const [customFragrance, setCustomFragrance] = useState('');
    const [globalFragrances, setGlobalFragrances] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [fetching, setFetching] = useState(Boolean(initialProduct?._id));
    const { addToCart } = useCart();

    useEffect(() => {
        if (initialProduct) {
            setProduct(initialProduct);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (!initialProduct?._id) {
            setFetching(false);
            return;
        }
        setFetching(true);
        fetch(API_ENDPOINTS.PRODUCT_BY_ID(initialProduct._id))
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setFetching(false);
            })
            .catch((err) => {
                console.error('Error fetching product:', err);
                setFetching(false);
            });
    }, [initialProduct]);

    useEffect(() => {
        fetch(API_ENDPOINTS.PRODUCTS)
            .then((res) => res.json())
            .then((data) => {
                if (!Array.isArray(data)) return;
                let filtered = data;
                if (product?._id) {
                    filtered = data.filter((p) => p._id !== product._id);
                    const sameCategory = filtered.filter((p) => p.category === product.category);
                    if (sameCategory.length >= 4) filtered = sameCategory;
                }
                const shuffled = [...filtered].sort(() => 0.5 - Math.random());
                setRelatedProducts(shuffled.slice(0, 4));
            })
            .catch((err) => console.error('Error fetching related products:', err));
    }, [product?._id, product?.category]);

    const displayProduct = product;
    const availableColors = useMemo(() => resolveColors(displayProduct), [displayProduct]);
    const hexMap = useMemo(() => productHexMap(displayProduct), [displayProduct]);
    const availableFragrances = useMemo(
        () => resolveFragrances(displayProduct, globalFragrances),
        [displayProduct, globalFragrances]
    );

    useEffect(() => {
        fetch(API_ENDPOINTS.FRAGRANCES)
            .then((res) => res.json())
            .then((data) => {
                const names = (Array.isArray(data) ? data : []).map((f) =>
                    typeof f === 'string' ? f : f?.name
                ).filter(Boolean);
                setGlobalFragrances(names);
            })
            .catch((err) => console.error('Error fetching fragrances:', err));
    }, []);

    const colorKey = (displayProduct?.colors || []).join('|');
    const fragranceKey = (displayProduct?.fragrances || []).join('|');

    useEffect(() => {
        setSelectedColor(availableColors[0] || 'Natural Beige');
        setSelectedFragrance(availableFragrances[0] || 'Woody Flora');
        setCustomColor('');
        setCustomFragrance('');
        setQuantity(1);
        // Palette identity is colorKey / fragranceKey, not the product object.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayProduct?._id, colorKey, fragranceKey]);

    const galleryImages = useMemo(() => {
        if (!displayProduct) return [];
        const imgs = [displayProduct.image, ...(displayProduct.images || [])];
        return [...new Set(imgs.filter(Boolean))];
    }, [displayProduct]);

    useEffect(() => {
        setSelectedImageIndex(0);
    }, [displayProduct?._id]);

    const selectedImage =
        galleryImages[Math.min(selectedImageIndex, Math.max(galleryImages.length - 1, 0))] ||
        displayProduct?.image ||
        flowerCandle;

    const goImage = (dir) => {
        if (galleryImages.length < 2) return;
        setSelectedImageIndex((prev) => (prev + dir + galleryImages.length) % galleryImages.length);
    };

    useEffect(() => {
        if (!showZoomModal) return undefined;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setShowZoomModal(false);
            if (event.key === 'ArrowRight') goImage(1);
            if (event.key === 'ArrowLeft') goImage(-1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showZoomModal, galleryImages.length]);

    const openWhatsApp = (message) => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    };

    const colorLabel = selectedColor === 'Others' ? customColor || 'Custom' : selectedColor;
    const fragranceLabel = selectedFragrance === 'Others' ? customFragrance.trim() || 'Custom' : selectedFragrance;

    const handleBulkInquiry = () => {
        if (!displayProduct) return;
        openWhatsApp(
            `Hello Fleroma Candles! I would like a bulk inquiry for:\n\nProduct: ${displayProduct.name}\nPrice: ${typeof displayProduct.price === 'string' ? displayProduct.price : `₹${displayProduct.price}`}\nSelected Color: ${colorLabel}\nSelected Fragrance: ${fragranceLabel}\nQuantity: ${quantity}+ units\n\nPlease share bulk pricing details.`
        );
    };

    const handleCustomizeProduct = () => {
        if (!displayProduct) return;
        openWhatsApp(
            `Hello Fleroma Candles! I would like to customize this product:\n\nProduct: ${displayProduct.name}\nPreferred Color: ${selectedColor === 'Others' ? customColor || 'Will discuss' : selectedColor}\nPreferred Fragrance: ${selectedFragrance === 'Others' ? customFragrance.trim() || 'Will discuss' : selectedFragrance}\n\nPlease share customization options and pricing.`
        );
    };

    const handleAddToCart = () => {
        if (!displayProduct) return;
        if (selectedColor === 'Others' && !customColor.trim()) {
            toast.error('Name the custom wax colour first');
            return;
        }
        if (selectedFragrance === 'Others' && !customFragrance.trim()) {
            toast.error('Name the custom fragrance first');
            return;
        }
        const colorToUse = selectedColor === 'Others' ? customColor : selectedColor;
        const fragranceToUse = selectedFragrance === 'Others' ? customFragrance.trim() : selectedFragrance;
        for (let i = 0; i < quantity; i += 1) {
            addToCart(displayProduct, colorToUse, fragranceToUse);
        }
        toast.success(`Added ${quantity} ${displayProduct.name} to cart`);
    };

    const handleRelatedAdd = (item) => {
        addToCart(item);
        toast.success(`${item.name} added to cart`, {
            duration: 2000,
            position: 'bottom-right',
            style: { background: '#4A2A1A', color: '#FAF6EF', fontWeight: '600' },
        });
    };

    const hasDimensions =
        displayProduct?.dimensions &&
        (displayProduct.dimensions.height || displayProduct.dimensions.width || displayProduct.dimensions.depth);

    const specTiles = [
        displayProduct?.specifications?.wax && { label: 'Wax', value: displayProduct.specifications.wax },
        displayProduct?.specifications?.fragrance && {
            label: 'Base scent',
            value: displayProduct.specifications.fragrance,
        },
        displayProduct?.specifications?.burningTime && {
            label: 'Burn',
            value: displayProduct.specifications.burningTime,
        },
    ].filter(Boolean);

    if (!displayProduct && !fetching) {
        return (
            <div className="lp relative min-h-[100dvh] w-full bg-[#FAF6EF] text-[#4A2A1A]">
                <Navbar />
                <main id="main-content" className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-10 lg:px-16">
                    <h1 className="lp-display text-4xl leading-[1.1] md:text-5xl">Pick a candle first</h1>
                    <p className="lp-lede mt-4 max-w-[65ch] text-[#4A2A1A]/70">
                        Open any piece from the shop to see colours, scent, and photos.
                    </p>
                    <Link to="/shop" className="lp-btn lp-btn-primary mt-8">
                        Back to shop
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="lp relative min-h-[100dvh] w-full bg-[#FAF6EF] text-[#4A2A1A]">
            <Navbar />

            <main id="main-content" className="mx-auto w-full max-w-[1400px] px-5 pb-24 pt-8 sm:px-10 lg:px-16">
                {fetching && !displayProduct ? (
                    <div className="grid gap-10 lg:grid-cols-12">
                        <div className="aspect-[4/5] animate-pulse rounded-[20px] bg-[#EDE0C8] lg:col-span-7" />
                        <div className="space-y-4 lg:col-span-5">
                            <div className="h-10 w-2/3 animate-pulse rounded bg-[#EDE0C8]" />
                            <div className="h-24 animate-pulse rounded bg-[#EDE0C8]" />
                        </div>
                    </div>
                ) : (
                    <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
                        <div className="lg:sticky lg:top-24 lg:col-span-7 lg:self-start">
                            <div className="flex flex-col gap-3 lg:flex-row">
                                {galleryImages.length > 1 && (
                                    <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:max-h-[70vh] lg:flex-col lg:overflow-y-auto">
                                        {galleryImages.map((img, index) => (
                                            <button
                                                key={`${img}-${index}`}
                                                type="button"
                                                className="lp-thumb shrink-0"
                                                data-on={index === selectedImageIndex}
                                                onClick={() => setSelectedImageIndex(index)}
                                                aria-label={`${displayProduct.name} photo ${index + 1}`}
                                                aria-pressed={index === selectedImageIndex}
                                            >
                                                <LazyImage src={img} alt="" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div className="order-1 relative min-w-0 flex-1 lg:order-2">
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-[#EDE0C8]">
                                        <button
                                            type="button"
                                            className="absolute inset-0"
                                            onClick={() => setShowZoomModal(true)}
                                            aria-label={`View larger photo of ${displayProduct.name}`}
                                        >
                                            <LazyImage
                                                src={selectedImage}
                                                alt={displayProduct.name}
                                                className="transition-transform duration-700 ease-out hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
                                            />
                                        </button>
                                        {galleryImages.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => goImage(-1)}
                                                    aria-label="Previous photo"
                                                    className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#4A2A1A]/80 text-[#FAF6EF] transition-transform hover:-translate-y-[calc(50%+2px)] active:scale-[0.98]"
                                                >
                                                    <span className="material-symbols-outlined" aria-hidden="true">
                                                        chevron_left
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => goImage(1)}
                                                    aria-label="Next photo"
                                                    className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#4A2A1A]/80 text-[#FAF6EF] transition-transform hover:-translate-y-[calc(50%+2px)] active:scale-[0.98]"
                                                >
                                                    <span className="material-symbols-outlined" aria-hidden="true">
                                                        chevron_right
                                                    </span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <h1 className="lp-display text-3xl leading-[1.1] md:text-4xl lg:text-[2.75rem]">
                                {displayProduct.name}
                            </h1>
                            <div className="mt-4 flex items-baseline gap-3 font-jost">
                                {displayProduct.offerPrice ? (
                                    <>
                                        <span className="text-2xl tabular-nums text-[#4A2A1A]">₹{displayProduct.offerPrice}</span>
                                        <span className="text-base text-[#4A2A1A]/50 line-through">₹{displayProduct.price}</span>
                                    </>
                                ) : (
                                    <span className="text-2xl tabular-nums text-[#4A2A1A]">
                                        {typeof displayProduct.price === 'string'
                                            ? displayProduct.price
                                            : `₹${displayProduct.price}`}
                                    </span>
                                )}
                            </div>
                            {displayProduct.description && (
                                <p className="lp-lede mt-5 max-w-[65ch] text-[#4A2A1A]/70">{displayProduct.description}</p>
                            )}

                            <div className="mt-8">
                                <div className="flex flex-wrap items-center gap-3">
                                    <p className="font-jost text-sm text-[#4A2A1A]">Wax colour</p>
                                    <p className="inline-flex items-center rounded-full bg-[#4A2A1A] px-3 py-1 font-jost text-sm font-semibold text-[#FAF6EF]">
                                        {selectedColor === 'Others' ? customColor || 'Custom' : selectedColor}
                                    </p>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-4" role="radiogroup" aria-label="Wax colour">
                                    {availableColors.map((color) => {
                                        const on = selectedColor === color;
                                        return (
                                            <button
                                                key={color}
                                                type="button"
                                                role="radio"
                                                aria-checked={on}
                                                aria-label={color}
                                                data-on={on}
                                                className="lp-swatch-wrap flex flex-col items-center gap-2"
                                                onClick={() => setSelectedColor(color)}
                                            >
                                                <span
                                                    className="lp-swatch relative flex items-center justify-center"
                                                    data-on={on}
                                                    style={
                                                        color === 'Others'
                                                            ? {
                                                                  background:
                                                                      'conic-gradient(#C9B896, #EDE6D8, #D9A3A8, #3D3834, #C9B896)',
                                                              }
                                                            : { background: colorHex(color, hexMap) }
                                                    }
                                                >
                                                    {on && (
                                                        <span
                                                            className="material-symbols-outlined text-[16px] text-[#4A2A1A] drop-shadow-[0_1px_2px_rgba(42,29,21,0.9)]"
                                                            aria-hidden="true"
                                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                                        >
                                                            check
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="lp-swatch-name">{colorShort(color)}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {selectedColor === 'Others' && (
                                    <label className="mt-4 flex flex-col gap-2">
                                        <span className="font-jost text-sm text-[#4A2A1A]">Custom wax colour</span>
                                        <input
                                            className="lp-field"
                                            name="customColor"
                                            value={customColor}
                                            onChange={(e) => setCustomColor(e.target.value)}
                                            aria-describedby="custom-color-hint"
                                        />
                                        <span id="custom-color-hint" className="font-jost text-xs text-[#4A2A1A]/70">
                                            Name the shade you want. We confirm it on WhatsApp.
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="mt-8">
                                <div className="flex flex-wrap items-center gap-3">
                                    <p className="font-jost text-sm text-[#4A2A1A]">Fragrance</p>
                                    <p className="inline-flex items-center rounded-full bg-[#4A2A1A] px-3 py-1 font-jost text-sm font-semibold text-[#FAF6EF]">
                                        {fragranceLabel}
                                    </p>
                                </div>
                                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Fragrance">
                                    {availableFragrances.map((fragrance) => {
                                        const on = selectedFragrance === fragrance;
                                        return (
                                            <button
                                                key={fragrance}
                                                type="button"
                                                role="radio"
                                                aria-checked={on}
                                                data-on={on}
                                                onClick={() => setSelectedFragrance(fragrance)}
                                                className="lp-scent"
                                            >
                                                {on && (
                                                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                                                        check
                                                    </span>
                                                )}
                                                {fragrance === 'Others' ? 'Custom scent' : fragrance}
                                            </button>
                                        );
                                    })}
                                </div>
                                {selectedFragrance === 'Others' && (
                                    <label className="mt-4 flex flex-col gap-2">
                                        <span className="font-jost text-sm text-[#4A2A1A]">Custom fragrance</span>
                                        <input
                                            className="lp-field"
                                            name="customFragrance"
                                            value={customFragrance}
                                            onChange={(e) => setCustomFragrance(e.target.value)}
                                            placeholder="e.g. Sandalwood Rose"
                                            aria-describedby="custom-fragrance-hint"
                                        />
                                        <span id="custom-fragrance-hint" className="font-jost text-xs text-[#4A2A1A]/70">
                                            Name the scent you want. We confirm it on WhatsApp.
                                        </span>
                                    </label>
                                )}
                            </div>

                            {hasDimensions && (
                                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {displayProduct.dimensions.height && (
                                        <div className="rounded-[12px] bg-[#EDE0C8] px-3 py-4">
                                            <p className="font-jost text-xs text-[#4A2A1A]/70">Height</p>
                                            <p className="mt-1 font-jost text-lg tabular-nums">{displayProduct.dimensions.height}</p>
                                        </div>
                                    )}
                                    {displayProduct.dimensions.width && (
                                        <div className="rounded-[12px] bg-[#EDE0C8] px-3 py-4">
                                            <p className="font-jost text-xs text-[#4A2A1A]/70">Width</p>
                                            <p className="mt-1 font-jost text-lg tabular-nums">{displayProduct.dimensions.width}</p>
                                        </div>
                                    )}
                                    {displayProduct.dimensions.depth && (
                                        <div className="rounded-[12px] bg-[#EDE0C8] px-3 py-4">
                                            <p className="font-jost text-xs text-[#4A2A1A]/70">Depth</p>
                                            <p className="mt-1 font-jost text-lg tabular-nums">{displayProduct.dimensions.depth}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {specTiles.length > 0 && (
                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {specTiles.map((spec) => (
                                        <div key={spec.label} className="rounded-[12px] bg-[#EDE0C8] px-4 py-4">
                                            <p className="font-jost text-xs text-[#4A2A1A]/70">{spec.label}</p>
                                            <p className="mt-1 font-jost text-sm text-[#4A2A1A]">{spec.value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p className="mt-8 font-jost text-sm text-[#4A2A1A]/70">
                                Orders over 100 units get studio pricing.
                            </p>

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex w-fit items-center rounded-full border border-[#4A2A1A]/35">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        aria-label="Decrease quantity"
                                        className="flex h-12 w-12 items-center justify-center text-[#4A2A1A] transition-transform active:scale-[0.98]"
                                    >
                                        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                                            remove
                                        </span>
                                    </button>
                                    <span className="w-8 text-center font-jost tabular-nums" aria-live="polite">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        aria-label="Increase quantity"
                                        className="flex h-12 w-12 items-center justify-center text-[#4A2A1A] transition-transform active:scale-[0.98]"
                                    >
                                        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                                            add
                                        </span>
                                    </button>
                                </div>
                                <button type="button" onClick={handleAddToCart} className="lp-btn lp-btn-primary w-full sm:flex-1">
                                    Add to cart
                                </button>
                            </div>

                            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <button type="button" onClick={handleBulkInquiry} className="lp-btn lp-btn-ghost w-full">
                                    Bulk inquiry
                                </button>
                                <button type="button" onClick={handleCustomizeProduct} className="lp-btn lp-btn-ghost w-full">
                                    Custom order
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {relatedProducts.length > 0 && (
                    <section className="mt-24">
                        <h2 className="lp-display text-3xl leading-[1.1] md:text-4xl">More from the studio</h2>
                        <div className="mt-8 grid grid-cols-2 items-stretch gap-4 sm:grid-cols-4 sm:gap-6">
                            {relatedProducts.map((item) => (
                                <CatalogCard
                                    key={item._id || item.name}
                                    product={item}
                                    onAdd={handleRelatedAdd}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {showZoomModal && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-[#4A2A1A]/92 p-4"
                    onClick={() => setShowZoomModal(false)}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') setShowZoomModal(false);
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${displayProduct.name} photos`}
                >
                    <button
                        type="button"
                        className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full text-[#FAF6EF] hover:text-[#FAF6EF]/80"
                        onClick={() => setShowZoomModal(false)}
                        aria-label="Close photos"
                    >
                        <span className="material-symbols-outlined text-[28px]" aria-hidden="true">
                            close
                        </span>
                    </button>
                    {galleryImages.length > 1 && (
                        <>
                            <button
                                type="button"
                                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#FAF6EF] text-[#4A2A1A]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goImage(-1);
                                }}
                                aria-label="Previous photo"
                            >
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    chevron_left
                                </span>
                            </button>
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#FAF6EF] text-[#4A2A1A]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goImage(1);
                                }}
                                aria-label="Next photo"
                            >
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    chevron_right
                                </span>
                            </button>
                        </>
                    )}
                    <img
                        src={selectedImage}
                        alt={displayProduct.name}
                        className="max-h-full max-w-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductPage;
