import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CatalogCard from '../components/CatalogCard';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const SORTS = [
    { id: 'default', label: 'Featured' },
    { id: 'price-low', label: 'Price, low to high' },
    { id: 'price-high', label: 'Price, high to low' },
];

const parsePrice = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseInt(value.replace('₹', ''), 10) || 0;
    return 0;
};

const Shop = () => {
    const { addToCart } = useCart();
    const [searchParams, setSearchParams] = useSearchParams();

    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page'), 10) || 1);
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'default');
    const [selectedCollection, setSelectedCollection] = useState(searchParams.get('collection') || 'All');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadState, setLoadState] = useState('loading');
    const itemsPerPage = 12;

    const fetchShop = () => {
        setLoadState('loading');
        fetch(API_ENDPOINTS.PRODUCTS)
            .then((res) => res.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data : []);
                setLoadState('ready');
            })
            .catch((err) => {
                console.error('Error fetching products:', err);
                setLoadState('error');
            });

        fetch(API_ENDPOINTS.CATEGORIES)
            .then((res) => res.json())
            .then((data) => setCategories(Array.isArray(data) ? data : []))
            .catch((err) => console.error('Error fetching categories:', err));
    };

    useEffect(() => {
        fetchShop();
    }, []);

    const searchQuery = searchParams.get('search') || '';

    const collections = useMemo(() => ['All', ...categories.map((cat) => cat.name)], [categories]);

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products;

        if (selectedCollection !== 'All') {
            filtered = filtered.filter(
                (p) => p.category && p.category.toLowerCase() === selectedCollection.toLowerCase()
            );
        }

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    (p.name || '').toLowerCase().includes(lowerQuery) ||
                    (p.description || '').toLowerCase().includes(lowerQuery)
            );
        }

        if (sortBy === 'price-low') {
            filtered = [...filtered].sort((a, b) => parsePrice(a.offerPrice || a.price) - parsePrice(b.offerPrice || b.price));
        } else if (sortBy === 'price-high') {
            filtered = [...filtered].sort((a, b) => parsePrice(b.offerPrice || b.price) - parsePrice(a.offerPrice || a.price));
        }

        return filtered;
    }, [selectedCollection, sortBy, searchQuery, products]);

    const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

    useEffect(() => {
        const params = new URLSearchParams();
        if (currentPage !== 1) params.set('page', String(currentPage));
        if (sortBy !== 'default') params.set('sort', sortBy);
        if (selectedCollection !== 'All') params.set('collection', selectedCollection);
        if (searchQuery) params.set('search', searchQuery);
        setSearchParams(params, { replace: true });
    }, [currentPage, sortBy, selectedCollection, searchQuery, setSearchParams]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCollectionChange = (collection) => {
        setSelectedCollection(collection);
        setCurrentPage(1);
    };

    const handleSortChange = (sort) => {
        setSortBy(sort);
        setCurrentPage(1);
    };

    const handleAdd = (product) => {
        addToCart(product);
        toast.success(`${product.name} added to cart`, {
            duration: 2000,
            position: 'bottom-right',
            style: { background: '#4A2A1A', color: '#FAF6EF', fontWeight: '600' },
        });
    };

    const handleResetFilters = () => {
        setSelectedCollection('All');
        setSortBy('default');
        setCurrentPage(1);
    };

    return (
        <div className="lp relative min-h-[100dvh] w-full bg-[#FAF6EF] text-[#4A2A1A]">
            <Navbar />

            <main id="main-content" className="mx-auto w-full max-w-[1400px] px-5 pb-24 pt-10 sm:px-10 lg:px-16">
                <header className="max-w-xl">
                    <h1 className="lp-display text-4xl leading-[1.1] md:text-5xl lg:text-6xl">The collection</h1>
                    <p className="lp-lede mt-4 max-w-[65ch] text-[#4A2A1A]/70">
                        Hand-poured shapes, ready to gift. Filter by collection or price.
                    </p>
                </header>

                <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="lp-pills" role="tablist" aria-label="Collections">
                            {collections.map((collection) => (
                                <button
                                    key={collection}
                                    type="button"
                                    role="tab"
                                    aria-selected={selectedCollection === collection}
                                    data-on={selectedCollection === collection}
                                    onClick={() => handleCollectionChange(collection)}
                                    className="lp-pill"
                                >
                                    {collection}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2" role="group" aria-label="Sort candles">
                        {SORTS.map((sort) => (
                            <button
                                key={sort.id}
                                type="button"
                                onClick={() => handleSortChange(sort.id)}
                                className={`whitespace-nowrap font-jost text-sm tracking-wide transition-colors ${
                                    sortBy === sort.id
                                        ? 'text-[#4A2A1A]'
                                        : 'text-[#4A2A1A]/70 hover:text-[#4A2A1A]'
                                }`}
                                aria-pressed={sortBy === sort.id}
                            >
                                {sort.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6 font-jost text-sm text-[#4A2A1A]/70">
                    {searchQuery ? (
                        <p>
                            Results for “{searchQuery}”
                            {loadState === 'ready' ? ` · ${filteredAndSortedProducts.length} candles` : ''}
                        </p>
                    ) : loadState === 'ready' ? (
                        <p>
                            {filteredAndSortedProducts.length}{' '}
                            {filteredAndSortedProducts.length === 1 ? 'candle' : 'candles'}
                        </p>
                    ) : (
                        <p className="sr-only">Loading candles</p>
                    )}
                </div>

                {loadState === 'loading' && (
                    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div key={index} className="flex flex-col">
                                <div className="aspect-[4/5] animate-pulse rounded-[20px] bg-[#EDE0C8]" />
                                <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-[#EDE0C8]" />
                            </div>
                        ))}
                    </div>
                )}

                {loadState === 'error' && (
                    <div className="mt-16 max-w-md">
                        <h2 className="lp-display text-3xl leading-[1.1]">Could not load the shop</h2>
                        <p className="lp-lede mt-3 text-[#4A2A1A]/70">Check your connection, then try again.</p>
                        <button type="button" onClick={fetchShop} className="lp-btn lp-btn-primary mt-6">
                            Try again
                        </button>
                    </div>
                )}

                {loadState === 'ready' && currentProducts.length === 0 && (
                    <div className="mt-16 max-w-md">
                        <h2 className="lp-display text-3xl leading-[1.1]">
                            {products.length === 0 ? 'The shop is being restocked' : 'Nothing in this view'}
                        </h2>
                        <p className="lp-lede mt-3 text-[#4A2A1A]/70">
                            {products.length === 0
                                ? 'New pours land here first. Come back shortly.'
                                : 'Clear the filters to see the full collection.'}
                        </p>
                        {products.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-3">
                                <button type="button" onClick={handleResetFilters} className="lp-btn lp-btn-primary">
                                    Show all
                                </button>
                                {searchQuery && (
                                    <Link to="/shop" className="lp-btn lp-btn-ghost">
                                        Clear search
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {loadState === 'ready' && currentProducts.length > 0 && (
                    <div className="mt-8 grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
                        {currentProducts.map((product) => (
                            <CatalogCard key={product._id || product.name} product={product} onAdd={handleAdd} />
                        ))}
                    </div>
                )}

                {loadState === 'ready' && totalPages > 1 && currentProducts.length > 0 && (
                    <nav className="mt-12 flex items-center justify-center gap-1" aria-label="Shop pages">
                        <button
                            type="button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                            className={`flex size-10 items-center justify-center rounded-full transition-colors ${
                                currentPage === 1 ? 'text-[#4A2A1A]/40' : 'text-[#4A2A1A]/70 hover:text-[#4A2A1A]'
                            }`}
                        >
                            <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
                        </button>
                        {Array.from({ length: totalPages }).map((_, index) => {
                            const pageNum = index + 1;
                            if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={pageNum}
                                        type="button"
                                        onClick={() => handlePageChange(pageNum)}
                                        aria-current={currentPage === pageNum ? 'page' : undefined}
                                        className={`flex size-10 items-center justify-center rounded-full font-jost text-sm transition-colors ${
                                            currentPage === pageNum
                                                ? 'bg-[#4A2A1A] text-[#FAF6EF]'
                                                : 'text-[#4A2A1A]/70 hover:text-[#4A2A1A]'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }
                            if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                return (
                                    <span key={pageNum} className="flex size-10 items-center justify-center text-[#4A2A1A]/70">
                                        ...
                                    </span>
                                );
                            }
                            return null;
                        })}
                        <button
                            type="button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                            className={`flex size-10 items-center justify-center rounded-full transition-colors ${
                                currentPage === totalPages ? 'text-[#4A2A1A]/40' : 'text-[#4A2A1A]/70 hover:text-[#4A2A1A]'
                            }`}
                        >
                            <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
                        </button>
                    </nav>
                )}
            </main>
        </div>
    );
};

export default Shop;
