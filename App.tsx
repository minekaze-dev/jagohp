import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import SmartReview from './pages/SmartReview';
import Compare from './pages/Compare';
import PhoneMatch from './pages/PhoneMatch';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import AIChat from './pages/AIChat';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsCondition from './pages/TermsCondition';
import AdminDashboard from './pages/AdminDashboard';
import BlogEditor from './pages/BlogEditor';
import TopTier from './pages/TopTier';
import AdminTopTier from './pages/AdminTopTier';
import Catalog from './pages/Catalog';
import { getTrendingReviews, getGadgetDictionary } from './services/geminiService';

// Fix: Define logo constants at the top level so they are accessible by all components in this file.
const logoDark = "https://imgur.com/oaPHidZ.jpg";
const logoLight = "https://imgur.com/8QS4UJ0.jpg";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// Sidebar Kiri (Navigation & Identity)
const LeftSidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const [dictionary, setDictionary] = useState<{term: string, definition: string}[]>([]);
  const [loadingDic, setLoadingDic] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const fetchDic = async () => {
      setLoadingDic(true);
      const data = await getGadgetDictionary();
      setDictionary(data);
      setLoadingDic(false);
    };
    fetchDic();
  }, []);

  useEffect(() => {
    if (dictionary.length === 0) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % dictionary.length);
    }, 15000); 
    return () => clearInterval(interval);
  }, [dictionary]);

  const navItems = [
    { name: 'Smart Review', path: '/review', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg> },
    { name: 'Compare', path: '/compare', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg> },
    { name: 'Phone Match', path: '/match', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg> },
    { name: 'JAGOBOT AI', path: '/chat', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg> },
  ];

  return (
    <aside className="w-[240px] hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-black border-r border-black/5 dark:border-white/5 p-4 overflow-y-auto custom-scrollbar shrink-0 theme-transition">
      <div className="mb-4">
        <Link to="/" className="block mb-2 hover:opacity-80 transition-opacity">
          <img src={logoLight} alt="JAGOHP" className="h-12 w-auto dark:hidden" />
          <img src={logoDark} alt="JAGOHP" className="h-12 w-auto hidden dark:block" />
        </Link>
        <p className="text-[7.5px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.1em] leading-tight">Platform Rekomendasi HP Berbasis AI</p>
      </div>

      <nav className="space-y-0.5 mb-3">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex items-center gap-3 py-1.5 px-2 rounded-xl transition-all group ${isActive(item.path) ? 'bg-black/5 dark:bg-yellow-400/10' : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            <span className={`p-1 rounded-lg transition-colors ${isActive(item.path) ? 'text-black dark:text-yellow-500' : 'text-black dark:text-yellow-400/40 group-hover:text-black dark:group-hover:text-yellow-400'}`}>
              {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" })}
            </span>
            <span className={`text-[11px] font-black uppercase tracking-[0.05em] ${isActive(item.path) ? 'text-black dark:text-yellow-500' : ''}`}>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="h-[1px] w-full bg-black/5 dark:bg-white/5 mb-3"></div>

      <div className="space-y-4">
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-black text-yellow-600/60 dark:text-yellow-400/40 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse"></span> AI INSIGHT TECH
          </h4>
          <div className="relative min-h-[85px]">
             {loadingDic ? (
               <div className="h-20 bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse"></div>
             ) : dictionary.length > 0 ? (
               <div className="space-y-2">
                 <div key={activeIdx} className="bg-yellow-400 border border-yellow-500 p-4 rounded-2xl relative overflow-hidden group shadow-xl shadow-yellow-400/10 cursor-default animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-16 h-16 bg-black/5 rounded-full blur-xl pointer-events-none"></div>
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                      <span className="bg-black text-yellow-400 text-[7px] font-black px-1.5 py-0.5 rounded-sm shadow-sm">AI</span>
                      <h5 className="text-[10px] font-black uppercase italic leading-tight text-black truncate">{dictionary[activeIdx].term}?</h5>
                    </div>
                    <p className="text-[9px] text-black font-black uppercase leading-snug relative z-10 line-clamp-3 italic">{dictionary[activeIdx].definition}</p>
                 </div>
                 <div className="flex justify-center gap-1.5 pt-1">
                   {dictionary.map((_, i) => (
                     <button key={i} onClick={() => setActiveIdx(i)} className={`h-1 rounded-full transition-all duration-300 ${activeIdx === i ? 'w-4 bg-yellow-500' : 'w-1 bg-black/10 dark:bg-white/10'}`} />
                   ))}
                 </div>
               </div>
             ) : (
               <p className="text-[8px] text-gray-400 italic font-black uppercase tracking-widest text-center">Data AI Error</p>
             )}
          </div>
        </div>

        <div className="space-y-2.5 border-t border-black/5 dark:border-white/5 pt-4">
          <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.2em]"># POPULER TAG</h4>
          <div className="flex flex-wrap gap-1.5">
            {['iPhone', 'Samsung', 'Xiaomi', 'Snapdragon', 'Vivo', 'Oppo'].map(tag => (
              <Link 
                key={tag} 
                to={`/blog?tag=${tag}`} 
                className={`text-[11px] font-black px-2 py-0.5 rounded border border-black/5 dark:border-white/5 hover:border-yellow-400/50 hover:text-yellow-500 transition-all uppercase tracking-tight ${location.search === `?tag=${tag}` ? 'text-yellow-600 border-yellow-400/30 bg-yellow-400/5' : 'text-gray-400 dark:text-gray-600'}`}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-4 space-y-4">
        <div className="flex flex-col gap-2 border-t border-black/5 dark:border-white/5 pt-4">
          <Link to="/faq" className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest hover:text-yellow-500 transition-colors">FAQ</Link>
          <Link to="/privacy" className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest hover:text-yellow-500 transition-colors">Kebijakan Jagohp</Link>
          <Link to="/terms" className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest hover:text-yellow-500 transition-colors">Syarat Ketentuan</Link>
        </div>
        <div className="pt-3 border-t border-black/5 dark:border-white/5">
          <p className="text-[9px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest">© 2026 JAGOHP</p>
        </div>
      </div>
    </aside>
  );
};

// Sidebar Kanan (Trending & Market Share)
const RightSidebar: React.FC<{ onOpenDonation: () => void, isDark: boolean, toggleTheme: () => void }> = ({ onOpenDonation, isDark, toggleTheme }) => {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const marketShareData = [
    { brand: 'Samsung', share: 22 },
    { brand: 'Oppo', share: 19 },
    { brand: 'Vivo', share: 17 },
    { brand: 'Xiaomi', share: 15 },
    { brand: 'iPhone', share: 11 },
    { brand: 'Lainnya', share: 16 }
  ];

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      const data = await getTrendingReviews(3);
      setTrending(data);
      setLoading(false);
    };
    fetchTrending();
  }, []);

  return (
    <aside className="w-[300px] hidden xl:flex flex-col h-screen sticky top-0 bg-white dark:bg-black border-l border-black/5 dark:border-white/5 p-5 space-y-7 overflow-y-auto custom-scrollbar shrink-0 theme-transition">
      <div className="space-y-4">
        <button 
          onClick={() => alert("Google Login: Segera hadir untuk fitur komentar cerdas!")}
          className="w-full bg-[#4285F4] text-white rounded-xl px-4 py-2.5 flex items-center gap-3 group hover:bg-[#357ae8] transition-all shadow-sm theme-transition"
        >
          <div className="bg-white p-1 rounded-lg shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Masuk dengan Google</span>
        </button>
      </div>

      <div className="space-y-5">
        <h4 className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
           <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
           TOP PENCARIAN
        </h4>
        <div className="space-y-3.5">
           {loading ? (
             <div className="space-y-3 animate-pulse">
               {[1,2,3].map(i => (
                 <div key={i} className="h-9 bg-black/5 dark:bg-white/5 rounded-xl"></div>
               ))}
             </div>
           ) : trending.length > 0 ? (
             trending.map((item) => (
               <Link to={`/catalog?model=${encodeURIComponent(item.title)}`} key={item.rank} className="flex gap-4 group cursor-pointer items-center p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                 <span className="text-xl font-black text-gray-200 dark:text-gray-800 italic group-hover:text-yellow-500 transition-colors w-6 leading-none text-center">{item.rank}</span>
                 <div className="min-w-0">
                    <h5 className="text-[11px] font-black text-black dark:text-white uppercase leading-tight group-hover:text-yellow-500 transition-colors truncate">{item.title}</h5>
                 </div>
               </Link>
             ))
           ) : (
             <p className="text-[8px] text-gray-400 dark:text-gray-700 font-black uppercase text-center italic">Belum ada data</p>
           )}
        </div>
      </div>

      <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-black/5 dark:border-white/5 space-y-5 theme-transition">
        <div className="flex items-center justify-between">
           <h4 className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              TOP BRAND DI INDONESIA
           </h4>
        </div>
        
        <div className="space-y-4">
           {marketShareData.map((data, i) => (
             <div key={i} className="space-y-1.5 group cursor-default">
               <div className="flex justify-between items-end">
                 <span className="text-[9px] font-black text-black dark:text-white uppercase tracking-tight group-hover:text-yellow-500 transition-colors">{data.brand}</span>
                 <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 italic leading-none">{data.share}%</span>
               </div>
               <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out"
                   style={{ width: `${data.share}%`, transitionDelay: `${i * 100}ms` }}
                 ></div>
               </div>
             </div>
           ))}
        </div>
        
        <div className="pt-2 border-t border-black/5 dark:border-white/5">
          <p className="text-[9px] text-gray-400 dark:text-gray-700 font-medium leading-snug">Sumber: www.topbrand-award.com</p>
        </div>
      </div>

      <div className="px-1 space-y-5">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 group transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/10 group-hover:border-yellow-400/50 transition-all">
            {isDark ? (
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c.132 0 .263 0 .393.007a9.982 9.982 0 00-.393 19.986c.132 0 .263 0 .393-.007A9.982 9.982 0 0012 3z"/></svg>
            ) : (
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 13h2a1 1 0 100-2H2a1 1 0 100 2zm18 0h2a1 1 0 100-2h-2a1 1 0 100 2zM11 2v2a1 1 0 102 0V2a1 1 0 10-2 0zm0 18v2a1 1 0 102 0v-2a1 1 0 10-2 0zM5.99 4.58a1 1 0 10-1.41 1.41l1.06 1.06a1 1 0 101.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 10-1.41 1.41l1.06 1.06a1 1 0 101.41-1.41l-1.06-1.06zm1.06-12.37a1 1 0 10-1.41-1.41l-1.06 1.06a1 1 0 101.41 1.41l1.06-1.06zM5.99 19.42a1 1 0 101.41-1.41l-1.06-1.06a1 1 0 10-1.41 1.41l1.06 1.06z"/></svg>
            )}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
              GANTI TEMA
            </span>
            <span className="text-[7px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-tighter">KE MODE {isDark ? 'TERANG' : 'GELAP'}</span>
          </div>
        </button>

        <button 
          onClick={onOpenDonation}
          className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 hover:text-yellow-500 transition-colors cursor-pointer group w-full text-left outline-none pt-3 border-t border-black/5 dark:border-white/5"
        >
           <svg className="w-3.5 h-3.5 text-yellow-500 transition-transform group-hover:scale-125" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
           DUKUNG KAMI
        </button>
      </div>

      <div 
        onClick={onOpenDonation}
        className="mt-auto pt-10 pb-4 flex justify-center opacity-30 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0 cursor-pointer hover:scale-110"
      >
        <img src={logoLight} alt="JAGOHP" className="h-24 w-auto object-contain dark:hidden" />
        <img src={logoDark} alt="JAGOHP" className="h-24 w-auto object-contain hidden dark:block" />
      </div>
    </aside>
  );
};

const BottomNavbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const userNavItems = [
    { name: 'LINIMASA', path: '/', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
    { name: 'REVIEW', path: '/review', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg> },
    { name: 'COMPARE', path: '/compare', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg> },
    { name: 'MATCH', path: '/match', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg> },
    { name: 'KATALOG', path: '/catalog', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[1200] bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-t border-black/5 dark:border-white/5 px-2 pb-safe pt-2 theme-transition">
      <div className="flex items-center justify-around">
        {userNavItems.map((item) => (
          <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 py-2 px-1 flex-1 transition-colors ${isActive(item.path) ? 'text-black dark:text-yellow-500' : 'text-gray-400 dark:text-gray-600'}`}>
            <span className={`transition-colors ${isActive(item.path) ? 'text-black dark:text-yellow-500' : 'text-black/40 dark:text-gray-600'}`}>
              {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })}
            </span>
            <span className="text-[7px] font-black uppercase tracking-widest">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showAiNotice, setShowAiNotice] = useState(true);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [search, setSearch] = useState('');
  const isAdminPath = location.pathname.startsWith('/admin');

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/blog?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const subNav = [
    { name: 'LINIMASA', path: '/', desktopOnly: true },
    { name: 'KATALOG', path: '/catalog', desktopOnly: false },
    { name: 'BLOG', path: '/blog', desktopOnly: false },
    { name: 'TOP TIER', mobileName: 'TOP', path: '/top-tier', desktopOnly: false },
  ];

  return (
    <div className="bg-white dark:bg-black min-h-screen selection:bg-yellow-400/30 selection:text-black transition-colors duration-300">
      {/* GLOBAL AI STATUS NOTICE */}
      {showAiNotice && !isAdminPath && (
        <div className="bg-yellow-400 text-black px-4 py-2 flex items-center justify-between gap-4 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-black text-yellow-400 p-1 rounded-lg shrink-0">
               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            </div>
            <p className="text-[9px] md:text-[10px] font-black uppercase italic tracking-widest leading-tight truncate">
              Update: Fitur berbasis AI sedang nonaktif sementara. Akses Blog & Katalog tetap tersedia penuh!
            </p>
          </div>
          <button 
            onClick={() => setShowAiNotice(false)}
            className="bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors shrink-0"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      )}

      <div className={`${isAdminPath ? 'w-full' : 'max-w-[1250px] mx-auto border-x border-black/5 dark:border-white/5'} flex bg-white dark:bg-black min-h-screen theme-transition`}>
        {!isAdminPath && <LeftSidebar />}
        
        <div className="flex-1 flex flex-col min-w-0">
          {!isAdminPath && (
            <nav className="sticky top-0 z-[1100] bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-black/5 dark:border-white/10 px-4 md:px-6 h-14 flex items-center justify-between gap-4 theme-transition overflow-hidden">
              {/* Sisi Kiri: Logo Mobile & Nav Menu Desktop */}
              <div className="flex items-center gap-4 lg:gap-8 flex-1 overflow-hidden h-full">
                <div className="lg:hidden flex-shrink-0">
                  <Link to="/">
                    <img src="https://imgur.com/8QS4UJ0.jpg" alt="JAGOHP" className="h-8 w-auto dark:hidden" />
                    <img src="https://imgur.com/oaPHidZ.jpg" alt="JAGOHP" className="h-8 w-auto hidden dark:block" />
                  </Link>
                </div>
                
                {/* Desktop Nav Items */}
                <div className="hidden lg:flex items-center gap-8 overflow-x-auto no-scrollbar h-full">
                  {subNav.map((item) => {
                    const isItemActive = item.path === '/' 
                      ? location.pathname === '/' 
                      : location.pathname.startsWith(item.path);
                      
                    return (
                      <Link 
                        key={item.name} 
                        to={item.path} 
                        className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-4 shrink-0 ${isItemActive ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-gray-400'}`}
                      >
                        {item.name}
                        {isItemActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500 rounded-t-full"></div>}
                      </Link>
                    );
                  })}
                </div>
              </div>
              
              {/* Sisi Kanan: Pencarian, Actions */}
              <div className="flex items-center justify-end gap-3 md:gap-4 h-full">
                {/* Mobile Navigation Links */}
                <div className="lg:hidden flex items-center gap-4">
                  {subNav.filter(s => !s.desktopOnly).map((item) => {
                    const isItemActive = location.pathname.startsWith(item.path);
                    return (
                      <Link 
                        key={item.name} 
                        to={item.path} 
                        className={`text-[10px] font-black uppercase tracking-widest transition-all relative py-4 ${isItemActive ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}
                      >
                        {item.mobileName || item.name}
                        {isItemActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500 rounded-t-full"></div>}
                      </Link>
                    );
                  })}
                </div>

                {/* Global Search Header (Placeholder 10px) */}
                <div className="hidden md:flex relative group w-48 xl:w-64">
                  <input 
                    type="text" 
                    placeholder="Pencarian Artikel..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-9 py-2 text-[10px] font-bold text-black dark:text-white outline-none focus:border-yellow-400/50 transition-all placeholder:text-[10px] placeholder:text-gray-400 dark:placeholder:text-gray-700"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 group-focus-within:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <div className="lg:hidden flex items-center gap-2">
                  <button 
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-all active:scale-90"
                    title="Ganti Tema"
                  >
                    {isDark ? (
                      <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c.132 0 .263 0 .393.007a9.982 9.982 0 00-.393 19.986c.132 0 .263 0 .393-.007A9.982 9.982 0 0012 3z"/></svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 13h2a1 1 0 100-2H2a1 1 0 100 2zm18 0h2a1 1 0 100-2h-2a1 1 0 100 2zM11 2v2a1 1 0 102 0V2a1 1 0 10-2 0zm0 18v2a1 1 0 102 0v-2a1 1 0 10-2 0zM5.99 4.58a1 1 0 10-1.41 1.41l1.06 1.06a1 1 0 101.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 10-1.41 1.41l1.06 1.06a1 1 0 101.41-1.41l-1.06-1.06zm1.06-12.37a1 1 0 10-1.41-1.41l-1.06 1.06a1 1 0 101.41 1.41l1.06-1.06zM5.99 19.42a1 1 0 101.41-1.41l-1.06-1.06a1 1 0 10-1.41 1.41l1.06 1.06z"/></svg>
                    )}
                  </button>

                  <button 
                    onClick={() => alert("Google Login: Segera hadir!")}
                    className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-all active:scale-90"
                    title="Masuk Google"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </nav>
          )}

          <main className="flex-1 pb-16 lg:pb-6 text-black dark:text-white">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/review" element={<SmartReview />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/match" element={<PhoneMatch />} />
              <Route path="/top-tier" element={<TopTier />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/chat" element={<AIChat />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsCondition />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/top-tier" element={<AdminTopTier />} />
              <Route path="/admin/editor" element={<BlogEditor />} />
              <Route path="/admin/editor/:id" element={<BlogEditor />} />
            </Routes>
          </main>
        </div>

        {!isAdminPath && <RightSidebar onOpenDonation={() => setShowDonationModal(true)} isDark={isDark} toggleTheme={toggleTheme} />}
      </div>
      {!isAdminPath && <BottomNavbar />}

      {/* Floating AI Button for Mobile */}
      {!isAdminPath && (
        <Link 
          to="/chat" 
          className="lg:hidden fixed bottom-20 right-4 z-[1100] w-14 h-14 bg-yellow-400 rounded-2xl shadow-2xl shadow-yellow-400/40 flex items-center justify-center border-2 border-black active:scale-90 transition-transform hover:bg-black dark:hover:bg-white group"
        >
          <svg className="w-7 h-7 text-black group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-black rounded-full animate-pulse"></div>
        </Link>
      )}

      {/* Donation Modal Global */}
      {showDonationModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm" onClick={() => setShowDonationModal(false)}></div>
          <div className="bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm relative z-10 shadow-2xl animate-in zoom-in duration-300 theme-transition">
             <div className="space-y-6 text-center">
               <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto">
                 <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
               </div>
               <div className="space-y-2">
                 <h3 className="text-xl font-black text-black dark:text-white uppercase italic tracking-tighter">Support JAGOHP</h3>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed italic">
                   Traktir kopi bantu AI kami tetap riset HP 24/7 untuk lo semua!
                 </p>
               </div>
               <a 
                 href="https://saweria.co/minekaze" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="block w-full bg-yellow-400 text-black py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-yellow-400 transition-all shadow-xl shadow-yellow-400/10 active:scale-95"
               >
                 Saweria
               </a>
               <button 
                 onClick={() => setShowDonationModal(false)}
                 className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors"
               >
                 Nanti Dulu
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
};

export default App;