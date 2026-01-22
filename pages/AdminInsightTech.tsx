
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGadgetDictionary, regenerateDictionary } from '../services/geminiService';
import { supabase } from '../services/blogService';

const AdminInsightTech: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem('admin_token') === 'granted';

  const [dictionary, setDictionary] = useState<{term: string, definition: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchDic = async () => {
    setLoading(true);
    const data = await getGadgetDictionary();
    setDictionary(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    fetchDic();
  }, [isAdmin]);

  const handleAIRegenerate = async () => {
    if (!window.confirm("Update via AI akan menghapus data kamus saat ini dan meriset jargon baru tahun 2026. Lanjutkan?")) return;
    
    setUpdating(true);
    const success = await regenerateDictionary();
    if (success) {
      alert("AI Insight Tech berhasil diperbarui!");
      fetchDic();
    } else {
      alert("Gagal memperbarui kamus. Cek API Key atau Supabase.");
    }
    setUpdating(false);
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12 space-y-12 pb-32">
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-8 gap-6">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Insight Tech <span className="text-yellow-400">Mod</span></h1>
        </div>
        <button 
          onClick={handleAIRegenerate} 
          disabled={updating || loading}
          className="w-full md:w-auto bg-yellow-400 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 shadow-xl shadow-yellow-400/20 active:scale-95 disabled:opacity-50 transition-all"
        >
          {updating ? 'AI RESEARCHING...' : 'Update via AI (Weekly)'}
        </button>
      </div>

      <div className="space-y-6">
        <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em] italic">Current Gadget Dictionary</h2>
        
        {loading ? (
          <div className="py-20 text-center animate-pulse"><p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">Accessing Database...</p></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {dictionary.map((item, idx) => (
              <div key={idx} className="bg-black/40 border border-white/5 p-6 rounded-[2rem] space-y-3 shadow-xl hover:border-yellow-400/20 transition-all group">
                <div className="flex justify-between items-center">
                   <h3 className="text-sm font-black text-yellow-400 uppercase italic tracking-widest">{item.term}</h3>
                   <span className="text-[8px] font-black text-gray-700 uppercase">#Term {idx + 1}</span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium italic leading-relaxed">"{item.definition}"</p>
              </div>
            ))}
            {dictionary.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                <p className="text-gray-600 font-black uppercase text-[10px] italic">Kamus Kosong. Klik Tombol AI untuk Mengisi.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-yellow-400/5 border border-yellow-400/10 p-8 rounded-[2.5rem] space-y-4">
         <h4 className="text-[10px] font-black uppercase text-yellow-500 tracking-[0.2em]">Note Editor</h4>
         <p className="text-[11px] text-gray-500 italic leading-relaxed">
           Fitur ini dirancang untuk menjaga kesegaran konten di sidebar user tanpa harus melakukan deploy ulang. Pastikan untuk menekan tombol update setidaknya seminggu sekali agar kamus tetap relevan dengan tren smartphone terbaru.
         </p>
      </div>
    </div>
  );
};

export default AdminInsightTech;
