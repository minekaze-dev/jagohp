import React, { useState } from 'react';
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
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setReview(null);
    setSources([]);
    setLoading(true);
    setError('');
    try {
      const result = await getSmartReview(query);
      if (result && result.review) {
        setReview(result.review);
        setSources(result.sources || []);
      } else {
        setError('Data tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal memuat review. Pastikan koneksi internet aktif.');
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

  const logoDark = "https://imgur.com/oaPHidZ.jpg";
  const logoLight = "https://imgur.com/8QS4UJ0.jpg";

  return (
    <div className="max-w-[850px] mx-auto px-4 pt-16 pb-40 space-y-10 theme-transition">
      <div className="text-center space-y-4">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic text-black dark:text-white"><span className="text-yellow-400">Smart</span> Review</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium italic">
          Analisis spesifikasi secara cepat dan akurat.
        </p>
        
        {!review && !loading && (
          <div className="max-w-2xl mx-auto space-y-20 mt-8 animate-in fade-in duration-500">
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
                disabled={loading}
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-yellow-400 text-black px-4 md:px-6 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 disabled:opacity-50 transition-colors active:scale-95 shadow-lg shadow-yellow-400/20"
              >
                Review
              </button>
            </form>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-yellow-400/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative border-2 border-dashed border-black/5 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] rounded-[2.5rem] p-16 md:p-24 flex flex-col items-center justify-center gap-6 shadow-2xl overflow-hidden group-hover:border-yellow-400/20 transition-all duration-500 theme-transition">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-1.5 h-1.5 bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/50 transition-colors"></div>
                  <div className="w-2.5 h-2.5 bg-yellow-400/40 rotate-45 group-hover:bg-yellow-400 transition-all group-hover:scale-125 duration-500"></div>
                  <div className="w-1.5 h-1.5 bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/50 transition-colors"></div>
                </div>
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] text-gray-300 dark:text-gray-700 group-hover:text-gray-500 transition-colors italic text-center">
                  Hasil review akan muncul di sini.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-20 space-y-5 animate-in fade-in duration-500">
          <div className="relative inline-block">
            <div className="w-24 h-24 border-2 border-yellow-400/20 rounded-full animate-ping absolute inset-0" />
            <img src={logoDark} className="w-20 h-20 object-contain relative z-10 animate-pulse hidden dark:block" alt="JAGOHP Loading" />
            <img src={logoLight} className="w-20 h-20 object-contain relative z-10 animate-pulse block dark:hidden" alt="JAGOHP Loading" />
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black tracking-[0.4em]">Mohon Tunggu, AI sedang menganalisanya...</p>
        </div>
      )}

      {error && <p className="text-red-400 text-center text-xs font-bold uppercase tracking-widest">{error}</p>}

      {review && !loading && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-[#0a0a0a] p-6 md:p-10 rounded-3xl border border-black/5 dark:border-white/5 space-y-5 shadow-2xl relative overflow-hidden group theme-transition">
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-black dark:text-white uppercase italic leading-none">{review.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">Rilis: {review.specs?.releaseDate}</p>
                     </div>
                     <div className="h-3 w-[1px] bg-black/5 dark:bg-white/10"></div>
                     <div className="flex items-center gap-2">
                        <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
                        <p className="text-[10px] md:text-xs text-yellow-400 font-black uppercase tracking-[0.2em]">{review.specs?.price}</p>
                     </div>
                     <div className="h-3 w-[1px] bg-black/5 dark:bg-white/10 hidden sm:block"></div>
                     <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${getStatusColor(review.specs?.availabilityStatus || '')}`}>
                        {review.specs?.availabilityStatus}
                     </span>
                  </div>
                </div>
                <button 
                  onClick={() => {setReview(null); setQuery('');}}
                  className="text-gray-400 dark:text-gray-600 hover:text-yellow-400 transition-colors text-[9px] font-black uppercase tracking-widest border-b border-gray-200 dark:border-gray-800 pb-1"
                >
                  Reset
                </button>
              </div>
              <p className="text-sm md:text-lg text-yellow-500 dark:text-yellow-400 font-bold italic tracking-tight pt-5 mt-5 border-t border-black/5 dark:border-white/5">"{review.highlight}"</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#050505] border border-black/5 dark:border-white/5 rounded-3xl p-6 md:p-10 space-y-8 shadow-inner theme-transition">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-yellow-400 rounded-full"></div>
              <h3 className="text-base md:text-xl font-black text-black dark:text-white uppercase tracking-widest">Analisis Spek Teknis</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SpecCard label="JARINGAN" value={review.specs?.network} review={review.specs?.networkReview} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M2 22h20V2L2 22zm18-2H6.83L20 6.83V20z"/></svg>} />
              <SpecCard label="SISTEM OPERASI (OS)" value={review.specs?.os} review={review.specs?.osReview} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h12v-2H3v2zm0 4h12v-2H3v2zm0-8h12V7H3v2zm14 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-8v2h2V5h-2z"/></svg>} />
              <SpecCard label="MATERIAL BODY" value={review.specs?.body} review={review.specs?.bodyReview} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 18h-2v-2h2v2zm3-4H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V6h8v2z"/></svg>} />
              <SpecCard label="DISPLAY / LAYAR" value={review.specs?.screen} review={review.specs?.screenReview} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2m0 18H7V5h10v14Z"/></svg>} />
              <SpecCard label="CHIPSET / PROCESSOR" value={review.specs?.processor} review={review.specs?.processorReview} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M11 15h2v2h-2v-2m0-8h2v6h-2V7m1-5C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.48 10-10S17.53 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z"/></svg>} />
              <SpecCard label="STORAGE / PENYIMPANAN" value={review.specs?.storage} review={review.specs?.storageReview} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M18 2H10L4 8v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M9 4v4H6l3-4m9 16H6V9h4c1.1 0 2-.9 2-2V4h6v16Z"/></svg>} />
              <SpecCard label="KAMERA UTAMA" value={review.specs?.mainCamera} review={review.specs?.mainCameraReview} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h3l2-2h6l2 2h3c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2m8 3c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5m0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3Z"/></svg>} />
              <SpecCard label="KAMERA DEPAN (SELFIE)" value={review.specs?.selfieCamera} review={review.specs?.selfieCameraReview} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>} />
              <SpecCard label="KAPASITAS RAM" value={review.specs?.ram} review={review.specs?.ramReview} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9m0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7Z"/></svg>} />
              <SpecCard label="KONEKSI / CONNECT" value={review.specs?.connectivity} review={review.specs?.connectivityReview} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 18h-2v-2h2v2zm3-4H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V6h8v2z"/></svg>} />
              <SpecCard label="AUDIO / SOUND" value={review.specs?.sound} review={review.specs?.soundReview} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.57 12 7 13.57 7 15.5S8.57 19 10.5 19s3.5-1.57 3.5-3.5V7h4V3h-6z"/></svg>} />
              <SpecCard label="BATTERY / BATERAI" value={review.specs?.battery} review={review.specs?.batteryReview} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M16.67 4H15V2H9v2H7.33C6.6 4 6 4.6 6 5.33v15.33C6 21.4 6.6 22 7.33 22h9.33c.74 0 1.34-.6 1.34-1.33V5.33C18 4.6 17.4 4 16.67 4M15 20H9V6h6v14Z"/></svg>} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-10 space-y-8 theme-transition">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-yellow-400 rounded-full"></div>
              <h3 className="text-base md:text-xl font-black text-black dark:text-white uppercase tracking-widest">Performa Gaming</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/5 dark:border-white/10">
                    <th className="py-4 text-[9px] font-black uppercase text-gray-400 dark:text-gray-600 tracking-[0.3em]">Game</th>
                    <th className="py-4 text-[9px] font-black uppercase text-gray-400 dark:text-gray-600 tracking-[0.3em] px-4">Setting</th>
                    <th className="py-4 text-[9px] font-black uppercase text-gray-400 dark:text-gray-600 tracking-[0.3em]">Pengalaman</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {Array.isArray(review.gamingPerformance) && review.gamingPerformance.map((g, i) => (
                    <tr key={i} className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-5 font-black text-black dark:text-white text-xs md:text-base uppercase italic tracking-tighter">{g.game}</td>
                      <td className="py-5 px-4">
                        <span className="text-[9px] font-black bg-yellow-400 text-black px-2 py-1 rounded-sm uppercase tracking-wider inline-block">
                          {g.setting}
                        </span>
                      </td>
                      <td className="py-5 text-gray-500 dark:text-gray-500 text-[10px] md:text-xs leading-relaxed italic font-medium">"{g.experience}"</td>
                    </tr>
                  ))}
                  {(!Array.isArray(review.gamingPerformance) || review.gamingPerformance.length === 0) && (
                    <tr>
                      <td colSpan={3} className="py-10 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Data gaming belum tersedia</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-6 border-t border-black/5 dark:border-white/10 space-y-4">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rotate-45"></div>
                  <h4 className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.4em]">Ringkasan Performa Gaming</h4>
               </div>
               <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed italic font-black text-justify tracking-tight border-l-2 border-yellow-400/30 pl-6">
                 "{review.overallGamingSummary}"
               </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-8 rounded-[2rem] space-y-8 shadow-2xl theme-transition">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Benchmark Performa</h4>
                <div className="space-y-1">
                  <div className="text-[10px] text-gray-400 dark:text-gray-400 font-black uppercase tracking-widest">ANTUTU V11</div>
                  <div className="text-3xl font-black text-yellow-500 dark:text-yellow-400 italic tracking-tighter">{review.performance?.antutu || "N/A"}</div>
                </div>
                <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-500 leading-relaxed font-medium italic">"{review.performance?.description || "Belum ada analisis benchmark mendalam."}"</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-black/40 p-6 rounded-2xl border border-black/5 dark:border-white/5 space-y-4">
                <h5 className="text-[9px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest border-b border-black/5 dark:border-white/5 pb-2">Smartphone Rival</h5>
                <div className="space-y-3">
                  {Array.isArray(review.performance?.rivals) && review.performance?.rivals.map((rival, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-xs font-black text-black dark:text-gray-300 uppercase italic">{rival.name}</span>
                      <span className="text-yellow-500 dark:text-yellow-400 font-black text-xs">{rival.score}</span>
                    </div>
                  ))}
                  {(!Array.isArray(review.performance?.rivals) || review.performance?.rivals.length === 0) && (
                     <div className="text-[9px] text-gray-600 uppercase font-black tracking-widest text-center italic">Rival data not available</div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-8 rounded-[2rem] space-y-8 shadow-2xl text-center md:text-left theme-transition">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Fotografi</h4>
              <div className="flex flex-col items-center gap-6 py-4">
                <div className="space-y-1 text-center">
                  <div className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-[0.3em]">DXOMARK SCORE</div>
                  <div className="text-4xl font-black text-yellow-500 dark:text-yellow-400 tracking-tighter italic leading-none">{review.camera?.score || "N/A"}</div>
                </div>
                <div className="bg-gray-100 dark:bg-[#151515] text-black dark:text-white text-[10px] px-6 py-2.5 rounded-full font-black tracking-widest uppercase border border-black/5 dark:border-white/10 theme-transition">
                  {review.camera?.dxoMarkClass || "UNRANKED"}
                </div>
              </div>
              <div className="pt-4 border-t border-black/5 dark:border-white/5">
                <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-500 leading-relaxed italic font-medium">"{review.camera?.description || "Belum ada analisis kamera mendalam."}"</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-400 text-black p-8 md:p-12 rounded-[2.5rem] space-y-10 shadow-2xl shadow-yellow-400/20">
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-prop-4em opacity-40">Kelebihan</h3>
                <ul className="space-y-2 text-xs md:text-base font-black italic tracking-tight leading-snug">
                  {Array.isArray(review.pros) && review.pros.map((p, i) => <li key={i} className="flex gap-2"><span>+</span> {p}</li>)}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-prop-4em opacity-40">Kekurangan</h3>
                <ul className="space-y-2 text-xs md:text-base font-black italic tracking-tight opacity-70 leading-snug">
                  {Array.isArray(review.cons) && review.cons.map((c, i) => <li key={i} className="flex gap-2"><span>-</span> {c}</li>)}
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-black/10">
              <span className="text-[9px] font-black uppercase tracking-[0.6em] opacity-40 block mb-3">Insight AI</span>
              <p className="text-sm md:text-lg font-black leading-tight italic tracking-tight">"{review.targetAudience}"</p>
            </div>
          </div>

          <div className="flex justify-center pt-10">
            <button 
              onClick={() => {setReview(null); setQuery(''); window.scrollTo({top:0, behavior:'smooth'})}} 
              className="text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white text-[10px] font-black uppercase tracking-widest border-b border-transparent hover:border-black dark:hover:border-white transition-all pb-1 italic"
            >
              Reset Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartReview;