import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import flowerCandle from '../assets/Flower_Glass_Jar_Candle__199.webp';
import vanillaCandle from '../assets/Vanilla_Bliss_Glass_Jar_Candle__249.webp';
import sandalwoodCandle from '../assets/Chai_Biscuit_Glass_Candle___90.webp';
import oceanCandle from '../assets/Snowman_Candle ___199.webp';
import heroBg from '../assets/hero-bg.png'; // Using as profile placeholder

const Admin = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', image: null });
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'products', 'orders'
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [featuredPage, setFeaturedPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        fetch('http://localhost:3001/api/orders')
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error('Error fetching orders:', err));

        fetch('http://localhost:3001/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    const handleAddProduct = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('price', newProduct.price);
        formData.append('stock', newProduct.stock);
        if (newProduct.image) {
            formData.append('image', newProduct.image);
        }

        fetch('http://localhost:3001/api/products', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                setProducts([...products, data]);
                setShowAddProduct(false);
                setNewProduct({ name: '', description: '', price: '', stock: '', image: null });
            })
            .catch(err => console.error('Error adding product:', err));
    };

    return (
        <div className="bg-[#3B2A23] font-['Inter',_sans-serif] h-screen overflow-hidden text-[#FFF7ED]">
            <div className="relative flex h-screen w-full">
                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#D8A24A] text-[#3B2A23] rounded-lg shadow-lg"
                >
                    <span className="material-symbols-outlined">
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>

                {/* SideNavBar */}
                <aside className={`flex h-screen w-64 flex-col justify-between p-4 sticky top-0 border-r border-[#EAD2C0]/10 bg-[#3B2A23] z-40 transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 fixed' : '-translate-x-full fixed lg:relative'}`}>
                    <div className="flex flex-col gap-8">
                        <Link to="/" className="flex items-center gap-3 px-3 hover:opacity-80 transition-opacity">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                                style={{ backgroundImage: `url(${heroBg})` }}
                            ></div>
                            <div className="flex flex-col">
                                <h1 className="text-base font-bold leading-normal text-[#FFF7ED]">Enpees Candles</h1>
                                <p className="text-sm font-normal leading-normal text-[#EAD2C0]">Owner Dashboard</p>
                            </div>
                        </Link>
                        <nav className="flex flex-col gap-2">
                            <button 
                                onClick={() => { setActiveView('dashboard'); setIsMobileMenuOpen(false); }}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${activeView === 'dashboard' ? 'bg-[#D8A24A] text-[#3B2A23]' : 'text-[#EAD2C0] hover:bg-white/10'}`}
                            >
                                <span className="material-symbols-outlined text-2xl">dashboard</span>
                                <p className={`text-sm leading-normal ${activeView === 'dashboard' ? 'font-bold' : 'font-medium'}`}>Dashboard</p>
                            </button>
                            <button 
                                onClick={() => { setActiveView('products'); setIsMobileMenuOpen(false); }}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${activeView === 'products' ? 'bg-[#D8A24A] text-[#3B2A23]' : 'text-[#EAD2C0] hover:bg-white/10'}`}
                            >
                                <span className="material-symbols-outlined text-2xl">inventory_2</span>
                                <p className={`text-sm leading-normal ${activeView === 'products' ? 'font-bold' : 'font-medium'}`}>Products</p>
                            </button>
                            <button 
                                onClick={() => { setActiveView('orders'); setIsMobileMenuOpen(false); }}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${activeView === 'orders' ? 'bg-[#D8A24A] text-[#3B2A23]' : 'text-[#EAD2C0] hover:bg-white/10'}`}
                            >
                                <span className="material-symbols-outlined text-2xl">receipt_long</span>
                                <p className={`text-sm leading-normal ${activeView === 'orders' ? 'font-bold' : 'font-medium'}`}>Orders</p>
                            </button>
                            <button 
                                onClick={() => { setActiveView('featured'); setIsMobileMenuOpen(false); }}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${activeView === 'featured' ? 'bg-[#D8A24A] text-[#3B2A23]' : 'text-[#EAD2C0] hover:bg-white/10'}`}
                            >
                                <span className="material-symbols-outlined text-2xl">star</span>
                                <p className={`text-sm leading-normal ${activeView === 'featured' ? 'font-bold' : 'font-medium'}`}>Featured</p>
                            </button>
                        </nav>
                    </div>
                    <button onClick={() => setShowAddProduct(true)} className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#D8A24A] text-[#3B2A23] text-sm font-bold leading-normal tracking-wide shadow-md hover:brightness-110 transition-all">
                        <span className="truncate">Add New Product</span>
                    </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto h-screen lg:ml-0 ml-0">
                    {/* Add Product Modal */}
                    {showAddProduct && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="bg-[#3B2A23] p-8 rounded-xl border border-[#FFF7ED]/20 w-full max-w-md">
                                <h2 className="text-2xl font-bold mb-4 text-[#FFF7ED]">Add New Product</h2>
                                <form onSubmit={handleAddProduct} className="space-y-4">
                                    <input
                                        type="text" placeholder="Product Name" required
                                        value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white placeholder-white/50"
                                    />
                                    <textarea
                                        placeholder="Description" required
                                        value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                        className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white placeholder-white/50"
                                    />
                                    <input
                                        type="text" placeholder="Price (e.g. ₹249)" required
                                        value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white placeholder-white/50"
                                    />
                                    <input
                                        type="text" placeholder="Stock" required
                                        value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white placeholder-white/50"
                                    />
                                    <input
                                        type="file" accept="image/*"
                                        onChange={e => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                                        className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white"
                                    />
                                    <div className="flex justify-end gap-4 mt-6">
                                        <button type="button" onClick={() => setShowAddProduct(false)} className="px-4 py-2 text-[#EAD2C0] hover:text-white">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-[#D8A24A] text-[#3B2A23] font-bold rounded">Add Product</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Dashboard View */}
                    {activeView === 'dashboard' && (
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-col gap-2">
                                    <p className="text-4xl font-black leading-tight tracking-tighter text-[#FFF7ED]">Welcome, Owner</p>
                                    <p className="text-base font-normal leading-normal text-[#EAD2C0]">Here's a look at your business performance today.</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {(() => {
                                    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
                                    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
                                    const totalStock = products.reduce((acc, product) => acc + parseInt(product.stock || 0), 0);
                                    return [
                                        { title: "Total Revenue", value: `₹${totalRevenue.toFixed(2)}`, change: "+5.2%", icon: "arrow_upward", color: "text-green-700" },
                                        { title: "Number of Orders", value: orders.length.toString(), change: "+1.3%", icon: "arrow_upward", color: "text-green-700" },
                                        { title: "Average Order Value", value: `₹${avgOrderValue.toFixed(2)}`, change: orders.length > 0 ? "+2.4%" : "0%", icon: orders.length > 0 ? "arrow_upward" : "remove", color: orders.length > 0 ? "text-green-700" : "text-gray-500" },
                                        { title: "Total Inventory", value: totalStock.toString(), change: "+10%", icon: "arrow_upward", color: "text-green-700" }
                                    ];
                                })().map((stat, index) => (
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

                            <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#FFF7ED] pt-4">Product Management</h2>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
                                {products.slice(0, 4).map((product, index) => (
                                    <div key={index} className="flex flex-col gap-4 rounded-xl p-4 backdrop-blur-xl bg-[#FFF7ED]/60 border border-[#FFF7ED]/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                                        <div
                                            className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg shadow-sm"
                                            style={{ backgroundImage: `url('${product.image}')` }}
                                        ></div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-base font-bold leading-normal text-[#3B2A23]">{product.name}</p>
                                            <p className="text-sm font-normal leading-normal text-[#554B47]">Stock: {product.stock}</p>
                                            <p className="text-sm font-normal leading-normal text-[#554B47]">{product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#FFF7ED] pt-4">Recent Orders</h2>
                            <div className="overflow-x-auto rounded-xl border border-[#FFF7ED]/20">
                                <table className="w-full text-left text-sm text-[#EAD2C0]">
                                    <thead className="bg-[#FFF7ED]/10 text-xs uppercase text-[#FFF7ED]">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Order ID</th>
                                            <th scope="col" className="px-6 py-3">Customer</th>
                                            <th scope="col" className="px-6 py-3">Items</th>
                                            <th scope="col" className="px-6 py-3">Total</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 5).map((order) => (
                                            <tr key={order.id} className="border-b border-[#FFF7ED]/10 bg-[#FFF7ED]/5 hover:bg-[#FFF7ED]/10">
                                                <td className="px-6 py-4 font-medium text-[#FFF7ED]">{order.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">{order.customer.name}</span>
                                                        <span className="text-xs opacity-70">{order.customer.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                                                </td>
                                                <td className="px-6 py-4">₹{order.total.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-400 ring-1 ring-inset ring-yellow-400/20">
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center">No orders found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Products View */}
                    {activeView === 'products' && (
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-col gap-2">
                                    <p className="text-4xl font-black leading-tight tracking-tighter text-[#FFF7ED]">Product Management</p>
                                    <p className="text-base font-normal leading-normal text-[#EAD2C0]">Manage your product inventory and listings.</p>
                                </div>
                                <button onClick={() => setShowAddProduct(true)} className="flex h-12 cursor-pointer items-center justify-center rounded-lg px-6 bg-[#D8A24A] text-[#3B2A23] text-sm font-bold leading-normal tracking-wide shadow-md hover:brightness-110 transition-all">
                                    <span className="material-symbols-outlined mr-2">add</span>
                                    Add New Product
                                </button>
                            </div>

                            {products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <span className="material-symbols-outlined text-6xl text-[#EAD2C0] mb-4">inventory_2</span>
                                    <p className="text-xl text-[#EAD2C0] mb-2">No products yet</p>
                                    <p className="text-sm text-[#EAD2C0]/70">Add your first product to get started</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
                                    {products.map((product, index) => (
                                        <div key={index} className="flex flex-col gap-4 rounded-xl p-4 backdrop-blur-xl bg-[#FFF7ED]/60 border border-[#FFF7ED]/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                                            <div
                                                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg shadow-sm"
                                                style={{ backgroundImage: `url('${product.image}')` }}
                                            ></div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-base font-bold leading-normal text-[#3B2A23]">{product.name}</p>
                                                <p className="text-sm font-normal leading-normal text-[#554B47]">Stock: {product.stock}</p>
                                                <p className="text-sm font-normal leading-normal text-[#554B47]">{product.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Orders View */}
                    {activeView === 'orders' && (
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-col gap-2">
                                    <p className="text-4xl font-black leading-tight tracking-tighter text-[#FFF7ED]">Order Management</p>
                                    <p className="text-base font-normal leading-normal text-[#EAD2C0]">View and manage all customer orders.</p>
                                </div>
                            </div>

                            {orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <span className="material-symbols-outlined text-6xl text-[#EAD2C0] mb-4">receipt_long</span>
                                    <p className="text-xl text-[#EAD2C0] mb-2">No orders yet</p>
                                    <p className="text-sm text-[#EAD2C0]/70">Orders will appear here once customers place them</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-[#FFF7ED]/20">
                                    <table className="w-full text-left text-sm text-[#EAD2C0]">
                                        <thead className="bg-[#FFF7ED]/10 text-xs uppercase text-[#FFF7ED]">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Order ID</th>
                                                <th scope="col" className="px-6 py-3">Date</th>
                                                <th scope="col" className="px-6 py-3">Customer</th>
                                                <th scope="col" className="px-6 py-3">Items</th>
                                                <th scope="col" className="px-6 py-3">Total</th>
                                                <th scope="col" className="px-6 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order.id} className="border-b border-[#FFF7ED]/10 bg-[#FFF7ED]/5 hover:bg-[#FFF7ED]/10">
                                                    <td className="px-6 py-4 font-medium text-[#FFF7ED]">{order.id}</td>
                                                    <td className="px-6 py-4">
                                                        {order.date ? new Date(order.date).toLocaleDateString('en-IN', { 
                                                            day: '2-digit', 
                                                            month: 'short', 
                                                            year: 'numeric' 
                                                        }) : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold">{order.customer.name}</span>
                                                            <span className="text-xs opacity-70">{order.customer.email}</span>
                                                            <span className="text-xs opacity-70 mt-1">{order.customer.address}, {order.customer.city}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            {order.items.map((item, idx) => (
                                                                <span key={idx} className="text-xs">
                                                                    {item.name} (x{item.quantity})
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold">₹{order.total.toFixed(2)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-400 ring-1 ring-inset ring-yellow-400/20">
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Featured Products View */}
                    {activeView === 'featured' && (
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <p className="text-4xl font-black leading-tight tracking-tighter text-[#FFF7ED]">Featured Products</p>
                                <p className="text-base font-normal leading-normal text-[#EAD2C0]">Select up to 6 products to display in the landing page bestsellers section</p>
                                <p className="text-sm text-[#D8A24A] mt-2">
                                    Currently Featured: {products.filter(p => p.featured === true || p.featured === 'true').length} / 6
                                </p>
                            </div>

                            {(() => {
                                const totalPages = Math.ceil(products.length / itemsPerPage);
                                const startIndex = (featuredPage - 1) * itemsPerPage;
                                const endIndex = startIndex + itemsPerPage;
                                const currentProducts = products.slice(startIndex, endIndex);
                                
                                return (
                                    <>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                                            {currentProducts.map(product => {
                                                const isFeatured = product.featured === true || product.featured === 'true';
                                                const featuredCount = products.filter(p => p.featured === true || p.featured === 'true').length;

                                                return (
                                                    <div key={product.id} className={`bg-[#FFF7ED]/5 border ${isFeatured ? 'border-[#D8A24A] ring-2 ring-[#D8A24A]/50' : 'border-[#FFF7ED]/10'} rounded-lg p-3 transition-all hover:border-[#D8A24A]/50 flex flex-col`}>
                                                        <div className="aspect-square w-full overflow-hidden rounded-lg mb-2">
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <h3 className="font-bold text-[#FFF7ED] text-sm mb-1 line-clamp-2">{product.name}</h3>
                                                        <p className="text-xs text-[#EAD2C0] mb-2">{product.price}</p>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                
                                                                // If product is already featured, allow unfeaturing
                                                                // If not featured, check if we're at the limit
                                                                if (!isFeatured && featuredCount >= 6) {
                                                                    alert('You can only feature up to 6 products. Please unselect a featured product first.');
                                                                    return;
                                                                }

                                                                // Toggle featured status
                                                                const newFeaturedStatus = !isFeatured;
                                                                
                                                                fetch(`http://localhost:3001/api/products/${product.id}`, {
                                                                    method: 'PATCH',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ featured: newFeaturedStatus })
                                                                })
                                                                    .then(res => res.json())
                                                                    .then(updatedProduct => {
                                                                        setProducts(prevProducts => prevProducts.map(p => p.id === product.id ? updatedProduct : p));
                                                                    })
                                                                    .catch(err => console.error('Error updating featured status:', err));
                                                            }}
                                                            className={`w-full py-1.5 rounded-lg font-bold text-xs transition-all mt-auto ${isFeatured
                                                                    ? 'bg-[#D8A24A] text-[#3B2A23] hover:bg-[#D8A24A]/90'
                                                                    : 'bg-[#FFF7ED]/10 text-[#FFF7ED] hover:bg-[#FFF7ED]/20'
                                                                }`}
                                                        >
                                                            {isFeatured ? (
                                                                <span className="flex items-center justify-center gap-1">
                                                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                                    Featured
                                                                </span>
                                                            ) : (
                                                                'Set as Featured'
                                                            )}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-center gap-2 mt-4">
                                                <button
                                                    onClick={() => setFeaturedPage(featuredPage - 1)}
                                                    disabled={featuredPage === 1}
                                                    className={`flex size-10 items-center justify-center transition-colors ${featuredPage === 1
                                                        ? 'text-[#EAD2C0]/50 cursor-not-allowed'
                                                        : 'text-[#EAD2C0] hover:text-white cursor-pointer'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined">chevron_left</span>
                                                </button>

                                                {[...Array(totalPages)].map((_, index) => {
                                                    const pageNum = index + 1;
                                                    if (
                                                        pageNum === 1 ||
                                                        pageNum === totalPages ||
                                                        (pageNum >= featuredPage - 1 && pageNum <= featuredPage + 1)
                                                    ) {
                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => setFeaturedPage(pageNum)}
                                                                className={`text-sm leading-normal flex size-10 items-center justify-center rounded-full transition-colors ${featuredPage === pageNum
                                                                    ? 'font-bold text-[#FFF7ED] bg-[#D8A24A]/80'
                                                                    : 'font-normal text-[#EAD2C0] hover:text-white hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    } else if (
                                                        pageNum === featuredPage - 2 ||
                                                        pageNum === featuredPage + 2
                                                    ) {
                                                        return <span key={pageNum} className="text-[#EAD2C0]">...</span>;
                                                    }
                                                    return null;
                                                })}

                                                <button
                                                    onClick={() => setFeaturedPage(featuredPage + 1)}
                                                    disabled={featuredPage === totalPages}
                                                    className={`flex size-10 items-center justify-center transition-colors ${featuredPage === totalPages
                                                        ? 'text-[#EAD2C0]/50 cursor-not-allowed'
                                                        : 'text-[#EAD2C0] hover:text-white cursor-pointer'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined">chevron_right</span>
                                                </button>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Admin;
