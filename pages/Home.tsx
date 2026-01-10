
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, BlogPostExtended } from '../services/blogService';

const Home: React.FC = () => {
  const [newsItems, setNewsItems] = useState<BlogPostExtended[]>([]);

  useEffect(() => {
    // Mengambil 3 berita terbaru yang sudah dipublish
    const allPosts = getBlogPosts(false);
    setNewsItems(allPosts.slice(0, 3));
  }, []);

  const features = [
    {
      title: 'Smart Review',
      description: 'Analisis mendalam Smartphone berbasis AI.',
      path: '/review',
      image: 'https://imgur.com/9BTOC0H.jpg',
      accent: 'Review Secara Cepat & Akurat'
    },
    {
      title: 'Compare',
      description: 'Bandingin 2 atau 3 spesifikasi Smartphone secara instan.',
      path: '/compare',
      image: 'https://imgur.com/eHrM8Pd.jpg',
      accent: 'Cek Perbedaan Spesifikasi'
    },
    {
      title: 'Phone Match',
      description: 'Cari Smartphone yang sesuai kebutuhan.',
      path: '/match',
      image: 'https://imgur.com/IATbhwQ.jpg',
      accent: 'Mencari Sesuai Kebutuhan'
    }
  ];

  return (
    <div className="max-w-[900px] mx-auto px-4 pt-4 space-y-12 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-4 pt-4">
        <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic">
          Portal Gadget <span className="text-yellow-400">Smartphone Berbasis AI</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-base max-w-2xl mx-auto leading-relaxed italic">
          Dapatkan review objektif, perbandingan akurat, dan rekomendasi Smartphone terbaik.
        </p>
      </section>

      {/* AI Chatbot CTA Button - Tetap Full Width & Sleek */}
      <section className="animate-in fade-in zoom-in duration-500 w-full">
        <Link 
          to="/chat" 
          className="group relative flex items-center justify-between w-full bg-yellow-400 text-black px-6 py-1 md:py-2 rounded-2xl md:rounded-[1rem] hover:bg-yellow-500 transition-all duration-300 shadow-2xl shadow-yellow-400/20"
        >
          <div className="flex items-center gap-4">
            <div className="bg-black/10 p-2 rounded-full">
              <svg className="w-5 h-5 md:w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-base md:text-base font-black tracking-tight">
              Cari HP apa Kak? Tanya dulu aja sini (~bertanya dengan nada sales)
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity italic">
            DUKUNGAN CHAT 24/7<span>→</span>
          </div>
        </Link>
      </section>

      {/* Main Feature Cards - Menggunakan Image Baru */}
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
                alt={feature.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4">
                <span className="bg-yellow-400 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {feature.accent}
                </span>
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col">
              <h3 className="text-xl font-black uppercase italic group-hover:text-yellow-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-base leading-relaxed flex-1 italic font-medium">
                "{feature.description}"
              </p>
              <div className="pt-2 flex items-center gap-2 text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                Akses Sekarang <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Latest News Section - Only show if data exists */}
      {newsItems.length > 0 && (
        <section className="space-y-8 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-end justify-between border-b border-white/5 pb-2">
            <div className="space-y-1">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Berita Terbaru</h2>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Update informasi teknologi terkini.</p>
            </div>
            <Link to="/blog" className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors border-b border-gray-800 hover:border-white pb-1">Lihat Semua</Link>
          </div>
          
          <div className="grid gap-5">
            {newsItems.map((item) => (
              <Link 
                key={item.id}
                to={`/blog/${item.slug}`}
                className="group flex flex-col md:flex-row bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:border-yellow-400/20 shadow-xl"
              >
                {/* Image Left */}
                <div className="w-full md:w-[28%] aspect-video md:aspect-auto overflow-hidden relative">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                </div>

                {/* Content Right */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-yellow-400 text-black">
                        {item.category}
                      </span>
                    </div>

                    {/* Title & Excerpt */}
                    <div className="space-y-1">
                      <h4 className="text-sm md:text-lg font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-yellow-400 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-[10px] md:text-[11px] leading-relaxed italic line-clamp-1">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/5 border border-white/10 text-white group-hover:bg-yellow-400 text-black group-hover:border-yellow-400 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
                        Baca Selengkapnya
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-[9px] font-black">{item.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="text-[9px] font-black">{item.comments || 0}</span>
                      </div>
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
