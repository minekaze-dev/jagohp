
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogPostBySlug, BlogPostExtended, getCommentsByPostId, saveComment, deleteComment } from '../services/blogService';
import { BlogComment } from '../types';

const BlogDetail: React.FC = () => {
  const { slug } = useParams();
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

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem('admin_token') === 'granted');

    let storedId = localStorage.getItem('jagohp_guest_id');
    if (!storedId) {
      storedId = 'guest_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('jagohp_guest_id', storedId);
    }
    setGuestId(storedId);

    const fetchData = async () => {
      if (!slug) {
        navigate('/blog');
        return;
      }
      
      setLoading(true);
      // Reset state saat ganti artikel
      window.scrollTo(0, 0); 
      setPost(null);

      try {
        const data = await getBlogPostBySlug(slug);
        if (data) {
          setPost(data);
          const comms = await getCommentsByPostId(data.id);
          setComments(comms);
        } else {
          navigate('/blog');
        }
      } catch (err) {
        console.error("Error loading blog detail:", err);
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, navigate]);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !newAuthor.trim() || !newContent.trim()) return;

    const lastCommentTime = localStorage.getItem('last_comment_timestamp');
    const now = Date.now();
    if (lastCommentTime && now - parseInt(lastCommentTime) < 30000) {
      setCooldown(30);
      return;
    }

    setIsSubmitting(true);
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
    setIsSubmitting(false);
    localStorage.setItem('last_comment_timestamp', Date.now().toString());
  };

  const handleDeleteComment = async (id: string) => {
    if (window.confirm('Hapus komentar ini?')) {
      await deleteComment(id);
      setComments(comments.filter(c => c.id !== id));
    }
  };

  if (loading) return (
    <div className="min-h-screen py-40 text-center bg-black">
      <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-500 font-black uppercase tracking-widest italic text-xs">Memuat Konten Cloud...</p>
    </div>
  );

  if (!post) return null;

  return (
    <div className="min-h-screen bg-black text-white">
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
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{post.title}</h1>
            <p className="text-gray-500 italic text-sm md:text-lg font-medium border-l-4 border-yellow-400/20 pl-6 leading-relaxed">"{post.excerpt}"</p>
          </div>

          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-neutral-900">
            {post.imageUrl ? (
              <img src={post.imageUrl} className="w-full h-full object-cover" alt={post.title} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-700 font-black uppercase tracking-widest italic">No Cover Image</div>
            )}
          </div>

          <div 
            className="text-gray-300 text-base md:text-lg leading-relaxed prose prose-invert max-w-none 
            prose-h1:text-white prose-h1:text-3xl prose-h1:font-black prose-h1:italic prose-h1:uppercase 
            prose-p:mb-6 prose-p:italic prose-p:font-medium
            prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-10"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          <div className="py-6 border-t border-white/5 flex items-center justify-between">
             <p className="text-[#a5c4e0] font-black italic text-sm md:text-base uppercase tracking-tight opacity-80">
                Ditulis Oleh <span className="text-white/90">{post.author}</span>
             </p>
             <div className="flex gap-4 text-gray-600 text-[10px] font-black uppercase tracking-widest">
                <span>{post.views} Views</span>
                <span>{comments.length} Komentar</span>
             </div>
          </div>

          <div className="pt-20 space-y-12">
             <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">Diskusi ({comments.length})</h3>

             <form onSubmit={handleCommentSubmit} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden group">
                <input 
                  type="text" 
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Nama Kamu" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-yellow-400 outline-none"
                />
                <textarea 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Tulis pendapatmu..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-medium italic text-gray-300 h-32 focus:border-yellow-400 outline-none resize-none"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting || cooldown > 0}
                  className="w-full md:w-auto bg-yellow-400 text-black px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Mengirim...' : cooldown > 0 ? `Tunggu ${cooldown}s` : 'Kirim Komentar'}
                </button>
             </form>

             <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-4 hover:border-white/10 transition-all relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-black font-black text-xs uppercase italic">{comment.author.charAt(0)}</div>
                         <div>
                            <h4 className="text-xs font-black text-white uppercase italic tracking-tighter">{comment.author}</h4>
                            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1">
                               {new Date(comment.date).toLocaleDateString('id-ID')}
                            </p>
                         </div>
                      </div>
                      {(comment.authorId === guestId || isAdmin) && (
                        <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500/40 hover:text-red-500 p-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm italic font-medium">"{comment.content}"</p>
                  </div>
                ))}
             </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
