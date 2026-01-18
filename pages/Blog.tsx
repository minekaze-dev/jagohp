
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, BlogPostExtended } from '../services/blogService';

const BlogCard: React.FC<{ post: BlogPostExtended }> = ({ post }) => {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  
  const shareUrl = `${window.location.origin}/#/blog/${post.slug}`;
  const shareText = encodeURIComponent(`${post.title}\nBaca selengkapnya di JAGOHP: `);

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
    <article className="group bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-[2rem] overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:border-yellow-400/20 shadow-2xl theme-transition">
      <div className="w-full md:w-[35%] aspect-video md:aspect-auto overflow-hidden relative">
        <Link to={`/blog/${post.slug}`} className="block w-full h-full">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none"></div>
      </div>

      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-yellow-400 text-black">
              {post.category}
            </span>
            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
              {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="space-y-2">
            <Link to={`/blog/${post.slug}`}>
              <h2 className="text-lg md:text-xl font-black text-black dark:text-white uppercase italic tracking-tighter leading-tight group-hover:text-yellow-400 transition-colors">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-500 dark:text-gray-500 text-[11px] md:text-xs leading-relaxed line-clamp-2 md:line-clamp-3 italic font-medium">
              {post.excerpt}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-black/5 dark:border-white/5 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link to={`/blog/${post.slug}`} className="bg-transparent border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-yellow-400 hover:text-black hover:border-yellow-400 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap">
              Baca Selengkapnya
            </Link>
            
            <div className="relative" ref={shareMenuRef}>
              <button 
                onClick={(e) => { e.preventDefault(); setShowShare(!showShare); }}
                className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all active:scale-90 ${showShare ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-400 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>

              {showShare && (
                <div className="absolute bottom-full mb-3 left-0 bg-white dark:bg-neutral-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 p-2 rounded-2xl flex gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                  <a 
                    href={`https://wa.me/?text=${shareText}${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="WhatsApp"
                    className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72 0.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </a>
                  <button 
                    onClick={handleCopy}
                    className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all ${copied ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-400 hover:text-black dark:hover:text-white'}`}
                  >
                    {copied ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-400 dark:text-gray-600 border-t xs:border-t-0 border-black/5 dark:border-white/5 pt-3 xs:pt-0 w-full xs:w-auto theme-transition">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-[10px] font-bold">{post.views}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="text-[10px] font-bold">{post.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostExtended[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getBlogPosts(false);
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-16 space-y-12 pb-32 theme-transition">
      <div className="space-y-3 text-center md:text-left">
        <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic mb-2">
          Update Mingguan
        </div>
        <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-black dark:text-white">
          Blog & <span className="text-yellow-400">Berita</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium italic">
          Informasi, wawasan dan tips mendalam seputar dunia HP.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse">
          <p className="text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest italic">Menarik berita terbaru...</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {posts.length > 0 ? (
            posts.map(post => <BlogCard key={post.id} post={post} />)
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-400 dark:text-gray-600 text-[10px] md:text-xs font-black uppercase tracking-widest italic">Belum ada berita dipublikasikan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
