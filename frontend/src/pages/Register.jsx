import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, Lock, Mail, User } from 'lucide-react';
import axios from 'axios';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return alert('Passwords do not match');
        }
        try {
            await axios.post('/api/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            alert('Registered successfully! Please login.');
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 border-gray-800">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
                <div className="flex flex-col items-center mb-6">
                    <Cloud className="text-sky-400 mb-2" size={40} />
                    <h1 className="text-xl font-bold tracking-wide">
                        Register Account
                    </h1>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text" required
                                className="w-full bg-gray-900 border border-gray-700 text-sm text-white rounded-lg py-2.5 px-9 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                                placeholder="User / Admin"
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400">Email Option</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="email" required
                                className="w-full bg-gray-900 border border-gray-700 text-sm text-white rounded-lg py-2.5 px-9 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                                placeholder="email@nscs.cloud"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="password" required
                                className="w-full bg-gray-900 border border-gray-700 text-sm text-white rounded-lg py-2.5 px-9 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="password" required
                                className="w-full bg-gray-900 border border-gray-700 text-sm text-white rounded-lg py-2.5 px-9 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-sky-600 hover:bg-sky-500 mt-4 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-sky-500/20 transition-all"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-sky-400 hover:text-sky-300 font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
