
import React, { useState } from 'react';
import { getComparison } from '../services/geminiService';
import { ComparisonResult } from '../types';

const Compare: React.FC = () => {
  const [phones, setPhones] = useState(['', '']);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updatePhone = (index: number, val: string) => {
    const next = [...phones];
    next[index] = val;
    setPhones(next);
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    const activePhones = phones.filter(p => p.trim() !== '');
    if (activePhones.length < 2) {
      setError('Masukkan minimal 2 HP.');
      return;
    }

    setResult(null);
    setLoading(true);
    setError('');
    try {
      const res = await getComparison(activePhones);
      setResult(res);
    } catch (err) {
      setError('Gagal membandingkan. Cek koneksi atau API Key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[950px] mx-auto px-4 py-16 space-y-12 pb-32">
      <div className="text-center space-y-4">
        <h1 className="text-2xl md:text-4xl font-black uppercase italic text-black dark:text-white">
          <span className="text-yellow-400">Com</span>pare
        </h1>
        <p className="text-gray-400 text-sm italic">Perbandingan teknis mendalam antar perangkat.</p>
      </div>

      {!result && !loading && (
        <form onSubmit={handleCompare} className="space-y-8 max-w-xl mx-auto">
          <div className="space-y-4">
            {phones.map((p, i) => (
              <input
                key={i}
                type="text"
                value={p}
                onChange={(e) => updatePhone(i, e.target.value)}
                placeholder={`HP Pilihan ${i + 1}`}
                className="w-full bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/20 rounded-xl px-4 py-4 text-xs font-bold text-black dark:text-white outline-none focus:border-yellow-400"
              />
            ))}
          </div>
          <button type="submit" className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black uppercase text-[10px] hover:bg-yellow-500 shadow-xl">Mulai Bandingkan</button>
        </form>
      )}

      {loading && <div className="text-center py-20 text-[10px] font-black uppercase text-gray-500 animate-pulse">AI sedang memproses komparasi...</div>}
      {error && <p className="text-red-500 text-center font-black uppercase text-xs">{error}</p>}

      {result && (
        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
           <h2 className="text-xl font-black uppercase italic text-yellow-400 tracking-widest">Hasil Analisis</h2>
           <p className="text-gray-400 italic">"{result.conclusion}"</p>
           <div className="bg-yellow-400 text-black p-6 rounded-2xl font-black">
              Rekomendasi: {result.recommendation}
           </div>
           <button onClick={() => setResult(null)} className="text-xs font-black uppercase text-gray-500 border-b border-gray-500 pb-1">Reset</button>
        </div>
      )}
    </div>
  );
};

export default Compare;
