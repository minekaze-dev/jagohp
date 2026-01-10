import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  getBlogPostById, saveBlogPost, BlogPostExtended, 
  getCategories, generateSlug, getAuthors 
} from '../services/blogService';

const BlogEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: 'Tim JAGOHP',
    excerpt: '',
    category: 'Gaming',
    imageUrl: 'https://imgur.com/3Uf7swJ.jpg',
    content: '',
    status: 'draft' as 'draft' | 'published',
    publishDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (token !== 'granted') {
      navigate('/');
      return;
    }

    setCategories(getCategories());
    setAuthors(getAuthors());

    if (id) {
      const existing = getBlogPostById(id);
      if (existing) {
        setFormData({
          title: existing.title,
          slug: existing.slug || generateSlug(existing.title),
          author: existing.author || 'Tim JAGOHP',
          excerpt: existing.excerpt,
          category: existing.category,
          imageUrl: existing.imageUrl,
          content: existing.content || '',
          status: existing.status || 'draft',
          publishDate: existing.publishDate || new Date().toISOString().split('T')[0]
        });
        if (editorRef.current) editorRef.current.innerHTML = existing.content || '';
      }
    }
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

  const handleUppercase = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const text = selection.toString();
    if (text) {
      document.execCommand('insertText', false, text.toUpperCase());
      updateContent();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const html = e.clipboardData.getData('text/html');

    if (html) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const allElements = tempDiv.querySelectorAll('*');
      allElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.backgroundColor = '';
          el.style.background = '';
          el.removeAttribute('bgcolor');
        }
      });
      document.execCommand('insertHTML', false, tempDiv.innerHTML);
    } else {
      document.execCommand('insertText', false, text);
    }
    updateContent();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const imgHtml = `<img src="${base64}" class="w-full rounded-2xl my-4 inline-block shadow-lg" style="max-width: 100%; height: auto;" />`;
        execCommand('insertHTML', imgHtml);
      };
      reader.readAsDataURL(file);
    }
  };

  const resizeImage = (widthClass: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let target: HTMLElement | null = null;
      if (range.startContainer.nodeType === 1) {
        const el = range.startContainer as HTMLElement;
        if (el.tagName === 'IMG') target = el;
      }
      if (!target) {
        let parent = range.commonAncestorContainer as HTMLElement;
        while (parent && parent !== editorRef.current) {
          if (parent.tagName === 'IMG') {
            target = parent;
            break;
          }
          parent = parent.parentElement as HTMLElement;
        }
      }
      if (target) {
        target.className = `${widthClass} rounded-2xl my-4 inline-block shadow-lg transition-all`;
        updateContent();
      } else {
        alert("Klik pada gambar di editor terlebih dahulu untuk mengatur ukurannya.");
      }
    }
  };

  const handleSave = (statusOverride?: 'draft' | 'published') => {
    if (!formData.title || !formData.content) {
      alert('Judul dan Konten wajib diisi!');
      return;
    }

    const finalStatus = statusOverride || formData.status;

    const newPost: BlogPostExtended = {
      id: id || Math.random().toString(36).substr(2, 9),
      slug: formData.slug || generateSlug(formData.title),
      title: formData.title,
      author: formData.author,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      categories: [formData.category],
      imageUrl: formData.imageUrl,
      status: finalStatus,
      publishDate: formData.publishDate,
      date: new Date().toISOString(),
      views: id ? getBlogPostById(id)?.views || 0 : 0,
      comments: id ? getBlogPostById(id)?.comments || 0 : 0
    };

    saveBlogPost(newPost);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col selection:bg-yellow-400/20 pb-32">
      <div className="sticky top-20 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-white transition-colors p-2 -ml-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div className="h-6 w-[1px] bg-white/10"></div>
            <h1 className="text-xs md:text-lg font-black uppercase italic tracking-tighter text-white">
              {id ? 'Perbarui' : 'Tulis'} <span className="text-yellow-400">Artikel</span>
            </h1>
          </div>
          <div className="flex gap-2 md:gap-3">
            <button onClick={() => handleSave('draft')} className="hidden sm:block bg-white/5 border border-white/10 text-gray-400 px-4 md:px-6 py-2 md:py-3 rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
              Simpan Draf
            </button>
            <button onClick={() => handleSave('published')} className="bg-yellow-400 text-black px-4 md:px-8 py-2 md:py-3 rounded-2xl font-black uppercase text-[8px] md:text-[10px] tracking-widest shadow-xl shadow-yellow-400/20 hover:scale-[1.02] active:scale-95 transition-all">
              {formData.status === 'published' ? 'Update' : 'Tayangkan'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start h-full">
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] ml-1">Meta Data & Penjadwalan</label>
              <div className="bg-[#0c0c0c] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={handleTitleChange}
                    placeholder="Ketik Judul Artikel..."
                    className="w-full bg-transparent text-xl md:text-2xl font-black text-white outline-none placeholder:text-gray-800 italic uppercase tracking-tighter"
                    spellCheck={false}
                  />
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">URL:</span>
                    <span className="text-[9px] font-bold text-yellow-400/60 lowercase italic truncate">jagohp.com/blog/{formData.slug || '...'}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                    <span className="text-[8px] font-black text-gray-700 uppercase ml-1">Penulis (Author)</span>
                    <select 
                      value={formData.author} 
                      onChange={e => setFormData({...formData, author: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-bold text-gray-300 outline-none focus:border-yellow-400 transition-colors uppercase border-yellow-400/20"
                    >
                      {authors.map(a => <option key={a} value={a} className="bg-[#0c0c0c]">{a}</option>)}
                    </select>
                  </div>
                   <div className="space-y-1.5">
                    <span className="text-[8px] font-black text-gray-700 uppercase ml-1">Kategori</span>
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-bold text-gray-300 outline-none focus:border-yellow-400 transition-colors uppercase"
                    >
                      {categories.map(cat => <option key={cat} value={cat} className="bg-[#0c0c0c]">{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-black text-gray-700 uppercase ml-1">Status</span>
                    <select 
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-bold text-gray-300 outline-none focus:border-yellow-400 transition-colors uppercase"
                    >
                      <option value="draft" className="bg-[#0c0c0c]">Draft</option>
                      <option value="published" className="bg-[#0c0c0c]">Published</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-black text-gray-700 uppercase ml-1">Tanggal Tayang</span>
                    <input 
                      type="date" 
                      value={formData.publishDate} 
                      onChange={e => setFormData({...formData, publishDate: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-gray-300 outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[8px] font-black text-gray-700 uppercase ml-1">Thumbnail URL</span>
                  <input 
                    type="text" 
                    value={formData.imageUrl} 
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-bold text-gray-300 outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[8px] font-black text-gray-700 uppercase ml-1">Excerpt (Ringkasan)</span>
                  <textarea 
                    value={formData.excerpt} 
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    placeholder="Ringkasan singkat yang muncul di kartu berita..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-medium italic outline-none focus:border-yellow-400 h-20 transition-colors text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] ml-1">Isi Artikel</label>
              <div className="relative border border-white/10 rounded-3xl overflow-visible bg-[#0c0c0c] shadow-2xl">
                <div className="sticky top-40 z-40 bg-neutral-900/95 border-b border-white/10 p-2 md:p-3 flex flex-wrap items-center gap-1 backdrop-blur-md rounded-t-3xl">
                  <button onClick={() => execCommand('bold')} className="w-8 h-8 hover:bg-white/10 rounded text-white font-bold transition-colors">B</button>
                  <button onClick={() => execCommand('italic')} className="w-8 h-8 hover:bg-white/10 rounded text-white italic transition-colors">I</button>
                  <button onClick={() => execCommand('underline')} className="w-8 h-8 hover:bg-white/10 rounded text-white underline transition-colors">U</button>
                  <div className="w-[1px] h-4 bg-white/10 my-auto mx-1"></div>
                  
                  <button onClick={handleUppercase} className="w-8 h-8 hover:bg-white/10 rounded text-white font-black text-[10px] transition-colors" title="Uppercase">TT</button>
                  <div className="w-[1px] h-4 bg-white/10 my-auto mx-1"></div>
                  
                  {/* Font Color Picker */}
                  <button onClick={() => colorInputRef.current?.click()} className="w-8 h-8 hover:bg-white/10 rounded text-white flex items-center justify-center relative" title="Warna Font">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-3M9.707 3.293l3 3a1 1 0 010 1.414l-9 9a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414l9-9a1 1 0 011.414 0z"/></svg>
                    <input type="color" ref={colorInputRef} onChange={(e) => execCommand('foreColor', e.target.value)} className="absolute opacity-0 w-0 h-0" />
                  </button>
                  <div className="w-[1px] h-4 bg-white/10 my-auto mx-1"></div>

                  <button onClick={() => execCommand('formatBlock', 'H1')} className="px-1.5 md:px-2 h-8 hover:bg-white/10 rounded text-white text-[10px] font-black transition-colors">H1</button>
                  <button onClick={() => execCommand('formatBlock', 'H2')} className="px-1.5 md:px-2 h-8 hover:bg-white/10 rounded text-white text-[10px] font-black transition-colors">H2</button>
                  <div className="w-[1px] h-4 bg-white/10 my-auto mx-1"></div>
                  
                  <button onClick={() => execCommand('insertUnorderedList')} className="w-8 h-8 hover:bg-white/10 rounded text-white flex items-center justify-center" title="Bullet List">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M4 6h.01M4 12h.01M4 18h.01"/></svg>
                  </button>
                  <button onClick={() => execCommand('insertOrderedList')} className="w-8 h-8 hover:bg-white/10 rounded text-white flex items-center justify-center" title="Numbered List">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h13M7 12h13M7 16h13M3 8h.01M3 12h.01M3 16h.01"/></svg>
                  </button>
                  <div className="w-[1px] h-4 bg-white/10 my-auto mx-1"></div>

                  <button onClick={() => execCommand('justifyLeft')} className="w-8 h-8 hover:bg-white/10 rounded text-white flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"/></svg>
                  </button>
                  <button onClick={() => execCommand('justifyCenter')} className="w-8 h-8 hover:bg-white/10 rounded text-white flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm4 4h10v2H7V7zm-4 4h18v2H3v-2zm4 4h10v2H7v-2zm-4 4h18v2H3v-2z"/></svg>
                  </button>
                  
                  <div className="w-[1px] h-4 bg-white/10 my-auto mx-1"></div>
                  
                  <select onChange={(e) => execCommand('fontSize', e.target.value)} className="bg-transparent text-white text-[8px] md:text-[9px] font-black outline-none px-1 md:px-2 border-l border-white/10 ml-1 md:ml-2 uppercase tracking-tighter cursor-pointer">
                    <option value="2">Kecil</option>
                    <option value="3">Normal</option>
                    <option value="5">Besar</option>
                  </select>
                  
                  <div className="w-[1px] h-4 bg-white/10 my-auto mx-1"></div>

                  <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                  <button onClick={() => fileInputRef.current?.click()} className="w-8 h-8 hover:bg-white/10 rounded text-yellow-400 flex items-center justify-center" title="Upload Gambar"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 00-2 2z"/></svg></button>
                  <div className="flex gap-1 ml-1">
                    <button onClick={() => resizeImage('w-1/2')} className="text-[7px] font-black bg-white/5 hover:bg-white/10 px-1.5 py-1 rounded border border-white/5 uppercase">50%</button>
                    <button onClick={() => resizeImage('w-full')} className="text-[7px] font-black bg-white/5 hover:bg-white/10 px-1.5 py-1 rounded border border-white/5 uppercase">100%</button>
                  </div>
                </div>

                <div 
                  ref={editorRef}
                  contentEditable
                  onInput={updateContent}
                  onPaste={handlePaste}
                  spellCheck={false}
                  className="min-h-[400px] md:min-h-[600px] p-6 md:p-8 text-gray-200 outline-none prose prose-invert max-w-none text-sm leading-relaxed editor-canvas"
                />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] ml-1">Preview Real-time</label>
            <div className="bg-black border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-inner overflow-hidden">
              <article className="space-y-8">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                  <img src={formData.imageUrl} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">{formData.category}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">{formData.title || 'Judul Artikel'}</h1>
                  <p className="text-gray-500 italic text-sm font-medium border-l-4 border-yellow-400/20 pl-6 leading-relaxed">
                    "{formData.excerpt || 'Ringkasan artikel...'}"
                  </p>
                </div>

                <div className="h-[1px] w-full bg-white/5"></div>

                <div 
                  className="text-gray-400 text-sm leading-relaxed prose prose-invert max-w-none prose-h1:text-white prose-h2:text-white/80 preview-canvas break-words overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-800 italic">Mulai menulis untuk melihat preview...</p>' }}
                />

                <div className="pt-8 border-t border-white/5">
                  <p className="text-[#a5c4e0] font-black italic text-xs uppercase tracking-tight">Ditulis Oleh {formData.author}</p>
                </div>
              </article>
            </div>
          </div>

        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        
        [contenteditable] ul { list-style-type: disc; padding-left: 1.5rem; }
        [contenteditable] ol { list-style-type: decimal; padding-left: 1.5rem; }

        .editor-canvas *, .preview-canvas * {
          background-color: transparent !important;
          background: transparent !important;
        }

        .editor-canvas h1 { font-size: 1.5rem; font-weight: 900; margin-bottom: 1rem; color: white; text-transform: uppercase; font-style: italic; }
        .editor-canvas h2 { font-size: 1.25rem; font-weight: 900; margin-bottom: 0.75rem; color: rgba(255,255,255,0.8); text-transform: uppercase; font-style: italic; }
        
        @media (min-width: 768px) {
          .editor-canvas h1 { font-size: 1.875rem; }
          .editor-canvas h2 { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default BlogEditor;
