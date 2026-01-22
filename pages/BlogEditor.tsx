
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
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);

  const [formData, setFormData] = useState({
    id: id || '',
    title: '',
    slug: '',
    author_id: '',
    excerpt: '',
    tags: '',
    category_id: '',
    imageUrl: '',
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
          const loadedData = {
            id: post.id,
            title: post.title,
            slug: post.slug,
            author_id: post.author_id,
            excerpt: post.excerpt || '',
            tags: post.tags || '',
            category_id: post.category_id,
            imageUrl: post.image_url || '',
            content: post.content || '',
            status: post.status as any,
            publishDate: post.publish_date
          };
          setFormData(loadedData);
          
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

  const handleKeyUp = () => {
    updateContent();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    updateContent();
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (selectedImage) {
      selectedImage.style.outline = 'none';
    }
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      setSelectedImage(img);
      img.style.outline = '4px solid #facc15';
      img.style.outlineOffset = '4px';
      img.style.transition = 'outline 0.2s ease';
    } else {
      setSelectedImage(null);
    }
  };

  const handleResizeSelectedImage = () => {
    if (!selectedImage) return;
    const currentWidth = selectedImage.style.width || '100%';
    const newWidth = prompt('Atur lebar gambar (contoh: 50%, 400px, atau auto):', currentWidth);
    if (newWidth !== null) {
      selectedImage.style.width = newWidth;
      selectedImage.style.height = 'auto';
      updateContent();
    }
  };

  const handleInsertImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const publicUrl = await uploadImage(file);
      const imgHtml = `<img src="${publicUrl}" style="width: 100%; height: auto; border-radius: 1.5rem; margin: 1.5rem 0; display: block;" alt="Uploaded Image" />`;
      execCommand('insertHTML', imgHtml);
    } catch (err) {
      alert("Gagal mengunggah gambar.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
    if (selectedImage) {
      selectedImage.style.outline = 'none';
    }
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
    <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col pb-32 transition-colors duration-300">
      <style>{`
        .jago-editor-content ul { list-style-type: disc !important; padding-left: 2rem !important; margin: 1rem 0 !important; }
        .jago-editor-content ol { list-style-type: decimal !important; padding-left: 2rem !important; margin: 1rem 0 !important; }
        .jago-editor-content li { display: list-item !important; margin-bottom: 0.5rem !important; }
        .jago-editor-content img { display: block; max-width: 100%; border-radius: 1rem; margin: 1.5rem 0; }
      `}</style>
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <input type="file" ref={thumbInputRef} onChange={handleThumbUpload} accept="image/*" className="hidden" />

      {/* Header Admin */}
      <div className="sticky top-0 z-[120] bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-black/5 dark:border-white/10 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <h1 className="text-sm font-black uppercase italic tracking-tighter text-black dark:text-white">Jago <span className="text-yellow-400">Editor V2.5</span></h1>
          </div>
          <div className="flex gap-3">
            <button disabled={isSaving || isUploading} onClick={() => handleSave('draft')} className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-gray-400 px-4 md:px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-black dark:hover:text-white transition-all disabled:opacity-50">Draft</button>
            <button disabled={isSaving || isUploading} onClick={() => handleSave('published')} className="bg-yellow-400 text-black px-5 md:px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-yellow-400/20 active:scale-95 transition-all disabled:opacity-50">
              {isSaving ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8 h-fit">
          {/* Metadata Inputs */}
          <div className="bg-gray-50 dark:bg-[#0c0c0c] border border-black/5 dark:border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-2xl transition-colors">
            <div className="space-y-1">
               <label className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Judul Artikel</label>
               <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value, slug: generateSlug(e.target.value)})}
                placeholder="JUDUL ARTIKEL..."
                className="w-full bg-transparent text-3xl font-black text-black dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-gray-900 italic uppercase tracking-tighter"
              />
              <div className="text-[7px] font-bold text-yellow-500/40 dark:text-yellow-400/40 mt-1 ml-1 truncate tracking-widest uppercase">Permalink: {formData.slug}</div>
            </div>

            <div className="space-y-2">
              <label className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Excerpt (Ringkasan)</label>
              <textarea 
                value={formData.excerpt}
                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                placeholder="Tulis ringkasan berita di sini..."
                className="w-full bg-white dark:bg-neutral-900/50 border border-black/5 dark:border-white/5 rounded-2xl p-4 text-xs md:text-sm italic font-medium text-gray-500 dark:text-gray-400 outline-none focus:border-yellow-400/30 transition-all resize-none h-24 shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Tags (Pisahkan dengan koma)</label>
              <input 
                type="text" 
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
                placeholder="gadget, smartphone, android, ios"
                className="w-full bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-xl p-3 text-[11px] font-bold text-gray-600 dark:text-gray-300 outline-none focus:border-yellow-400/50 transition-all shadow-inner"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Author</label>
                <select value={formData.author_id} onChange={e => setFormData({...formData, author_id: e.target.value})} className="w-full bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-xl p-3 text-[10px] font-black uppercase text-black dark:text-white outline-none shadow-inner">
                  {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Category</label>
                <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-xl p-3 text-[10px] font-black uppercase text-black dark:text-white outline-none shadow-inner">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Date</label>
                <input type="date" value={formData.publishDate} onChange={e => setFormData({...formData, publishDate: e.target.value})} className="w-full bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-xl p-3 text-[10px] font-black uppercase text-black dark:text-white outline-none shadow-inner" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Main Thumbnail</label>
              <div className="flex gap-2">
                <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="URL Thumbnail..." className="flex-1 bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-xl p-3 text-[10px] font-bold text-gray-400 outline-none shadow-inner" />
                <button 
                  onClick={() => thumbInputRef.current?.click()}
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-black dark:text-white px-4 rounded-xl text-[9px] font-black uppercase hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>

          {/* Text Editor */}
          <div className="bg-gray-50 dark:bg-[#0c0c0c] border border-black/5 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col transition-colors">
             <div className="bg-gray-100 dark:bg-neutral-900 p-3 flex flex-wrap gap-2 border-b border-black/5 dark:border-white/5 sticky top-[80px] z-[100] transition-colors">
                <select onChange={(e) => execCommand('fontSize', e.target.value)} className="bg-white dark:bg-black text-[9px] font-black text-black dark:text-white px-3 py-2 rounded-xl outline-none border border-black/10 dark:border-white/20 cursor-pointer hover:border-yellow-400 transition-all">
                  <option value="3">Normal</option>
                  <option value="1">Small</option>
                  <option value="5">Large</option>
                  <option value="7">Huge</option>
                </select>
                
                <div className="flex items-center bg-white dark:bg-black/50 rounded-xl border border-black/10 dark:border-white/20 px-1 overflow-hidden transition-colors">
                  <input type="color" onChange={(e) => execCommand('foreColor', e.target.value)} className="w-10 h-10 p-2 bg-transparent cursor-pointer border-none" title="Font Color" />
                  <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10 mx-1"></div>
                  <button onClick={() => execCommand('bold')} className="w-10 h-10 font-black text-black dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-400/10 transition-all" title="Bold">B</button>
                  <button onClick={() => execCommand('italic')} className="w-10 h-10 italic font-serif text-black dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-400/10 transition-all text-xl" title="Italic">I</button>
                </div>

                <div className="flex items-center bg-white dark:bg-black/50 rounded-xl border border-black/10 dark:border-white/20 px-1 transition-colors">
                  <button onClick={() => execCommand('insertUnorderedList')} className="w-10 h-10 flex items-center justify-center text-black dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-400/10 transition-all" title="Unordered List"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg></button>
                  <button onClick={() => execCommand('insertOrderedList')} className="w-10 h-10 flex items-center justify-center text-black dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-400/10 transition-all" title="Ordered List"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9v-.9H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg></button>
                </div>

                <div className="flex items-center bg-white dark:bg-black/50 rounded-xl border border-black/10 dark:border-white/20 px-1 transition-colors">
                  <button onClick={() => execCommand('justifyLeft')} className="w-10 h-10 flex items-center justify-center text-black dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 15h18v2H3v-2zm0-8h18v2H3V7zm0 6h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg></button>
                  <button onClick={() => execCommand('justifyCenter')} className="w-10 h-10 flex items-center justify-center text-black dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 15h10v2H7v-2zm-4-8h18v2H3V7zm0 6h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg></button>
                  <button onClick={() => execCommand('justifyRight')} className="w-10 h-10 flex items-center justify-center text-black dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 15h10v2H11v-2zm-8-8h18v2H3V7zm0 6h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg></button>
                </div>

                <button 
                  onClick={handleInsertImageClick} 
                  disabled={isUploading}
                  className="px-4 h-10 flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-black dark:text-white text-[10px] font-black uppercase rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                  Insert
                </button>

                {selectedImage && (
                  <button 
                    onClick={handleResizeSelectedImage}
                    className="px-4 h-10 flex items-center gap-2 bg-yellow-400 text-black text-[10px] font-black uppercase rounded-xl hover:bg-yellow-500 shadow-xl transition-all animate-in zoom-in duration-300"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H3V8h18v8zM5 10h2v4H5v-4zm12 0h2v4h-2v-4z"/></svg>
                    Resize
                  </button>
                )}
             </div>
             
             <div 
               ref={editorRef}
               contentEditable
               onInput={updateContent}
               onKeyUp={handleKeyUp}
               onPaste={handlePaste}
               onClick={handleEditorClick}
               className="jago-editor-content min-h-[800px] p-6 pt-24 md:p-12 md:pt-32 text-black dark:text-white caret-yellow-400 outline-none text-base leading-relaxed cursor-text selection:bg-yellow-400/30 transition-colors"
               style={{ minHeight: '800px' }}
             />
          </div>
        </div>

        {/* Live Preview Side */}
        <div className="space-y-6 h-fit hidden lg:block">
           <div className="flex items-center gap-3 ml-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <h3 className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.4em]">Live Review Preview</h3>
           </div>
           <div className="bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-[3.5rem] p-8 md:p-14 overflow-hidden sticky top-[100px] shadow-2xl transition-colors">
              <article className="space-y-10 animate-in fade-in duration-500">
                 {formData.imageUrl ? (
                   <img src={formData.imageUrl} className="w-full aspect-video object-cover rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl" alt="" />
                 ) : (
                   <div className="w-full aspect-video bg-black/5 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center text-gray-400 dark:text-gray-800 text-[10px] font-black uppercase border-2 border-dashed border-black/5 dark:border-white/5">No Thumbnail</div>
                 )}
                 <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white uppercase italic tracking-tighter leading-[0.95] transition-colors">{formData.title || 'Draft Article'}</h2>
                 </div>
                 <div 
                    dangerouslySetInnerHTML={{ __html: formData.content }} 
                    className="prose dark:prose-invert prose-p:italic dark:text-gray-300 prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-img:rounded-3xl prose-img:shadow-2xl text-justify prose-li:italic transition-colors max-w-none" 
                 />
                 
                 {/* Preview Tags */}
                 {formData.tags && (
                   <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-wrap gap-2 transition-colors">
                      {formData.tags.split(',').map((t, i) => (
                        <span key={i} className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-tight">#{t.trim()}</span>
                      ))}
                   </div>
                 )}
              </article>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
