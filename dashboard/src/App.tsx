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
    <div className="flex h-screen bg-[#111111] font-sans selection:bg-[#facc15] selection:text-black">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-24 flex items-center justify-between px-10 border-b-[6px] border-black bg-white">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4 pr-10 border-r-[4px] border-black">
              <div className={`w-4 h-4 border-2 border-black ${user.role === 'ADMIN' ? 'bg-[#3b82f6]' : 'bg-[#a855f7]'}`}></div>
              <h2 className="text-black font-black tracking-tighter text-2xl uppercase">
                {user.role === 'ADMIN' ? 'Admin.OS' : 'Partner.OS'}
              </h2>
            </div>
            <div className="relative w-[400px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black z-10" size={20} />
              <input
                type="text"
                placeholder="QUERY_RESOURCES..."
                className="w-full bg-[#eeeeee] border-[4px] border-black text-black pl-14 pr-4 py-3 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-black/40 font-black uppercase text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button className="bg-white border-[4px] border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all relative">
              <Bell size={24} className="text-black" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#ef4444] border-2 border-black text-[10px] font-black flex items-center justify-center text-white">3</span>
            </button>
            <div className="flex items-center gap-6 pl-8 border-l-[4px] border-black">
              <div className="text-right">
                <p className="text-sm font-black text-black leading-none tracking-tighter uppercase">{user.name}</p>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <span className={`text-[10px] px-3 py-1 border-2 border-black font-black uppercase tracking-tighter ${user.role === 'ADMIN' ? 'bg-[#3b82f6] text-white' : 'bg-[#a855f7] text-white'
                    }`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <div className={`w-14 h-14 border-[4px] border-black flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                <UserIcon size={32} className="text-black" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-12 bg-[#eeeeee]">
          <div className="max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
