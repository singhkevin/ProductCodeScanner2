import { useState } from 'react';
import { Shield, Lock, Mail, Loader2 } from 'lucide-react';
import { dashboardApi } from '../api';

interface LoginProps {
    onLogin: (user: any, token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [portal, setPortal] = useState<'ADMIN' | 'COMPANY'>('ADMIN');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await dashboardApi.login({ email, password });
            const user = response.data.user;

            // Validate that the user is logging into the correct portal
            if (user.role !== portal) {
                setError(`This account does not have ${portal.toLowerCase()} access. Please switch portals.`);
                setLoading(false);
                return;
            }

            onLogin(user, response.data.token);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center p-4 rounded-2xl shadow-lg mb-6 transition-colors ${portal === 'ADMIN' ? 'bg-blue-600' : 'bg-purple-600'
                        }`}>
                        <Shield size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Product Guard</h1>
                    <p className="text-slate-400 mt-2">
                        {portal === 'ADMIN' ? 'Administrator Control Terminal' : 'Company Partner Portal'}
                    </p>
                </div>

                {/* Portal Switcher */}
                <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 mb-8">
                    <button
                        onClick={() => setPortal('ADMIN')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${portal === 'ADMIN' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        Admin Portal
                    </button>
                    <button
                        onClick={() => setPortal('COMPANY')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${portal === 'COMPANY' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        Company Login
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    {/* Background Glow */}
                    <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors ${portal === 'ADMIN' ? 'bg-blue-600' : 'bg-purple-600'
                        }`} />

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm animate-in fade-in zoom-in-95">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium ml-1">Account Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={portal === 'ADMIN' ? 'admin@guard.com' : 'partner@company.com'}
                                    className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${portal === 'ADMIN' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20'
                                }`}
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                `Access ${portal === 'ADMIN' ? 'Admin' : 'Partner'} Workspace`
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-500 mt-8 text-sm">
                    {portal === 'ADMIN'
                        ? 'Secure access for system administrators only.'
                        : 'Registered verified brand partners and manufacturers.'}
                </p>
            </div>
        </div>
    );
}
