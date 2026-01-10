
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
    imageUrl: '', // Default Kosong sesuai permintaan
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
            imageUrl: post.image_url || '',
            content: post.content || '',
            status: post.status as any,
            publishDate: post.publish_date
          });
          if (editorRef.current) editorRef.current.innerHTML = post.content || '';
        }
      } else {
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
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    updateContent();
  };

  const insertImage = () => {
    const url = prompt("Masukkan URL Gambar:");
    if (!url) return;
    const width = prompt("Lebar gambar (contoh: 100%, 400px):", "100%");
    
    const imgHtml = `<img src="${url}" style="width: ${width || '100%'}; height: auto; border-radius: 1rem; margin: 1rem 0;" alt="Blog Image" />`;
    execCommand('insertHTML', imgHtml);
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
      {/* Header Utama (Tinggi ~80px) */}
      <div className="sticky top-0 z-[120] bg-black/95 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <h1 className="text-sm font-black uppercase italic tracking-tighter text-white">Cloud <span className="text-yellow-400">Editor V2</span></h1>
          </div>
          <div className="flex gap-3">
            <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 mr-2">
               <span className="text-[8px] font-black text-gray-500 uppercase mr-3">Status:</span>
               <select 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                className="bg-neutral-900 text-[9px] font-black text-yellow-400 uppercase outline-none cursor-pointer p-1"
               >
                 <option value="draft">Draft</option>
                 <option value="published">Published</option>
               </select>
            </div>
            <button disabled={isSaving} onClick={() => handleSave('draft')} className="bg-white/5 border border-white/10 text-gray-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Simpan Draft</button>
            <button disabled={isSaving} onClick={() => handleSave('published')} className="bg-yellow-400 text-black px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-yellow-400/20 active:scale-95 transition-all">
              {isSaving ? 'Processing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        <div className="space-y-8 h-fit">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
               <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Judul Utama</label>
               <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value, slug: generateSlug(e.target.value)})}
                placeholder="TULIS JUDUL ARTIKEL DI SINI..."
                className="w-full bg-transparent text-3xl font-black text-white outline-none placeholder:text-gray-900 italic uppercase tracking-tighter"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Penulis</label>
                <select value={formData.author_id} onChange={e => setFormData({...formData, author_id: e.target.value})} className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase text-white outline-none cursor-pointer">
                  {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Kategori</label>
                <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase text-white outline-none cursor-pointer">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Tgl Publish</label>
                <input 
                  type="date" 
                  value={formData.publishDate}
                  onChange={e => setFormData({...formData, publishDate: e.target.value})}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Thumbnail URL</label>
              <input 
                type="text" 
                value={formData.imageUrl} 
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="Masukkan URL Gambar..."
                className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-[10px] font-bold text-gray-400 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Excerpt (Ringkasan)</label>
              <textarea 
                value={formData.excerpt} 
                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                placeholder="Tulis ringkasan singkat artikel di sini..."
                className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 text-[11px] font-medium italic text-gray-400 outline-none h-20 resize-none"
              />
            </div>
          </div>

          <div className="bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col relative">
             {/* Toolbar Sticky di bawah header (top 80px) */}
             <div className="bg-neutral-900 p-2 flex flex-wrap gap-1 border-b border-white/5 sticky top-[80px] z-[100]">
                <select onChange={(e) => execCommand('fontSize', e.target.value)} className="bg-black text-[9px] font-black text-white px-2 py-1.5 rounded-lg outline-none border border-white/10 cursor-pointer">
                  <option value="3">Normal</option>
                  <option value="1">Small</option>
                  <option value="5">Large</option>
                  <option value="7">Huge</option>
                </select>
                <input type="color" onChange={(e) => execCommand('foreColor', e.target.value)} className="w-8 h-8 p-1 bg-black rounded-lg border border-white/10 cursor-pointer" />
                <div className="w-[1px] h-8 bg-white/5 mx-1" />
                <button onClick={() => execCommand('bold')} className="w-8 h-8 font-black text-white hover:bg-white/10 rounded-lg">B</button>
                <button onClick={() => execCommand('italic')} className="w-8 h-8 italic font-serif text-white hover:bg-white/10 rounded-lg text-lg">I</button>
                <div className="w-[1px] h-8 bg-white/5 mx-1" />
                <button onClick={() => execCommand('justifyLeft')} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg></button>
                <button onClick={() => execCommand('justifyCenter')} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 15h18v2H3v-2zm0-8h18v2H3V7zm0 6h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg></button>
                <button onClick={() => execCommand('justifyRight')} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 15h12v2H9v-2zm0-8h12v2H9V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg></button>
                <button onClick={() => execCommand('justifyFull')} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/></svg></button>
                <div className="w-[1px] h-8 bg-white/5 mx-1" />
                <button onClick={insertImage} className="px-3 h-8 flex items-center gap-2 bg-yellow-400 text-black text-[9px] font-black uppercase rounded-lg hover:bg-yellow-500">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                  Add Image
                </button>
             </div>
             
             {/* Area Tulis dengan Padding-Top Ekstra (pt-44) untuk memastikan tidak tertutup toolbar */}
             <div 
               ref={editorRef}
               contentEditable
               onInput={updateContent}
               onPaste={handlePaste}
               className="min-h-[700px] p-10 pt-44 text-white caret-white outline-none prose prose-invert max-w-none text-base leading-relaxed selection:bg-yellow-400 selection:text-black cursor-text"
               style={{ color: 'white' }}
             />
          </div>
        </div>

        <div className="space-y-6 h-fit">
           <div className="flex items-center gap-3 ml-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em]">Live Preview</h3>
           </div>
           
           <div className="bg-black border border-white/5 rounded-[3rem] p-8 md:p-12 overflow-hidden sticky top-[100px] shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              <article className="space-y-8 animate-in fade-in duration-500">
                 {formData.imageUrl ? (
                   <img src={formData.imageUrl} className="w-full aspect-[16/9] object-cover rounded-[2rem] shadow-2xl border border-white/5" alt="" />
                 ) : (
                   <div className="w-full aspect-[16/9] bg-white/5 rounded-[2rem] flex items-center justify-center text-gray-700 text-[10px] font-black uppercase">No Thumbnail</div>
                 )}
                 
                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest">{formData.publishDate}</span>
                       <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">/</span>
                       <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{categories.find(c => c.id === formData.category_id)?.name || 'KATEGORI'}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">{formData.title || 'Draft Judul Artikel...'}</h2>
                 </div>

                 <div dangerouslySetInnerHTML={{ __html: formData.content }} className="prose prose-invert prose-p:italic prose-p:font-medium prose-p:text-gray-400 prose-img:rounded-2xl prose-img:shadow-xl text-justify break-words" />
                 
                 <div className="pt-10 border-t border-white/5">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Penulis: <span className="text-white">{authors.find(a => a.id === formData.author_id)?.name || 'ADMIN'}</span></p>
                 </div>
              </article>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
