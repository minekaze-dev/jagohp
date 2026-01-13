
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, BlogPostExtended } from '../services/blogService';

const NewsCard: React.FC<{ item: BlogPostExtended }> = ({ item }) => {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  
  const shareUrl = `${window.location.origin}/#/blog/${item.slug}`;
  const shareText = encodeURIComponent(`${item.title}\nBaca selengkapnya di JAGOHP: `);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShare(false);
      }
    };
    if (showShare) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShare]);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowShare(false);
    }, 1500);
  };

  return (
    <article className="group flex flex-col md:flex-row bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:border-yellow-400/20 shadow-xl">
      <div className="w-full md:w-[28%] aspect-video md:aspect-auto overflow-hidden relative">
        <Link to={`/blog/${item.slug}`}>
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
      </div>
      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded bg-yellow-400 text-black inline-block">{item.category}</span>
            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">
              {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <Link to={`/blog/${item.slug}`}>
            <h4 className="text-sm md:text-base font-black text-white uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
              {item.title}
            </h4>
          </Link>
          <p className="text-gray-600 text-[11px] leading-relaxed italic line-clamp-1">{item.excerpt}</p>
        </div>

        <div className="pt-4 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link 
              to={`/blog/${item.slug}`} 
              className="bg-yellow-400 text-black px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all active:scale-95 shadow-lg shadow-yellow-400/10 whitespace-nowrap"
            >
              Baca Selengkapnya
            </Link>

            <div className="relative" ref={shareMenuRef}>
              <button 
                onClick={() => setShowShare(!showShare)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all active:scale-90 ${showShare ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>

              {showShare && (
                <div className="absolute bottom-full mb-2 left-0 bg-neutral-900/95 backdrop-blur-xl border border-white/10 p-1.5 rounded-xl flex gap-1.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                  <a 
                    href={`https://wa.me/?text=${shareText}${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72 0.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </a>
                  <button 
                    onClick={handleCopy}
                    className={`w-8 h-8 flex items-center justify-center border rounded-lg transition-all ${copied ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                  >
                    {copied ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 text-gray-700 text-[8px] md:text-[9px] font-black uppercase tracking-widest border-t xs:border-t-0 border-white/5 pt-3 xs:pt-0 w-full xs:w-auto">
            <span className="flex items-center gap-1.5"><svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg> {item.views} <span className="hidden xs:inline">Dilihat</span></span>
            <span className="flex items-center gap-1.5"><svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg> {item.comments} <span className="hidden xs:inline">Komentar</span></span>
          </div>
        </div>
      </div>
    </article>
  );
};

const Home: React.FC = () => {
  const [newsItems, setNewsItems] = useState<BlogPostExtended[]>([]);

  useEffect(() => {
    const fetchLatest = async () => {
      const allPosts = await getBlogPosts(false);
      setNewsItems(allPosts.slice(0, 3));
    };
    fetchLatest();
  }, []);

  const features = [
    {
      title: 'Smart Review',
      description: 'Mengulas HP secara mendalam.',
      path: '/review',
      image: 'https://imgur.com/9BTOC0H.jpg',
      accent: 'Mengulas secara cepat & akurat'
    },
    {
      title: 'Compare',
      description: 'Bandingkan spesifikasi HP.',
      path: '/compare',
      image: 'https://imgur.com/eHrM8Pd.jpg',
      accent: 'Cek perbedaan spesifikasi'
    },
    {
      title: 'Phone Match',
      description: 'Cari HP yang sesuai kebutuhan.',
      path: '/match',
      image: 'https://imgur.com/IATbhwQ.jpg',
      accent: 'Mencari yang sesuai kebutuhan'
    }
  ];

  return (
    <div className="max-w-[900px] mx-auto px-4 pt-4 space-y-10 pb-20">
      <section className="text-center space-y-4 pt-4">
        <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic">
          Platform Rekomendasi<span className="text-yellow-400"> HP Berbasis AI</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-base max-w-2xl mx-auto leading-relaxed italic">
          Dapatkan review objektif dan rekomendasi HP terbaik disini.
        </p>
      </section>

      {/* Hero Action Buttons Section */}
      <section className="animate-in fade-in zoom-in duration-500 w-full">
        <div className="w-full">
          {/* Tombol Chatbot (Lebar Penuh) */}
          <Link 
            to="/chat" 
            className="w-full group relative flex items-center justify-between bg-yellow-400 text-black px-6 py-0.5 rounded-[2.5rem] hover:bg-yellow-500 transition-all duration-300 shadow-2xl shadow-yellow-400/10"
          >
            <div className="flex items-center gap-4">
              <div className="bg-black/10 p-2 md:p-2.5 rounded-full">
                <img src="https://imgur.com/d3OzP78.jpg" className="w-5 h-5 md:w-7 h-7 object-contain rounded-lg" alt="JAGOBOT" />
              </div>
              <span className="text-sm md:text-sm font-black tracking-tight italic">Cari HP apa Kak? Tanya dulu aja sini</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
              DUKUNGAN CHAT 24/7<span>→</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <Link 
            key={idx} 
            to={feature.path}
            className="group relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-yellow-400/30 transition-all duration-300 flex flex-col shadow-2xl"
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img 
                src={feature.image} 
                alt="" 
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="bg-yellow-400 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase">{feature.accent}</span>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-black uppercase italic group-hover:text-yellow-400 transition-colors">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed italic">"{feature.description}"</p>
            </div>
          </Link>
        ))}
      </section>

      {newsItems.length > 0 && (
        <section className="space-y-8 pt-0">
          <div className="flex items-end justify-between border-b border-white/5 pb-2">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Berita <span className="text-yellow-400">Terbaru</span></h2>
            <Link to="/blog" className="text-gray-500 text-[10px] font-black uppercase hover:text-white border-b border-gray-800 pb-1">Lihat Semua</Link>
          </div>
          
          <div className="grid gap-5">
            {newsItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
