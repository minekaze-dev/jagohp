
import React, { useState, useEffect } from 'react';
import { getSavedTopTier } from '../services/topTierService';
import { TopTierResponse, TopTierPhone } from '../types';

const TierCard: React.FC<{ phone: TopTierPhone }> = ({ phone }) => (
  <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-2xl relative overflow-hidden group hover:border-yellow-400/30 transition-all duration-500 w-full animate-in fade-in zoom-in duration-700">
    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] group-hover:bg-yellow-400/10 transition-colors"></div>
    
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-black italic shadow-2xl transform transition-transform group-hover:scale-110 duration-500 bg-yellow-400 text-black shadow-yellow-400/20">
          #1
        </div>
        <div>
          <h3 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-yellow-400 transition-colors">{phone.name}</h3>
          <p className="text-yellow-400 text-xs md:text-sm font-black uppercase tracking-[0.2em] mt-3">{phone.price}</p>
        </div>
      </div>
      
      <div className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
        🏆 Pilihan Terbaik
      </div>
    </div>

    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400/50 to-transparent rounded-full"></div>
      <p className="text-gray-400 text-base md:text-lg italic font-medium leading-relaxed pl-8 py-2 max-w-3xl">
        "{phone.reason}"
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 relative z-10">
      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1 group-hover:bg-white/[0.07] transition-colors">
        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest block">Processor</span>
        <span className="text-white text-xs font-bold block">{phone.specs.processor}</span>
      </div>
      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1 group-hover:bg-white/[0.07] transition-colors">
        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest block">Display</span>
        <span className="text-white text-xs font-bold block">{phone.specs.screen}</span>
      </div>
      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1 group-hover:bg-white/[0.07] transition-colors">
        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest block">Main Camera</span>
        <span className="text-white text-xs font-bold block">{phone.specs.camera}</span>
      </div>
      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1 group-hover:bg-white/[0.07] transition-colors">
        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest block">Battery</span>
        <span className="text-white text-xs font-bold block">{phone.specs.battery}</span>
      </div>
      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1 group-hover:bg-white/[0.07] transition-colors col-span-2 md:col-span-1">
        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest block">RAM/ROM</span>
        <span className="text-white text-xs font-bold block">{phone.specs.ramStorage}</span>
      </div>
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
    { id: 'Entry-Level', icon: '💰', label: 'Entry-Level' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getSavedTopTier();
      setAllData(res || []);
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
  // Hanya ambil peringkat #1 jika ada
  const topPhone = data?.phones?.find(p => p.rank === 1) || data?.phones?.[0];

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-16 space-y-12 pb-32">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic"><span className="text-yellow-400">Top</span> Tier Rank</h1>
        <p className="text-gray-500 text-sm md:text-base font-medium italic max-w-xl mx-auto">The Best Smartphone per Januari 2026 menurut Jagohp.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border text-center ${
              activeCategory === cat.id ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse"><p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Loading Database...</p></div>
      ) : error ? (
        <div className="py-10 text-center bg-red-500/10 border border-red-500/20 rounded-3xl"><p className="text-red-500 font-bold uppercase text-[10px] tracking-widest">{error}</p></div>
      ) : data ? (
        <div className="space-y-16 animate-in fade-in duration-700">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 md:p-14 text-center space-y-6 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-yellow-400/[0.02] pointer-events-none"></div>
            <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter relative z-10">Best of <span className="text-yellow-400">{data.category}</span></h2>
            <p className="text-gray-500 text-sm md:text-lg italic font-medium max-w-2xl mx-auto relative z-10">"{data.description}"</p>
          </div>
          
          <div className="flex flex-col items-center">
            {topPhone ? (
              <TierCard phone={topPhone} />
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] w-full"><p className="text-gray-700 font-black uppercase text-xs italic">Data belum diperbarui bulan ini.</p></div>
            )}
          </div>

          <div className="text-center pt-10">
            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.6em] italic">Data Top Tier akan selalu diperbarui per 3 bulan</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TopTier;
