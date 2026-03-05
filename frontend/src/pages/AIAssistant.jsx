import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Trash2, Cpu, Key, Terminal, Code, Copy, Check, Plus, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export default function AIAssistant({ user }) {
    const [apiKeys, setApiKeys] = useState([]);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'NSCS-CLOUD API Gateway ready. Authentication verified via X-API-KEY. System is standing by for simulation requests.' }
    ]);
    const [input, setInput] = useState('');
    const [selectedKey, setSelectedKey] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const messagesEndRef = useRef(null);

    const fetchKeys = async () => {
        try {
            const res = await axios.get('/api/keys');
            setApiKeys(res.data);
            if (res.data.length > 0 && !selectedKey) {
                setSelectedKey(res.data[0].value);
            }
        } catch (err) {
            console.error("Failed to fetch keys", err);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleCreateKey = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/keys', { name: newKeyName });
            setNewKeyName('');
            setIsCreating(false);
            fetchKeys();
        } catch (err) {
            alert("Failed to create key");
        }
    };

    const handleDeleteKey = async (id) => {
        if (!confirm("Are you sure you want to revoke this API key? Applications using it will break.")) return;
        try {
            await axios.delete(`/api/keys/${id}`);
            fetchKeys();
        } catch (err) {
            alert("Failed to delete key");
        }
    };

    const handleCopy = (val, id) => {
        navigator.clipboard.writeText(val);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleTestAPI = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !selectedKey) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('/api/ai', {
                prompt: input,
                apiKey: selectedKey
            });
            const aiMessage = { role: 'assistant', content: response.data.response, meta: { node: response.data.node, key: response.data.usedKey } };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("AI Error:", error);
            const status = error.response?.status;
            let errMsg = "Simulation Error: Backend service disconnected.";
            if (status === 401) errMsg = "ACCESS DENIED: The selected API Key is invalid or has been revoked.";
            setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-screen bg-[#050505]">
            <header className="p-6 border-b border-gray-800 bg-[#0a0a0a] flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Cpu className="text-sky-400" />
                        AI API Developer Portal
                    </h1>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.2em] font-mono">
                        Infrastructure Layer // Node-Alpha-01 // Provider Access
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-sky-600/20"
                    >
                        <Plus size={18} /> Generate New Key
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Key Management & Docs */}
                <div className="w-[450px] border-r border-gray-800 bg-[#0a0a0a] p-6 overflow-y-auto space-y-8 scrollbar-hide">
                    {/* Key List */}
                    <section>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Active API Keys</h3>
                        <div className="space-y-4">
                            {apiKeys.map((k) => (
                                <div key={k.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-bold text-gray-200 text-sm">{k.name}</h4>
                                            <p className="text-[10px] text-gray-600 font-mono">ID: {k.id}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteKey(k.id)}
                                            className="text-gray-600 hover:text-red-500 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3 bg-black/50 p-3 rounded-xl border border-gray-800 group">
                                        <code className="text-xs text-sky-400 font-mono truncate flex-1">
                                            {k.value.substring(0, 10)}****************
                                        </code>
                                        <button
                                            onClick={() => handleCopy(k.value, k.id)}
                                            className="text-gray-500 hover:text-white"
                                        >
                                            {copiedId === k.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-[10px] text-gray-600 font-bold">
                                        <span>CREATED: {k.created}</span>
                                        <span className="text-emerald-500">READY</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Documentation */}
                    <section>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Implementation Guide</h3>
                        <div className="bg-sky-500/5 border border-sky-500/10 p-4 rounded-2xl mb-4">
                            <p className="text-xs text-sky-300 leading-relaxed font-medium">
                                To use our AI, send a POST request to <code className="bg-black/50 px-1 rounded text-white">/api/ai</code> with the <code className="bg-black/50 px-1 rounded text-white">apiKey</code> field in your JSON body.
                            </p>
                        </div>
                        <div className="bg-black rounded-2xl p-4 border border-gray-800 font-mono">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Body Example</span>
                                <Terminal size={12} className="text-gray-700" />
                            </div>
                            <pre className="text-[11px] text-gray-400">
                                {`{
  "apiKey": "nscs_...",
  "prompt": "Analyze security logs"
}`}
                            </pre>
                        </div>
                    </section>
                </div>

                {/* Right: API Sandbox */}
                <div className="flex-1 flex flex-col bg-black">
                    <div className="bg-[#0a0a0a] border-b border-gray-800 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-[10px] font-black font-mono border border-emerald-500/20">TEST SANDBOX</div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target: Node-Alpha-01</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-500">SELECTED KEY:</span>
                            <select
                                value={selectedKey}
                                onChange={(e) => setSelectedKey(e.target.value)}
                                className="bg-gray-900 border border-gray-800 text-xs text-sky-400 rounded px-3 py-1 outline-none font-mono"
                            >
                                {apiKeys.map(k => (
                                    <option key={k.id} value={k.value}>{k.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-800">
                        {messages.map((m, idx) => (
                            <div key={idx} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : ''}`}>
                                {m.role === 'assistant' && (
                                    <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                                        <Bot size={20} className="text-sky-500" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-5 rounded-3xl font-mono text-sm leading-relaxed ${m.role === 'user'
                                    ? 'bg-sky-600 text-white rounded-tr-none'
                                    : 'bg-[#0f172a] border border-sky-900/30 text-gray-200 rounded-tl-none'
                                    }`}>
                                    {m.role === 'assistant' && m.meta && (
                                        <div className="flex gap-4 text-[9px] font-black text-sky-400/60 uppercase mb-3 border-b border-sky-400/10 pb-2">
                                            <span>GATEWAY: {m.meta.node}</span>
                                            <span>AUTH_METHOD: {m.meta.key}</span>
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap">{m.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 animate-pulse">
                                    <Cpu size={20} className="text-sky-500" />
                                </div>
                                <div className="bg-[#0f172a] border border-sky-900/30 p-5 rounded-3xl rounded-tl-none flex items-center gap-2">
                                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-8 bg-[#0a0a0a] border-t border-gray-800">
                        <form onSubmit={handleTestAPI} className="relative max-w-4xl mx-auto group">
                            <div className="absolute -top-10 left-0 text-[10px] font-bold text-gray-600 uppercase flex items-center gap-2 animate-pulse">
                                <Terminal size={12} /> Executing simulated API call via {selectedKey?.substring(0, 10)}...
                            </div>
                            <input
                                type="text"
                                placeholder="Enter system prompt for API simulation..."
                                className="w-full bg-black border border-gray-800 rounded-2xl py-5 pl-8 pr-24 text-white focus:outline-none focus:ring-2 focus:ring-sky-600 font-mono text-sm transition-all shadow-2xl"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading || !selectedKey}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim() || !selectedKey}
                                    className="bg-sky-600 hover:bg-sky-500 disabled:opacity-30 text-white p-3.5 rounded-xl transition-all shadow-lg shadow-sky-600/30"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Create Key Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                            <Key className="text-sky-400" /> Generate API Key
                        </h2>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Assign a name to your new API key for easier management. You will be able to revoke this key at any time.
                        </p>
                        <form onSubmit={handleCreateKey} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Key Description</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                                    placeholder="e.g. Production Infrastructure"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-gray-400 py-3 rounded-xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-sky-600 hover:bg-sky-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-600/20"
                                >
                                    Generate Key
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
