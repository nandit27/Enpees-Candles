import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check if already logged in as admin
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            try {
                const userData = JSON.parse(user);
                if (userData.role === 'admin') {
                    navigate('/admin');
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Check if user is admin
                if (data.user.role !== 'admin') {
                    toast.error('Access denied. Admin credentials required.');
                    setLoading(false);
                    return;
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success('Admin login successful!');
                navigate('/admin');
            } else {
                toast.error(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#3B2A23] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background decoration */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D8A24A]/20 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-md w-full space-y-8 bg-[#FFF7ED]/10 backdrop-blur-xl p-8 rounded-2xl border border-[#FFF7ED]/20 shadow-2xl">
                {/* Logo and Title */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-[#D8A24A] rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#3B2A23] text-4xl">admin_panel_settings</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-['Italiana',_serif] text-[#FFF7ED] mb-2">
                        Admin Portal
                    </h2>
                    <p className="text-sm text-[#EAD2C0]">
                        Sign in to access the admin dashboard
                    </p>
                </div>

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#EAD2C0] mb-2">
                                Admin Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-[#FFF7ED]/30 bg-[#3B2A23]/80 placeholder-[#EAD2C0]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#D8A24A] focus:border-[#D8A24A] transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#EAD2C0] mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-[#FFF7ED]/30 bg-[#3B2A23]/80 placeholder-[#EAD2C0]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#D8A24A] focus:border-[#D8A24A] transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-[#3B2A23] bg-[#D8A24A] hover:bg-[#D8A24A]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D8A24A] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined">login</span>
                                    Sign in to Admin Panel
                                </span>
                            )}
                        </button>
                    </div>
                </form>

                {/* Back to Home Link */}
                <div className="text-center">
                    <Link 
                        to="/" 
                        className="text-sm text-[#EAD2C0] hover:text-[#D8A24A] transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Home
                    </Link>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 rounded-lg bg-[#D8A24A]/10 border border-[#D8A24A]/30">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[#D8A24A] text-sm">shield</span>
                        <p className="text-xs text-[#EAD2C0]">
                            This is a secure admin area. Only authorized personnel with admin credentials can access this portal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
