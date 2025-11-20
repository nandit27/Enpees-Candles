import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Shop = () => {
    const navigate = useNavigate();

    const products = [
        { title: "Amber & Sandalwood", price: "$34.00", collection: "Signature Collection", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9DOqsOwA9gIJTx_qrNMBEjjWtz1f1lI9fpEKSTfnIwj3E0j2DdQNNN9SA63vFymqxdgbkTlpseamxH0i3V8yVrDvkqsEEUgHNrAb26HVMzLJdMjlqHoy59btSpyIbRQQBzMPQDtp7GEaa_qhibQjRTtpCLZrwUnL476BJGwLUGjNQt0n-sOqozyl0AkuffAG5IEkt-hfQym67-AjJXGrNE7ryp79nJ6HLHWGOZYwCcni6ZXE3EPEyQlrKzrM7eHQGCtITg1l2S472" },
        { title: "Vanilla Bean & Birch", price: "$34.00", collection: "Signature Collection", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFYapgXDD5eR9VAivxe_Q2uOxGc7gQC5Rw-g9k_IWdJQyQ-eieYk732-56s21ARzVc2z4pXFctjLSqj8073yQPn8kMJ4VDWcFhMvIuTJaz7Nc3hocTvS-O-6Dlw3WTI0rdO7wqMPwgGwsFZlGgziAIF5nsplhJhpqHhiGHwiV_iCmYPtxm_UTpexkKgjTTZ0rzf8aOuoS-wQItvrnnSHvVh9iHvTS5ffmKPdv3pet_rk3Whkk4-DNsafdFel2_fwjeBgKMu37d5oBo" },
        { title: "Spiced Pumpkin Chai", price: "$36.00", collection: "Seasonal Collection", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwKnh3WgMi8OkhyLiQfD6RUTgTwXeEaWohCCp72xKV8QsjPyStiu0pFbJkHU_oOg7qxaZrOy71BoDNqdaiTafaHYdi7ajPhCW3TgxM-BcFMNW8je_yeD7scL0ehAnxlQZ7H3At5mUVV1VxXs4kPVcREMK20PU9BwfDFGJjRFsbEdMmdgScSZsc4gtNaEy9ZuUkiJFt2RjBLUlCLaxKHaJvjGcu-wqgIctJLkm7E3o8enEGAip9MqM3i7gx2xrFRzRO39m50RUC3bND" },
        { title: "Ocean Rose & Driftwood", price: "$34.00", collection: "Coastal Collection", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3dXOC1lllDpuXRhDxTUmv6oCEdgSFeE4m8XAc5KtWJ3HbQtsnkGii_gjR-vC9NKUgRRNzO9j3RUaEMBy82hmwXUCWJQ6CYhTFMoQ5OmV87oYidTPzbBs3gb_OF4g-b6ngk_tVqQrY0sXL39o0L0Em0N1ky6mnrmgMSIuYEkZoblSXgDQJhnm6lXOR72yEqxByiWTjVwR0Z3CsS9MmONFlRDWNY9OmIxl9apeYycl48jJQ4EBQ2hV7rzAHv9vLsAZozXx8feB3EkhI" },
        { title: "Midnight Jasmine", price: "$34.00", collection: "Floral Collection", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLMMcgydKi7GgPJekmoc2pUC_ArH-7Xtlm1JAH0TBRwcnaYQ-mcnlGb4qAdDdndwT_akgh7gNudsx2iNGHt_IO98P9sOUyqfebV1j7BI_tDWrLAf2_syXGqdRV8exvpZBGyOmtAVIennxXo2tC-m1r-x7AGl-hWBnhSUxCd03MwXfEGl0TEABUqPrd6DLK230pEsZLPvCivIbLg87Q3M-BxWu7jkESfm39141NbSnPKCc61mgGCGbIstHm4Vj5H_Gt0MAqtmj6LOTe" },
        { title: "Smoked Cedar & Leather", price: "$38.00", collection: "Signature Collection", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNfjqDQ-RtGubckkxwWILCUfypJy1PY1ejF1HEUjtD0nHW6k9QdpLQtSs28jpSawye1vCnaWikwVkMjwQ-zDFGOH0oVRySsbrOj8ZkwW5Tqf2vnj4GK738872lQbfaqvOK7tABZwP_3fz49qgmwVl7P7uS2B9L31d4mhJJ_lxrdf8Jp8mzz5G0A7Soh5K81tpP1qc1JUbWtqdqgMboFpWE8RHBFgzgO2CFoPyssNhMOY1DtzpZoVQe74nyqHsuL8QXv--GDUY2NgHy" },
        { title: "Eucalyptus & Lavender", price: "$32.00", collection: "Aromatherapy Collection", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxdp3XGnxCZ7kiVDzpGa6Q-UjXdHu-3jRI-M2voHbDipb2zTXbGkLfU8_v22JS3JoCUb66DlyK_vWSJG3iV2Y2yCEQVTmV9lwzVQXTL7TJHgLCIElDIfyMlSKcN8gPQLU_LflcTlwm4HnneDJFNVFKza9JMCil7WZDRJoSj83jMGBIN25fhG3S1wrUuCP_zyMD3XLmG1Gyc4sgmT1Xf2CxD2Ircbv5ekgrtLL_WqxFzhOfc6E3s-Z8uTh2laYn4264todRXaD0RyGN" },
        { title: "Cozy Cashmere & Fig", price: "$38.00", collection: "Luxe Collection", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5euO8p2vbdXSll6zNG7sSyQ-50AMIN_B4Jx8pp6I2aJ9BMo1wVY-yozTGyljAd6Ch2O-LCZKXnXEh9yjRyZmDyHWrYoQ6SjgBRXqQ3aRHlvFx6NUKBMI2CTQUHD9bClO1TiMxbErIAzWLZ6Cjp4IE_7u6nVGxeRhIvpOWBXs3y8wTiheTzB2PRs4r3BnUxrADSVv4q5LJcuDYNgeG2N6wWdyi-f8ZCE0FtkA-plG4_OAQDYBY5F7DgLQsQp5bZXdPF-803_HSXP2R" },
        { title: "Cinnamon & Apple Crisp", price: "$36.00", collection: "Seasonal Collection", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGQvPVI_Ey9akCGkO4xqLZK-4qxiB3YCNrs6LrQC1TMhLaFBxpnbr_Kn-LlKBrAfj0TtHr_Zps-lkq0kecfElfkjf-KPKxYt0yxLE3dwvRMY5pJnbElCiavd1prLNt-H_n_Y2mV5-wszDAtpB_WfxTfP2iQIKlsZAGsRVnuIX1N7NaKx1kN97qoRpJfw_GxfvK_ungqEgCsvyU4Sg4aXu0d08aGlhyTjT7llzo1Lx6gBMBbVw0uUwHCOIevl6PGr4DJXhTHOXRe1T7" },
        { title: "Bergamot & Grapefruit", price: "$32.00", collection: "Citrus Collection", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNvQt32tNMGu3XKCMzLfophNwevRYZcHGkdeGfgl5WA6RjRPagkM94y1tZk4qeahQy2FjhKlGfyM8efKzMWDN1fZ-8EdQfRYXm5ofYQX6MMDlwBkJ71Deb1mHL1Fqnnd4FjKgD37Vh0sG2Jvr6jSM3sKtnmw8TZcdZpnQcLchrF9inb4UV3M9PUQUwuuY2V3-UZrmyBq9OLaEsmCc1quD9AFvCNUYp4Kud21R3OA4hjtn6LksUYRkUIq5EBkKJQdPD0isAZuFQkUff" },
        { title: "Winter Forest Pine", price: "$38.00", collection: "Holiday Collection", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQYD-jiFukuujWCAj9M2dtSxmp0pXq5am85xldwa_lUIjIryvs9K74XU6ydB2-y_rz4jdmeOwKflOywofzW_mQ43EewA8ZGRBnv6fmBh7Cr6NoaeqTkpPgV9JbwrAdVX0leWEQX6otcB6xji1byzDZ7zfww3q2AhbDvRjXI0zARM9E45pR1OpwvLkyTgn9Z2Wqi84DRkx8gkamw3D1JBUY8fCsGedM4uE4IDY-O7BSq1mpCpQ46bmekRx72gAhdWHMCFisjQRWCCZS" },
        { title: "Linen & Cotton Blossom", price: "$34.00", collection: "Fresh Collection", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyKp5LtR3I5KASA9cMLtg9cczaZJm-61XqKQh0ZJjgFu82-Gf32FObBqYpkfYRQWl2zNiq433Vvj_JxpVQrnQgAkA_0Xdysdg8o-kHewg5Pz0yVAHD4khW_3IuueHPwFYsYNujH_PTv37dIap0EjHFhtxgbzpq50niq_drEyMk-aIng2J1fNAFHZRWgjooaghSxQGeq3lWw3_sMo7YvmQhnvsmL9FfO5pZRBdxlkxw9TS_oZd2R8uR1rXl7QLR-Bex_Z7sGS7vhjDe" }
    ];

    const handleProductClick = (product) => {
        navigate('/product', { state: { product } });
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
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-4 sm:px-10 md:px-20 lg:px-40 py-4">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 text-white">
                            <div className="size-6 text-[#FFF7ED]">
                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>local_fire_department</span>
                            </div>
                            <h1 className="text-[#FFF7ED] text-xl font-['Italiana',_serif] tracking-wider">Enpees Candles</h1>
                        </div>
                        <nav className="hidden md:flex items-center gap-9">
                            <Link className="text-[#EAD2C0] hover:text-white text-sm font-medium leading-normal transition-colors" to="/">Home</Link>
                            <Link className="text-white text-sm font-bold leading-normal" to="/shop">Shop All</Link>
                            <Link className="text-[#EAD2C0] hover:text-white text-sm font-medium leading-normal transition-colors" to="#">Collections</Link>
                            <Link className="text-[#EAD2C0] hover:text-white text-sm font-medium leading-normal transition-colors" to="#">About Us</Link>
                            <Link className="text-[#EAD2C0] hover:text-white text-sm font-medium leading-normal transition-colors" to="/contact">Contact</Link>
                        </nav>
                    </div>
                    <div className="flex flex-1 justify-end items-center gap-4">
                        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">favorite</span>
                        </button>
                        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">shopping_bag</span>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex flex-1 justify-center px-4 sm:px-10 md:px-20 lg:px-40 py-10">
                    <div className="flex w-full max-w-7xl flex-col">
                        <div className="flex flex-wrap justify-between gap-3 p-4">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-white text-5xl md:text-6xl font-['Italiana',_serif] tracking-wide">Our Collection</h2>
                                <p className="text-[#EAD2C0] text-base font-normal leading-normal max-w-md">Discover our handcrafted candles, designed to bring warmth and luxury to your space.</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-3 p-4 flex-wrap">
                            <button className="bg-[#D8A24A]/50 shadow-[0_0_12px_0_rgba(216,162,74,0.5)] text-[#FFF7ED] backdrop-blur-[10px] border border-white/10 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-sm font-medium leading-normal transition-colors duration-300">All</button>
                            <button className="bg-[#FFF7ED]/15 hover:bg-[#FFF7ED]/25 backdrop-blur-[10px] border border-white/10 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-[#EAD2C0] text-sm font-medium leading-normal transition-colors duration-300">Scent Profile</button>
                            <button className="bg-[#FFF7ED]/15 hover:bg-[#FFF7ED]/25 backdrop-blur-[10px] border border-white/10 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-[#EAD2C0] text-sm font-medium leading-normal transition-colors duration-300">Collection</button>
                            <button className="bg-[#FFF7ED]/15 hover:bg-[#FFF7ED]/25 backdrop-blur-[10px] border border-white/10 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-[#EAD2C0] text-sm font-medium leading-normal transition-colors duration-300">Size</button>
                            <button className="bg-[#FFF7ED]/15 hover:bg-[#FFF7ED]/25 backdrop-blur-[10px] border border-white/10 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-[#EAD2C0] text-sm font-medium leading-normal transition-colors duration-300">Limited Edition</button>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
                            {products.map((product, index) => (
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
                        <div className="flex items-center justify-center p-4 mt-8">
                            <a className="flex size-10 items-center justify-center text-[#EAD2C0] hover:text-white transition-colors" href="#">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </a>
                            <a className="text-sm font-bold leading-normal flex size-10 items-center justify-center text-[#FFF7ED] rounded-full bg-[#D8A24A]/80" href="#">1</a>
                            <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#EAD2C0] hover:text-white rounded-full hover:bg-white/10 transition-colors" href="#">2</a>
                            <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#EAD2C0] hover:text-white rounded-full hover:bg-white/10 transition-colors" href="#">3</a>
                            <span className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#EAD2C0] rounded-full">...</span>
                            <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#EAD2C0] hover:text-white rounded-full hover:bg-white/10 transition-colors" href="#">8</a>
                            <a className="flex size-10 items-center justify-center text-[#EAD2C0] hover:text-white transition-colors" href="#">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </a>
                        </div>
                    </div>
                </main>


            </div>
        </div>
    );
};

export default Shop;
