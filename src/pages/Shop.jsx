import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Shop = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Pagination and Sorting State
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high'
    const [selectedCollection, setSelectedCollection] = useState('All');
    const [products, setProducts] = useState([]);
    const itemsPerPage = 12;

    useEffect(() => {
        fetch('http://localhost:3001/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    // Define broad collection groups
    const collectionGroups = {
        'Premium': ['Premium Collection', 'Gourmet Collection', 'Classic Collection'],
        'Seasonal': ['Holiday Collection', 'Winter Collection', 'Festival Collection'],
        'Decorative': ['Decorative Collection', 'Party Collection', 'Botanical Collection', 'Romance Collection', 'Floral Collection', 'Cute Collection', 'Spiritual Collection', 'Celebration Collection']
    };

    const collections = ['All', 'Premium', 'Seasonal', 'Decorative'];

    // Filter and Sort Products
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products;

        // Filter by Collection Group
        if (selectedCollection !== 'All') {
            const allowedCollections = collectionGroups[selectedCollection] || [];
            filtered = filtered.filter(p => allowedCollections.includes(p.collection));
        }

        // Filter by Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery)
            );
        }

        // Sort products
        if (sortBy === 'price-low') {
            filtered = [...filtered].sort((a, b) => {
                const priceA = typeof a.price === 'string' ? parseInt(a.price.replace('₹', '')) : a.price;
                const priceB = typeof b.price === 'string' ? parseInt(b.price.replace('₹', '')) : b.price;
                return priceA - priceB;
            });
        } else if (sortBy === 'price-high') {
            filtered = [...filtered].sort((a, b) => {
                const priceA = typeof a.price === 'string' ? parseInt(a.price.replace('₹', '')) : a.price;
                const priceB = typeof b.price === 'string' ? parseInt(b.price.replace('₹', '')) : b.price;
                return priceB - priceA;
            });
        }

        return filtered;
    }, [selectedCollection, sortBy, searchQuery, products]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

    // Handlers
    const handleProductClick = (product) => {
        navigate('/product', { state: { product } });
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCollectionChange = (collection) => {
        setSelectedCollection(collection);
        setCurrentPage(1); // Reset to first page
    };

    const handleSortChange = (sort) => {
        setSortBy(sort);
        setCurrentPage(1); // Reset to first page
    };

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#3B2A23] font-['Inter',_sans-serif] text-[#554B47]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    alt="A warm, atmospheric scene with a soft focus on a cozy interior."
                    className="h-full w-full object-cover opacity-80"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDutxWS_dei-qSFNwXWoKTewxP_16V-9wfEEEJY83nVcfVFMKVhliMqIHbGbMdG3-8pFpxpNbxxb_pPMDOLA9eC7HOtrTY0N7dCGjcsculTxxNUQAfsVwM3bcFTNDXetT6Bpz79irmbRZH96WCGMt5LdKegoePs3SJojRFUSjCOEKsDgWyGZCJTUrychUS8S_ks5UB8tzcYzDh5jNHas55kC2HzRORJRKVGlWo8LiCeH_0D-f7nXpX0pTJbTDtSomfn-si24I6j0mZp"
                />
                <div className="absolute inset-0 bg-[#3B2A23]/50"></div>
            </div>

            <div className="relative z-10 flex h-full grow flex-col">
                {/* Header */}
                <Navbar />

                {/* Main Content */}
                <main className="flex flex-1 justify-center px-4 sm:px-10 md:px-20 lg:px-40 py-10">
                    <div className="flex w-full max-w-7xl flex-col">
                        <div className="flex flex-wrap justify-between gap-3 p-4">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-white text-5xl md:text-6xl font-['Italiana',_serif] tracking-wide">Our Collection</h2>
                                <p className="text-[#EAD2C0] text-base font-normal leading-normal max-w-md">Discover our handcrafted candles, designed to bring warmth and luxury to your space.</p>
                            </div>
                        </div>

                        {/* Filters and Sorting */}
                        <div className="flex flex-col gap-3 p-4">
                            {/* Collections */}
                            <div className="flex flex-col gap-2">
                                <span className="text-[#EAD2C0] text-sm font-medium">Collections:</span>
                                <div className="flex gap-2 flex-wrap">
                                    {collections.map((collection) => (
                                        <button
                                            key={collection}
                                            onClick={() => handleCollectionChange(collection)}
                                            className={`${selectedCollection === collection
                                                ? 'bg-[#D8A24A]/50 shadow-[0_0_12px_0_rgba(216,162,74,0.5)] text-[#FFF7ED]'
                                                : 'bg-[#FFF7ED]/15 hover:bg-[#FFF7ED]/25 text-[#EAD2C0]'
                                                } backdrop-blur-[10px] border border-white/10 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-sm font-medium leading-normal transition-colors duration-300`}
                                        >
                                            {collection}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="flex flex-col gap-2">
                                <span className="text-[#EAD2C0] text-sm font-medium">Sort:</span>
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => handleSortChange('default')}
                                        className={`${sortBy === 'default'
                                            ? 'bg-[#D8A24A]/50 shadow-[0_0_12px_0_rgba(216,162,74,0.5)] text-[#FFF7ED]'
                                            : 'bg-[#FFF7ED]/15 hover:bg-[#FFF7ED]/25 text-[#EAD2C0]'
                                            } backdrop-blur-[10px] border border-white/10 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-3 sm:px-4 text-xs sm:text-sm font-medium leading-normal transition-colors duration-300`}
                                    >
                                        Default
                                    </button>
                                    <button
                                        onClick={() => handleSortChange('price-low')}
                                        className={`${sortBy === 'price-low'
                                            ? 'bg-[#D8A24A]/50 shadow-[0_0_12px_0_rgba(216,162,74,0.5)] text-[#FFF7ED]'
                                            : 'bg-[#FFF7ED]/15 hover:bg-[#FFF7ED]/25 text-[#EAD2C0]'
                                            } backdrop-blur-[10px] border border-white/10 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-3 sm:px-4 text-xs sm:text-sm font-medium leading-normal transition-colors duration-300`}
                                    >
                                        <span className="hidden sm:inline">Price: </span>Low to High
                                    </button>
                                    <button
                                        onClick={() => handleSortChange('price-high')}
                                        className={`${sortBy === 'price-high'
                                            ? 'bg-[#D8A24A]/50 shadow-[0_0_12px_0_rgba(216,162,74,0.5)] text-[#FFF7ED]'
                                            : 'bg-[#FFF7ED]/15 hover:bg-[#FFF7ED]/25 text-[#EAD2C0]'
                                            } backdrop-blur-[10px] border border-white/10 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-3 sm:px-4 text-xs sm:text-sm font-medium leading-normal transition-colors duration-300`}
                                    >
                                        <span className="hidden sm:inline">Price: </span>High to Low
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product Count */}
                        <div className="px-4 py-2">
                            <p className="text-[#EAD2C0] text-sm">
                                Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
                            </p>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 p-2 sm:p-4">
                            {currentProducts.map((product, index) => (
                                <div
                                    key={index}
                                    className={`bg-[#FFF7ED]/70 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_0_rgba(0,0,0,0.25),0_0_0_2px_rgba(216,162,74,0.5)] rounded-xl overflow-hidden flex flex-col group ${index % 4 === 1 || index % 4 === 3 ? 'lg:mt-16' : ''}`}
                                >
                                    <div className="w-full aspect-[3/4] overflow-hidden cursor-pointer" onClick={() => handleProductClick(product)}>
                                        <img
                                            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                            alt={product.name}
                                            src={product.image}
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-[#554B47] text-lg font-bold leading-normal">{product.name}</h3>
                                        <p className="text-[#554B47]/70 text-sm font-normal leading-normal">{product.collection}</p>
                                        <div className="mt-auto pt-4 flex justify-between items-center">
                                            <p className="text-[#554B47] text-lg font-semibold">
                                                ₹{product.price}
                                            </p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    addToCart(product);
                                                    toast.success(`${product.name} added to cart!`, {
                                                        duration: 2000,
                                                        position: 'bottom-right',
                                                        style: {
                                                            background: '#D8A24A',
                                                            color: '#3B2A23',
                                                            fontWeight: 'bold',
                                                        },
                                                    });
                                                }}
                                                className="bg-[#D8A24A] text-white h-10 px-4 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center p-4 mt-8 gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`flex size-10 items-center justify-center transition-colors ${currentPage === 1
                                        ? 'text-[#EAD2C0]/50 cursor-not-allowed'
                                        : 'text-[#EAD2C0] hover:text-white cursor-pointer'
                                        }`}
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>

                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNum = index + 1;
                                    // Show first page, last page, current page, and pages around current
                                    if (
                                        pageNum === 1 ||
                                        pageNum === totalPages ||
                                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`text-sm leading-normal flex size-10 items-center justify-center rounded-full transition-colors ${currentPage === pageNum
                                                    ? 'font-bold text-[#FFF7ED] bg-[#D8A24A]/80'
                                                    : 'font-normal text-[#EAD2C0] hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (
                                        pageNum === currentPage - 2 ||
                                        pageNum === currentPage + 2
                                    ) {
                                        return (
                                            <span
                                                key={pageNum}
                                                className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#EAD2C0] rounded-full"
                                            >
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`flex size-10 items-center justify-center transition-colors ${currentPage === totalPages
                                        ? 'text-[#EAD2C0]/50 cursor-not-allowed'
                                        : 'text-[#EAD2C0] hover:text-white cursor-pointer'
                                        }`}
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </div>
                </main>


            </div>
        </div>
    );
};

export default Shop;
