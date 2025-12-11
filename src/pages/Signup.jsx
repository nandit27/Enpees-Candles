import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success('Account created successfully!');
                navigate('/');
            } else {
                toast.error(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#3B2A23]">
            <Navbar />
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-[#FFF7ED]/10 backdrop-blur-xl p-8 rounded-2xl border border-[#FFF7ED]/20">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-['Italiana',_serif] text-[#FFF7ED]">
                            Create your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-[#EAD2C0]">
                            Or{' '}
                            <Link to="/login" className="font-medium text-[#D8A24A] hover:text-[#D8A24A]/80">
                                sign in to existing account
                            </Link>
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-[#EAD2C0] mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#FFF7ED]/30 bg-[#3B2A23]/80 placeholder-[#EAD2C0]/50 text-white focus:outline-none focus:ring-[#D8A24A] focus:border-[#D8A24A] sm:text-sm"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#EAD2C0] mb-2">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#FFF7ED]/30 bg-[#3B2A23]/80 placeholder-[#EAD2C0]/50 text-white focus:outline-none focus:ring-[#D8A24A] focus:border-[#D8A24A] sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="mobile" className="block text-sm font-medium text-[#EAD2C0] mb-2">
                                    Mobile Number
                                </label>
                                <input
                                    id="mobile"
                                    name="mobile"
                                    type="tel"
                                    required
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    pattern="[0-9]{10}"
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#FFF7ED]/30 bg-[#3B2A23]/80 placeholder-[#EAD2C0]/50 text-white focus:outline-none focus:ring-[#D8A24A] focus:border-[#D8A24A] sm:text-sm"
                                    placeholder="10-digit mobile number"
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
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#FFF7ED]/30 bg-[#3B2A23]/80 placeholder-[#EAD2C0]/50 text-white focus:outline-none focus:ring-[#D8A24A] focus:border-[#D8A24A] sm:text-sm"
                                    placeholder="Password (min 6 characters)"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#EAD2C0] mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#FFF7ED]/30 bg-[#3B2A23]/80 placeholder-[#EAD2C0]/50 text-white focus:outline-none focus:ring-[#D8A24A] focus:border-[#D8A24A] sm:text-sm"
                                    placeholder="Confirm Password"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-[#3B2A23] bg-[#D8A24A] hover:bg-[#D8A24A]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D8A24A] disabled:opacity-50"
                            >
                                {loading ? 'Creating account...' : 'Sign up'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
