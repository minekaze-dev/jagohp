
import React, { useState, useEffect } from 'react';
import { getSavedTopTier } from '../services/topTierService';
import { TopTierResponse, TopTierPhone } from '../types';

const TierCard: React.FC<{ phone: TopTierPhone }> = ({ phone }) => (
  <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden group hover:border-yellow-400/30 transition-all duration-500">
    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-yellow-400/10 transition-colors"></div>
    <div className="flex justify-between items-start relative z-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-400 text-black rounded-2xl flex items-center justify-center text-2xl font-black italic shadow-lg shadow-yellow-400/20">
          #{phone.rank}
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{phone.name}</h3>
          <p className="text-yellow-400 text-[10px] md:text-xs font-black uppercase tracking-widest mt-1.5">{phone.price}</p>
        </div>
      </div>
    </div>
    <p className="text-gray-400 text-sm italic font-medium leading-relaxed border-l-2 border-yellow-400/20 pl-6 py-1">"{phone.reason}"</p>
    <div className="grid grid-cols-2 gap-3 pt-4">
      <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
        <span className="text-gray-600 text-[7px] font-black uppercase tracking-widest block">Processor</span>
        <span className="text-white text-[10px] font-bold truncate block">{phone.specs.processor}</span>
      </div>
      <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
        <span className="text-gray-600 text-[7px] font-black uppercase tracking-widest block">Display</span>
        <span className="text-white text-[10px] font-bold truncate block">{phone.specs.screen}</span>
      </div>
      <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
        <span className="text-gray-600 text-[7px] font-black uppercase tracking-widest block">Camera</span>
        <span className="text-white text-[10px] font-bold truncate block">{phone.specs.camera}</span>
      </div>
      <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
        <span className="text-gray-600 text-[7px] font-black uppercase tracking-widest block">Battery</span>
        <span className="text-white text-[10px] font-bold truncate block">{phone.specs.battery}</span>
      </div>
    </div>
    <div className="bg-neutral-900/50 p-3 rounded-xl border border-white/5">
      <span className="text-gray-600 text-[7px] font-black uppercase tracking-widest block mb-0.5">RAM & Storage</span>
      <span className="text-white text-[11px] font-black italic uppercase tracking-tight">{phone.specs.ramStorage}</span>
    </div>
  </div>
);

const TopTier: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Flagship');
  const [allData, setAllData] = useState<TopTierResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    { id: 'Flagship', icon: '👑', label: 'Flagship' },
    { id: 'Gaming', icon: '🎮', label: 'Gaming' },
    { id: 'Kamera', icon: '📸', label: 'Camera' },
    { id: 'All Rounder', icon: '🌟', label: 'All Rounder' },
    { id: 'Baterai Awet', icon: '🔋', label: 'Battery' },
    { id: 'Mid-Range', icon: '⚖️', label: 'Mid-Range' },
    { id: 'Entry-Level', icon: '💰', label: 'Budget' },
    { id: 'Daily Driver (1 Jutaan)', icon: '📱', label: 'Daily 1jt' },
    { id: 'Daily Driver (2 Jutaan)', icon: '📱', label: 'Daily 2jt' },
    { id: 'Daily Driver (3-5 Jutaan)', icon: '📱', label: 'Daily 3-5jt' },
    { id: 'Daily Driver (7-10 Jutaan)', icon: '📱', label: 'Daily 7-10jt' },
    { id: 'Daily Driver (>10 Juta)', icon: '📱', label: 'Daily 10jt+' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getSavedTopTier();
      setAllData(res);
    } catch (err) {
      setError('Gagal memuat ranking database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = allData.find(d => d.category === activeCategory);

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-16 space-y-12 pb-32">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic"><span className="text-yellow-400">Top</span> Tier Rank</h1>
        <p className="text-gray-500 text-sm md:text-base font-medium italic max-w-xl mx-auto">Ranking kurasi manual Admin JAGOHP berbasis riset pasar Januari 2026.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-2 border text-center ${
              activeCategory === cat.id ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse"><p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Loading Database...</p></div>
      ) : error ? (
        <div className="py-10 text-center bg-red-500/10 border border-red-500/20 rounded-3xl"><p className="text-red-500 font-bold uppercase text-[10px] tracking-widest">{error}</p></div>
      ) : data ? (
        <div className="space-y-12 animate-in fade-in duration-700">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-12 text-center md:text-left space-y-4 shadow-inner">
            <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">The Best of <span className="text-yellow-400">{data.category}</span></h2>
            <p className="text-gray-500 text-sm md:text-base italic font-medium">"{data.description}"</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {data.phones.length > 0 ? data.phones.map((phone, i) => (<TierCard key={i} phone={phone} />)) : (
              <div className="lg:col-span-3 py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]"><p className="text-gray-700 font-black uppercase text-[10px] italic">Data belum diperbarui bulan ini.</p></div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TopTier;
