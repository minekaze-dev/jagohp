
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  saveBlogPost, BlogPostExtended, 
  getCategories, generateSlug, getAuthors, supabase,
  uploadImage
} from '../services/blogService';

const BlogEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [authors, setAuthors] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    id: id || '',
    title: '',
    slug: '',
    author_id: '',
    excerpt: '',
    category_id: '',
    imageUrl: '',
    content: '',
    status: 'draft' as 'draft' | 'published',
    publishDate: new Date().toISOString().split('T')[0]
  });

  // Effect untuk inisialisasi data
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
          const loadedData = {
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
          };
          setFormData(loadedData);
          
          // Memastikan konten masuk ke editor dengan jeda kecil agar DOM siap
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.innerHTML = post.content || '';
            }
          }, 100);
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
    if (editorRef.current) editorRef.current.focus();
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

  // Trigger file selection for body image
  const handleInsertImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Handle file selection and upload for body content
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadImage(file);
      const imgHtml = `<img src="${publicUrl}" style="width: 100%; height: auto; border-radius: 1.5rem; margin: 1.5rem 0; display: block;" alt="Uploaded Image" />`;
      execCommand('insertHTML', imgHtml);
    } catch (err) {
      alert("Gagal mengunggah gambar: Pastikan bucket 'images' tersedia di Supabase.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle upload for main thumbnail
  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
    } catch (err) {
      alert("Gagal mengunggah thumbnail.");
    } finally {
      setIsUploading(false);
      if (thumbInputRef.current) thumbInputRef.current.value = '';
    }
  };

  const handleSave = async (statusOverride?: 'draft' | 'published') => {
    if (!formData.title || !formData.content) return alert('Lengkapi data judul dan konten!');
    setIsSaving(true);
    const result = await saveBlogPost({
      ...formData,
      status: statusOverride || formData.status
    });
    if (result.error) alert("Gagal simpan: " + result.error.message);
    else navigate('/admin');
    setIsSaving(false);
  };

  if (loading) return <div className="py-40 text-center animate-pulse text-gray-500 uppercase font-black text-xs tracking-widest">Inisialisasi Jago Engine...</div>;

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col pb-32">
      {/* Hidden Inputs for Upload */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <input type="file" ref={thumbInputRef} onChange={handleThumbUpload} accept="image/*" className="hidden" />

      {/* Header Utama */}
      <div className="sticky top-0 z-[120] bg-black/95 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <h1 className="text-sm font-black uppercase italic tracking-tighter text-white">Jago <span className="text-yellow-400">Editor V2.2</span></h1>
          </div>
          <div className="flex gap-3">
            <button disabled={isSaving || isUploading} onClick={() => handleSave('draft')} className="bg-white/5 border border-white/10 text-gray-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all disabled:opacity-50">Draft</button>
            <button disabled={isSaving || isUploading} onClick={() => handleSave('published')} className="bg-yellow-400 text-black px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-yellow-400/20 active:scale-95 transition-all disabled:opacity-50">
              {isSaving ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="fixed top-20 left-0 right-0 z-[150] flex justify-center pointer-events-none">
          <div className="bg-yellow-400 text-black px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest animate-bounce shadow-xl">
            Mengunggah Gambar ke Cloud...
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8 h-fit">
          {/* Metadata Section */}
          <div className="bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
               <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Judul Artikel</label>
               <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value, slug: generateSlug(e.target.value)})}
                placeholder="JUDUL SMARTPHONE REVIEW..."
                className="w-full bg-transparent text-3xl font-black text-white outline-none placeholder:text-gray-900 italic uppercase tracking-tighter"
              />
              <div className="text-[7px] font-bold text-yellow-400/40 mt-1 ml-1 truncate tracking-widest uppercase">Permalink: {formData.slug}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Author</label>
                <select value={formData.author_id} onChange={e => setFormData({...formData, author_id: e.target.value})} className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase text-white outline-none">
                  {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Category</label>
                <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase text-white outline-none">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Date</label>
                <input type="date" value={formData.publishDate} onChange={e => setFormData({...formData, publishDate: e.target.value})} className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase text-white outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Main Thumbnail</label>
              <div className="flex gap-2">
                <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="Thumbnail URL atau Upload..." className="flex-1 bg-neutral-900 border border-white/10 rounded-xl p-3 text-[10px] font-bold text-gray-400 outline-none" />
                <button 
                  onClick={() => thumbInputRef.current?.click()}
                  className="bg-white/5 border border-white/10 text-white px-4 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all"
                >
                  Upload
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Excerpt</label>
              <textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} placeholder="Ringkasan artikel..." className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 text-[11px] font-medium italic text-gray-400 outline-none h-20 resize-none" />
            </div>
          </div>

          {/* Editor Tool Section */}
          <div className="bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
             <div className="bg-neutral-900 p-3 flex flex-wrap gap-2 border-b border-white/5 sticky top-[80px] z-[100]">
                <select onChange={(e) => execCommand('fontSize', e.target.value)} className="bg-black text-[9px] font-black text-white px-3 py-2 rounded-xl outline-none border border-white/20 cursor-pointer hover:border-yellow-400 transition-all">
                  <option value="3">Normal</option>
                  <option value="1">Small</option>
                  <option value="5">Large</option>
                  <option value="7">Huge</option>
                </select>
                
                <div className="flex items-center bg-black/50 rounded-xl border border-white/20 px-1 overflow-hidden">
                  <input type="color" onChange={(e) => execCommand('foreColor', e.target.value)} className="w-10 h-10 p-2 bg-transparent cursor-pointer border-none" title="Font Color" />
                  <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
                  <button onClick={() => execCommand('bold')} className="w-10 h-10 font-black text-white hover:text-yellow-400 hover:bg-yellow-400/10 transition-all" title="Bold">B</button>
                  <button onClick={() => execCommand('italic')} className="w-10 h-10 italic font-serif text-white hover:text-yellow-400 hover:bg-yellow-400/10 transition-all text-xl" title="Italic">I</button>
                </div>

                <div className="flex items-center bg-black/50 rounded-xl border border-white/20 px-1">
                  <button onClick={() => execCommand('justifyLeft')} className="w-10 h-10 flex items-center justify-center text-white hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 15h18v2H3v-2zm0-8h18v2H3V7zm0 6h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg></button>
                  <button onClick={() => execCommand('justifyCenter')} className="w-10 h-10 flex items-center justify-center text-white hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 15h10v2H7v-2zm-4-8h18v2H3V7zm0 6h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg></button>
                  <button onClick={() => execCommand('justifyRight')} className="w-10 h-10 flex items-center justify-center text-white hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 15h10v2H11v-2zm-8-8h18v2H3V7zm0 6h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg></button>
                </div>

                <div className="flex items-center bg-black/50 rounded-xl border border-white/20 px-1">
                   <button onClick={() => execCommand('insertUnorderedList')} className="w-10 h-10 flex items-center justify-center text-white hover:text-yellow-400 hover:bg-yellow-400/10 transition-all" title="Bullets"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg></button>
                   <button onClick={() => execCommand('insertOrderedList')} className="w-10 h-10 flex items-center justify-center text-white hover:text-yellow-400 hover:bg-yellow-400/10 transition-all" title="Numbers"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg></button>
                </div>

                <button 
                  onClick={handleInsertImageClick} 
                  disabled={isUploading}
                  className="ml-auto px-4 h-10 flex items-center gap-2 bg-yellow-400 text-black text-[10px] font-black uppercase rounded-xl hover:bg-yellow-500 shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                  Upload Gambar
                </button>
             </div>
             
             <div 
               ref={editorRef}
               contentEditable
               onInput={updateContent}
               onPaste={handlePaste}
               className="min-h-[800px] p-10 pt-32 text-white caret-yellow-400 outline-none prose prose-invert max-w-none text-base leading-relaxed cursor-text selection:bg-yellow-400/30"
               style={{ color: 'white' }}
             />
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6 h-fit">
           <div className="flex items-center gap-3 ml-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em]">Real-time Preview</h3>
           </div>
           <div className="bg-black border border-white/5 rounded-[3.5rem] p-8 md:p-14 overflow-hidden sticky top-[100px] shadow-[0_0_80px_rgba(0,0,0,0.8)]">
              <article className="space-y-10 animate-in fade-in duration-500">
                 {formData.imageUrl ? (
                   <img src={formData.imageUrl} className="w-full aspect-video object-cover rounded-[2.5rem] border border-white/5 shadow-2xl" alt="" />
                 ) : (
                   <div className="w-full aspect-video bg-white/5 rounded-[2.5rem] flex items-center justify-center text-gray-800 text-[10px] font-black uppercase border-2 border-dashed border-white/5">Thumbnail Area</div>
                 )}
                 <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-[0.95]">{formData.title || 'Untitled Article'}</h2>
                 </div>
                 <div dangerouslySetInnerHTML={{ __html: formData.content }} className="prose prose-invert prose-p:italic prose-p:text-gray-400 prose-img:rounded-3xl prose-img:shadow-2xl text-justify prose-li:italic" />
              </article>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
