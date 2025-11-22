import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ className = "" }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    return (
        <header className={`relative flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-4 sm:px-10 md:px-20 lg:px-40 py-4 ${className}`}>
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-4 text-white">
                    <div className="size-6 text-[#FFF7ED]">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>local_fire_department</span>
                    </div>
                    <h1 className="text-[#FFF7ED] text-xl font-['Italiana',_serif] tracking-wider">Enpees Candles</h1>
                </div>
                <nav className="hidden md:flex items-center gap-9">
                    <Link className="text-[#EAD2C0] hover:text-white text-sm font-medium leading-normal transition-colors" to="/">Home</Link>
                    <Link className="text-[#EAD2C0] hover:text-white text-sm font-medium leading-normal transition-colors" to="/shop">Shop All</Link>
                    <Link className="text-[#EAD2C0] hover:text-white text-sm font-medium leading-normal transition-colors" to="#">Collections</Link>
                    <Link className="text-[#EAD2C0] hover:text-white text-sm font-medium leading-normal transition-colors" to="#">About Us</Link>
                    <Link className="text-[#EAD2C0] hover:text-white text-sm font-medium leading-normal transition-colors" to="/contact">Contact</Link>
                </nav>
            </div>
            {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="absolute inset-x-0 top-0 bottom-0 z-50 flex items-center bg-[#3B2A23] px-4 sm:px-10 md:px-20 lg:px-40">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search candles..."
                        className="flex-1 bg-transparent text-white placeholder-white/50 text-lg outline-none border-b border-white/20 pb-1 font-['Inter',_sans-serif]"
                        autoFocus
                    />
                    <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-4 text-white hover:text-[#D8A24A] transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </form>
            ) : (
                <div className="flex flex-1 justify-end items-center gap-4">
                    <button onClick={() => setIsSearchOpen(true)} className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                    <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">favorite</span>
                    </button>
                    <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">shopping_bag</span>
                    </button>
                </div>
            )}
        </header>
    );
};

export default Navbar;
