import { useState } from 'react';
import { User as UserIcon, Mail, HardDrive, ShieldCheck, Key } from 'lucide-react';

export default function Account({ user }) {
    const [passwordForm, setPasswordForm] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleChangePassword = (e) => {
        e.preventDefault();
        alert('Password change simulated successfully!');
        setPasswordForm({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="p-8 max-w-4xl">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <UserIcon className="text-blue-500" />
                    Account Settings
                </h1>
                <p className="text-gray-400">View and manage your NSCS-CLOUD profile.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Info */}
                <div className="space-y-6">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <ShieldCheck className="text-emerald-400" size={20} />
                            Profile Information
                        </h3>

                        <div className="space-y-4">
                            <div className="border-b border-gray-700 pb-4">
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Username</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <UserIcon size={16} className="text-gray-400" />
                                    <span className="text-white font-medium">{user?.username || 'Guest'}</span>
                                </div>
                            </div>

                            <div className="border-b border-gray-700 pb-4">
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Address</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Mail size={16} className="text-gray-400" />
                                    <span className="text-white font-medium">{user?.email || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="border-b border-gray-700 pb-4">
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">AI Access</label>
                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center gap-2">
                                        <Key size={16} className="text-blue-400" />
                                        <span className="text-white font-medium">{user?.apiKeys?.length || 0} Active Keys</span>
                                    </div>
                                    <button
                                        onClick={() => window.location.href = '/ai'}
                                        className="text-[10px] text-blue-400 hover:text-blue-300 font-black uppercase"
                                    >
                                        Manage
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Storage Plan</label>
                                <div className="flex items-center justify-between mt-2 mb-1">
                                    <div className="flex items-center gap-2">
                                        <HardDrive size={16} className="text-blue-400" />
                                        <span className="text-sm font-bold">Standard Tier (50 GB)</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-700">
                                    <div className="bg-blue-500 h-full w-[2%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Key className="text-amber-400" size={20} />
                        Security Settings
                    </h3>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 font-bold uppercase">Current Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="••••••••"
                                value={passwordForm.current}
                                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 font-bold uppercase">New Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="••••••••"
                                value={passwordForm.new}
                                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 font-bold uppercase">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="••••••••"
                                value={passwordForm.confirm}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 mt-4 rounded-xl transition-all border border-gray-600"
                        >
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
