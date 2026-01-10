
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, BlogPostExtended } from '../services/blogService';

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
      description: 'Analisis mendalam Smartphone berbasis AI.',
      path: '/review',
      image: 'https://imgur.com/9BTOC0H.jpg',
      accent: 'Mengulas secara cepat & akurat'
    },
    {
      title: 'Compare',
      description: 'Bandingkan spesifikasi Smartphone secara instan.',
      path: '/compare',
      image: 'https://imgur.com/eHrM8Pd.jpg',
      accent: 'Cek perbedaan spesifikasi'
    },
    {
      title: 'Phone Match',
      description: 'Cari Smartphone yang sesuai kebutuhan.',
      path: '/match',
      image: 'https://imgur.com/IATbhwQ.jpg',
      accent: 'Mencari yang sesuai kebutuhan'
    }
  ];

  return (
    <div className="max-w-[900px] mx-auto px-4 pt-4 space-y-10 pb-20">
      <section className="text-center space-y-4 pt-4">
        <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic">
          #1 Portal Gadget <span className="text-yellow-400">Smartphone Berbasis AI</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-base max-w-2xl mx-auto leading-relaxed italic">
          Dapatkan review objektif dan rekomendasi Smartphone terbaik disini.
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
              <div className="bg-black/10 p-2.5 rounded-full">
              <svg className="w-5 h-5 md:w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
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
              <img src={feature.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Berita Gadget <span className="text-yellow-400">Terbaru</span></h2>
            <Link to="/blog" className="text-gray-500 text-[10px] font-black uppercase hover:text-white border-b border-gray-800 pb-1">Lihat Semua</Link>
          </div>
          
          <div className="grid gap-5">
            {newsItems.map((item) => (
              <Link 
                key={item.id}
                to={`/blog/${item.slug}`}
                className="group flex flex-col md:flex-row bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:border-yellow-400/20 shadow-xl"
              >
                <div className="w-full md:w-[28%] aspect-video md:aspect-auto overflow-hidden relative">
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded bg-yellow-400 text-black inline-block">{item.category}</span>
                    <h4 className="text-sm md:text-lg font-black text-white uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors line-clamp-1">{item.title}</h4>
                    <p className="text-gray-600 text-[11px] leading-relaxed italic line-clamp-1">{item.excerpt}</p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-gray-700 text-[9px] font-black uppercase tracking-widest">
                     <span>BACA SELENGKAPNYA →</span>
                     <div className="flex gap-3">
                        <span>{item.views} Dilihat</span>
                        <span>{item.comments} Komentar</span>
                     </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
