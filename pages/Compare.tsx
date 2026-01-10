
import React, { useState } from 'react';
import { getComparison } from '../services/geminiService';
import { ComparisonResult } from '../types';

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

  return (
    <div className="max-w-[900px] mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic"><span className="text-yellow-400">Com</span>pare</h1>
        <p className="text-gray-400 text-base md:text-base font-medium italic">Head-to-head spesifikasi biar lo gak salah pilih Smartphone.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {phones.map((p, i) => (
          <div key={i} className="space-y-4">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Smartphone {i + 1}</label>
            <input
              type="text"
              value={p}
              onChange={(e) => updatePhone(i, e.target.value)}
              placeholder="Tuliskan nama/tipe Smartphone"
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
          {loading ? 'Processing...' : 'Compare'}
        </button>
      </div>

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
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="overflow-x-auto bg-[#0c0c0c] rounded-3xl border border-white/10 p-5 md:p-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-5 pr-4 text-gray-600 uppercase tracking-[0.3em] font-black text-[8px] w-1/4">Fitur</th>
                  <th className="text-left py-5 px-4 text-white font-black uppercase italic tracking-tighter text-sm md:text-base">{activePhonesHeader(0, phones)}</th>
                  <th className="text-left py-5 px-4 text-white font-black uppercase italic tracking-tighter text-sm md:text-base">{activePhonesHeader(1, phones)}</th>
                  {phones[2] && <th className="text-left py-5 px-4 text-white font-black uppercase italic tracking-tighter text-sm md:text-base">{activePhonesHeader(2, phones)}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {result.tableData.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="py-5 pr-4 font-black text-gray-500 group-hover:text-gray-300 transition-colors uppercase text-[8px] tracking-[0.2em]">{row.feature}</td>
                    <td className="py-5 px-4 font-bold text-yellow-400 text-[10px] md:text-[13px] tracking-tight">
                      {row.phone1}
                    </td>
                    <td className="py-5 px-4 font-bold text-yellow-400 text-[10px] md:text-[13px] tracking-tight">
                      {row.phone2}
                    </td>
                    {phones[2] && (
                      <td className="py-5 px-4 font-bold text-yellow-400 text-[10px] md:text-[13px] tracking-tight">
                        {row.phone3}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="h-[1px] flex-1 bg-white/10"></div>
               <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em] whitespace-nowrap">Analisis Head-to-Head</h3>
               <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>

            <div className="grid gap-6">
              {parseAnalysis(result.conclusion).phonePoints.map((pointText, idx) => {
                const { header, content } = getUnifiedText(pointText);
                return (
                  <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-black uppercase italic tracking-widest text-xs md:text-sm">{header}</span>
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm md:text-base leading-relaxed italic font-medium text-justify">
                      {content}
                    </div>
                  </div>
                );
              })}
            </div>

            {parseAnalysis(result.conclusion).conclusion && (
              <div className="bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-white/10 space-y-6 shadow-2xl relative overflow-hidden text-center md:text-left">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14H15.017C13.9124 14 13.017 13.1046 13.017 12V6C13.017 4.89543 13.9124 4 15.017 4H21.017C22.1216 4 23.017 4.89543 23.017 6V12C23.017 13.1046 22.1216 14 21.017 14V16C21.017 18.7614 18.7784 21 16.017 21H14.017ZM1.017 21L1.017 18C1.017 16.8954 1.91243 16 3.017 16H6.017V14H2.017C0.91243 14 0.017 13.1046 0.017 12V6C0.017 4.89543 0.91243 4 2.017 4H8.017C9.12157 4 10.017 4.89543 10.017 6V12C10.017 13.1046 9.12157 14 8.017 14V16C8.017 18.7614 5.77843 21 3.017 21H1.017Z"/></svg>
                </div>
                <h4 className="text-[10px] font-black uppercase text-yellow-400 tracking-[0.5em]">Kesimpulan Akhir</h4>
                <div className="text-white text-sm md:text-lg leading-snug font-black tracking-tight italic text-justify relative z-10">
                  {parseAnalysis(result.conclusion).conclusion}
                </div>
              </div>
            )}

            <div className="bg-yellow-400 text-black p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-yellow-400/20 border-t-4 border-black/10">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 block mb-3">Rekomendasi Terbaik JagoHP</span>
              <p className="text-base md:text-lg font-black italic leading-tight tracking-tighter">
                {result.recommendation}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center pb-20">
             <button onClick={() => {setResult(null); setPhones(['','']); window.scrollTo({top:0, behavior:'smooth'})}} className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest border-b border-transparent hover:border-white transition-all pb-1">Reset Perbandingan</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
