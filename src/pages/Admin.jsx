import React from 'react';

const Admin = () => {
    return (
        <div className="bg-[#3B2A23] font-['Inter',_sans-serif] min-h-screen text-[#FFF7ED]">
            <div className="relative flex min-h-screen w-full">
                {/* SideNavBar */}
                <aside className="flex h-screen w-64 flex-col justify-between p-4 sticky top-0 border-r border-[#EAD2C0]/10">
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-3 px-3">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfPLjse1da96CoxLmiU-Wjz-36mxpE67sQ7-nJVhFJpLWE3meJxazdt6TgLILARMvYIfBWpgTp4GEnmy8gV3--vbUKeokHR2uTSO9lTE7xVDMLaeNfHBRgTok5M2cfvVMsZhVVIWNb6B4gsjvLpPDc-dYajnE4dANTdt7GvENlnFxjdIRl7Il2LT2ji-DbQFN8LWX1HFGKzh7ztaXrUZdCsPM6XSGa1P214JeHA8ip_j06zt_ejjPhgU-PYsb-S71I6SyVNwzk5oCX')" }}
                            ></div>
                            <div className="flex flex-col">
                                <h1 className="text-base font-bold leading-normal text-[#FFF7ED]">Enpees Candles</h1>
                                <p className="text-sm font-normal leading-normal text-[#EAD2C0]">Owner Dashboard</p>
                            </div>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <a className="flex items-center gap-3 rounded-lg bg-[#D8A24A] px-3 py-2 text-[#3B2A23]" href="#">
                                <span className="material-symbols-outlined text-2xl">dashboard</span>
                                <p className="text-sm font-bold leading-normal">Dashboard</p>
                            </a>
                            <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#EAD2C0] hover:bg-white/10 transition-colors" href="#">
                                <span className="material-symbols-outlined text-2xl">inventory_2</span>
                                <p className="text-sm font-medium leading-normal">Products</p>
                            </a>
                            <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#EAD2C0] hover:bg-white/10 transition-colors" href="#">
                                <span className="material-symbols-outlined text-2xl">receipt_long</span>
                                <p className="text-sm font-medium leading-normal">Orders</p>
                            </a>
                            <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#EAD2C0] hover:bg-white/10 transition-colors" href="#">
                                <span className="material-symbols-outlined text-2xl">bar_chart</span>
                                <p className="text-sm font-medium leading-normal">Analytics</p>
                            </a>
                        </nav>
                    </div>
                    <button className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#D8A24A] text-[#3B2A23] text-sm font-bold leading-normal tracking-wide shadow-md hover:brightness-110 transition-all">
                        <span className="truncate">Add New Product</span>
                    </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="flex flex-col gap-8">
                        {/* PageHeading */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-4xl font-black leading-tight tracking-tighter text-[#FFF7ED]">Welcome, Owner</p>
                                <p className="text-base font-normal leading-normal text-[#EAD2C0]">Here's a look at your business performance today.</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { title: "Total Revenue", value: "$1,234.56", change: "+5.2%", icon: "arrow_upward", color: "text-green-700" },
                                { title: "Number of Orders", value: "78", change: "+1.3%", icon: "arrow_upward", color: "text-green-700" },
                                { title: "Average Order Value", value: "$15.82", change: "-0.5%", icon: "arrow_downward", color: "text-red-700" },
                                { title: "Inventory Count", value: "450", change: "+10%", icon: "arrow_upward", color: "text-green-700" }
                            ].map((stat, index) => (
                                <div key={index} className="flex flex-col gap-2 rounded-xl p-6 backdrop-blur-xl bg-[#FFF7ED]/60 border border-[#FFF7ED]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <p className="text-base font-medium leading-normal text-[#554B47]">{stat.title}</p>
                                    <p className="text-3xl font-bold leading-tight tracking-tight text-[#3B2A23]">{stat.value}</p>
                                    <div className="flex items-center gap-1">
                                        <span className={`material-symbols-outlined text-lg ${stat.color}`}>{stat.icon}</span>
                                        <p className={`text-base font-medium leading-normal ${stat.color}`}>{stat.change}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* SectionHeader */}
                        <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#FFF7ED] pt-4">Product Management</h2>

                        {/* ImageGrid */}
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
                            {[
                                { name: "Luxe Ember Candle", stock: "50", price: "$24.99", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9wV5t1CNkxAGPL2D0NVQdJAdt_gjeG6PBtv_0kH5ZCrsWx6qNRMcDoSLL1nNl3BZyod0qcYcnADHnB4dFBIbG_ZAeSFSCWzgkVdFuJ-cG6sx6XfSgh-9ywD9tyaUYOFZ9WEV8qbM8IgYcMThRegzphTqZaz81OXrjTW7V5JwdO2u964smwjAav2lS7ZXwURYuU866KTfE25j_9HZSVeujSQ0FB7M7UFsCBoAxNP1kM64QsQasqyBeYypZyA1t6mHjfF6q7yyDdwyj" },
                                { name: "Vanilla Dream Candle", stock: "32", price: "$22.99", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCK-uMLkMYZq0ObHw6b1FDCUwZChGoNtHWSgiNIjTeDB4B7uZ7d4WZsb9zcvd4EYk6t5iHCtSo6ZOUGJ66FQAIDJFwMjK5Tz6dXTTpANUg2UxqfQDDxrWTPPqAzP7k0Hkbl_gz4A0Hm2RaOnSIZP-0CKr1OVow2lnDEAetsLgTmimAcULCTIv9FTgSjvHgE14PU2Qo5QwI8ZtOW0_OwWd4RdXlXMTYybbtnpIt-JvKVC5X1mErO-rtC6YbkjqfJk6Yp-uFIIDjOFMPS" },
                                { name: "Sandalwood Serenity", stock: "15 (Low)", price: "$29.99", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEch_p1baYbZ46FF16mBIaHUtzyxidP_9QUPVWZOgrd7b5aqvQdnDqF_lTLllLQoQdZ1TYzP6eiFsbVUxSyNOLhLvdbyPkWuZ-vyM738YtfYGzhx4xE4JAhtD533-ZZTTMGUZvaq9q6yclRjPJSXAKDI56PYOYF4Xcmiqyv81SSFZO_vrST9YFQTjPz812WX-lOz1bcXA_egrQf6lQbyMl9DgZ6gABcdUhJdKQm1mQzHjPxi_DB9JQi7hIvBD2-WHA4up08NMtYUqq", stockColor: "text-red-700" },
                                { name: "Ocean Mist Candle", stock: "88", price: "$24.99", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl2VJNnN3GDaPTBB3JjzQSM_yyuBNott_NTg2DOnBI2s55rCiCvw3xm3AAcURd64-Dpr074A4VKYp6zy90kGc2WJ2LZDn_ZXRDQZDvhCDuxo-HhQ-GLqCLdOOo6WWAEkFeh9zXKwKaBbsiFCbsZlIKo3bQBFUaQlG3eiZwwVVJzBKPRBi4DMaTZLJfBHweDJpftt48y4xGOlGoNUCf8RjXmPCa5497Dw7bicLXSbpVB6vULESHMuz2b9O7CdoNC3Aqj0wt963CPkb5" }
                            ].map((product, index) => (
                                <div key={index} className="flex flex-col gap-4 rounded-xl p-4 backdrop-blur-xl bg-[#FFF7ED]/60 border border-[#FFF7ED]/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg shadow-sm"
                                        style={{ backgroundImage: `url('${product.img}')` }}
                                    ></div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-base font-bold leading-normal text-[#3B2A23]">{product.name}</p>
                                        <p className={`text-sm font-normal leading-normal ${product.stockColor || 'text-[#554B47]'}`}>Stock: {product.stock}</p>
                                        <p className="text-sm font-normal leading-normal text-[#554B47]">{product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Admin;
