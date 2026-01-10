
import React, { useState } from 'react';
import { getComparison } from '../services/geminiService';
import { ComparisonResult } from '../types';

const FeatureIcon = ({ feature }: { feature: string }) => {
  const f = feature.toLowerCase();
  if (f.includes('harga')) return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
  if (f.includes('chipset')) return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>;
  if (f.includes('layar')) return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>;
  if (f.includes('kamera')) return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
  if (f.includes('batere') || f.includes('baterai')) return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>;
  if (f.includes('charging')) return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
  if (f.includes('nfc')) return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>;
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
};

const PerformanceBar = ({ label, scores, phones }: { label: string, scores: number[], phones: string[] }) => {
  const maxScore = Math.max(...scores);
  
  return (
    <div className="space-y-4 bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl shadow-xl hover:border-white/10 transition-all">
      <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em] mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
        {label}
      </h4>
      <div className="space-y-6">
        {scores.map((score, idx) => {
          const isWinner = score === maxScore && score > 0;
          return (
            <div key={idx} className={`space-y-2 relative p-4 rounded-2xl transition-all ${isWinner ? 'bg-yellow-400/5 border border-yellow-400/30 ring-1 ring-yellow-400/10' : 'bg-transparent'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[10px] font-black uppercase tracking-tight italic ${isWinner ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {phones[idx]}
                </span>
                <div className="flex items-center gap-2">
                  {isWinner && (
                    <span className="bg-yellow-400 text-black text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-tighter animate-pulse">
                      Rekomendasi JagoHP
                    </span>
                  )}
                  <span className={`text-xs font-black ${isWinner ? 'text-yellow-400' : 'text-white'}`}>
                    {score}/10
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${isWinner ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : 'bg-gray-800'}`}
                  style={{ width: `${score * 10}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Compare: React.FC = () => {
  const [phones, setPhones] = useState(['', '']);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addPhoneSlot = () => {
    if (phones.length < 3) setPhones([...phones, '']);
  };

  const updatePhone = (index: number, val: string) => {
    const next = [...phones];
    next[index] = val;
    setPhones(next);
  };

  const handleCompare = async () => {
    const activePhones = phones.filter(p => p.trim() !== '');
    if (activePhones.length < 2) {
      setError('Masukkan minimal 2 HP untuk dibandingkan.');
      return;
    }

    setResult(null);
    setLoading(true);
    setError('');
    try {
      const res = await getComparison(activePhones);
      setResult(res);
    } catch (err) {
      console.error(err);
      setError('Gagal membandingkan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const activePhonesHeader = (index: number, phones: string[]) => {
    const p = phones.filter(x => x.trim() !== '');
    return p[index] || '';
  };

  const parseAnalysis = (text: string) => {
    const cleanedText = text.replace(/\\n/g, ' ').replace(/\n/g, ' ').replace(/\s\s+/g, ' ');
    const sections = cleanedText.split(/KESIMPULAN:|POIN PENTING:/i);
    let pointsRaw = "";
    let conclusion = "";

    if (sections.length >= 3) {
      pointsRaw = sections[1].trim();
      conclusion = sections[2].trim();
    } else if (sections.length === 2) {
      conclusion = sections[1].trim();
    } else {
      conclusion = cleanedText;
    }

    const phonePoints = pointsRaw.split(/(?=\[[A-Z0-9\s]+\]:)/g).filter(p => p.trim());
    return { phonePoints, conclusion };
  };

  const getUnifiedText = (text: string): { header: string; content: string } => {
    const match = text.match(/^(\[[^\]]+\]:)([\s\S]*)$/);
    if (!match) return { header: 'Detail Analysis', content: text.replace(/-/g, '').trim() };
    const header = match[1];
    const content = match[2].replace(/-/g, '').replace(/\s\s+/g, ' ').trim();
    return { header, content };
  };

  const getMetricScores = (metric: keyof typeof result.performanceScores.phone1) => {
    const activePhones = phones.filter(p => p.trim() !== '');
    const s = [result?.performanceScores.phone1[metric], result?.performanceScores.phone2[metric]];
    if (activePhones.length === 3 && result?.performanceScores.phone3) {
      s.push(result.performanceScores.phone3[metric]);
    }
    return s as number[];
  };

  return (
    <div className="max-w-[950px] mx-auto px-4 py-16 space-y-12 pb-32">
      <div className="text-center space-y-4">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic"><span className="text-yellow-400">Com</span>pare</h1>
        <p className="text-gray-400 text-sm md:text-base font-medium italic">Head-to-head spesifikasi biar lo gak salah pilih Smartphone.</p>
      </div>

      {/* Input Section */}
      {!result && !loading && (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="grid md:grid-cols-3 gap-4">
            {phones.map((p, i) => (
              <div key={i} className="space-y-4">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Smartphone {i + 1}</label>
                <input
                  type="text"
                  value={p}
                  onChange={(e) => updatePhone(i, e.target.value)}
                  placeholder="Nama/tipe Smartphone"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3.5 text-xs md:text-sm focus:outline-none focus:border-yellow-400 transition-colors font-bold"
                />
              </div>
            ))}
            {phones.length < 3 && (
              <button
                onClick={addPhoneSlot}
                className="h-[52px] mt-6 border-2 border-dashed border-white/10 rounded-xl text-gray-500 hover:text-white hover:border-white/20 transition-colors font-bold text-[9px] tracking-widest"
              >
                + Tambah HP
              </button>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleCompare}
              disabled={loading}
              className="bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase tracking-[0.15em] text-[10px] hover:bg-yellow-500 transition-all disabled:opacity-50 shadow-xl shadow-yellow-400/10"
            >
              Mulai Bandingkan
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-20 space-y-6 animate-in fade-in duration-500">
          <div className="relative inline-block">
            <div className="w-24 h-24 border-2 border-yellow-400/20 rounded-full animate-ping absolute inset-0" />
            <img src="https://imgur.com/oaPHidZ.jpg" className="w-20 h-20 object-contain relative z-10 animate-pulse" alt="JAGOHP Loading" />
          </div>
          <p className="text-gray-500 text-[10px] font-black tracking-[0.3em]">Mohon Tunggu, AI sedang membedah antar perangkat...</p>
        </div>
      )}

      {error && <p className="text-red-400 text-center font-bold uppercase text-[10px] tracking-widest">{error}</p>}

      {result && !loading && (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => {setResult(null); setPhones(['','']);}}
              className="text-gray-600 hover:text-yellow-400 transition-colors text-[9px] font-black uppercase tracking-widest border-b border-gray-800 pb-1"
            >
              Bandingkan Lainnya
            </button>
          </div>

          {/* Table Data Section */}
          <div className="overflow-x-auto bg-[#0c0c0c] rounded-3xl border border-white/10 p-4 md:p-10 shadow-2xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-6 pr-4 text-gray-600 uppercase tracking-[0.3em] font-black text-[8px] w-[20%]">Parameter Teknis</th>
                  <th className="text-left py-6 px-4 text-white font-black uppercase italic tracking-tighter text-sm md:text-lg min-w-[200px]">{activePhonesHeader(0, phones)}</th>
                  <th className="text-left py-6 px-4 text-white font-black uppercase italic tracking-tighter text-sm md:text-lg min-w-[200px]">{activePhonesHeader(1, phones)}</th>
                  {phones.filter(p=>p.trim()!=='').length === 3 && <th className="text-left py-6 px-4 text-white font-black uppercase italic tracking-tighter text-sm md:text-lg min-w-[200px]">{activePhonesHeader(2, phones)}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {result.tableData.map((row, i) => {
                  const isPriceRow = row.feature.toLowerCase().includes('harga');
                  const isNfcRow = row.feature.toLowerCase().includes('nfc');
                  return (
                    <tr key={i} className={`transition-colors group ${isPriceRow ? 'bg-yellow-400/[0.03]' : 'hover:bg-white/[0.02]'}`}>
                      <td className={`py-6 pr-4 font-black uppercase text-[8px] tracking-[0.2em] transition-colors flex items-start gap-2.5 ${isPriceRow ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                        <div className="mt-[-2px] shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                          <FeatureIcon feature={row.feature} />
                        </div>
                        {row.feature}
                      </td>
                      <td className={`py-6 px-4 font-bold text-[10px] md:text-[14px] leading-relaxed tracking-tight ${isPriceRow ? 'text-white bg-yellow-400/10' : 'text-gray-300'}`}>
                        {row.phone1}
                      </td>
                      <td className={`py-6 px-4 font-bold text-[10px] md:text-[14px] leading-relaxed tracking-tight ${isPriceRow ? 'text-white bg-yellow-400/10' : 'text-gray-300'}`}>
                        {row.phone2}
                      </td>
                      {phones.filter(p=>p.trim()!=='').length === 3 && (
                        <td className={`py-6 px-4 font-bold text-[10px] md:text-[14px] leading-relaxed tracking-tight ${isPriceRow ? 'text-white bg-yellow-400/10' : 'text-gray-300'}`}>
                          {row.phone3}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PERFORMANCE SCORES SECTION */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
               <h3 className="text-xl md:text-2xl font-black uppercase text-white italic tracking-tighter">Skor Performa AI</h3>
               <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <PerformanceBar label="Chipset & Raw Power" scores={getMetricScores('chipset')} phones={phones.filter(p=>p.trim()!=='')} />
              <PerformanceBar label="Multitasking (Memory)" scores={getMetricScores('memory')} phones={phones.filter(p=>p.trim()!=='')} />
              <PerformanceBar label="Photography & Video" scores={getMetricScores('camera')} phones={phones.filter(p=>p.trim()!=='')} />
              <PerformanceBar label="Gaming Experience" scores={getMetricScores('gaming')} phones={phones.filter(p=>p.trim()!=='')} />
              <PerformanceBar label="Battery Endurance" scores={getMetricScores('battery')} phones={phones.filter(p=>p.trim()!=='')} />
              <PerformanceBar label="Charging Speed" scores={getMetricScores('charging')} phones={phones.filter(p=>p.trim()!=='')} />
            </div>
          </div>

          {/* Analysis & Summary */}
          <div className="space-y-10">
            <div className="grid gap-6">
              {parseAnalysis(result.conclusion).phonePoints.map((pointText, idx) => {
                const { header, content } = getUnifiedText(pointText);
                return (
                  <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-white font-black uppercase italic tracking-widest text-xs md:text-sm">{header}</span>
                    </div>
                    <div className="text-gray-400 text-sm md:text-base leading-relaxed italic font-medium text-justify">
                      {content}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-yellow-400 text-black p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-yellow-400/20 border-t-4 border-black/10">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 block mb-3">Rekomendasi Akhir JagoHP</span>
              <p className="text-base md:text-lg font-black italic leading-tight tracking-tighter">
                {result.recommendation}
              </p>
              {parseAnalysis(result.conclusion).conclusion && (
                <p className="mt-6 text-sm md:text-base font-bold opacity-80 border-t border-black/10 pt-6">
                  {parseAnalysis(result.conclusion).conclusion}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-center pb-20">
             <button onClick={() => {setResult(null); setPhones(['','']); window.scrollTo({top:0, behavior:'smooth'})}} className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest border-b border-transparent hover:border-white transition-all pb-1 italic">Reset & Bandingkan Lainnya</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
