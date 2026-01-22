import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBlogPosts, BlogPostExtended } from '../services/blogService';

const NewsCard: React.FC<{ item: BlogPostExtended }> = ({ item }) => {
  return (
    <article className="group flex flex-col md:flex-row bg-gray-50 dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:border-yellow-400/20 shadow-lg theme-transition">
      <div className="w-full md:w-[35%] aspect-video md:aspect-auto overflow-hidden relative shrink-0">
        <Link to={`/blog/${item.slug}`}>
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-4 left-4">
           <span className="bg-yellow-400 text-black text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-xl">{item.category}</span>
        </div>
      </div>
      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
        <div className="space-y-3">
          <Link to={`/blog/${item.slug}`}>
            <h4 className="text-[13px] md:text-[16px] font-black text-black dark:text-white uppercase italic tracking-tighter group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors leading-tight line-clamp-2">
              {item.title}
            </h4>
          </Link>
          <p className="text-gray-500 dark:text-gray-600 text-[11px] leading-relaxed italic line-clamp-2 font-medium">{item.excerpt}</p>
          
          <div className="flex items-center gap-3 pt-1">
            <span className="text-[8px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">
              {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <div className="w-1 h-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            <span className="text-[8px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] flex items-center gap-1.5">
               <svg className="w-3 h-3 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2.5" />
                 <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2.5" />
               </svg>
               {item.views} VIEWS
            </span>
          </div>
        </div>
        
        <div className="pt-4 flex items-center justify-between border-t border-black/5 dark:border-white/5 mt-4">
           <Link to={`/blog/${item.slug}`} className="text-yellow-600 dark:text-yellow-400 text-[9px] font-black uppercase tracking-[0.15em] hover:translate-x-1 transition-transform inline-flex items-center gap-2">Baca Selengkapnya <span>→</span></Link>
           <div className="flex gap-4">
             <button className="text-gray-300 dark:text-gray-700 hover:text-black dark:hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeWidth="2.5"/></svg></button>
             <button className="text-gray-300 dark:text-gray-700 hover:text-black dark:hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeWidth="2.5"/></svg></button>
           </div>
        </div>
      </div>
    </article>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPostExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileSearch, setMobileSearch] = useState('');

  useEffect(() => {
    const fetchLatest = async () => {
      setLoading(true);
      const allPosts = await getBlogPosts(false);
      setPosts(allPosts);
      setLoading(false);
    };
    fetchLatest();
  }, []);

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      navigate(`/blog?q=${encodeURIComponent(mobileSearch.trim())}`);
      setMobileSearch('');
    }
  };

  const headline = posts[0];
  const feed = posts.slice(1, 6);

  return (
    <div className="space-y-0 animate-in fade-in duration-700 theme-transition">
      <div className="p-6 md:p-8 space-y-6">
        {loading ? (
          <div className="py-32 text-center animate-pulse">
            <p className="text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.6em] text-[11px]">Memuat Feed Gadget Terbaru...</p>
          </div>
        ) : (
          <>
            {/* Mobile Search Bar - Visible only on mobile/tablet */}
            <div className="lg:hidden animate-in fade-in slide-in-from-top-4 duration-500">
               <form onSubmit={handleMobileSearch} className="relative group">
                  <input 
                    type="text" 
                    placeholder="Cari artikel gadget..." 
                    value={mobileSearch}
                    onChange={(e) => setMobileSearch(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-12 py-4 text-xs font-bold text-black dark:text-white outline-none focus:border-yellow-400/50 transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-700"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-yellow-400 text-black px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg">Cari</button>
               </form>
            </div>

            {/* Headline Article */}
            {headline && (
              <article className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
                <div className="relative aspect-video rounded-[2rem] overflow-hidden group border border-black/5 dark:border-white/5 shadow-2xl">
                  <img src={headline.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute top-6 left-6">
                     <span className="bg-yellow-400 text-black text-[10px] font-black px-5 py-2 rounded-xl uppercase tracking-widest shadow-2xl">
                       {headline.category}
                     </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                </div>

                <div className="space-y-4 px-2">
                  <Link to={`/blog/${headline.slug}`} className="block group">
                    <h2 className="text-2xl md:text-4xl font-black text-black dark:text-white italic uppercase tracking-tighter leading-[0.95] group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                      {headline.title}
                    </h2>
                  </Link>
                  <p className="text-gray-500 dark:text-gray-500 text-sm md:text-base leading-relaxed italic max-w-[90%] font-medium">
                    {headline.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 pt-1">
                    <div className="flex items-center gap-2.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                       <svg className="w-4 h-4 text-yellow-500/50 dark:text-yellow-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V12a2 2 0 002 2z" strokeWidth="2.5"/>
                       </svg>
                       {new Date(headline.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-900 rounded-full"></div>
                    <div className="flex items-center gap-2.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                       <svg className="w-4 h-4 text-yellow-500/50 dark:text-yellow-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2.5"/>
                         <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2.5"/>
                       </svg>
                       {headline.views} VIEWS
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link to={`/blog/${headline.slug}`} className="text-yellow-600 dark:text-yellow-400 text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] hover:translate-x-1 transition-transform inline-flex items-center gap-2 group/btn">
                      Baca Selengkapnya <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* Regular Feed */}
            <div className="pt-6 space-y-6">
               <div className="flex items-center gap-5">
                 <h3 className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.5em] whitespace-nowrap">ARTIKEL LAINNYA</h3>
                 <div className="h-[1px] flex-1 bg-black/5 dark:bg-white/5"></div>
               </div>
               <div className="grid gap-6">
                 {feed.map((post) => (
                   <NewsCard key={post.id} item={post} />
                 ))}
               </div>

               {/* View All Button */}
               {posts.length > 6 && (
                 <div className="pt-10 flex justify-center">
                   <Link 
                    to="/blog" 
                    className="group bg-yellow-400 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-black hover:text-yellow-400 transition-all flex items-center gap-4 shadow-2xl shadow-yellow-400/20 active:scale-95"
                   >
                     LIHAT SEMUA BLOG
                     <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                   </Link>
                 </div>
               )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;