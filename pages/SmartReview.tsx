
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getSmartReview } from '../services/geminiService';
import { PhoneReview } from '../types';

const SpecCard = ({ label, value, review, icon }: { label: string, value: string, review: string, icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-[#0c0c0c] p-4 rounded-xl flex flex-col gap-3 border border-black/5 dark:border-white/5 shadow-md hover:border-black/10 dark:hover:border-white/10 transition-all group theme-transition">
    <div className="flex items-center gap-3">
      <div className="bg-gray-50 dark:bg-black w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-black/5 dark:border-white/10 shadow-inner group-hover:border-yellow-400/30 transition-colors">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5 text-yellow-500" }) : icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-orange-500 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">{label}</span>
        <span className="text-black dark:text-white text-xs md:text-sm font-bold truncate uppercase tracking-tight" title={value}>{value}</span>
      </div>
    </div>
    <div className="pl-1 space-y-1.5">
      <div className="w-4 h-[1px] bg-black/5 dark:bg-white/10"></div>
      <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-500 leading-relaxed italic font-medium">"{review}"</p>
    </div>
  </div>
);

const SmartReview: React.FC = () => {
  const [query, setQuery] = useState('');
  const [review, setReview] = useState<PhoneReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setReview(null);
    setLoading(true);
    setError('');
    try {
      const result = await getSmartReview(query);
      if (result && result.review) {
        setReview(result.review);
      } else {
        setError('Data tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal memuat review. Pastikan API Key Groq valid.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('resmi')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (s.includes('global')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    if (s.includes('china')) return 'bg-red-500/10 text-red-500 border-red-500/20';
    return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  return (
    <div className="max-w-[850px] mx-auto px-4 pt-16 pb-40 space-y-10 theme-transition">
      <div className="text-center space-y-4">
        <h1 className="text-2xl md:text-4xl font-black uppercase italic text-black dark:text-white">
          <span className="text-yellow-400">Smart</span> Review
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium italic">
          Analisis spesifikasi akurat menggunakan Groq Llama 3 Engine.
        </p>
        
        {!review && !loading && (
          <div className="max-w-2xl mx-auto space-y-8 mt-8 animate-in fade-in duration-500">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tulis merk dan tipe HP (Contoh: Samsung S25 Ultra)"
                className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/20 rounded-2xl px-6 py-4 text-xs md:text-sm focus:outline-none focus:border-yellow-400 transition-colors pr-28 md:pr-32 font-bold shadow-2xl dark:text-white text-black"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-yellow-400 text-black px-4 md:px-6 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-colors shadow-lg active:scale-95"
              >
                Review
              </button>
            </form>
            
            <div className="relative border-2 border-dashed border-black/5 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-4">
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 dark:text-gray-700 italic text-center">
                  Hasil review akan muncul di sini.
               </p>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-20 animate-pulse">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Groq sedang menganalisis...</p>
        </div>
      )}

      {error && <p className="text-red-500 text-center text-xs font-black uppercase">{error}</p>}

      {review && !loading && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-4 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-black text-black dark:text-white uppercase italic">{review.name}</h2>
            <p className="text-yellow-500 font-bold italic">"{review.highlight}"</p>
            <div className="flex gap-4 pt-2">
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${getStatusColor(review.specs.availabilityStatus)}`}>{review.specs.availabilityStatus}</span>
              <span className="text-[10px] font-black uppercase text-gray-400">{review.specs.price}</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
             <SpecCard label="Chipset" value={review.specs.processor} review={review.specs.processorReview} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" strokeWidth="2"/></svg>} />
             <SpecCard label="Layar" value={review.specs.screen} review={review.specs.screenReview} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2"/></svg>} />
             <SpecCard label="Kamera" value={review.specs.mainCamera} review={review.specs.mainCameraReview} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth="2"/><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/></svg>} />
             <SpecCard label="Baterai" value={review.specs.battery} review={review.specs.batteryReview} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2"/></svg>} />
          </div>
          <button onClick={() => setReview(null)} className="w-full py-4 text-gray-400 font-black uppercase text-[10px] hover:text-yellow-500 transition-colors">Reset Review</button>
        </div>
      )}
    </div>
  );
};

export default SmartReview;
