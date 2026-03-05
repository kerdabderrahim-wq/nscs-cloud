import { useState, useEffect } from 'react';
import { File, Download, Trash2, Search, Plus, HardDrive } from 'lucide-react';
import axios from 'axios';

export default function CloudStorage() {
    const [files, setFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchFiles = async () => {
        try {
            const response = await axios.get('/api/files');
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files", error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleDelete = async (fileName) => {
        if (confirm(`Are you sure you want to delete ${fileName}?`)) {
            try {
                await axios.delete(`/api/delete/${fileName}`);
                fetchFiles();
            } catch (error) {
                alert('Failed to delete file');
            }
        }
    };

    const filteredFiles = files.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <HardDrive className="text-blue-500" />
                        Cloud Storage
                    </h1>
                    <p className="text-gray-400">Manage your files securely on NSCS-CLOUD.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search files..."
                            className="bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                        <Plus size={20} />
                        New File
                    </button>
                </div>
            </header>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900/50 border-b border-gray-700">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Name</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Size</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Date Modified</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredFiles.length > 0 ? (
                                filteredFiles.map((file, idx) => (
                                    <tr key={idx} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <File className="text-blue-400" size={20} />
                                            <span className="font-medium text-gray-200">{file.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{file.size}</td>
                                        <td className="px-6 py-4 text-gray-400">{file.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-4">
                                                <button
                                                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                                                    title="Download"
                                                >
                                                    <Download size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(file.name)}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No files found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
