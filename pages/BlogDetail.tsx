
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogPostBySlug, BlogPostExtended, getCommentsByPostId, saveComment, deleteComment } from '../services/blogService';
import { BlogComment } from '../types';

const BlogDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostExtended | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  
  // Auth States
  const [guestId, setGuestId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Comment Form States
  const [newAuthor, setNewAuthor] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Sharing States
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Admin check
    setIsAdmin(sessionStorage.getItem('admin_token') === 'granted');

    // Guest identity for comment ownership
    let storedId = localStorage.getItem('jagohp_guest_id');
    if (!storedId) {
      storedId = 'guest_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('jagohp_guest_id', storedId);
    }
    setGuestId(storedId);

    if (slug) {
      const data = getBlogPostBySlug(slug);
      if (data) {
        setPost(data);
        setComments(getCommentsByPostId(data.id));
      } else {
        navigate('/blog');
      }
    }
  }, [slug, navigate]);

  // Handle Click Outside for share menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cooldown timer logic
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !newAuthor.trim() || !newContent.trim()) return;

    // Check cooldown
    const lastCommentTime = localStorage.getItem('last_comment_timestamp');
    const now = Date.now();
    if (lastCommentTime && now - parseInt(lastCommentTime) < 60000) {
      const remaining = Math.ceil((60000 - (now - parseInt(lastCommentTime))) / 1000);
      setCooldown(remaining);
      return;
    }

    setIsSubmitting(true);
    const comment: BlogComment = {
      id: Math.random().toString(36).substr(2, 9),
      postId: post.id,
      author: newAuthor,
      authorId: guestId, // Mark ownership
      content: newContent,
      date: new Date().toISOString()
    };

    saveComment(comment);
    setComments([comment, ...comments]);
    setNewAuthor('');
    setNewContent('');
    setIsSubmitting(false);
    localStorage.setItem('last_comment_timestamp', Date.now().toString());
  };

  const handleDeleteComment = (id: string) => {
    if (window.confirm('Yakin ingin menghapus komentar ini?')) {
      deleteComment(id);
      setComments(comments.filter(c => c.id !== id));
    }
  };

  const shareToWhatsApp = () => {
    if (!post) return;
    const url = window.location.href;
    const text = `Baca artikel menarik di JAGOHP: "${post.title}"\n\nLink: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setShowShareMenu(false);
  };

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowShareMenu(false);
      }, 2000);
    });
  };

  if (!post) return null;

  return (
    <div className="max-w-[800px] mx-auto px-4 py-16 space-y-12 pb-32">
      <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-yellow-400 transition-colors text-[10px] font-black uppercase tracking-widest">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
        Kembali ke Blog
      </Link>

      <article className="space-y-10 animate-in fade-in duration-700">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
              {post.category}
            </span>
            <span className="text-gray-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ml-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"/></svg>
              {new Date(post.publishDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
            {post.title}
          </h1>
          
          <p className="text-gray-500 italic text-sm md:text-lg font-medium border-l-4 border-yellow-400/20 pl-6 leading-relaxed">
            "{post.excerpt}"
          </p>
        </div>

        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img src={post.imageUrl} className="w-full h-full object-cover" alt={post.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>

        <div 
          className="text-gray-300 text-base md:text-lg leading-relaxed prose prose-invert max-w-none 
          prose-h1:text-white prose-h1:text-3xl prose-h1:italic prose-h1:font-black prose-h1:tracking-tighter prose-h1:uppercase 
          prose-h2:text-white/80 prose-h2:text-2xl prose-h2:italic prose-h2:font-black prose-h2:tracking-tight prose-h2:uppercase
          prose-p:mb-6 prose-p:italic prose-p:font-medium
          prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-10"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        <div className="py-6 border-t border-white/5">
           <p className="text-[#a5c4e0] font-black italic text-sm md:text-base uppercase tracking-tight opacity-80">
              Ditulis Oleh <span className="text-white/90">{post.author}</span>
           </p>
        </div>

        {/* ACTIONS SECTION */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4 text-gray-500">
             <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest">{post.views} Views</span>
             </div>
             <div className="h-4 w-[1px] bg-white/10"></div>
             <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest">{comments.length} Komentar</span>
             </div>
           </div>

           <div className="flex gap-4 w-full md:w-auto relative" ref={shareMenuRef}>
             <button 
               onClick={() => setShowShareMenu(!showShareMenu)}
               className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
             >
               Bagikan Berita
             </button>
             
             {showShareMenu && (
               <div className="absolute bottom-full mb-4 left-0 md:left-auto md:right-0 bg-neutral-900 border border-white/10 rounded-2xl p-4 w-48 shadow-2xl z-50 animate-in slide-in-from-bottom-2">
                  <div className="space-y-2">
                    <button 
                      onClick={shareToWhatsApp}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">WhatsApp</span>
                    </button>
                    <button 
                      onClick={copyLink}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all"
                    >
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        {copySuccess ? 'Tersalin!' : 'Salin Tautan'}
                      </span>
                    </button>
                  </div>
               </div>
             )}
           </div>
        </div>

        {/* COMMENTS SECTION */}
        <div className="pt-20 space-y-12">
           <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">
                Diskusi & <span className="text-yellow-400">Komentar</span>
              </h3>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Bergabung dalam percakapan ({comments.length})</p>
           </div>

           {/* Comment Form */}
           <form onSubmit={handleCommentSubmit} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest ml-1">Nama Kamu</label>
                    <input 
                      type="text" 
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Masukkan nama..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-yellow-400 outline-none transition-colors"
                    />
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest ml-1">Komentar</label>
                 <textarea 
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Apa pendapatmu?" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-medium italic text-gray-300 h-32 focus:border-yellow-400 outline-none transition-colors resize-none"
                 />
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                 {cooldown > 0 && (
                   <p className="text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                     <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                     Tunggu {cooldown} detik lagi...
                   </p>
                 )}
                 <button 
                   type="submit"
                   disabled={isSubmitting || cooldown > 0}
                   className="w-full md:w-auto bg-yellow-400 text-black px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all disabled:opacity-50"
                 >
                   {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
                 </button>
              </div>
           </form>

           {/* Comment List */}
           <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-4 hover:border-yellow-400/10 transition-all relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-black font-black text-xs uppercase italic">
                           {comment.author.charAt(0)}
                         </div>
                         <div>
                            <h4 className="text-xs font-black text-white uppercase italic tracking-tighter leading-none">{comment.author}</h4>
                            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1">
                               {new Date(comment.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                         </div>
                      </div>
                      
                      {/* Delete Button for Owner or Admin */}
                      {(comment.authorId === guestId || isAdmin) && (
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className={`p-2 rounded-lg transition-all ${isAdmin ? 'text-red-500/40 hover:text-red-500 hover:bg-red-500/5' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
                          title="Hapus Komentar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm italic font-medium leading-relaxed pl-13">
                      "{comment.content}"
                    </p>
                    {isAdmin && comment.authorId === guestId && (
                      <span className="absolute top-2 right-12 text-[7px] font-black uppercase tracking-widest text-yellow-400/30">You (Owner)</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                   <p className="text-gray-700 text-[10px] font-black uppercase tracking-widest italic">Belum ada diskusi di sini. Jadilah yang pertama!</p>
                </div>
              )}
           </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
