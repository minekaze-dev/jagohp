
import React, { useState, useEffect } from 'react';
import { getSavedTopTier } from '../services/topTierService';
import { TopTierResponse, TopTierPhone } from '../types';

const TierCard: React.FC<{ phone: TopTierPhone }> = ({ phone }) => (
  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-6 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 w-full animate-in fade-in zoom-in duration-700 hover:border-yellow-400/20">
    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]"></div>
    
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black italic shadow-2xl transform transition-transform group-hover:scale-110 duration-500 bg-yellow-400 text-black">
          #1
        </div>
        <div>
          <h3 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-yellow-400 transition-colors">{phone.name}</h3>
          <p className="text-yellow-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-2">{phone.price}</p>
        </div>
      </div>
      
      <div className="bg-yellow-400 text-black px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] animate-pulse shadow-lg shadow-yellow-400/20">
        🏆 Pilihan Terbaik
      </div>
    </div>

    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400 to-transparent rounded-full"></div>
      <p className="text-gray-400 text-sm md:text-base italic font-medium leading-relaxed pl-6 py-1 max-w-3xl">
        "{phone.reason}"
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 relative z-10">
      <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5 group-hover:bg-white/[0.07] transition-colors text-center">
        <span className="text-gray-600 text-[7px] font-black uppercase tracking-widest block">Processor</span>
        <span className="text-white text-[10px] font-bold block truncate">{phone.specs.processor}</span>
      </div>
      <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5 group-hover:bg-white/[0.07] transition-colors text-center">
        <span className="text-gray-600 text-[7px] font-black uppercase tracking-widest block">Display</span>
        <span className="text-white text-[10px] font-bold block truncate">{phone.specs.screen}</span>
      </div>
      <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5 group-hover:bg-white/[0.07] transition-colors text-center">
        <span className="text-gray-600 text-[7px] font-black uppercase tracking-widest block">Main Camera</span>
        <span className="text-white text-[10px] font-bold block truncate">{phone.specs.camera}</span>
      </div>
      <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5 group-hover:bg-white/[0.07] transition-colors text-center">
        <span className="text-gray-600 text-[7px] font-black uppercase tracking-widest block">Battery</span>
        <span className="text-white text-[10px] font-bold block truncate">{phone.specs.battery}</span>
      </div>
      <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5 group-hover:bg-white/[0.07] transition-colors text-center col-span-2 md:col-span-1">
        <span className="text-gray-600 text-[7px] font-black uppercase tracking-widest block">RAM/ROM</span>
        <span className="text-white text-[10px] font-bold block truncate">{phone.specs.ramStorage}</span>
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
  const topPhone = data?.phones?.find(p => p.rank === 1) || data?.phones?.[0];

  return (
    <div className="bg-black min-h-screen transition-colors duration-500">
      <div className="max-w-[1000px] mx-auto px-4 py-16 space-y-12 pb-32">
        <div className="text-center space-y-4">
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic text-white leading-none">
            Top Tier <span className="text-yellow-400">Rank</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-bold italic max-w-xl mx-auto">
            Top Tier Rank Smartphone per Januari 2026 menurut Jagohp.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border shadow-sm ${
                activeCategory === cat.id 
                  ? 'bg-yellow-400 border-yellow-400 text-black shadow-xl' 
                  : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center animate-pulse">
            <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px]">Processing Database...</p>
          </div>
        ) : error ? (
          <div className="py-10 text-center bg-red-500/10 border border-red-500/20 rounded-3xl">
            <p className="text-red-500 font-bold uppercase text-[10px] tracking-widest">{error}</p>
          </div>
        ) : data ? (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-12 text-center space-y-4 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-yellow-400/[0.02] pointer-events-none"></div>
              <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter relative z-10 text-white leading-none">
                Best of <span className="text-yellow-400">{data.category}</span>
              </h2>
              <p className="text-gray-400 text-xs md:text-base italic font-medium max-w-xl mx-auto relative z-10">
                "{data.description}"
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              {topPhone ? (
                <TierCard phone={topPhone} />
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] w-full">
                  <p className="text-gray-600 font-black uppercase text-xs italic">Data belum diperbarui bulan ini.</p>
                </div>
              )}
            </div>

            <div className="text-center pt-8">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.6em] italic">Data Top Tier diperbarui secara berkala per 3 bulan</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TopTier;
