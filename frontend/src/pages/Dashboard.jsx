import { useState, useEffect } from 'react';
import { FileText, HardDrive, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard({ user }) {
    const [stats, setStats] = useState({ count: 0, size: 0, recent: [] });

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/files');
            const files = response.data;
            const totalSize = files.reduce((acc, f) => {
                // Simple parse: size is string like "10.00 KB"
                const num = parseFloat(f.size);
                return acc + (isNaN(num) ? 0 : num);
            }, 0);

            setStats({
                count: files.length,
                size: totalSize.toFixed(2),
                recent: files.slice(0, 5)
            });
        } catch (error) {
            console.error("Dashboard error", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome, <span className="text-blue-500">{user?.username}</span></h1>
                <p className="text-gray-400">NSCS-CLOUD infrastructure monitoring is active.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-500/50 transition-all group">
                    <div className="bg-blue-500/10 p-4 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                        <HardDrive size={32} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold tracking-widest border-b border-gray-700 pb-1 mb-1 uppercase">Storage Used</p>
                        <h2 className="text-2xl font-black">{stats.size} KB <span className="text-sm font-normal text-gray-500">of 50 GB</span></h2>
                    </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl flex items-center gap-4 hover:border-sky-500/50 transition-all group">
                    <div className="bg-sky-500/10 p-4 rounded-xl text-sky-400 group-hover:scale-110 transition-transform">
                        <FileText size={32} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold tracking-widest border-b border-gray-700 pb-1 mb-1 uppercase">Total Objects</p>
                        <h2 className="text-2xl font-black">{stats.count} <span className="text-sm font-normal text-gray-500">files</span></h2>
                    </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl flex items-center gap-4 hover:border-emerald-500/50 transition-all group">
                    <div className="bg-emerald-500/10 p-4 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                        <Activity size={32} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold tracking-widest border-b border-gray-700 pb-1 mb-1 uppercase">Cluster State</p>
                        <h2 className="text-2xl font-black text-emerald-400">Operational</h2>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
                    <h3 className="text-lg font-bold">Recent Cluster Activity</h3>
                    <Link to="/files" className="text-sm text-blue-400 hover:text-blue-300 font-bold">View Data Lake</Link>
                </div>

                <div className="space-y-3">
                    {stats.recent.length > 0 ? (
                        stats.recent.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-900/50 border border-gray-700/50 p-4 rounded-xl hover:bg-gray-900 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-blue-400">
                                        <FileText size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-200">{file.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">{file.size}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-mono">{file.date}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No recent activity found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
