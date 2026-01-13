
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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const Header: React.FC = () => {
  const location = useLocation();
  const isAdmin = sessionStorage.getItem('admin_token') === 'granted';
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm('Yakin ingin logout dari mode Admin?')) {
      sessionStorage.removeItem('admin_token');
      window.location.href = '#/';
      window.location.reload();
    }
  };

  const navItems = isAdmin 
    ? [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Blog', path: '/blog' },
      ]
    : [
        { name: 'Beranda', path: '/' },
        { name: 'Smart Review', path: '/review' },
        { name: 'Compare', path: '/compare' },
        { name: 'Phone Match', path: '/match' },
        { name: 'Blog', path: '/blog' },
        { name: 'Tentang', path: '/about' },
      ];

  return (
    <header className="sticky top-0 z-[100] bg-gradient-to-b from-neutral-900 via-black/95 to-black backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1000px] mx-auto px-4 h-20 flex items-center justify-between relative">
        <div className="flex-shrink-0 relative z-[110]">
          <Link to="/" className="flex items-center group">
            <img 
              src="https://imgur.com/oaPHidZ.jpg" 
              alt="JAGOHP Logo" 
              className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            {isAdmin && <span className="ml-2 bg-yellow-400 text-black text-[7px] font-black px-1.5 py-0.5 rounded uppercase">ADMIN</span>}
          </Link>
        </div>

        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-7 whitespace-nowrap">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-[10px] font-black uppercase tracking-widest transition-all hover:text-yellow-400 ${
                isActive(item.path) ? 'text-yellow-400' : 'text-gray-500'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 relative z-[110]">
          {!isAdmin && (
            <>
              <Link 
                to="/blog" 
                className={`lg:hidden text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border transition-all ${
                  isActive('/blog') ? 'bg-white/10 border-white/20 text-yellow-400' : 'border-white/5 text-gray-400'
                }`}
              >
                Blog
              </Link>
              <Link 
                to="/top-tier" 
                className="bg-yellow-400 text-black px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all flex items-center gap-2 shadow-lg shadow-yellow-400/20"
              >
                <span className="inline text-[9px]">🏆 Top Tier Rank</span>
              </Link>
            </>
          )}

          {isAdmin && (
            <button 
              onClick={handleLogout}
              className="hidden md:flex bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

const BottomNavbar: React.FC = () => {
  const location = useLocation();
  const isAdmin = sessionStorage.getItem('admin_token') === 'granted';
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm('Yakin ingin logout dari mode Admin?')) {
      sessionStorage.removeItem('admin_token');
      window.location.href = '#/';
      window.location.reload();
    }
  };

  const userNavItems = [
    { name: 'BERANDA', path: '/', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
    { name: 'REVIEW', path: '/review', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg> },
    { name: 'COMPARE', path: '/compare', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg> },
    { name: 'MATCH', path: '/match', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg> },
    { name: 'TENTANG', path: '/about', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> }
  ];

  const adminNavItems = [
    { name: 'DASHBOARD', path: '/admin', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg> },
    { name: 'BLOG', path: '/blog', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m-6 4h10"/></svg> },
    { name: 'LOGOUT', path: '#logout', icon: <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg> }
  ];

  const currentNav = isAdmin ? adminNavItems : userNavItems;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[200] bg-black/90 backdrop-blur-2xl border-t border-white/10 px-1 pb-safe pt-2">
      <div className="flex items-center justify-around">
        {currentNav.map((item) => (
          item.path === '#logout' ? (
            <button key={item.path} onClick={handleLogout} className="flex flex-col items-center gap-1 py-2 px-1 text-gray-500 flex-1">
              {item.icon}
              <span className="text-[7px] font-black uppercase tracking-widest leading-none">{item.name}</span>
            </button>
          ) : (
            <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 py-2 px-1 flex-1 ${isActive(item.path) ? 'text-yellow-400' : 'text-gray-500'}`}>
              {item.icon}
              <span className="text-[7px] font-black uppercase tracking-widest leading-none">{item.name}</span>
            </Link>
          )
        ))}
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [showDonate, setShowDonate] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-black">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/review" element={<SmartReview />} />
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
        <Footer onDonateClick={() => setShowDonate(true)} />
        <BottomNavbar />
      </div>
      {showDonate && <DonationModal onClose={() => setShowDonate(false)} />}
    </Router>
  );
};

const Footer = ({ onDonateClick }: { onDonateClick: () => void }) => (
  <footer className="border-t border-white/10 mt-10 py-16 bg-black/40 backdrop-blur-sm mb-20 md:mb-0">
    <div className="max-w-[900px] mx-auto px-4 text-center space-y-10">
      <img src="https://imgur.com/oaPHidZ.jpg" className="h-12 w-auto mx-auto opacity-80" alt="" />
      
      {/* Social Media Section */}
      <div className="flex justify-center gap-4">
        <a 
          href="https://instagram.com/jagohp" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-black hover:bg-yellow-400 hover:border-yellow-400 transition-all active:scale-95 shadow-lg"
          title="Follow Instagram JAGOHP"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      </div>

      <nav className="flex flex-wrap justify-center gap-8">
        <button onClick={onDonateClick} className="text-[10px] font-black uppercase text-gray-500 hover:text-yellow-400">Dukung Kami</button>
        <Link to="/faq" className="text-[10px] font-black uppercase text-gray-500 hover:text-yellow-400">FAQ</Link>
        <Link to="/privacy" className="text-[10px] font-black uppercase text-gray-500 hover:text-yellow-400">Kebijakan Privasi</Link>
        <Link to="/terms" className="text-[10px] font-black uppercase text-gray-500 hover:text-yellow-400">Syarat & Ketentuan</Link>
      </nav>
      <p className="text-gray-600 text-[10px] uppercase font-black tracking-widest">© 2026 JAGOHP | Platform Rekomendasi Smartphone Berbasis AI</p>
    </div>
  </footer>
);

const DonationModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose}></div>
    <div className="relative bg-[#0a0a0a] border border-yellow-400/30 w-full max-w-sm rounded-[2.5rem] p-10 text-center">
      <h3 className="text-2xl font-black text-white uppercase italic">Support <span className="text-yellow-400">JAGOHP</span></h3>
      <a href="https://saweria.co/minekaze" target="_blank" className="block mt-8 bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase text-xs">Donasi via Saweria</a>
    </div>
  </div>
);

export default App;
