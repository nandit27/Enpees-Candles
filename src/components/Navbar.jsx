import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Collections' },
    { to: '/contact', label: 'Contact' },
    { to: '/track-order', label: 'Track Order' },
];

// Brand mark: a lit wick. Same idea as the page's wick rail.
function FlameMark({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
            <path
                d="M12 2.5c3.4 3.3 5.2 6 5.2 8.7a5.2 5.2 0 1 1-10.4 0C6.8 8.5 8.6 5.8 12 2.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />
            {/* inner core: reads as flame, not leaf, at 24px */}
            <path
                d="M12 7.6c1.7 1.7 2.6 3.1 2.6 4.4a2.6 2.6 0 1 1-5.2 0c0-1.3.9-2.7 2.6-4.4Z"
                fill="currentColor"
                opacity="0.42"
            />
            <path d="M12 21.5v-5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

const Navbar = ({ overHero = false, className = '' }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(!overHero);
    const [menuOpen, setMenuOpen] = useState(false);
    const [notice, setNotice] = useState(() => sessionStorage.getItem('enpees-notice') !== 'off');
    const [pop, setPop] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { getCartCount } = useCart();
    const cartCount = getCartCount();
    const prevCount = useRef(cartCount);

    // Solid once past the hero; transparent over it.
    useEffect(() => {
        if (!overHero) return;
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [overHero]);

    // Cart badge pops when an item lands.
    useEffect(() => {
        if (cartCount <= prevCount.current) {
            prevCount.current = cartCount;
            return;
        }
        prevCount.current = cartCount;
        setPop(true);
        const t = setTimeout(() => setPop(false), 520);
        return () => clearTimeout(t);
    }, [cartCount]);

    // Close the drawer on navigation, and lock scroll while it's open.
    useEffect(() => setMenuOpen(false), [pathname]);
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const dismissNotice = () => {
        sessionStorage.setItem('enpees-notice', 'off');
        setNotice(false);
    };

    return (
        <div
            className={`lp z-50 ${overHero ? 'fixed inset-x-0 top-0' : 'sticky top-0'} ${className}`}
            style={{ background: 'transparent' }}
        >
            {/* ── Announcement bar ── */}
            <div
                className="overflow-hidden transition-all duration-500 ease-out"
                style={{ maxHeight: notice ? 40 : 0, opacity: notice ? 1 : 0 }}
            >
                <div className="flex items-center justify-center gap-3 bg-[#4A3527] px-4 py-2.5 text-center">
                    <p className="lp-eyebrow !text-[#EDE6D8] text-[10px] sm:text-[11px]">
                        Free shipping over ₹999
                        <span className="hidden sm:inline"> · Hand-poured in Rajkot</span>
                    </p>
                    <button
                        type="button"
                        onClick={dismissNotice}
                        aria-label="Dismiss announcement"
                        className="text-[#C7BCA8] transition-colors hover:text-[#D3A34E]"
                    >
                        <svg viewBox="0 0 14 14" className="h-3 w-3" aria-hidden="true">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── Nav bar ── */}
            <header
                className={`relative border-b transition-all duration-500 ease-out ${
                    scrolled
                        ? 'border-[#D3A34E]/15 bg-[#2A1D15]/90 backdrop-blur-xl'
                        : 'border-transparent bg-transparent'
                }`}
            >
                <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-12">
                    <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-85">
                        <FlameMark className="h-7 w-7 text-[#D3A34E]" />
                        <span className="leading-none">
                            <span className="lp-display block text-lg tracking-wide sm:text-xl">Enpees</span>
                            <span className="lp-eyebrow block text-[8px] !tracking-[0.34em] text-[#C7BCA8]/70">Candles</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-10 md:flex">
                        {NAV_LINKS.map(({ to, label }) => (
                            <Link
                                key={label}
                                to={to}
                                aria-current={pathname === to ? 'page' : undefined}
                                className={`lp-underline font-jost text-[13px] font-normal tracking-[0.1em] transition-colors ${
                                    pathname === to ? 'text-[#EDE6D8]' : 'text-[#C7BCA8] hover:text-[#EDE6D8]'
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Search candles"
                            className="flex h-11 w-11 items-center justify-center rounded-full text-[#C7BCA8] transition-colors hover:bg-[#EDE6D8]/10 hover:text-[#EDE6D8]"
                        >
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </button>
                        <Link
                            to="/checkout"
                            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
                            className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#C7BCA8] transition-colors hover:bg-[#EDE6D8]/10 hover:text-[#EDE6D8]"
                        >
                            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                            {cartCount > 0 && (
                                <span
                                    className={`absolute right-1.5 top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#D3A34E] px-1 font-jost text-[10px] font-semibold text-[#2A1D15] ${
                                        pop ? 'animate-badge-pop' : ''
                                    }`}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                            aria-expanded={menuOpen}
                            className="flex h-11 w-11 items-center justify-center rounded-full text-[#C7BCA8] transition-colors hover:bg-[#EDE6D8]/10 hover:text-[#EDE6D8] md:hidden"
                        >
                            <span className="material-symbols-outlined text-[22px]">menu</span>
                        </button>
                    </div>
                </div>

                {isSearchOpen && (
                    <form
                        onSubmit={handleSearchSubmit}
                        className="absolute inset-0 z-50 flex items-center gap-4 bg-[#2A1D15] px-5 sm:px-8 lg:px-12"
                    >
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search candles…"
                            aria-label="Search candles"
                            className="flex-1 border-b border-[#D3A34E]/30 bg-transparent pb-1.5 font-jost text-base text-[#EDE6D8] outline-none placeholder:text-[#C7BCA8]/45 focus:border-[#D3A34E]"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(false)}
                            aria-label="Close search"
                            className="text-[#C7BCA8] transition-colors hover:text-[#D3A34E]"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </form>
                )}
            </header>

            {/* ── Mobile drawer: slides in, links fade in one after another ── */}
            <div
                className={`fixed inset-0 z-[60] md:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
                aria-hidden={!menuOpen}
            >
                <button
                    tabIndex={-1}
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                    className={`absolute inset-0 bg-[#150E09]/70 transition-opacity duration-300 ${
                        menuOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                />
                <div
                    className="absolute inset-y-0 right-0 flex w-[82%] max-w-[340px] flex-col bg-[#2A1D15] px-7 pb-10 pt-6 shadow-2xl transition-transform duration-300 ease-out"
                    style={{ transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }}
                >
                    <div className="mb-10 flex items-center justify-between">
                        <FlameMark className="h-6 w-6 text-[#D3A34E]" />
                        <button
                            onClick={() => setMenuOpen(false)}
                            aria-label="Close menu"
                            className="flex h-11 w-11 items-center justify-center rounded-full text-[#C7BCA8] hover:text-[#EDE6D8]"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <nav className="flex flex-col gap-1">
                        {NAV_LINKS.map(({ to, label }, i) => (
                            <Link
                                key={label}
                                to={to}
                                onClick={() => setMenuOpen(false)}
                                className="lp-display border-b border-[#4A3527]/60 py-4 text-2xl transition-colors hover:text-[#D3A34E]"
                                style={{
                                    opacity: menuOpen ? 1 : 0,
                                    transform: menuOpen ? 'none' : 'translateX(16px)',
                                    transition: `opacity .4s ease ${menuOpen ? 120 + i * 70 : 0}ms, transform .4s ease ${
                                        menuOpen ? 120 + i * 70 : 0
                                    }ms, color .2s ease`,
                                }}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                    <Link to="/shop" onClick={() => setMenuOpen(false)} className="lp-btn lp-btn-primary mt-10">
                        Shop all candles
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
