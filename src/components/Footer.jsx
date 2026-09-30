import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────
   Footer. Editorial flat layout.
   No glass circles, no hand-rolled social SVGs, no emojis, no tick
   marks, no gradient text, no shimmer animation, no accordion. Hairline
   rules only. Icons come from Material Symbols (the project's existing
   icon font), so we never draw our own glyphs.
   ───────────────────────────────────────────────────────────────────── */

const COLUMNS = [
    {
        title: 'Shop',
        links: [
            { to: '/shop', label: 'All candles' },
            { to: '/shop', label: 'Glass jar' },
            { to: '/shop', label: 'Sculpted shapes' },
            { to: '/shop', label: 'Seasonal' },
            { to: '/shop', label: 'Gift sets' },
        ],
    },
    {
        title: 'Studio',
        links: [
            { to: '/contact', label: 'About Fleroma' },
            { to: '/contact', label: 'The process' },
            { to: '/contact', label: 'Wholesale' },
            { to: '/contact', label: 'Custom orders' },
            { to: '/contact', label: 'Press' },
        ],
    },
    {
        title: 'Help',
        links: [
            { to: '/track-order', label: 'Track an order' },
            { to: '/contact', label: 'Contact us' },
            { to: '/contact', label: 'Shipping' },
            { to: '/contact', label: 'Returns' },
            { to: '/contact', label: 'Care guide' },
        ],
    },
];

const SOCIALS = [
    { href: 'https://www.instagram.com/enpees.candles', label: 'Instagram', icon: 'photo_camera' },
    { href: 'https://wa.me/919173958589', label: 'WhatsApp', icon: 'chat' },
    { href: 'mailto:enpeecandles@gmail.com', label: 'Email', icon: 'mail' },
];

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [focused, setFocused] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 4000);
        }
    };

    return (
        <footer className="relative overflow-hidden bg-[#FAF6EF]">
            {/* Top hairline */}
            <div className="lp-hairline" aria-hidden="true" />

            <div className="mx-auto max-w-[1400px] px-7 sm:px-12 lg:px-20">
                {/* ── Top: Manifesto + Newsletter ──────────────────── */}
                <div className="grid grid-cols-1 gap-14 py-20 lg:grid-cols-12 lg:gap-12 lg:py-28">
                    <div className="lg:col-span-7">
                        <p className="lp-eyebrow text-[10px]">A letter, occasionally</p>
                        <h2 className="lp-display mt-5 text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-[3.6rem]">
                            Small batches, the studio's<br />
                            <span className="lp-wonk italic text-[#4A2A1A]">fragrant diary.</span>
                        </h2>
                        <p className="lp-lede mt-6 max-w-[36rem] !text-[15px]">
                            One short note a month: new shapes, what we are pouring, the
                            occasional studio secret. No noise, no sales fluff.
                        </p>
                    </div>

                    <div className="lg:col-span-5 lg:pt-3">
                        <form
                            onSubmit={handleSubscribe}
                            className={`lp-input-glow flex items-center gap-2 rounded-full p-2 ${focused ? 'is-focused' : ''}`}
                        >
                            <span className="material-symbols-outlined ml-3 text-[20px] text-[#4A2A1A]/50" aria-hidden="true">mail</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                placeholder={subscribed ? 'You are on the list.' : 'your@email.com'}
                                required
                                disabled={subscribed}
                                aria-label="Email address"
                                className="flex-1 bg-transparent px-2 py-2 font-jost text-[15px] text-[#4A2A1A] placeholder-[#4A2A1A]/40 outline-none"
                            />
                            <button
                                type="submit"
                                disabled={subscribed}
                                className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#4A2A1A] px-5 py-3 font-jost text-[11px] uppercase tracking-[0.18em] text-[#FAF6EF] transition-all hover:bg-[#3A2013] hover:shadow-[0_10px_30px_-10px_rgba(74,42,26,0.5)] active:translate-y-[1px] disabled:opacity-60"
                            >
                                {subscribed ? (
                                    <>
                                        <span className="material-symbols-outlined text-[15px]">check</span>
                                        Done
                                    </>
                                ) : (
                                    <>
                                        Subscribe
                                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>
                        <p className="mt-4 font-jost text-[11px] uppercase tracking-[0.2em] text-[#4A2A1A]/50">
                            One email a month. Unsubscribe in a click.
                        </p>
                    </div>
                </div>

                {/* ── Middle: Brand mark + columns ─────────────────── */}
                <div className="lp-hairline" aria-hidden="true" />

                <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-20">
                    {/* Brand block */}
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-3">
                            <BrandMark className="h-9 w-9 text-[#4A2A1A]" />
                            <span className="leading-none">
                                <span className="lp-display block text-lg tracking-wide sm:text-xl">Fleroma</span>
                                <span className="font-jost text-[9px] uppercase tracking-[0.3em] text-[#4A2A1A]/60">Hand-poured candles</span>
                            </span>
                        </div>
                        <p className="lp-lede mt-6 max-w-[26rem] !text-[14px]">
                            A two-room studio in Rajkot, pouring soy wax into the shapes we wish
                            someone had made for us. Small batches, hand-finished, posted with care.
                        </p>

                        {/* Socials: flat, hairline-bordered row, not circles */}
                        <div className="mt-8 flex flex-wrap items-center gap-2">
                            {SOCIALS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="group flex items-center gap-2 rounded-full border border-[#4A2A1A]/25 px-4 py-2 font-jost text-[11px] uppercase tracking-[0.18em] text-[#4A2A1A]/70 transition-all hover:border-[#4A2A1A]/60 hover:text-[#4A2A1A]"
                                >
                                    <span className="material-symbols-outlined text-[16px] text-[#4A2A1A] transition-transform group-hover:-translate-y-0.5" aria-hidden="true">{s.icon}</span>
                                    {s.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Spacer on lg */}
                    <div className="hidden lg:col-span-1 lg:block" />

                    {/* Link columns */}
                    {COLUMNS.map((col) => (
                        <div key={col.title} className="lg:col-span-2">
                            <h4 className="font-jost text-[10px] uppercase tracking-[0.26em] text-[#4A2A1A]">
                                {col.title}
                            </h4>
                            <ul className="mt-5 space-y-3">
                                {col.links.map((l) => (
                                    <li key={l.label}>
                                        <Link
                                            to={l.to}
                                            className="lp-foot-link font-jost text-[14px]"
                                        >
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Address column */}
                    <div className="lg:col-span-1">
                        <h4 className="font-jost text-[10px] uppercase tracking-[0.26em] text-[#4A2A1A]">
                            Visit
                        </h4>
                        <address className="mt-5 not-italic font-jost text-[14px] leading-[1.7] text-[#4A2A1A]/65">
                            Office 412, Aqua Corel<br />
                            Kataria Chokdi, Rajkot<br />
                            360 005, India
                        </address>
                        <a
                            href="tel:+919173958589"
                            className="lp-foot-link mt-4 inline-block font-jost text-[14px] text-[#4A2A1A]/65"
                        >
                            +91 91739 58589
                        </a>
                    </div>
                </div>

                {/* ── Bottom strip ──────────────────────────────────── */}
                <div className="lp-hairline" aria-hidden="true" />

                <div className="flex flex-col items-start gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-10">
                    <p className="font-jost text-[12px] text-[#4A2A1A]/50">
                        &copy; {new Date().getFullYear()} Enpee Handcrafts. Made by hand in Rajkot.
                    </p>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-jost text-[11px] uppercase tracking-[0.2em] text-[#4A2A1A]/50">
                        <span className="flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-[#4A2A1A]/60" aria-hidden="true" />
                            MSME Registered
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.18em]">GSTIN 24ERGPB1394P1ZH</span>
                        <Link to="/contact" className="lp-foot-link !text-[11px] !uppercase !tracking-[0.2em]">Privacy</Link>
                        <Link to="/contact" className="lp-foot-link !text-[11px] !uppercase !tracking-[0.2em]">Terms</Link>
                        <Link to="/contact" className="lp-foot-link !text-[11px] !uppercase !tracking-[0.2em]">Refunds</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* Brand mark: a single flame-as-wick glyph drawn with two strokes.
   Real composition (not a stock flame emoji). Solid amber dot at the
   wick's base mirrors the same motif used in the page's hero. */
function BrandMark({ className = '' }) {
    return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
            {/* Outer flame outline */}
            <path
                d="M20 5.5c4.6 4.4 7.2 8 7.2 11.4a7.2 7.2 0 1 1-14.4 0C12.8 13.5 15.4 9.9 20 5.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />
            {/* Inner core */}
            <path
                d="M20 12.4c2.4 2.3 3.6 4.2 3.6 5.9a3.6 3.6 0 1 1-7.2 0c0-1.7 1.2-3.6 3.6-5.9Z"
                fill="currentColor"
                opacity="0.55"
            />
            {/* Wick */}
            <line x1="20" y1="25.6" x2="20" y2="33.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            {/* Base dot */}
            <circle cx="20" cy="35" r="1.6" fill="currentColor" />
        </svg>
    );
}
