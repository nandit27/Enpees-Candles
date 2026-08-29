import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { API_ENDPOINTS } from '../config/api';

import CandleScrollHero from '../components/CandleScrollHero';
import flowerCandle from '../assets/Flower_Glass_Jar_Candle__199.webp';
import snowmanCandle from '../assets/Snowman_Candle ___199.webp';
import teddyCandle from '../assets/Teddy_Heart_Candle__60.webp';
import chaiCandle from '../assets/Tea_biscuit_candle_99.webp';
import bouquetCandle from '../assets/Luxury_Mini_Bouquet_Candle__150 .webp';
import lotusCandle from '../assets/Lotus_Candle __99.webp';
import studioWall from '../assets/textures/studio-wall.jpg';
import woodTable from '../assets/textures/wood-table.jpg';
import processMelt from '../assets/textures/process-melt.jpg';
import processShape from '../assets/textures/process-shape.jpg';
import processCure from '../assets/textures/process-cure.jpg';
import processGift from '../assets/textures/process-gift.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SHELL = 'mx-auto w-full max-w-[1400px] px-5 sm:px-10 lg:px-16';

const SHAPES = [
    { name: 'Floral', note: 'Glass jars and blooms', img: flowerCandle, alt: 'Flower-shaped soy candle in a glass jar' },
    { name: 'Seasonal', note: 'Limited winter pours', img: snowmanCandle, alt: 'Snowman-shaped novelty candle' },
    { name: 'Spiced', note: 'Chai, vanilla, wood', img: chaiCandle, alt: 'Chai biscuit scented candle in a glass tumbler' },
    { name: 'Sculpted', note: 'Teddies, roses, hearts', img: bouquetCandle, alt: 'Miniature bouquet candle arrangement' },
];

const POUR_CHAPTERS = [
    {
        verb: 'Melt',
        copy: 'Soy wax heated slow in small batches. No shortcuts, no rush.',
        img: processMelt,
        alt: 'Molten soy wax in a double boiler at the Enpees studio',
    },
    {
        verb: 'Shape',
        copy: 'Poured into hand-cut moulds. Roses, teddies, hearts, diyas.',
        img: processShape,
        alt: 'Molten wax poured into a silicone mould',
    },
    {
        verb: 'Cure',
        copy: 'Each candle rests 48 hours before the wick is trimmed.',
        img: processCure,
        alt: 'Freshly poured candles resting on a wooden curing rack',
    },
    {
        verb: 'Gift',
        copy: 'Wrapped in recyclable paper, ribbon-tied, posted from Rajkot.',
        img: processGift,
        alt: 'A candle wrapped in kraft paper and tied with gold ribbon',
    },
];

/* ── Hooks ── */

function usePrefersReducedMotion() {
    const [reduce, setReduce] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = () => setReduce(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);
    return reduce;
}

function useReveal() {
    const root = useRef(null);
    useEffect(() => {
        const nodes = root.current?.querySelectorAll('[data-reveal]');
        if (!nodes?.length) return;
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (!e.isIntersecting) return;
                    e.target.setAttribute('data-reveal', 'in');
                    io.unobserve(e.target);
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
        );
        nodes.forEach((n) => io.observe(n));
        return () => io.disconnect();
    }, []);
    return root;
}

/* ── Shape accordion ── */

function ShapeAccordion() {
    const [active, setActive] = useState(0);
    const reduce = usePrefersReducedMotion();

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => (i + 1) % SHAPES.length);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => (i - 1 + SHAPES.length) % SHAPES.length);
        }
    };

    return (
        <div
            className="lp-acc"
            role="list"
            aria-label="Candle shapes"
            onKeyDown={handleKeyDown}
        >
            {SHAPES.map((s, i) => {
                const isActive = reduce ? true : i === active;
                return (
                    <Link
                        key={s.name}
                        to="/shop"
                        role="listitem"
                        data-active={isActive ? 'true' : 'false'}
                        aria-current={isActive ? 'true' : undefined}
                        onMouseEnter={() => !reduce && setActive(i)}
                        onFocus={() => !reduce && setActive(i)}
                        className="lp-acc-panel group"
                    >
                        <img src={s.img} alt={s.alt} loading="lazy" decoding="async" />
                        <span className="lp-scrim" aria-hidden="true" />
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                            <h3 className="lp-display text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">{s.name}</h3>
                            <p className={`mt-2 font-jost text-[13px] text-[#C7BCA8] transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-100 md:opacity-0'}`}>
                                {s.note}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

/* ── Best-seller slides ── */

function ProductSlide({ product, onAdd, className = 'w-[72vw] shrink-0 sm:w-[42vw] lg:w-[28vw]' }) {
    const [added, setAdded] = useState(false);
    const price = product.offerPrice || product.price;

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAdd(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
    };

    return (
        <article className={`group flex flex-col ${className}`}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[#3B2A1E]">
                <Link to="/product" state={{ product }} className="absolute inset-0 block">
                    <img
                        src={product.image}
                        alt={product.name || 'Enpees candle'}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                </Link>
                <button
                    type="button"
                    onClick={handleAdd}
                    aria-label={added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
                    className="absolute bottom-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#D3A34E] text-[#2A1D15] shadow-[0_10px_24px_-8px_rgba(211,163,78,0.7)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                    <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                        {added ? 'check' : 'add'}
                    </span>
                </button>
            </div>
            <div className="mt-4 flex min-h-[3.25rem] items-start justify-between gap-3">
                <h3 className="lp-display line-clamp-2 text-[1.05rem] leading-snug">
                    <Link to="/product" state={{ product }} className="transition-colors hover:text-[#D3A34E]">
                        {product.name}
                    </Link>
                </h3>
                <p className="shrink-0 pt-0.5 font-jost text-base tabular-nums text-[#EDE6D8]">
                    ₹{price}
                    {product.offerPrice && (
                        <span className="ml-2 text-[13px] text-[#C7BCA8]/50 line-through">₹{product.price}</span>
                    )}
                </p>
            </div>
        </article>
    );
}

function ProductPan({ products, onAdd }) {
    const wrap = useRef(null);
    const track = useRef(null);
    const reduce = usePrefersReducedMotion();

    useGSAP(() => {
        if (reduce || !wrap.current || !track.current || products.length === 0) return;
        const getDistance = () => Math.max(0, track.current.scrollWidth - window.innerWidth);
        gsap.to(track.current, {
            x: () => -getDistance(),
            ease: 'none',
            scrollTrigger: {
                trigger: wrap.current,
                start: 'top top',
                end: () => `+=${Math.max(getDistance(), window.innerHeight * 0.5)}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1,
            },
        });
        const onImg = () => ScrollTrigger.refresh();
        track.current.querySelectorAll('img').forEach((img) => {
            if (!img.complete) img.addEventListener('load', onImg, { once: true });
        });
    }, { dependencies: [products, reduce], revertOnUpdate: true, scope: wrap });

    if (reduce) {
        return (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                    <ProductSlide key={p._id} product={p} onAdd={onAdd} className="w-full" />
                ))}
            </div>
        );
    }

    return (
        <div ref={wrap} className="relative z-10 isolate overflow-hidden bg-[#2A1D15]">
            <div
                ref={track}
                className="flex h-[100dvh] items-center gap-6 px-5 pt-28 sm:gap-8 sm:px-10 lg:gap-10 lg:px-16"
            >
                <div className="w-[72vw] shrink-0 sm:w-[36vw] lg:w-[24vw]">
                    <h2 className="lp-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                        The shapes people come back for.
                    </h2>
                    <p className="lp-lede mt-5 max-w-[28ch]">
                        A handful of pieces we pour again and again.
                    </p>
                </div>
                {products.map((p) => (
                    <ProductSlide key={p._id} product={p} onAdd={onAdd} />
                ))}
            </div>
        </div>
    );
}

function PourChapters({ reduce }) {
    const wrap = useRef(null);
    const [live, setLive] = useState(reduce ? POUR_CHAPTERS.length - 1 : -1);

    useGSAP(() => {
        if (!wrap.current) return;
        const cards = gsap.utils.toArray('.pour-card', wrap.current);
        if (reduce) {
            cards.forEach((card) => card.setAttribute('data-live', 'true'));
            return;
        }
        cards.forEach((card, i) => {
            ScrollTrigger.create({
                trigger: card,
                start: 'top 78%',
                onEnter: () => {
                    card.setAttribute('data-live', 'true');
                    setLive((n) => Math.max(n, i));
                },
                onEnterBack: () => setLive(i),
            });
        });
    }, { scope: wrap, dependencies: [reduce] });

    return (
        <div ref={wrap}>
            <ol className={`${SHELL} mb-8 flex items-center gap-2 overflow-x-auto pb-2 sm:mb-10`} aria-label="How a candle is made">
                {POUR_CHAPTERS.map((ch, i) => (
                    <li key={ch.verb} className="flex shrink-0 items-center gap-2">
                        <span
                            className={`font-jost text-sm transition-colors ${
                                i <= live ? 'text-[#D3A34E]' : 'text-[#C7BCA8]/45'
                            }`}
                        >
                            {ch.verb}
                        </span>
                        {i < POUR_CHAPTERS.length - 1 && (
                            <span
                                className={`h-px w-8 sm:w-12 ${i < live ? 'bg-[#D3A34E]' : 'bg-[#C7BCA8]/25'}`}
                                aria-hidden="true"
                            />
                        )}
                    </li>
                ))}
            </ol>
            <div className={`${SHELL} grid grid-cols-1 gap-5 pb-24 sm:grid-cols-2 sm:gap-6 lg:pb-32`}>
                {POUR_CHAPTERS.map((ch) => (
                    <article
                        key={ch.verb}
                        className="pour-card relative min-h-[280px] overflow-hidden rounded-[20px] sm:min-h-[340px] lg:min-h-[400px]"
                    >
                        <img
                            src={ch.img}
                            alt={ch.alt}
                            loading="lazy"
                            decoding="async"
                            className="pour-photo absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="pour-sheen" aria-hidden="true" />
                        <div className="absolute inset-0 bg-[#2A1D15]/55" aria-hidden="true" />
                        <div className="relative z-10 flex h-full min-h-[280px] flex-col justify-end p-6 sm:min-h-[340px] sm:p-8 lg:min-h-[400px]">
                            <h3 className="lp-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                                {ch.verb}
                            </h3>
                            <p className="lp-lede mt-3 max-w-[32ch] text-[#EDE6D8]">
                                {ch.copy}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

/* ── Page ── */

export default function LandingPage() {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState('loading');
    const root = useReveal();
    const reduce = usePrefersReducedMotion();

    useGSAP(() => {
        if (reduce || !root.current) return;
        ScrollTrigger.create({
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
                if (!root.current) return;
                root.current.style.setProperty('--burn', `${self.progress * root.current.offsetHeight}px`);
            },
        });
    }, { dependencies: [reduce], scope: root });

    useEffect(() => {
        fetch(API_ENDPOINTS.PRODUCTS)
            .then((res) => res.json())
            .then((data) => {
                setProducts((data || []).filter((p) => p.featured === true).slice(0, 7));
                setStatus('ok');
            })
            .catch(() => setStatus('error'));
    }, []);

    useEffect(() => {
        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener('load', onLoad);
        return () => window.removeEventListener('load', onLoad);
    }, []);

    const handleAdd = useCallback((product) => addToCart(product), [addToCart]);

    return (
        <div ref={root} className="lp relative w-full antialiased">
            <div className="lp-grain" aria-hidden="true" />

            <div className="wick-rail left-3 sm:left-6" aria-hidden="true">
                <span className="wick-burn" />
            </div>

            <Navbar overHero />

            <CandleScrollHero />

            {/* Shapes: accordion strips */}
            <section className="relative bg-[#2A1D15] py-16 sm:py-24 lg:py-28">
                <div className={SHELL}>
                    <h2 data-reveal className="lp-display lp-h2 max-w-[18ch]">
                        Four families. One studio.
                    </h2>
                    <p data-reveal style={{ '--d': '120ms' }} className="lp-lede mt-4 max-w-[42ch]">
                        Each one is a different mood we pour by hand.
                    </p>
                    <div data-reveal style={{ '--d': '200ms' }} className="mt-10 lg:mt-14">
                        <ShapeAccordion />
                    </div>
                </div>
            </section>

            {/* Studio: manifesto type over a wall, cinematic still below */}
            <section id="story" className="relative scroll-mt-24 overflow-hidden bg-[#1F150E] py-24 sm:py-32 lg:py-40">
                <img
                    src={studioWall}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-[#1F150E]/55" aria-hidden="true" />

                <div className={`${SHELL} relative`}>
                    <p data-reveal className="lp-display max-w-[16ch] text-5xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                        Wax is{' '}
                        <em className="lp-wonk pb-1 not-italic text-[#D3A34E]" style={{ fontStyle: 'italic' }}>
                            patient.
                        </em>
                    </p>
                    <p data-reveal style={{ '--d': '140ms' }} className="lp-lede mt-8 max-w-[38rem]">
                        It holds whatever shape you give it, so we take our time. Enpees started with one pot of soy wax and a mould shaped like a teddy bear.
                    </p>
                    <p data-reveal style={{ '--d': '220ms' }} className="lp-lede mt-4 max-w-[38rem]">
                        Everything since has been made the same way: small batches, hand-set shapes, scents we would want in our own rooms.
                    </p>

                    <div data-reveal style={{ '--d': '300ms' }} className="mt-14 overflow-hidden rounded-[20px] lg:mt-20">
                        <img
                            src={teddyCandle}
                            alt="A sculpted teddy candle from the Enpees studio"
                            loading="lazy"
                            decoding="async"
                            className="aspect-[16/7] w-full object-cover sm:aspect-[21/9]"
                        />
                    </div>
                </div>
            </section>

            {/* Bestsellers: horizontal pan on scroll */}
            <section id="bestsellers" className="relative z-10 scroll-mt-24 bg-[#2A1D15]">
                {status === 'loading' && (
                    <div className={`${SHELL} py-24`}>
                        <div className="flex gap-6 overflow-hidden">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="h-[420px] w-[78vw] shrink-0 animate-pulse rounded-[20px] bg-[#3B2A1E] sm:w-[46vw] lg:w-[30vw]"
                                />
                            ))}
                        </div>
                    </div>
                )}
                {status === 'error' && (
                    <div className={`${SHELL} py-24`}>
                        <p className="lp-lede">The shelf could not load. Open the shop to browse every shape.</p>
                        <Link to="/shop" className="lp-btn lp-btn-primary mt-8">Shop candles</Link>
                    </div>
                )}
                {status === 'ok' && products.length === 0 && (
                    <div className={`${SHELL} py-24`}>
                        <h2 className="lp-display lp-h2">Nothing featured this week.</h2>
                        <p className="lp-lede mt-4">The full shelf is still open.</p>
                        <Link to="/shop" className="lp-btn lp-btn-primary mt-8">Shop candles</Link>
                    </div>
                )}
                {status === 'ok' && products.length > 0 && reduce && (
                    <div className={`${SHELL} py-24 sm:py-32`}>
                        <h2 data-reveal className="lp-display lp-h2 max-w-[16ch]">
                            The shapes people come back for.
                        </h2>
                        <p data-reveal style={{ '--d': '120ms' }} className="lp-lede mt-4 max-w-[36ch]">
                            A handful of pieces we pour again and again.
                        </p>
                        <div className="mt-12">
                            <ProductPan products={products} onAdd={handleAdd} />
                        </div>
                    </div>
                )}
                {status === 'ok' && products.length > 0 && !reduce && (
                    <ProductPan products={products} onAdd={handleAdd} />
                )}
            </section>

            {/* Process: equal tiles, no pin, so it cannot overlay the shelf */}
            <section id="process" className="relative z-0 scroll-mt-24 bg-[#1F150E]">
                <div className={`${SHELL} pt-24 pb-4 sm:pt-32`}>
                    <h2 data-reveal className="lp-display lp-h2 max-w-[16ch]">
                        Four steps. No machinery.
                    </h2>
                    <p data-reveal style={{ '--d': '120ms' }} className="lp-lede mt-4 max-w-[40ch]">
                        Every Enpees candle passes through the same four hands.
                    </p>
                </div>
                <PourChapters reduce={reduce} />
            </section>

            {/* Close: broken-grid on the wood table */}
            <section className="relative bg-[#1F150E] py-24 sm:py-32 lg:py-36">
                <img
                    src={woodTable}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(90deg, rgba(31,21,14,0.92) 0%, rgba(31,21,14,0.72) 42%, rgba(31,21,14,0.35) 100%)',
                    }}
                />

                <div className={`${SHELL} relative grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-8`}>
                    <div className="lg:col-span-6 lg:pb-8">
                        <h2 data-reveal className="lp-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                            Light one tonight.
                        </h2>
                        <p data-reveal style={{ '--d': '120ms' }} className="lp-lede mt-5 max-w-[34ch]">
                            Fresh stock every Wednesday. We wrap whatever you pick before the weekend.
                        </p>
                        <div data-reveal style={{ '--d': '220ms' }} className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link to="/shop" className="lp-btn lp-btn-primary">Shop candles</Link>
                            <Link to="/contact" className="lp-btn lp-btn-ghost">Custom order</Link>
                        </div>
                    </div>
                    <div className="relative lg:col-span-6">
                        <img
                            src={lotusCandle}
                            alt="A lotus-shaped Enpees candle"
                            loading="lazy"
                            decoding="async"
                            className="relative z-10 w-full max-w-lg rounded-[20px] object-cover shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] lg:ml-auto lg:w-[92%] lg:translate-x-8"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
