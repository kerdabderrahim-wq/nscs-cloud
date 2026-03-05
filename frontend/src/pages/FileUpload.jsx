import { useState } from 'react';
import { UploadCloud, CheckCircle, X, File, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function FileUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setUploadStatus('idle');
            setUploadProgress(0);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadStatus('uploading');

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const savedUser = JSON.parse(localStorage.getItem('nscs_user'));
            await axios.post('/api/upload', formData, {
                headers: {
                    'x-user-email': savedUser?.email || 'public'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            setUploadStatus('success');
            setIsUploading(false);
        } catch (error) {
            setUploadStatus('error');
            setIsUploading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <UploadCloud className="text-blue-500" />
                    File Upload
                </h1>
                <p className="text-gray-400">Securely upload your data to the NSCS-CLOUD cluster.</p>
            </header>

            <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-3xl p-12 text-center transition-all hover:border-blue-500/50 group">
                {!selectedFile ? (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 text-gray-400 group-hover:text-blue-400 transition-colors">
                            <UploadCloud size={40} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Select a file to upload</h3>
                        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                            Drag and drop your file here, or click to browse from your local device.
                        </p>
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="fileInput"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all cursor-pointer shadow-lg shadow-blue-500/20"
                        >
                            Choose File
                        </label>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between bg-gray-900/50 p-6 rounded-2xl border border-gray-700">
                            <div className="flex items-center gap-4">
                                <File className="text-blue-400" size={32} />
                                <div className="text-left">
                                    <p className="font-bold text-white truncate max-w-xs">{selectedFile.name}</p>
                                    <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedFile(null)}
                                className="p-2 text-gray-500 hover:text-white transition-colors"
                                disabled={isUploading}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {uploadStatus === 'idle' && (
                            <button
                                onClick={handleUpload}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                <UploadCloud size={20} />
                                Start Upload
                            </button>
                        )}

                        {(uploadStatus === 'uploading' || uploadStatus === 'success') && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">
                                        {uploadStatus === 'success' ? 'Upload Complete' : 'Uploading...'}
                                    </span>
                                    <span className="font-bold text-blue-400">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-full transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>

                                {uploadStatus === 'success' && (
                                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold bg-emerald-400/10 py-3 rounded-xl animate-bounce">
                                        <CheckCircle size={20} />
                                        File safely stored in cluster
                                    </div>
                                )}
                            </div>
                        )}

                        {uploadStatus === 'error' && (
                            <div className="flex items-center justify-center gap-2 text-red-400 font-bold bg-red-400/10 py-3 rounded-xl">
                                <AlertCircle size={20} />
                                Upload failed. Please try again.
                            </div>
                        )}

                        {uploadStatus === 'success' && (
                            <button
                                onClick={() => {
                                    setSelectedFile(null);
                                    setUploadStatus('idle');
                                }}
                                className="text-blue-400 hover:text-blue-300 font-medium"
                            >
                                Upload another file?
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
