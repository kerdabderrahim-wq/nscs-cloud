import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Folder, UploadCloud, Bot, User, LogOut, Cloud } from 'lucide-react';

export default function Sidebar({ onLogout }) {
    const location = useLocation();

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'My Files', path: '/files', icon: <Folder size={20} /> },
        { name: 'Upload', path: '/upload', icon: <UploadCloud size={20} /> },
        { name: 'AI API Console', path: '/ai', icon: <Bot size={20} /> },
        { name: 'Account', path: '/account', icon: <User size={20} /> },
    ];

    return (
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col min-h-screen">
            <div className="p-6 flex items-center gap-3 border-b border-gray-700">
                <Cloud className="text-blue-500" size={28} />
                <span className="text-xl font-bold tracking-wide">NSCS<span className="text-sky-400">-CLOUD</span></span>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            {link.icon}
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
