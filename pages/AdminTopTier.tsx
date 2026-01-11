
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopTierRankings } from '../services/geminiService';
import { saveTopTierRankings, getSavedTopTier } from '../services/topTierService';
import { TopTierResponse, TopTierPhone } from '../types';

const AdminTopTier: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem('admin_token') === 'granted';

  const categories = [
    'Flagship', 'Gaming', 'Kamera', 'All Rounder', 'Baterai Awet', 'Mid-Range', 'Entry-Level'
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
      // Hanya ambil 1 data pertama
      setCurrentRankings(active ? active.phones.slice(0, 1) : []);
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
      // Pastikan hanya 1 data
      setCurrentRankings(res.phones.slice(0, 1));
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
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Manage <span className="text-yellow-400">Top 1 Winner</span></h1>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={handleGenerateAI} disabled={loading} className="flex-1 md:flex-none bg-white/5 border border-white/10 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 disabled:opacity-50">AI Research #1</button>
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
        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
          {currentRankings.length > 0 ? currentRankings.map((phone) => (
            <div key={phone.rank} className="bg-[#0a0a0a] border border-yellow-400/20 rounded-[2rem] p-8 space-y-6 shadow-2xl relative">
              <div className="absolute top-4 right-8 text-[8px] font-black text-yellow-400 uppercase tracking-widest">Editor Mode</div>
              <div className="flex flex-col md:flex-row items-center gap-4 border-b border-white/5 pb-4">
                <div className="w-10 h-10 bg-yellow-400 text-black rounded-xl flex items-center justify-center font-black">#1</div>
                <input value={phone.name} onChange={(e) => updatePhoneField(phone.rank, 'name', e.target.value)} className="flex-1 bg-transparent text-xl font-black text-white italic uppercase outline-none" placeholder="Nama Smartphone" />
                <input value={phone.price} onChange={(e) => updatePhoneField(phone.rank, 'price', e.target.value)} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-[10px] font-black uppercase text-yellow-400 outline-none" placeholder="Harga" />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Alasan Menjadi Juara</label>
                <textarea value={phone.reason} onChange={(e) => updatePhoneField(phone.rank, 'reason', e.target.value)} className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 text-xs italic text-gray-400 outline-none h-24 resize-none" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Processor</label>
                  <input value={phone.specs.processor} onChange={(e) => updatePhoneField(phone.rank, 'specs.processor', e.target.value)} className="w-full bg-neutral-900 border border-white/5 rounded-lg p-2.5 text-[10px] text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Screen</label>
                  <input value={phone.specs.screen} onChange={(e) => updatePhoneField(phone.rank, 'specs.screen', e.target.value)} className="w-full bg-neutral-900 border border-white/5 rounded-lg p-2.5 text-[10px] text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Camera</label>
                  <input value={phone.specs.camera} onChange={(e) => updatePhoneField(phone.rank, 'specs.camera', e.target.value)} className="w-full bg-neutral-900 border border-white/5 rounded-lg p-2.5 text-[10px] text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Battery</label>
                  <input value={phone.specs.battery} onChange={(e) => updatePhoneField(phone.rank, 'specs.battery', e.target.value)} className="w-full bg-neutral-900 border border-white/5 rounded-lg p-2.5 text-[10px] text-white" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">RAM & ROM</label>
                  <input value={phone.specs.ramStorage} onChange={(e) => updatePhoneField(phone.rank, 'specs.ramStorage', e.target.value)} className="w-full bg-neutral-900 border border-white/5 rounded-lg p-2.5 text-[10px] text-white" />
                </div>
              </div>
            </div>
          )) : <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">Data Kosong. Klik AI Research #1.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminTopTier;
