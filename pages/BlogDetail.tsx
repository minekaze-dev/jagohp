
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogPostBySlug, BlogPostExtended, getCommentsByPostId, saveComment, deleteComment } from '../services/blogService';
import { BlogComment } from '../types';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostExtended | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [guestId, setGuestId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [newAuthor, setNewAuthor] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem('admin_token') === 'granted');

    let storedId = localStorage.getItem('jagohp_guest_id');
    if (!storedId) {
      storedId = 'guest_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('jagohp_guest_id', storedId);
    }
    setGuestId(storedId);

    const fetchData = async () => {
      const targetSlug = slug?.trim();
      if (!targetSlug) return;
      
      setLoading(true);
      window.scrollTo(0, 0);
      
      try {
        const data = await getBlogPostBySlug(targetSlug);
        if (data) {
          setPost(data);
          const comms = await getCommentsByPostId(data.id);
          setComments(comms);
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error("Gagal memuat detail artikel:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !newAuthor.trim() || !newContent.trim()) return;

    const lastCommentTime = localStorage.getItem('last_comment_timestamp');
    const now = Date.now();
    if (lastCommentTime && now - parseInt(lastCommentTime) < 30000) {
      setCooldown(Math.ceil((30000 - (now - parseInt(lastCommentTime))) / 1000));
      return;
    }

    setIsSubmitting(true);
    try {
      await saveComment({
        postId: post.id,
        author: newAuthor,
        authorId: guestId,
        content: newContent
      });

      const updatedComments = await getCommentsByPostId(post.id);
      setComments(updatedComments);
      setNewAuthor('');
      setNewContent('');
      localStorage.setItem('last_comment_timestamp', Date.now().toString());
    } catch (err) {
      alert("Gagal mengirim komentar. Coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (window.confirm('Hapus komentar ini?')) {
      await deleteComment(id);
      setComments(comments.filter(c => c.id !== id));
    }
  };

  if (loading) return (
    <div className="min-h-screen py-40 text-center bg-black flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-gray-500 font-black uppercase tracking-[0.4em] italic text-xs">Menyusun Berita Terbaru...</p>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen py-40 text-center bg-black flex flex-col items-center justify-center px-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-12 max-w-md w-full space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Artikel Tidak Ditemukan</h2>
        <Link to="/blog" className="block w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-yellow-400/20 active:scale-95 transition-all">
          Kembali ke Blog Utama
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
      <div className="max-w-[800px] mx-auto px-4 py-16 space-y-12 pb-32">
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-yellow-400 transition-colors text-[10px] font-black uppercase tracking-widest group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
          Kembali ke Halaman Blog
        </Link>

        <article className="space-y-10 animate-in fade-in duration-700 slide-in-from-bottom-4">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
                {post.category}
              </span>
              <span className="text-gray-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ml-2">
                 {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">{post.title}</h1>
            <p className="text-gray-500 italic text-[13px] md:text-base font-medium border-l-4 border-yellow-400/20 pl-6 leading-relaxed">"{post.excerpt}"</p>
          </div>

          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-neutral-900">
            {post.imageUrl && <img src={post.imageUrl} className="w-full h-full object-cover" alt={post.title} />}
          </div>

          <div 
            className="text-gray-300 text-sm md:text-base leading-relaxed prose prose-invert max-w-none 
            prose-h1:text-white prose-h1:text-2xl prose-h1:font-black prose-h1:italic prose-h1:uppercase 
            prose-p:mb-6 prose-p:italic prose-p:font-medium prose-p:text-justify
            prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-10 prose-img:border prose-img:border-white/5
            prose-ul:italic prose-ol:italic prose-li:mb-2 prose-strong:text-yellow-400"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {/* SECTION BAGIKAN - Jarak diperdekat */}
          <div className="pt-8 pb-4 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-4">
               <h3 className="text-[10px] font-black text-white italic uppercase tracking-[0.3em]">Bagikan Artikel</h3>
               <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(post.title + '\n' + window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72 0.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp
              </a>
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${copied ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white/5 border border-white/10 text-white hover:text-yellow-400 hover:border-yellow-400'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                {copied ? 'Tersalin!' : 'Salin Tautan'}
              </button>
            </div>
          </div>

          <div className="py-4 flex items-center justify-between border-t border-white/5">
             <p className="text-gray-500 font-black italic text-[11px] uppercase tracking-tight">
                Oleh <span className="text-white/80">{post.author}</span>
             </p>
             <div className="flex gap-4 text-gray-700 text-[9px] font-black uppercase tracking-widest">
                <span>{post.views} Dilihat</span>
                <span>{comments.length} Komentar</span>
             </div>
          </div>

          {/* SECTION KOMENTAR - Jarak diperdekat */}
          <div className="pt-12 space-y-8">
             <div className="flex items-center gap-4">
               <h3 className="text-lg md:text-xl font-black text-white italic uppercase tracking-tighter">Komentar</h3>
               <div className="h-[1px] flex-1 bg-white/5"></div>
             </div>

             <form onSubmit={handleCommentSubmit} className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 md:p-8 space-y-5 shadow-2xl">
                <input 
                  type="text" 
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Nama lo..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-yellow-400 outline-none transition-all"
                />
                <textarea 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Tulis pendapat lo..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-medium italic text-gray-300 h-28 focus:border-yellow-400 outline-none resize-none transition-all"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting || cooldown > 0}
                  className="w-full md:w-auto bg-yellow-400 text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-yellow-400/20"
                >
                  {isSubmitting ? 'Mengirim...' : cooldown > 0 ? `Tunggu ${cooldown}s` : 'Kirim Komentar'}
                </button>
             </form>

             <div className="space-y-4">
                {comments.length > 0 ? comments.map((comment) => (
                  <div key={comment.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3 hover:border-white/10 transition-all group shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-black font-black text-[10px] uppercase italic">
                           {comment.author.charAt(0)}
                         </div>
                         <div>
                            <h4 className="text-[11px] font-black text-white uppercase italic tracking-tighter leading-none">{comment.author}</h4>
                            <p className="text-[7px] text-gray-700 font-bold uppercase tracking-widest mt-1 leading-none">
                               {new Date(comment.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                         </div>
                      </div>
                      {(comment.authorId === guestId || isAdmin) && (
                        <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500/20 hover:text-red-500 p-1.5 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      )}
                    </div>
                    <p className="text-gray-400 text-[12px] italic font-medium leading-relaxed">"{comment.content}"</p>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-gray-800 text-[9px] font-black uppercase tracking-widest italic">Belum ada diskusi. Jadilah yang pertama!</p>
                  </div>
                )}
             </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
