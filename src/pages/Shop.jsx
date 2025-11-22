import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Shop = () => {
    const navigate = useNavigate();

    // Pagination and Sorting State
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high'
    const [selectedCollection, setSelectedCollection] = useState('All');
    const itemsPerPage = 12;

    const products = [
        { title: "4 Layer Bubble Pyramid Candle", price: "₹60", collection: "Decorative Collection", image: "/src/assets/4_Layer_Bubble_Pyramid_Candle__60.webp", description: "A stunning 4-layer bubble pyramid candle perfect for special occasions" },
        { title: "Balloon Candle", price: "₹150", collection: "Party Collection", image: "/src/assets/Balloon_Candle__150.webp", description: "Fun balloon-shaped candle that adds a festive touch to any celebration" },
        { title: "Cactus Candle", price: "₹90", collection: "Botanical Collection", image: "/src/assets/Cactus_Candle__90.webp", description: "Adorable cactus-shaped candle for plant lovers" },
        { title: "Candle Light Bouquet Candle", price: "₹199", collection: "Premium Collection", image: "/src/assets/Candle_Light_Bouquet_Candle__199.webp", description: "Elegant bouquet candle that creates a romantic ambiance" },
        { title: "Chai Biscuit Glass Candle", price: "₹90", collection: "Gourmet Collection", image: "/src/assets/Chai_Biscuit_Glass_Candle___90.webp", description: "Delightful chai biscuit scented candle in a glass jar" },
        { title: "Christmas Bell Candle", price: "₹150", collection: "Holiday Collection", image: "/src/assets/Christmas_Bell_Candle __150.webp", description: "Festive bell-shaped candle perfect for Christmas celebrations" },
        { title: "Christmas Bomb", price: "₹499", collection: "Holiday Collection", image: "/src/assets/Christmas_Bomb___499.webp", description: "Premium Christmas-themed decorative candle set" },
        { title: "Christmas Bubble Tree Candle", price: "₹150", collection: "Holiday Collection", image: "/src/assets/Christmas_Bubble_Tree_Candle__150.webp", description: "Charming bubble tree candle for the holiday season" },
        { title: "Cute Snowman Candle", price: "₹120", collection: "Winter Collection", image: "/src/assets/Cute_Snowman_Candle__120 .webp", description: "Adorable snowman candle that brings winter magic indoors" },
        { title: "Diya Scented Candle", price: "₹15", collection: "Festival Collection", image: "/src/assets/Diya_Scented_Candle__15.webp", description: "Traditional diya-shaped scented candle for festivals" },
        { title: "Festival Diya Scented", price: "₹20", collection: "Festival Collection", image: "/src/assets/Festival_Diya_Scented__20.webp", description: "Beautifully crafted festival diya with delightful scents" },
        { title: "Festival Rhombus Candle", price: "₹60", collection: "Festival Collection", image: "/src/assets/Festival_Rhombus_Candle__60.webp", description: "Unique rhombus-shaped candle for festive occasions" },
        { title: "Flower Glass Jar Candle", price: "₹199", collection: "Premium Collection", image: "/src/assets/Flower_Glass_Jar_Candle__199.webp", description: "Elegant flower-decorated glass jar candle" },
        { title: "Flower Heart Bouquet Candle", price: "₹199", collection: "Romance Collection", image: "/src/assets/Flower_Heart_Bouquet_Candle__199.webp", description: "Romantic heart-shaped bouquet candle perfect for gifting" },
        { title: "Flowers", price: "₹20", collection: "Floral Collection", image: "/src/assets/Flowers__20.webp", description: "Simple yet beautiful flower-shaped candles" },
        { title: "Hand Holding Heart Candle", price: "₹150", collection: "Romance Collection", image: "/src/assets/Hand_Holding_Heart_Candle___150.webp", description: "Touching hand holding heart design for special moments" },
        { title: "Heart Mini Teddy Candle", price: "₹50", collection: "Cute Collection", image: "/src/assets/Heart_Mini_Teddy_Candle__50.webp", description: "Sweet mini teddy with heart candle" },
        { title: "Honey Teddy Scented Candle", price: "₹50", collection: "Cute Collection", image: "/src/assets/Honey_Teddy_Scented_Candle___50.webp", description: "Honey-scented teddy bear candle" },
        { title: "Lotus Candle", price: "₹99", collection: "Spiritual Collection", image: "/src/assets/Lotus_Candle __99.webp", description: "Serene lotus-shaped candle for meditation and relaxation" },
        { title: "Love Rose Heart Candle", price: "₹90", collection: "Romance Collection", image: "/src/assets/Love_Rose_Heart_Candle __90.webp", description: "Beautiful rose heart candle expressing love" },
        { title: "Luxury Mini Bouquet Candle", price: "₹150", collection: "Premium Collection", image: "/src/assets/Luxury_Mini_Bouquet_Candle__150 .webp", description: "Luxurious mini bouquet candle for elegant settings" },
        { title: "Mini Cake Candle", price: "₹60", collection: "Celebration Collection", image: "/src/assets/Mini_Cake_Candle___60.webp", description: "Delightful mini cake-shaped candle for celebrations" },
        { title: "Mini Glass Jar Candle", price: "₹80", collection: "Classic Collection", image: "/src/assets/Mini_Glass_Jar_Candle__80.webp", description: "Compact glass jar candle perfect for small spaces" },
        { title: "Mini Rose Flower Glass Jar Candle", price: "₹250", collection: "Premium Collection", image: "/src/assets/Mini_Rose_Flower_Glass_Jar_Candle__250.webp", description: "Premium rose flower glass jar candle" },
        { title: "Rabbit Candle", price: "₹50", collection: "Cute Collection", image: "/src/assets/Rabbit_Candle __50.webp", description: "Adorable rabbit-shaped candle" },
        { title: "Rose Flower Basket Candle", price: "₹249", collection: "Premium Collection", image: "/src/assets/Rose_Flower_Basket_Candle___249.webp", description: "Exquisite rose flower basket candle arrangement" },
        { title: "Snowman Candle", price: "₹199", collection: "Winter Collection", image: "/src/assets/Snowman_Candle ___199.webp", description: "Large decorative snowman candle for winter decor" },
        { title: "Snowman Holding Tree Candle", price: "₹70", collection: "Winter Collection", image: "/src/assets/Snowman_Holing_Tree _Candle__70.webp", description: "Charming snowman holding a Christmas tree candle" },
        { title: "Teddy Cup Cake Candle", price: "₹99", collection: "Cute Collection", image: "/src/assets/Teddy_Cup_Cake_Candle__99.webp", description: "Sweet teddy bear cupcake candle" },
        { title: "Teddy Glass Jar Candle", price: "₹199", collection: "Premium Collection", image: "/src/assets/Teddy_Glass_Jar_Candle__199.webp", description: "Premium teddy bear themed glass jar candle" },
        { title: "Teddy Heart Candle", price: "₹60", collection: "Cute Collection", image: "/src/assets/Teddy_Heart_Candle__60.webp", description: "Teddy bear with heart candle perfect for gifting" },
        { title: "Tulip Flower Candle", price: "₹120", collection: "Floral Collection", image: "/src/assets/Tulip_Flower_Candle__120.webp", description: "Elegant tulip flower candle" },
        { title: "Vanilla Bliss Glass Jar Candle", price: "₹249", collection: "Premium Collection", image: "/src/assets/Vanilla_Bliss_Glass_Jar_Candle__249.webp", description: "Luxurious vanilla-scented glass jar candle" }
    ];

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
                p.title.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery)
            );
        }

        // Sort products
        if (sortBy === 'price-low') {
            filtered = [...filtered].sort((a, b) => {
                const priceA = parseInt(a.price.replace('₹', ''));
                const priceB = parseInt(b.price.replace('₹', ''));
                return priceA - priceB;
            });
        } else if (sortBy === 'price-high') {
            filtered = [...filtered].sort((a, b) => {
                const priceA = parseInt(a.price.replace('₹', ''));
                const priceB = parseInt(b.price.replace('₹', ''));
                return priceB - priceA;
            });
        }

        return filtered;
    }, [selectedCollection, sortBy, searchQuery]);

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
                        <div className="flex gap-3 p-4 flex-wrap items-center">
                            <div className="flex gap-2 flex-wrap">
                                <span className="text-[#EAD2C0] text-sm font-medium px-2 flex items-center">Collections:</span>
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
                            <div className="flex gap-2 ml-auto">
                                <span className="text-[#EAD2C0] text-sm font-medium px-2 flex items-center">Sort:</span>
                                <button
                                    onClick={() => handleSortChange('default')}
                                    className={`${sortBy === 'default'
                                        ? 'bg-[#D8A24A]/50 shadow-[0_0_12px_0_rgba(216,162,74,0.5)] text-[#FFF7ED]'
                                        : 'bg-[#FFF7ED]/15 hover:bg-[#FFF7ED]/25 text-[#EAD2C0]'
                                        } backdrop-blur-[10px] border border-white/10 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-sm font-medium leading-normal transition-colors duration-300`}
                                >
                                    Default
                                </button>
                                <button
                                    onClick={() => handleSortChange('price-low')}
                                    className={`${sortBy === 'price-low'
                                        ? 'bg-[#D8A24A]/50 shadow-[0_0_12px_0_rgba(216,162,74,0.5)] text-[#FFF7ED]'
                                        : 'bg-[#FFF7ED]/15 hover:bg-[#FFF7ED]/25 text-[#EAD2C0]'
                                        } backdrop-blur-[10px] border border-white/10 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-sm font-medium leading-normal transition-colors duration-300`}
                                >
                                    Price: Low to High
                                </button>
                                <button
                                    onClick={() => handleSortChange('price-high')}
                                    className={`${sortBy === 'price-high'
                                        ? 'bg-[#D8A24A]/50 shadow-[0_0_12px_0_rgba(216,162,74,0.5)] text-[#FFF7ED]'
                                        : 'bg-[#FFF7ED]/15 hover:bg-[#FFF7ED]/25 text-[#EAD2C0]'
                                        } backdrop-blur-[10px] border border-white/10 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-sm font-medium leading-normal transition-colors duration-300`}
                                >
                                    Price: High to Low
                                </button>
                            </div>
                        </div>

                        {/* Product Count */}
                        <div className="px-4 py-2">
                            <p className="text-[#EAD2C0] text-sm">
                                Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
                            </p>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
                            {currentProducts.map((product, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleProductClick(product)}
                                    className={`bg-[#FFF7ED]/70 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_0_rgba(0,0,0,0.25),0_0_0_2px_rgba(216,162,74,0.5)] rounded-xl overflow-hidden flex flex-col group cursor-pointer ${index % 4 === 1 || index % 4 === 3 ? 'lg:mt-16' : ''}`}
                                >
                                    <div className="w-full aspect-[3/4] overflow-hidden">
                                        <img
                                            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                            alt={product.title}
                                            src={product.image}
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-[#554B47] text-lg font-bold leading-normal">{product.title}</h3>
                                        <p className="text-[#554B47]/70 text-sm font-normal leading-normal">{product.collection}</p>
                                        <div className="mt-auto pt-4 flex justify-between items-center">
                                            <p className="text-[#554B47] text-lg font-semibold">{product.price}</p>
                                            <button className="bg-[#D8A24A] text-white h-10 px-4 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all">Add to Cart</button>
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
