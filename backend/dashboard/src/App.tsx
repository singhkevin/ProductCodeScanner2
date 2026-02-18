import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import Overview from './pages/Overview';
import BulkUpload from './pages/BulkUpload';
import Hotspots from './pages/Hotspots';
import Login from './pages/Login';
import ApprovalQueue from './pages/ApprovalQueue';
import ManualAdd from './pages/ManualAdd';
import Products from './pages/Products';
import { Search, Bell, User as UserIcon } from 'lucide-react';

function App() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData: any, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (!token || !user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview user={user} />;
      case 'bulk': return <BulkUpload />;
      case 'add-product': return <ManualAdd />;
      case 'inventory': return <Products />;
      case 'approvals': return <ApprovalQueue />;
      case 'hotspots': return <Hotspots />;
      default: return <Overview user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] font-sans selection:bg-indigo-500 selection:text-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 pr-8 border-r border-slate-800">
              <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${user.role === 'ADMIN' ? 'bg-indigo-500 shadow-indigo-500/30' : 'bg-purple-500 shadow-purple-500/30'}`}></div>
              <h2 className="text-white font-bold tracking-tight text-lg">
                {user.role === 'ADMIN' ? 'Security Node' : 'Partner Portal'}
              </h2>
            </div>
            <div className="relative w-[320px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search telemetry..."
                className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 pl-11 pr-4 py-2.5 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500 text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all relative group">
              <Bell size={20} className="group-hover:scale-110 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-800">
              <div className="text-right">
                <p className="text-sm font-bold text-white leading-none whitespace-nowrap">{user.name}</p>
                <span className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 block ${user.role === 'ADMIN' ? 'text-indigo-400' : 'text-purple-400'}`}>
                  {user.role}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-sm text-slate-400 group hover:text-white transition-all">
                <UserIcon size={20} className="transition-transform group-hover:scale-110" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
