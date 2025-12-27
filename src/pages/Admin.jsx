import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { API_ENDPOINTS } from '../config/api';
import flowerCandle from '../assets/Flower_Glass_Jar_Candle__199.webp';
import vanillaCandle from '../assets/Vanilla_Bliss_Glass_Jar_Candle__249.webp';
import sandalwoodCandle from '../assets/Chai_Biscuit_Glass_Candle___90.webp';
import oceanCandle from '../assets/Snowman_Candle ___199.webp';
import heroBg from '../assets/hero-bg.png'; // Using as profile placeholder

const Admin = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [inquiries, setInquiries] = useState({ general: [], trade: [], bulk: [] });
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', category: '', image: null });
    const [editingProduct, setEditingProduct] = useState(null);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showEditProduct, setShowEditProduct] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'products', 'orders', 'inquiries', 'categories'
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [featuredPage, setFeaturedPage] = useState(1);
    const itemsPerPage = 12;

    // Check admin authentication
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (!token || !user) {
            navigate('/login');
            return;
        }

        try {
            const userData = JSON.parse(user);
            if (userData.role !== 'admin') {
                navigate('/');
                return;
            }
        } catch (error) {
            navigate('/login');
            return;
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        fetch(API_ENDPOINTS.ADMIN_ORDERS, { headers })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => setOrders(data))
            .catch(err => {
                console.error('Error fetching orders:', err);
                if (err.message.includes('401')) {
                    navigate('/login');
                }
            });

        fetch(API_ENDPOINTS.PRODUCTS)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching products:', err));

        fetch(API_ENDPOINTS.CATEGORIES)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => setCategories(data))
            .catch(err => console.error('Error fetching categories:', err));

        fetch(API_ENDPOINTS.INQUIRIES)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => setInquiries(data))
            .catch(err => console.error('Error fetching inquiries:', err));
    }, [navigate]);

    const handleAddProduct = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('price', newProduct.price);
        formData.append('stock', newProduct.stock);
        formData.append('category', newProduct.category);
        if (newProduct.image) {
            formData.append('image', newProduct.image);
        }

        fetch(API_ENDPOINTS.PRODUCTS, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                setProducts([...products, data]);
                setShowAddProduct(false);
                setNewProduct({ name: '', description: '', price: '', stock: '', category: '', image: null });
            })
            .catch(err => console.error('Error adding product:', err));
    };

    const handleEditProduct = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editingProduct.name);
        formData.append('description', editingProduct.description);
        formData.append('price', editingProduct.price);
        formData.append('stock', editingProduct.stock);
        formData.append('category', editingProduct.category);
        if (editingProduct.image && typeof editingProduct.image !== 'string') {
            formData.append('image', editingProduct.image);
        }

        fetch(API_ENDPOINTS.PRODUCT_BY_ID(editingProduct._id), {
            method: 'PATCH',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                setProducts(products.map(p => p._id === data._id ? data : p));
                setShowEditProduct(false);
                setEditingProduct(null);
            })
            .catch(err => console.error('Error updating product:', err));
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        fetch(API_ENDPOINTS.CATEGORIES, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCategory)
        })
            .then(res => res.json())
            .then(data => {
                setCategories([...categories, data]);
                setShowCategoryModal(false);
                setNewCategory({ name: '', description: '' });
            })
            .catch(err => console.error('Error adding category:', err));
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            fetch(API_ENDPOINTS.CATEGORY_BY_ID(id), {
                method: 'DELETE'
            })
                .then(() => setCategories(categories.filter(c => c._id !== id)))
                .catch(err => console.error('Error deleting category:', err));
        }
    };

    const handleLogout = () => {       
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <div className="bg-[#3B2A23] font-['Inter',_sans-serif] h-screen overflow-hidden text-[#FFF7ED]">
            <div className="relative flex h-screen w-full">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden fixed top-4 left-4 z-[60] p-2 sm:p-3 bg-[#D8A24A] text-[#3B2A23] rounded-lg shadow-xl"
                >
                    <span className="material-symbols-outlined text-xl sm:text-2xl">
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>

                {/* Mobile Backdrop Overlay */}
                {isMobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* SideNavBar */}
                <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 flex flex-col justify-between p-4 border-r border-[#EAD2C0]/10 bg-[#3B2A23] z-50 transition-transform duration-300 overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                    <div className="flex flex-col gap-8">
                        <button onClick={() => setActiveView('dashboard')} className="flex items-center gap-3 px-3 hover:opacity-80 transition-opacity text-left">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                                style={{ backgroundImage: `url(${heroBg})` }}
                            ></div>
                            <div className="flex flex-col">
                                <h1 className="text-base font-bold leading-normal text-[#FFF7ED]">Enpees Candles</h1>
                                <p className="text-sm font-normal leading-normal text-[#EAD2C0]">Owner Dashboard</p>
                            </div>
                        </button>
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
                            <button
                                onClick={() => { setActiveView('inquiries'); setIsMobileMenuOpen(false); }}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${activeView === 'inquiries' ? 'bg-[#D8A24A] text-[#3B2A23]' : 'text-[#EAD2C0] hover:bg-white/10'}`}
                            >
                                <span className="material-symbols-outlined text-2xl">contact_mail</span>
                                <p className={`text-sm leading-normal ${activeView === 'inquiries' ? 'font-bold' : 'font-medium'}`}>Inquiries</p>
                            </button>
                            <button
                                onClick={() => { setActiveView('categories'); setIsMobileMenuOpen(false); }}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${activeView === 'categories' ? 'bg-[#D8A24A] text-[#3B2A23]' : 'text-[#EAD2C0] hover:bg-white/10'}`}
                            >
                                <span className="material-symbols-outlined text-2xl">category</span>
                                <p className={`text-sm leading-normal ${activeView === 'categories' ? 'font-bold' : 'font-medium'}`}>Categories</p>
                            </button>
                        </nav>
                    </div>
                    <div className="space-y-3">
                        <button onClick={() => setShowAddProduct(true)} className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#D8A24A] text-[#3B2A23] text-sm font-bold leading-normal tracking-wide shadow-md hover:brightness-110 transition-all">
                            <span className="truncate">Add New Product</span>
                        </button>
                        <button onClick={handleLogout} className="flex min-w-[84px] w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-red-600 text-white text-sm font-bold leading-normal tracking-wide shadow-md hover:bg-red-700 transition-all">
                            <span className="material-symbols-outlined text-lg">logout</span>
                            <span className="truncate">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto h-screen w-full pt-16 lg:pt-6">
                    {/* Add Product Modal */}
                    {showAddProduct && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                            <div className="bg-[#3B2A23] p-4 sm:p-8 rounded-xl border border-[#FFF7ED]/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                                        type="number" placeholder="Stock" required
                                        value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white placeholder-white/50"
                                    />
                                    <select
                                        value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        required
                                        className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
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

                    {/* Edit Product Modal */}
                    {showEditProduct && editingProduct && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                            <div className="bg-[#3B2A23] p-4 sm:p-8 rounded-xl border border-[#FFF7ED]/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-4 text-[#FFF7ED]">Edit Product</h2>
                                <form onSubmit={handleEditProduct} className="space-y-4">
                                    <input
                                        type="text" placeholder="Product Name" required
                                        value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white placeholder-white/50"
                                    />
                                    <textarea
                                        placeholder="Description" required
                                        value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                        className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white placeholder-white/50"
                                    />
                                    <input
                                        type="text" placeholder="Price (e.g. ₹249)" required
                                        value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                        className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white placeholder-white/50"
                                    />
                                    <input
                                        type="number" placeholder="Stock" required
                                        value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                                        className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white placeholder-white/50"
                                    />
                                    <select
                                        value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                        required
                                        className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div>
                                        <label className="text-sm text-[#EAD2C0] mb-1 block">Change Image (optional)</label>
                                        <input
                                            type="file" accept="image/*"
                                            onChange={e => setEditingProduct({ ...editingProduct, image: e.target.files[0] })}
                                            className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white"
                                        />
                                        {typeof editingProduct.image === 'string' && (
                                            <p className="text-xs text-[#EAD2C0] mt-1">Current: {editingProduct.image.split('/').pop()}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-4 mt-6">
                                        <button type="button" onClick={() => { setShowEditProduct(false); setEditingProduct(null); }} className="px-4 py-2 text-[#EAD2C0] hover:text-white">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-[#D8A24A] text-[#3B2A23] font-bold rounded">Update Product</button>
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
                                    <p className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tighter text-[#FFF7ED]">Welcome, Owner</p>
                                    <p className="text-sm sm:text-base font-normal leading-normal text-[#EAD2C0]">Here's a look at your business performance today.</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {(() => {
                                    const totalRevenue = orders.reduce((acc, order) => acc + (order.totals?.total || order.total || 0), 0);
                                    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
                                    const totalStock = products.reduce((acc, product) => acc + parseInt(product.stock || 0), 0);
                                    return [
                                        { title: "Total Revenue", value: `₹${totalRevenue.toFixed(2)}`, change: "+5.2%", icon: "arrow_upward", color: "text-green-700" },
                                        { title: "Number of Orders", value: orders.length.toString(), change: "+1.3%", icon: "arrow_upward", color: "text-green-700" },
                                        { title: "Average Order Value", value: `₹${avgOrderValue.toFixed(2)}`, change: orders.length > 0 ? "+2.4%" : "0%", icon: orders.length > 0 ? "arrow_upward" : "remove", color: orders.length > 0 ? "text-green-700" : "text-gray-500" },
                                        { title: "Total Inventory", value: totalStock.toString(), change: "+10%", icon: "arrow_upward", color: "text-green-700" }
                                    ];
                                })().map((stat, index) => (
                                    <div key={index} className="flex flex-col gap-1 sm:gap-2 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 backdrop-blur-xl bg-[#FFF7ED]/60 border border-[#FFF7ED]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        <p className="text-xs sm:text-sm lg:text-base font-medium leading-normal text-[#554B47]">{stat.title}</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight tracking-tight text-[#3B2A23]">{stat.value}</p>
                                        <div className="flex items-center gap-1">
                                            <span className={`material-symbols-outlined text-lg ${stat.color}`}>{stat.icon}</span>
                                            <p className={`text-base font-medium leading-normal ${stat.color}`}>{stat.change}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight text-[#FFF7ED] pt-4">Product Management</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                                {products.slice(0, 4).map((product, index) => (
                                    <div key={index} className="flex flex-col gap-2 sm:gap-3 lg:gap-4 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 backdrop-blur-xl bg-[#FFF7ED]/60 border border-[#FFF7ED]/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                                        <div className="w-full aspect-square rounded-lg shadow-sm overflow-hidden">
                                            <LazyImage
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-0.5 sm:gap-1">
                                            <p className="text-xs sm:text-sm lg:text-base font-bold leading-tight text-[#3B2A23] line-clamp-2">{product.name}</p>
                                            <p className="text-xs sm:text-sm font-normal leading-normal text-[#554B47]">Stock: {product.stock}</p>
                                            <p className="text-xs sm:text-sm font-normal leading-normal text-[#554B47]">₹{product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight text-[#FFF7ED] pt-4">Recent Orders</h2>
                            <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-[#FFF7ED]/20 -mx-3 sm:mx-0">
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
                                            <tr key={order._id || order.id} className="border-b border-[#FFF7ED]/10 bg-[#FFF7ED]/5 hover:bg-[#FFF7ED]/10">
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
                                                <td className="px-6 py-4">₹{(order.totals?.total || order.total || 0).toFixed(2)}</td>
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
                            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                                <div className="flex flex-col gap-1 sm:gap-2">
                                    <p className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tighter text-[#FFF7ED]">Product Management</p>
                                    <p className="text-sm sm:text-base font-normal leading-normal text-[#EAD2C0]">Manage your product inventory and listings.</p>
                                </div>
                                <button onClick={() => setShowAddProduct(true)} className="flex h-10 sm:h-12 cursor-pointer items-center justify-center rounded-lg px-4 sm:px-6 bg-[#D8A24A] text-[#3B2A23] text-xs sm:text-sm font-bold leading-normal tracking-wide shadow-md hover:brightness-110 transition-all">
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
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                                    {products.map((product, index) => (
                                        <div key={index} className="flex flex-col gap-2 sm:gap-3 lg:gap-4 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 backdrop-blur-xl bg-[#FFF7ED]/60 border border-[#FFF7ED]/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                            <div className="w-full aspect-square rounded-lg shadow-sm overflow-hidden">
                                                <LazyImage
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-0.5 sm:gap-1 flex-1">
                                                <p className="text-xs sm:text-sm lg:text-base font-bold leading-tight text-[#3B2A23] line-clamp-2">{product.name}</p>
                                                <p className="text-xs font-normal leading-normal text-[#554B47]">Category: {product.category || 'general'}</p>
                                                <p className="text-xs sm:text-sm font-normal leading-normal text-[#554B47]">Stock: {product.stock}</p>
                                                <p className="text-xs sm:text-sm font-normal leading-normal text-[#554B47]">₹{product.price}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingProduct(product);
                                                        setShowEditProduct(true);
                                                    }}
                                                    className="flex-1 py-1.5 sm:py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <span className="material-symbols-outlined text-base sm:text-lg">edit</span>
                                                    <span className="hidden sm:inline">Edit</span>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Are you sure you want to delete this product?')) {
                                                            fetch(API_ENDPOINTS.PRODUCT_BY_ID(product._id), {
                                                                method: 'DELETE'
                                                            })
                                                                .then(res => {
                                                                    if (res.ok) {
                                                                        setProducts(products.filter(p => p._id !== product._id));
                                                                    }
                                                                })
                                                                .catch(err => console.error('Error deleting product:', err));
                                                        }
                                                    }}
                                                    className="flex-1 py-1.5 sm:py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <span className="material-symbols-outlined text-base sm:text-lg">delete</span>
                                                    <span className="hidden sm:inline">Delete</span>
                                                </button>
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
                            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                                <div className="flex flex-col gap-1 sm:gap-2">
                                    <p className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tighter text-[#FFF7ED]">Order Management</p>
                                    <p className="text-sm sm:text-base font-normal leading-normal text-[#EAD2C0]">View and manage all customer orders.</p>
                                </div>
                            </div>

                            {orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <span className="material-symbols-outlined text-6xl text-[#EAD2C0] mb-4">receipt_long</span>
                                    <p className="text-xl text-[#EAD2C0] mb-2">No orders yet</p>
                                    <p className="text-sm text-[#EAD2C0]/70">Orders will appear here once customers place them</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-[#FFF7ED]/20 -mx-3 sm:mx-0">
                                    <table className="w-full text-left text-xs sm:text-sm text-[#EAD2C0] min-w-[600px]">
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
                                                <tr 
                                                    key={order._id} 
                                                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                    className="border-b border-[#FFF7ED]/10 bg-[#FFF7ED]/5 hover:bg-[#FFF7ED]/10 cursor-pointer transition-colors"
                                                >
                                                    <td className="px-6 py-4 font-medium text-[#FFF7ED]">{order.orderId}</td>
                                                    <td className="px-6 py-4">
                                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
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
                                                    <td className="px-6 py-4 font-bold">₹{(order.totals?.total || order.total || 0).toFixed(2)}</td>
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
                        <div className="flex flex-col gap-4 sm:gap-6">
                            <div className="flex flex-col gap-1 sm:gap-2">
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tighter text-[#FFF7ED]">Featured Products</p>
                                <p className="text-sm sm:text-base font-normal leading-normal text-[#EAD2C0]">Select up to 6 products to display in the landing page bestsellers section</p>
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
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                            {currentProducts.map(product => {
                                                const isFeatured = product.featured === true || product.featured === 'true';
                                                const featuredCount = products.filter(p => p.featured === true || p.featured === 'true').length;

                                                return (
                                                    <div key={product._id} className={`bg-[#FFF7ED]/5 border ${isFeatured ? 'border-[#D8A24A] ring-2 ring-[#D8A24A]/50' : 'border-[#FFF7ED]/10'} rounded-lg p-3 transition-all hover:border-[#D8A24A]/50 flex flex-col`}>
                                                        <div className="aspect-square w-full overflow-hidden rounded-lg mb-2">
                                                            <LazyImage
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <h3 className="font-bold text-[#FFF7ED] text-sm mb-1 line-clamp-2">{product.name}</h3>
                                                        <p className="text-xs text-[#EAD2C0] mb-2">₹{product.price}</p>
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

                                                                fetch(API_ENDPOINTS.PRODUCT_BY_ID(product._id), {
                                                                    method: 'PATCH',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ featured: newFeaturedStatus })
                                                                })
                                                                    .then(res => res.json())
                                                                    .then(updatedProduct => {
                                                                        setProducts(prevProducts => prevProducts.map(p => p._id === product._id ? updatedProduct : p));
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

                    {/* Inquiries View */}
                    {activeView === 'inquiries' && (
                        <div className="space-y-4 sm:space-y-6">
                            <h2 className="text-[#FFF7ED] text-2xl sm:text-3xl font-black leading-tight tracking-wide">Inquiries</h2>

                            {/* General Contact Inquiries */}
                            <div className="bg-[#FFF7ED]/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                                <h3 className="text-[#3B2A23] text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#D8A24A]">mail</span>
                                    General Contact ({inquiries.general.length})
                                </h3>
                                {inquiries.general.length === 0 ? (
                                    <p className="text-[#554B47]/60 text-sm">No general inquiries yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {inquiries.general.map((inquiry) => (
                                            <div key={inquiry.id} className="bg-[#FFF7ED]/50 rounded-lg p-4 border border-[#EAD2C0]/30">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="text-[#3B2A23] font-bold">{inquiry.name}</p>
                                                    <p className="text-xs text-[#554B47]/60">{new Date(inquiry.date).toLocaleString()}</p>
                                                </div>
                                                <p className="text-sm text-[#554B47] mb-2">Email: {inquiry.email}</p>
                                                <p className="text-sm text-[#554B47] bg-white/50 p-3 rounded">{inquiry.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Trade Inquiries */}
                            <div className="bg-[#FFF7ED]/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                                <h3 className="text-[#3B2A23] text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#D8A24A]">business</span>
                                    Trade Inquiries ({inquiries.trade.length})
                                </h3>
                                {inquiries.trade.length === 0 ? (
                                    <p className="text-[#554B47]/60 text-sm">No trade inquiries yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {inquiries.trade.map((inquiry) => (
                                            <div key={inquiry.id} className="bg-[#FFF7ED]/50 rounded-lg p-4 border border-[#EAD2C0]/30">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="text-[#3B2A23] font-bold">{inquiry.name}</p>
                                                    <p className="text-xs text-[#554B47]/60">{new Date(inquiry.date).toLocaleString()}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm text-[#554B47] mb-2">
                                                    <p>Company: {inquiry.companyName}</p>
                                                    <p>Contact: {inquiry.contactNo}</p>
                                                    <p className="col-span-2">Email: {inquiry.email}</p>
                                                </div>
                                                {inquiry.remarks && (
                                                    <p className="text-sm text-[#554B47] bg-white/50 p-3 rounded mt-2">
                                                        <span className="font-semibold">Remarks:</span> {inquiry.remarks}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Bulk Order Inquiries */}
                            <div className="bg-[#FFF7ED]/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                                <h3 className="text-[#3B2A23] text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#D8A24A]">inventory</span>
                                    Bulk Orders ({inquiries.bulk.length})
                                </h3>
                                {inquiries.bulk.length === 0 ? (
                                    <p className="text-[#554B47]/60 text-sm">No bulk order inquiries yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {inquiries.bulk.map((inquiry) => (
                                            <div key={inquiry.id} className="bg-[#FFF7ED]/50 rounded-lg p-4 border border-[#EAD2C0]/30">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="text-[#3B2A23] font-bold">{inquiry.name}</p>
                                                    <p className="text-xs text-[#554B47]/60">{new Date(inquiry.date).toLocaleString()}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm text-[#554B47] mb-3">
                                                    <p>Company: {inquiry.companyName}</p>
                                                    <p>Phone: {inquiry.phoneNo}</p>
                                                    <p className="col-span-2">Email: {inquiry.email}</p>
                                                    <p className="col-span-2 font-semibold text-[#D8A24A]">
                                                        Total Quantity: {inquiry.totalQuantity} pieces
                                                    </p>
                                                </div>
                                                {inquiry.items && inquiry.items.length > 0 && (
                                                    <div className="bg-white/50 p-3 rounded">
                                                        <p className="text-sm font-semibold text-[#3B2A23] mb-2">Items:</p>
                                                        <div className="space-y-1">
                                                            {inquiry.items.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between text-sm text-[#554B47]">
                                                                    <span>{item.productName}</span>
                                                                    <span className="font-semibold">{item.quantity} pcs</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Categories View */}
                    {activeView === 'categories' && (
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                                <div className="flex flex-col gap-1 sm:gap-2">
                                    <p className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tighter text-[#FFF7ED]">Category Management</p>
                                    <p className="text-sm sm:text-base font-normal leading-normal text-[#EAD2C0]">Manage product categories and collections.</p>
                                </div>
                                <button onClick={() => setShowCategoryModal(true)} className="flex h-10 sm:h-12 cursor-pointer items-center justify-center rounded-lg px-4 sm:px-6 bg-[#D8A24A] text-[#3B2A23] text-xs sm:text-sm font-bold leading-normal tracking-wide shadow-md hover:brightness-110 transition-all">
                                    <span className="material-symbols-outlined mr-2">add</span>
                                    Add New Category
                                </button>
                            </div>

                            {/* Add Category Modal */}
                            {showCategoryModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                                    <div className="bg-[#3B2A23] p-4 sm:p-8 rounded-xl border border-[#FFF7ED]/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
                                        <h2 className="text-2xl font-bold mb-4 text-[#FFF7ED]">Add New Category</h2>
                                        <form onSubmit={handleAddCategory} className="space-y-4">
                                            <input
                                                type="text" placeholder="Category Name" required
                                                value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                                className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white placeholder-white/50"
                                            />
                                            <textarea
                                                placeholder="Description (optional)"
                                                value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                                                className="w-full p-2 rounded bg-[#FFF7ED]/10 border border-[#FFF7ED]/20 text-white placeholder-white/50"
                                            />
                                            <div className="flex justify-end gap-4 mt-6">
                                                <button type="button" onClick={() => { setShowCategoryModal(false); setNewCategory({ name: '', description: '' }); }} className="px-4 py-2 text-[#EAD2C0] hover:text-white">Cancel</button>
                                                <button type="submit" className="px-4 py-2 bg-[#D8A24A] text-[#3B2A23] font-bold rounded">Add Category</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {categories.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <span className="material-symbols-outlined text-6xl text-[#EAD2C0] mb-4">category</span>
                                    <p className="text-xl text-[#EAD2C0] mb-2">No categories yet</p>
                                    <p className="text-sm text-[#EAD2C0]/70">Add your first category to organize products</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {categories.map((category) => (
                                        <div key={category._id} className="flex flex-col gap-3 sm:gap-4 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-xl bg-[#FFF7ED]/60 border border-[#FFF7ED]/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#D8A24A]/20 rounded-lg p-2">
                                                        <span className="material-symbols-outlined text-[#D8A24A] text-2xl">category</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-base sm:text-lg font-bold text-[#3B2A23]">{category.name}</p>
                                                        <p className="text-xs sm:text-sm text-[#554B47]/70">{products.filter(p => p.category === category.name).length} products</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {category.description && (
                                                <p className="text-xs sm:text-sm text-[#554B47]">{category.description}</p>
                                            )}
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleDeleteCategory(category._id)}
                                                    className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Admin;
