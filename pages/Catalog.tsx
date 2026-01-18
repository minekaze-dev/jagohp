
import React, { useState, useEffect, useMemo } from 'react';
import { getAllCatalogItems } from '../services/geminiService';
import { CatalogItem } from '../types';

const CatalogCard: React.FC<{ item: CatalogItem; onOpenDetail: (item: CatalogItem) => void }> = ({ item, onOpenDetail }) => (
  <div className="bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5 p-5 rounded-3xl flex flex-col hover:border-yellow-400/20 transition-all group shadow-xl relative overflow-hidden h-full theme-transition">
    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
    
    <div className="flex-1 flex flex-col gap-4 relative z-10">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-orange-500 text-[8px] font-black uppercase tracking-widest leading-none block">{item.brand}</span>
          <h3 className="text-sm md:text-base font-black text-black dark:text-white uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors leading-tight">{item.name}</h3>
        </div>
        <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded border shrink-0 ${
          item.segment === 'Flagship' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' : 
          item.segment === 'Midrange' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' : 
          'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
        }`}>
          {item.segment}
        </span>
      </div>

      <div className="space-y-2 mt-2">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-[9px] md:text-[10px] font-medium italic">
          <svg className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/></svg>
          <span className="truncate">{item.classification.suitableFor.join(' & ')}</span>
        </div>
        <div className="text-black dark:text-white font-black text-xs md:text-sm tracking-tight">{item.price}</div>
      </div>
    </div>

    <button 
      onClick={() => onOpenDetail(item)}
      className="w-full mt-6 bg-yellow-400 text-black py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-yellow-500 transition-all active:scale-95 shadow-lg shadow-yellow-400/10 relative z-10"
    >
      Detail Katalog
    </button>
  </div>
);

const DetailModal: React.FC<{ item: CatalogItem; onClose: () => void }> = ({ item, onClose }) => {
  const isWaterproof = useMemo(() => {
    const content = `${item.specs.features} ${item.aiNote} ${item.classification.targetAudience} ${item.classification.suitableFor.join(' ')}`.toLowerCase();
    const match = content.match(/ip(67|68|69)/);
    return match ? match[0].toUpperCase() : (content.includes('tahan air') || content.includes('waterproof') ? 'IP RATED' : null);
  }, [item]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 md:p-4 mt-20">
      <div className="absolute inset-0 bg-gray-100/70 dark:bg-black/95 backdrop-blur-2xl theme-transition" onClick={onClose}></div>
      <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 w-full max-w-6xl max-h-[85vh] rounded-[2rem] md:rounded-[3rem] p-5 md:p-8 relative overflow-y-auto custom-scrollbar shadow-[0_0_100px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300 theme-transition">
        
        <div className="flex justify-between items-start mb-6 border-b border-black/5 dark:border-white/5 pb-4 sticky top-0 bg-white dark:bg-[#0a0a0a] z-20 theme-transition">
          <div className="flex items-start gap-3 md:gap-5">
            <div className="bg-yellow-400 text-black w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black italic text-lg md:text-xl shadow-lg shrink-0">
              {item.brand.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                 <span className="text-yellow-500 dark:text-yellow-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">{item.brand}</span>
                 <span className="w-1 h-1 bg-black/10 dark:bg-white/20 rounded-full"></span>
                 <span className="text-gray-400 dark:text-gray-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">{item.year}</span>
                 {isWaterproof && (
                   <span className="ml-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[7px] font-black uppercase px-2 py-0.5 rounded border border-blue-500/20">
                     💧 {isWaterproof}
                   </span>
                 )}
              </div>
              <h2 className="text-base md:text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter leading-tight line-clamp-2 md:line-clamp-none">
                {item.name}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6 pt-1">
            <div className="text-right hidden sm:block">
              <div className="text-[7px] md:text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Estimasi Harga</div>
              <div className="text-sm md:text-lg font-black text-yellow-500 dark:text-yellow-400 leading-none">{item.price}</div>
            </div>
            <button onClick={onClose} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-xl text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div className="sm:hidden mb-6 bg-yellow-400/5 border border-yellow-400/10 p-4 rounded-2xl flex justify-between items-center">
           <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Estimasi Harga</span>
           <span className="text-sm font-black text-yellow-500 dark:text-yellow-400 tracking-tight">{item.price}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          <div className="lg:col-span-1 bg-black/[0.01] dark:bg-white/[0.02] p-5 rounded-[2rem] border border-black/5 dark:border-white/5 theme-transition">
            <h4 className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.3em] mb-4 border-l-2 border-yellow-400 pl-3">Spesifikasi Teknis</h4>
            <div className="grid grid-cols-1 gap-y-2.5">
              {[
                { label: 'Jaringan', val: item.specs.network },
                { label: 'Chipset', val: item.specs.chipset },
                { label: 'RAM/ROM', val: item.specs.ramStorage },
                { label: 'Layar', val: item.specs.screen },
                { label: 'Kamera', val: item.specs.mainCamera },
                { label: 'Selfie', val: item.specs.selfieCamera },
                { label: 'Baterai', val: item.specs.batteryCharging },
                { label: 'OS/Fitur', val: item.specs.features },
              ].map((s, idx) => (
                <div key={idx} className="flex flex-col gap-0.5 border-b border-black/5 dark:border-white/5 pb-1.5 theme-transition">
                  <span className="text-[8px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">{s.label}</span>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 truncate" title={s.val}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
             <div className="bg-yellow-400 text-black p-5 rounded-[2rem] shadow-xl h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Klasifikasi Smart AI</h4>
                  <div className="space-y-3">
                     <div className="space-y-1.5">
                        <span className="text-[9px] font-black uppercase block opacity-40">Kebutuhan:</span>
                        <div className="flex flex-wrap gap-1.5">
                           {item.classification.suitableFor.map((s, i) => (
                             <span key={i} className="bg-black/10 border border-black/10 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase italic">{s}</span>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-1.5 pt-2">
                        <span className="text-[9px] font-black uppercase block opacity-40">Target Pengguna:</span>
                        <p className="text-[11px] font-black italic leading-tight">"{item.classification.targetAudience}"</p>
                     </div>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-black/10">
                   <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                      <span className="text-[8px] font-black uppercase tracking-widest">Kasta: {item.segment} Device</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-1 flex flex-col justify-between space-y-4">
             <div className="bg-gray-50 dark:bg-[#050505] p-5 rounded-[2rem] border border-black/5 dark:border-white/5 flex-1 relative overflow-hidden group theme-transition">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                </div>
                <h4 className="text-[10px] font-black uppercase text-yellow-500 dark:text-yellow-400 tracking-[0.3em] mb-4">JagoHP Insight</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 italic font-medium leading-relaxed text-justify relative z-10">
                  "{item.aiNote}"
                </p>
             </div>
             <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 theme-transition">
                <p className="text-[8px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.3em] text-center leading-relaxed">
                  DATA GENERATED BY JAGOHP 
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Catalog: React.FC = () => {
  const [allItems, setAllItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Harga' | 'Brand' | 'Kebutuhan'>('Brand');
  const [activeFilter, setActiveFilter] = useState('');
  const [activeSubBudget, setActiveSubBudget] = useState('Semua');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  const primaryBrands = [
    'Samsung', 'Xiaomi', 'iPhone', 'Poco', 'IQOO', 
    'Infinix', 'Oppo', 'Vivo', 'Asus', 'Realme', 
    'Itel', 'Tecno', 'Honor', 'Huawei', 'Motorola', 'Red Magic'
  ];

  const filters = {
    Brand: [...primaryBrands, 'Lainnya'],
    Harga: ['1-2 Juta', '2-3 Juta', '3-5 Juta', '5-10 Juta', 'Diatas 10 Juta'],
    Kebutuhan: ['Gaming', 'Harian', 'Fotografi', 'Tahan Air', 'Konten', 'Baterai Awet'],
    SubBudgets: ['Semua', '1-2 Juta', '2-5 Juta', '5-7 Juta', 'Diatas 7 Juta']
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getAllCatalogItems();
        setAllItems(data);
        setActiveFilter(filters.Brand[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    if (!activeFilter) return [];

    const result = allItems.filter(item => {
      if (activeTab === 'Brand') {
        if (activeFilter === 'Lainnya') {
          return !primaryBrands.some(b => item.brand.toLowerCase() === b.toLowerCase());
        }
        return item.name.toLowerCase().includes(activeFilter.toLowerCase()) || 
               item.brand.toLowerCase() === activeFilter.toLowerCase();
      }
      
      if (activeTab === 'Harga') {
        const firstPricePart = item.price.split('-')[0].split('~')[0].split('(')[0].trim();
        const priceNum = parseInt(firstPricePart.replace(/[^0-9]/g, '')) || 0;

        if (activeFilter === '1-2 Juta') return priceNum >= 1000000 && priceNum <= 2000000;
        if (activeFilter === '2-3 Juta') return priceNum > 2000000 && priceNum <= 3000000;
        if (activeFilter === '3-5 Juta') return priceNum > 3000000 && priceNum <= 5000000;
        if (activeFilter === '5-10 Juta') return priceNum > 5000000 && priceNum <= 10000000;
        if (activeFilter === 'Diatas 10 Juta') return priceNum > 10000000;
      }

      if (activeTab === 'Kebutuhan') {
        const search = activeFilter.toLowerCase();
        const contentToSearch = `${item.specs.features} ${item.aiNote} ${item.classification.targetAudience} ${item.classification.suitableFor.join(' ')}`.toLowerCase();
        
        let matchesCategory = false;
        
        if (search === 'tahan air') {
          matchesCategory = contentToSearch.includes('ip68') || contentToSearch.includes('ip67') || contentToSearch.includes('ip69') || contentToSearch.includes('tahan air') || contentToSearch.includes('waterproof');
        } else if (search === 'konten') {
          matchesCategory = contentToSearch.includes('konten') || contentToSearch.includes('creator') || contentToSearch.includes('vlog') || contentToSearch.includes('videografi');
        } else if (search === 'baterai awet') {
          matchesCategory = contentToSearch.includes('baterai awet') || contentToSearch.includes('long battery') || contentToSearch.includes('5000mah') || contentToSearch.includes('6000mah');
        } else if (search === 'gaming') {
          matchesCategory = contentToSearch.includes('gaming') || item.segment === 'Flagship' || contentToSearch.includes('performance');
        } else {
          matchesCategory = contentToSearch.includes(search);
        }

        if (!matchesCategory) return false;

        if (activeSubBudget !== 'Semua') {
          const firstPricePart = item.price.split('-')[0].split('~')[0].split('(')[0].trim();
          const priceNum = parseInt(firstPricePart.replace(/[^0-9]/g, '')) || 0;
          if (activeSubBudget === '1-2 Juta') return priceNum >= 1000000 && priceNum <= 2000000;
          if (activeSubBudget === '2-5 Juta') return priceNum > 2000000 && priceNum <= 5000000;
          if (activeSubBudget === '5-7 Juta') return priceNum > 5000000 && priceNum <= 7000000;
          if (activeSubBudget === 'Diatas 7 Juta') return priceNum > 7000000;
        }

        return true;
      }
      return false;
    });

    return result.sort((a, b) => {
      const monthOrder: Record<string, number> = {
        'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5,
        'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11
      };

      const parseDate = (raw: string) => {
        const parts = raw.toLowerCase().split(' ');
        const year = parseInt(parts.find(p => p.match(/^\d{4}$/)) || '0');
        const monthName = parts.find(p => monthOrder[p] !== undefined);
        const month = monthName ? monthOrder[monthName] : 0;
        return { year, month };
      };

      const dateA = parseDate(a.releaseDateRaw);
      const dateB = parseDate(b.releaseDateRaw);

      if (dateB.year !== dateA.year) return dateB.year - dateA.year;
      return dateB.month - dateA.month;
    });
  }, [allItems, activeTab, activeFilter, activeSubBudget]);

  const renderFilterButton = (f: string, isActive: boolean, onClick: () => void) => (
    <button
      key={f}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
        isActive ? 'bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/20 text-yellow-500 dark:text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.1)]' : 'bg-transparent border-black/5 dark:border-white/5 text-gray-400 dark:text-gray-600 hover:border-black/10 dark:hover:border-white/10 hover:text-black dark:hover:text-gray-400'
      }`}
    >
      {f}
    </button>
  );

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-16 space-y-12 pb-32 theme-transition">
      <div className="text-center space-y-4">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic text-black dark:text-white leading-none">
          <span className="text-yellow-500 dark:text-yellow-400">Kata</span>log
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium italic">
          Katalog cerdas yang dirangkum AI berdasarkan kategori brand, harga atau kebutuhan. 
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/5 dark:border-white/10 theme-transition">
           {['Brand', 'Harga'].map((tab) => (
             <button
               key={tab}
               onClick={() => {
                 setActiveTab(tab as any);
                 setActiveFilter(filters[tab as keyof typeof filters][0]);
                 setActiveSubBudget('Semua');
               }}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 activeTab === tab ? 'bg-yellow-400 text-black shadow-lg' : 'text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>

        <div className="w-full flex flex-col items-center gap-4">
          {activeTab === 'Brand' ? (
            <div className="flex flex-col items-center gap-2 w-full animate-in fade-in duration-500">
              <div className="flex flex-wrap justify-center gap-2">
                {filters.Brand.slice(0, 9).map(f => 
                  renderFilterButton(f, activeFilter === f, () => {
                    setActiveFilter(f);
                    setActiveSubBudget('Semua');
                  })
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {filters.Brand.slice(9).map(f => 
                  renderFilterButton(f, activeFilter === f, () => {
                    setActiveFilter(f);
                    setActiveSubBudget('Semua');
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2 animate-in fade-in duration-500">
              {filters[activeTab as keyof typeof filters]?.map(f => 
                renderFilterButton(f, activeFilter === f, () => {
                  setActiveFilter(f);
                  setActiveSubBudget('Semua');
                })
              )}
            </div>
          )}

          {activeTab === 'Kebutuhan' && activeFilter && (
            <div className="flex flex-col items-center gap-3 pt-4 border-t border-black/5 dark:border-white/5 w-full max-w-lg theme-transition">
              <span className="text-[8px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.4em]">Filter Budget {activeFilter}</span>
              <div className="flex flex-wrap justify-center gap-2">
                {filters.SubBudgets.map(b => 
                  renderFilterButton(b, activeSubBudget === b, () => setActiveSubBudget(b))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse space-y-6">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.4em] text-[10px]">Memindai Database Smart Review...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredItems.map((item, idx) => (
            <CatalogCard key={`${item.name}-${idx}`} item={item} onOpenDetail={setSelectedItem} />
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-[3rem] space-y-4 theme-transition">
              <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto theme-transition">
                 <svg className="w-8 h-8 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <p className="text-gray-400 dark:text-gray-600 font-black uppercase text-[10px] tracking-[0.5em] italic">Data Belum Tersedia di Database</p>
              <p className="text-gray-400 dark:text-gray-700 text-[10px] max-w-xs mx-auto italic">Silakan ulas di "Smart Review" pada HP incaran lo agar datanya masuk ke katalog.</p>
            </div>
          )}
        </div>
      )}

      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
};

export default Catalog;
