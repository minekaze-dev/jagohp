
import React, { useState, useRef } from 'react';
import { getMatch } from '../services/geminiService';
import { RecommendationResponse, RecommendedPhone } from '../types';

// Component for rendering individual specification cards
const SpecCard = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="bg-[#151515] p-2 md:p-2.5 rounded-xl flex items-center gap-2.5 border border-white/5 shadow-2xl">
    <div className="bg-black w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10">
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-3.5 h-3.5 text-yellow-500" }) : icon}
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-orange-500 text-[6px] md:text-[7px] font-black uppercase tracking-wider mb-0.5">{label}</span>
      <span className="text-white text-[9px] md:text-[11px] font-bold truncate leading-tight" title={value}>{value}</span>
    </div>
  </div>
);

const PhoneMatch: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allPhones, setAllPhones] = useState<RecommendedPhone[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [error, setError] = useState('');
  
  // Refs for scrolling
  const resultRef = useRef<HTMLDivElement>(null);

  // Form States
  const [activities, setActivities] = useState<string[]>([]);
  const [cameraPrio, setCameraPrio] = useState(2); // Default to "Biasa" (middle)
  const [budget, setBudget] = useState('3 Jutaan');
  const [extra, setExtra] = useState('');

  const activityOptions = [
    'Sosial Media & Browsing', 'Gaming Berat',
    'Fotografi & Videografi', 'Baterai Tahan Lama',
    'Layar Super Mulus (120Hz+)', 'Butuh NFC',
    'RAM 8GB atau Lebih', 'Storage Besar'
  ];

  const cameraLabels = ["Gak Penting", "Biasa Aja", "Penting"];

  const budgetOptions = [
    '1 Jutaan',
    '2 Jutaan',
    '3 Jutaan',
    '4 Jutaan',
    '5-7 Jutaan',
    '7-10 Jutaan',
    'Diatas 10 Juta'
  ];

  const toggleActivity = (act: string) => {
    setActivities(prev => 
      prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act]
    );
  };

  const handleSearch = async () => {
    if (activities.length === 0) {
      alert("Pilih minimal satu aktivitas Kak!");
      return;
    }

    setLoading(true);
    setAllPhones([]);
    setActiveIndex(0);
    setError('');
    
    try {
      const res = await getMatch({
        activities,
        cameraPrio: cameraLabels[cameraPrio - 1],
        budget,
        extra
      });
      
      if (res && res.primary) {
        // Menggabungkan semua HP ke dalam satu array untuk memudahkan penukaran (swapping)
        const combined = [res.primary, ...(res.alternatives || [])];
        setAllPhones(combined);
        // Scroll ke hasil setelah state update
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setError('Maaf, AI tidak menemukan HP yang cocok. Coba ubah kriteria budget atau aktivitas.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kendala saat menghubungi AI. Coba lagi ya Kak.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAllPhones([]);
    setActiveIndex(0);
    setActivities([]);
    setCameraPrio(2);
    setBudget('3 Jutaan');
    setExtra('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeRecommendation = allPhones[activeIndex];
  const otherOptions = allPhones.filter((_, idx) => idx !== activeIndex);

  return (
    <div className="max-w-[1000px] mx-auto px-4 pt-16 pb-10 md:py-16">
      <div className="space-y-8 mb-12">
        <div className="text-center space-y-4">
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic text-white leading-none">
            <span className="text-yellow-400">Phone</span> Match
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium italic">
            Cari Smartphone terbaik sesuai kebutuhan lo.
          </p>
        </div>

        {/* Input Section - Disembunyikan jika result sudah ada */}
        {allPhones.length === 0 && !loading && (
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden group animate-in fade-in duration-500">
            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
                
                <div className="space-y-10">
                  <section className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-500 border-l-4 border-yellow-400 pl-4">1. Apa aktivitas lo?</h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {activityOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => toggleActivity(opt)}
                          className={`text-left p-2.5 md:p-3.5 rounded-xl border transition-all text-[9px] md:text-[10px] font-bold uppercase tracking-tight leading-tight flex items-center gap-2.5 ${
                            activities.includes(opt) 
                            ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/20' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          <div className={`w-2.5 h-2.5 rounded-full border shrink-0 transition-all ${activities.includes(opt) ? 'bg-black border-black scale-110' : 'border-gray-700'}`}></div>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-8">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-500 border-l-4 border-yellow-400 pl-4">2. Pentingnya Kamera?</h3>
                    <div className="px-1">
                      <div className="relative h-14">
                        <input 
                          type="range" 
                          min="1" 
                          max="3" 
                          step="1"
                          value={cameraPrio}
                          onChange={(e) => setCameraPrio(parseInt(e.target.value))}
                          className="absolute w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400 z-20 top-0"
                        />
                        <div className="absolute top-7 left-0 right-0 h-6">
                          {cameraLabels.map((label, idx) => {
                            const isActive = cameraPrio === idx + 1;
                            const position = (idx / (cameraLabels.length - 1)) * 100;
                            return (
                              <span 
                                key={label} 
                                className={`absolute top-0 transition-all duration-300 text-[8px] md:text-[9px] font-black uppercase tracking-widest whitespace-nowrap
                                  ${isActive ? 'text-yellow-400 scale-110' : 'text-gray-700'}
                                  ${idx === 0 ? 'left-0' : idx === cameraLabels.length - 1 ? 'right-0' : ''}
                                `}
                                style={idx !== 0 && idx !== cameraLabels.length - 1 ? { left: `${position}%`, transform: 'translateX(-50%)' } : {}}
                              >
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="space-y-10 flex flex-col h-full">
                  <section className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-500 border-l-4 border-yellow-400 pl-4">3. Budget Maksimal?</h3>
                    <div className="relative">
                      <select 
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[11px] md:text-xs font-black uppercase tracking-widest focus:outline-none focus:border-yellow-400 appearance-none text-white cursor-pointer shadow-inner"
                      >
                        {budgetOptions.map(opt => (
                          <option key={opt} value={opt} className="bg-neutral-900">{opt}</option>
                        ))}
                      </select>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-500 border-l-4 border-yellow-400 pl-4">4. Preferensi Lain?</h3>
                    <input
                      type="text"
                      value={extra}
                      onChange={(e) => setExtra(e.target.value)}
                      placeholder="Contoh: Harus ada charger..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[11px] md:text-xs font-bold focus:outline-none focus:border-yellow-400 text-white placeholder:text-gray-700 shadow-inner"
                    />
                  </section>

                  <div className="pt-2 mt-auto">
                    <button
                      onClick={handleSearch}
                      disabled={loading}
                      className="w-full bg-yellow-400 text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-yellow-500 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-yellow-400/30 active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cari The Perfect Match
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div ref={resultRef} className="scroll-mt-24"></div>

      {loading && (
        <div className="text-center py-20 space-y-8 animate-in fade-in duration-500 border-t border-white/5">
          <div className="relative inline-block">
            <div className="w-24 h-24 border-2 border-yellow-400/20 rounded-full animate-ping absolute inset-0" />
            <img src="https://imgur.com/oaPHidZ.jpg" className="w-20 h-20 object-contain relative z-10 animate-pulse" alt="JAGOHP Loading" />
          </div>
          <p className="text-gray-500 text-[10px] font-black tracking-[0.5em]">Mohon Tunggu, AI sedang mencarikan spek tercocok...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 bg-red-500/10 border border-red-500/20 rounded-3xl animate-in fade-in duration-500">
           <p className="text-red-500 font-bold uppercase text-[10px] tracking-widest">{error}</p>
        </div>
      )}

      {allPhones.length > 0 && activeRecommendation && !loading && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pt-10 border-t border-white/5">
          {/* Header Action */}
          <div className="flex justify-end">
            <button 
              onClick={() => {setAllPhones([]);}}
              className="text-gray-600 hover:text-yellow-400 transition-colors text-[9px] font-black uppercase tracking-widest border-b border-gray-800 pb-1"
            >
              Ubah Preferensi
            </button>
          </div>

          {/* Main Selected Card */}
          <div className="bg-yellow-400 text-black p-6 md:p-8 rounded-[2rem] space-y-6 shadow-2xl shadow-yellow-400/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="relative z-10 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">Pilihan Aktif</span>
                <span className="bg-black text-white text-[7px] px-2.5 py-1 rounded-full font-black tracking-widest uppercase shadow-lg">
                  {activeIndex === 0 ? 'BEST MATCH' : 'ALTERNATE VIEW'}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-[0.9]">{activeRecommendation.name}</h2>
              <p className="text-[10px] md:text-[13px] leading-tight font-black italic pt-1.5 border-t border-black/10">"{activeRecommendation.reason}"</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 relative z-10">
              <SpecCard label="CHIPSET" value={activeRecommendation.specs.processor} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M11 15h2v2h-2v-2m0-8h2v6h-2V7m1-5C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z"/></svg>} />
              <SpecCard label="CAMERA" value={activeRecommendation.specs.cameraSummary} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h3l2-2h6l2 2h3c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2m8 3c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5m0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3Z"/></svg>} />
              <SpecCard label="SCREEN" value={activeRecommendation.specs.screen} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2m0 18H7V5h10v14Z"/></svg>} />
              <SpecCard label="MEMORY" value={activeRecommendation.specs.ram} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9m0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7Z"/></svg>} />
              <SpecCard label="STORAGE" value={activeRecommendation.specs.storage} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M18 2H10L4 8v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M9 4v4H6l3-4m9 16H6V9h4c1.1 0 2-.9 2-2V4h6v16Z"/></svg>} />
              <SpecCard label="BATTERY" value={activeRecommendation.specs.battery} icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M16.67 4H15V2H9v2H7.33C6.6 4 6 4.6 6 5.33v15.33C6 21.4 6.6 22 7.33 22h9.33c.74 0 1.34-.6 1.34-1.33V5.33C18 4.6 17.4 4 16.67 4M15 20H9V6h6v14Z"/></svg>} />
            </div>

            <div className="flex flex-wrap gap-6 md:gap-10 pt-6 border-t border-black/10 relative z-10">
              <div className="space-y-0.5">
                <div className="text-[7px] md:text-[8px] font-black opacity-40 uppercase tracking-[0.3em]">EST. ANTUTU</div>
                <div className="text-lg md:text-xl font-black italic tracking-tighter">{activeRecommendation.performance.antutu}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[7px] md:text-[8px] font-black opacity-40 uppercase tracking-[0.3em]">DXOMARK</div>
                <div className="text-lg md:text-xl font-black italic tracking-tighter">{activeRecommendation.camera.score}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[7px] md:text-[8px] font-black opacity-40 uppercase tracking-[0.3em]">EST. HARGA</div>
                <div className="text-lg md:text-xl font-black italic tracking-tighter text-black">{activeRecommendation.price}</div>
              </div>
            </div>
          </div>

          {/* Alternatives List */}
          {otherOptions.length > 0 && (
            <div className="space-y-5">
              <h3 className="text-[9px] font-black uppercase text-gray-500 tracking-[0.5em] pl-4 italic">Opsi Rekomendasi Lainnya</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {allPhones.map((phone, i) => (
                  // Render opsi yang tidak aktif sebagai alternatif
                  i !== activeIndex && (
                    <button 
                      key={i} 
                      onClick={() => {
                        setActiveIndex(i);
                        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="p-6 text-left rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-yellow-400/50 transition-all group space-y-4 shadow-2xl backdrop-blur-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-[8px] font-black uppercase tracking-widest border-l-2 pl-2 ${i === 0 ? 'text-yellow-400 border-yellow-400' : 'text-gray-600 border-white/20'}`}>
                          {i === 0 ? 'Pilihan Utama' : 'Alternatif'}
                        </span>
                        <div className="bg-yellow-400/10 text-yellow-400 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                          Klik Detail
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors leading-none">{phone.name}</h4>
                        <p className="text-[10px] md:text-[11px] text-gray-500 leading-relaxed line-clamp-2 italic font-medium">"{phone.reason}"</p>
                      </div>
                    </button>
                  )
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center pt-10 pb-20">
            <button onClick={reset} className="text-gray-600 hover:text-yellow-400 font-black text-[10px] uppercase tracking-[0.6em] border-b-2 border-transparent hover:border-yellow-400 transition-all pb-2 italic">
              Reset & Cari Ulang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneMatch;
