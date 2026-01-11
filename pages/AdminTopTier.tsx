
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopTierRankings } from '../services/geminiService';
import { saveTopTierRankings, getSavedTopTier } from '../services/topTierService';
import { TopTierResponse, TopTierPhone } from '../types';

const AdminTopTier: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem('admin_token') === 'granted';

  const categories = [
    'Flagship', 'Gaming', 'Kamera', 'All Rounder', 'Baterai Awet', 'Mid-Range', 'Entry-Level',
    'Daily Driver (1 Jutaan)', 'Daily Driver (2 Jutaan)', 'Daily Driver (3-5 Jutaan)', 
    'Daily Driver (7-10 Jutaan)', 'Daily Driver (>10 Juta)'
  ];
  
  const [activeCategory, setActiveCategory] = useState('Flagship');
  const [currentRankings, setCurrentRankings] = useState<TopTierPhone[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSavedTopTier();
      const active = data.find(d => d.category === activeCategory);
      setCurrentRankings(active ? active.phones : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    fetchData();
  }, [activeCategory, isAdmin]);

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const res = await getTopTierRankings(activeCategory);
      setCurrentRankings(res.phones);
      alert("AI Suggestion Berhasil Diambil!");
    } catch (err) {
      alert("Gagal memanggil AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (currentRankings.length === 0) return alert("Data kosong.");
    setSaving(true);
    try {
      await saveTopTierRankings(activeCategory, currentRankings);
      alert("Ranking Berhasil Disimpan ke Supabase!");
    } catch (err) {
      alert("Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const updatePhoneField = (rank: number, field: string, value: string) => {
    const next = [...currentRankings];
    const index = next.findIndex(p => p.rank === rank);
    if (index === -1) return;
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      (next[index] as any)[parent][child] = value;
    } else {
      (next[index] as any)[field] = value;
    }
    setCurrentRankings(next);
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 space-y-12 pb-32">
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-8 gap-6">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Manage <span className="text-yellow-400">Top Tier Rank</span></h1>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={handleGenerateAI} disabled={loading} className="flex-1 md:flex-none bg-white/5 border border-white/10 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 disabled:opacity-50">AI Research</button>
          <button onClick={handleSave} disabled={saving || loading} className="flex-1 md:flex-none bg-yellow-400 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-yellow-500 shadow-lg shadow-yellow-400/20">Save To DB</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center bg-black/40 p-4 rounded-[2rem] border border-white/5">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}>{cat}</button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse"><p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Processing Data...</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {currentRankings.length > 0 ? currentRankings.map((phone) => (
            <div key={phone.rank} className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-4 border-b border-white/5 pb-4">
                <div className="w-10 h-10 bg-yellow-400 text-black rounded-xl flex items-center justify-center font-black">#{phone.rank}</div>
                <input value={phone.name} onChange={(e) => updatePhoneField(phone.rank, 'name', e.target.value)} className="flex-1 bg-transparent text-xl font-black text-white italic uppercase outline-none" />
                <input value={phone.price} onChange={(e) => updatePhoneField(phone.rank, 'price', e.target.value)} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-[10px] font-black uppercase text-yellow-400 outline-none" />
              </div>
              <textarea value={phone.reason} onChange={(e) => updatePhoneField(phone.rank, 'reason', e.target.value)} className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 text-xs italic text-gray-400 outline-none h-20 resize-none" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <input value={phone.specs.processor} onChange={(e) => updatePhoneField(phone.rank, 'specs.processor', e.target.value)} className="bg-neutral-900 border border-white/5 rounded-lg p-2 text-[10px] text-white" placeholder="CPU" />
                <input value={phone.specs.screen} onChange={(e) => updatePhoneField(phone.rank, 'specs.screen', e.target.value)} className="bg-neutral-900 border border-white/5 rounded-lg p-2 text-[10px] text-white" placeholder="Display" />
                <input value={phone.specs.camera} onChange={(e) => updatePhoneField(phone.rank, 'specs.camera', e.target.value)} className="bg-neutral-900 border border-white/5 rounded-lg p-2 text-[10px] text-white" placeholder="Camera" />
                <input value={phone.specs.battery} onChange={(e) => updatePhoneField(phone.rank, 'specs.battery', e.target.value)} className="bg-neutral-900 border border-white/5 rounded-lg p-2 text-[10px] text-white" placeholder="Battery" />
                <input value={phone.specs.ramStorage} onChange={(e) => updatePhoneField(phone.rank, 'specs.ramStorage', e.target.value)} className="bg-neutral-900 border border-white/5 rounded-lg p-2 text-[10px] text-white" placeholder="RAM/ROM" />
              </div>
            </div>
          )) : <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">Data Kosong. Klik AI Research.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminTopTier;
