
import React, { useState } from 'react';
import { getMatch } from '../services/geminiService';
import { RecommendedPhone } from '../types';

const PhoneMatch: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState<RecommendedPhone | null>(null);
  const [budget, setBudget] = useState('3 Jutaan');
  const [activity, setActivity] = useState('Gaming');

  const handleMatch = async () => {
    setLoading(true);
    try {
      const res = await getMatch({ activities: [activity], budget, cameraPrio: "Biasa" });
      setMatch(res.primary);
    } catch (e) {
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-16 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-black italic uppercase text-black dark:text-white">Phone <span className="text-yellow-400">Match</span></h1>
        <p className="text-gray-500 text-sm italic">Cari HP tercocok sesuai budget lo.</p>
      </div>

      <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl border border-black/10 dark:border-white/10 space-y-6 shadow-xl">
         <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-gray-500">Budget</label>
               <select value={budget} onChange={e => setBudget(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-xl text-xs font-bold outline-none text-black dark:text-white">
                  <option>1 Jutaan</option><option>2 Jutaan</option><option>3 Jutaan</option><option>5 Jutaan</option><option>Diatas 10 Juta</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-gray-500">Aktivitas Utama</label>
               <select value={activity} onChange={e => setActivity(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-xl text-xs font-bold outline-none text-black dark:text-white">
                  <option>Gaming</option><option>Social Media</option><option>Fotografi</option><option>Kerja</option>
               </select>
            </div>
         </div>
         <button onClick={handleMatch} disabled={loading} className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black uppercase text-[10px] hover:bg-yellow-500 transition-all">Cari Match Terbaik</button>
      </div>

      {loading && <div className="text-center font-black uppercase text-xs text-gray-500 animate-pulse">AI Mencari opsi...</div>}

      {match && (
        <div className="bg-yellow-400 text-black p-8 rounded-[2.5rem] space-y-4 shadow-2xl animate-in zoom-in">
           <h2 className="text-3xl font-black italic uppercase">{match.name}</h2>
           <p className="font-bold italic">"{match.reason}"</p>
           <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase pt-4 border-t border-black/10">
              <div>Processor: {match.specs.processor}</div>
              <div>Battery: {match.specs.battery}</div>
              <div>Price: {match.price}</div>
              <div>AnTuTu: {match.performance.antutu}</div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PhoneMatch;
