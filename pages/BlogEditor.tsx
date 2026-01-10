
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  saveBlogPost, BlogPostExtended, 
  getCategories, generateSlug, getAuthors, supabase 
} from '../services/blogService';

const BlogEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [authors, setAuthors] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: id || '',
    title: '',
    slug: '',
    author_id: '',
    excerpt: '',
    category_id: '',
    imageUrl: 'https://imgur.com/3Uf7swJ.jpg',
    content: '',
    status: 'draft' as 'draft' | 'published',
    publishDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (token !== 'granted') { navigate('/'); return; }

    const init = async () => {
      const [cats, auths] = await Promise.all([getCategories(), getAuthors()]);
      setCategories(cats);
      setAuthors(auths);

      if (id) {
        const { data: post } = await supabase.from('blog_posts').select('*').eq('id', id).single();
        if (post) {
          setFormData({
            id: post.id,
            title: post.title,
            slug: post.slug,
            author_id: post.author_id,
            excerpt: post.excerpt,
            category_id: post.category_id,
            imageUrl: post.image_url,
            content: post.content || '',
            status: post.status as any,
            publishDate: post.publish_date
          });
          if (editorRef.current) editorRef.current.innerHTML = post.content || '';
        }
      } else {
        // Set default values for new post
        setFormData(prev => ({
          ...prev,
          author_id: auths[0]?.id || '',
          category_id: cats[0]?.id || ''
        }));
      }
      setLoading(false);
    };
    init();
  }, [id, navigate]);

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
  };

  const handleSave = async (statusOverride?: 'draft' | 'published') => {
    if (!formData.title || !formData.content) return alert('Lengkapi data judul dan konten!');
    
    setIsSaving(true);
    const result = await saveBlogPost({
      ...formData,
      status: statusOverride || formData.status
    });

    if (result.error) {
      alert("Gagal simpan: " + result.error.message);
    } else {
      navigate('/admin');
    }
    setIsSaving(false);
  };

  if (loading) return <div className="py-40 text-center animate-pulse text-gray-500 uppercase font-black text-xs tracking-widest">Inisialisasi Editor Cloud...</div>;

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col pb-32">
      <div className="sticky top-20 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10 px-6 py-5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg></button>
            <h1 className="text-lg font-black uppercase italic tracking-tighter text-white">Editor <span className="text-yellow-400">Database</span></h1>
          </div>
          <div className="flex gap-3">
            <button disabled={isSaving} onClick={() => handleSave('draft')} className="bg-white/5 border border-white/10 text-gray-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Draf</button>
            <button disabled={isSaving} onClick={() => handleSave('published')} className="bg-yellow-400 text-black px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-yellow-400/20">
              {isSaving ? 'Menyimpan...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-8 py-10 grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-3xl p-8 space-y-6">
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value, slug: generateSlug(e.target.value)})}
              placeholder="Judul Artikel"
              className="w-full bg-transparent text-2xl font-black text-white outline-none placeholder:text-gray-800 italic uppercase"
            />
            <div className="grid grid-cols-2 gap-4">
              <select value={formData.author_id} onChange={e => setFormData({...formData, author_id: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] font-bold uppercase text-white outline-none">
                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] font-bold uppercase text-white outline-none">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <input 
              type="text" 
              value={formData.imageUrl} 
              onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              placeholder="Thumbnail Image URL"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] font-bold text-white outline-none"
            />
            <textarea 
              value={formData.excerpt} 
              onChange={e => setFormData({...formData, excerpt: e.target.value})}
              placeholder="Ringkasan singkat untuk kartu berita..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[11px] font-medium italic text-white outline-none h-24"
            />
          </div>

          <div className="bg-[#0c0c0c] border border-white/10 rounded-3xl overflow-hidden">
             <div className="bg-neutral-900/50 p-3 flex gap-1 border-b border-white/5">
                <button onClick={() => execCommand('bold')} className="w-8 h-8 font-bold text-white hover:bg-white/10 rounded">B</button>
                <button onClick={() => execCommand('italic')} className="w-8 h-8 italic text-white hover:bg-white/10 rounded">I</button>
                <button onClick={() => execCommand('formatBlock', 'H1')} className="px-2 h-8 text-white text-[10px] font-black hover:bg-white/10 rounded">H1</button>
                <button onClick={() => execCommand('formatBlock', 'H2')} className="px-2 h-8 text-white text-[10px] font-black hover:bg-white/10 rounded">H2</button>
             </div>
             <div 
               ref={editorRef}
               contentEditable
               onInput={() => setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }))}
               className="min-h-[400px] p-8 text-white outline-none prose prose-invert max-w-none text-sm leading-relaxed"
             />
          </div>
        </div>

        <div className="bg-black border border-white/5 rounded-[2.5rem] p-10 overflow-hidden h-fit sticky top-60">
           <article className="space-y-8">
              <img src={formData.imageUrl} className="w-full aspect-video object-cover rounded-3xl shadow-2xl" alt="" />
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{formData.title || 'Draft Judul'}</h2>
              <div dangerouslySetInnerHTML={{ __html: formData.content }} className="prose prose-invert prose-p:italic text-gray-400" />
           </article>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
