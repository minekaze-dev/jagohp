
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getBlogPosts, deleteBlogPost, BlogPostExtended, 
  getCategories, saveCategory, deleteCategory,
  getAuthors, saveAuthor 
} from '../services/blogService';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem('admin_token') === 'granted';

  const [posts, setPosts] = useState<BlogPostExtended[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [authors, setAuthors] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newCat, setNewCat] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const refreshData = async () => {
    setLoading(true);
    try {
      const [p, c, a] = await Promise.all([
        getBlogPosts(true),
        getCategories(),
        getAuthors()
      ]);
      setPosts(p);
      setCategories(c);
      setAuthors(a);
    } catch (err) {
      console.error("Gagal refresh data admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    refreshData();
  }, [navigate, isAdmin]);

  if (!isAdmin) return null;

  const handleEditPost = (id: string) => navigate(`/admin/editor/${id}`);
  
  const handleDeletePost = async (id: string) => {
    if (window.confirm('Hapus artikel ini secara permanen dari Cloud Database?')) {
      const { error } = await deleteBlogPost(id);
      if (error) alert("Gagal menghapus: Mungkin karena kebijakan RLS. Pastikan Anda memiliki akses tulis.");
      else refreshData();
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    const { error } = await saveCategory(newCat.trim());
    if (error) alert("Gagal menambah kategori. Cek kebijakan RLS Supabase.");
    else {
      setNewCat('');
      refreshData();
    }
  };

  const handleAddAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim()) return;
    const { error } = await saveAuthor(newAuthor.trim());
    if (error) alert("Gagal menambah author. Cek kebijakan RLS Supabase.");
    else {
      setNewAuthor('');
      refreshData();
    }
  };

  const handleDeleteCat = async (id: string) => {
    if (window.confirm('Hapus kategori ini?')) {
      const { error } = await deleteCategory(id);
      if (error) alert("Gagal menghapus kategori.");
      else refreshData();
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 space-y-12 pb-32 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter"><span className="text-yellow-400">Admin</span> Dashboard</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Database Status: <span className="text-emerald-500">Connected to Supabase</span></p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button onClick={() => navigate('/admin/insight-tech')} className="flex-1 md:flex-none bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-lg active:scale-95">
            Insight Tech Mod
          </button>
          <button onClick={() => navigate('/admin/top-tier')} className="flex-1 md:flex-none bg-white/5 border border-white/10 text-white px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all shadow-lg active:scale-95">
            Manage Top Tier
          </button>
          <button onClick={() => navigate('/admin/editor')} className="flex-1 md:flex-none bg-yellow-400 text-black px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-lg active:scale-95">
            + Tulis Berita
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 font-black uppercase tracking-widest italic text-[10px]">Mengambil data terbaru dari Cloud...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 italic">Daftar Artikel ({posts.length})</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {posts.length > 0 ? posts.map(post => (
                <div key={post.id} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-3xl flex items-center gap-4 hover:border-white/10 transition-all group shadow-xl">
                  <img src={post.imageUrl} className="w-16 h-12 object-cover rounded-xl shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${post.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-400/10 text-yellow-400'}`}>
                         {post.status}
                       </span>
                       <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest truncate">{post.category}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white uppercase italic tracking-tight truncate">{post.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditPost(post.id!)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                    <button onClick={() => handleDeletePost(post.id!)} className="w-8 h-8 flex items-center justify-center bg-red-500/5 rounded-xl text-red-500/40 hover:text-red-500 transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-gray-700 font-bold uppercase text-[10px] italic">Belum ada artikel di database.</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-10">
            {/* Seksi Kategori */}
            <div className="space-y-6">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 italic">Kategori ({categories.length})</h2>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 space-y-6 shadow-2xl">
                <form onSubmit={handleAddCategory} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newCat} 
                    onChange={e => setNewCat(e.target.value)} 
                    placeholder="Nama baru..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-yellow-400 outline-none transition-all"
                  />
                  <button type="submit" className="bg-yellow-400 text-black px-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all">Add</button>
                </form>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex items-center gap-2 p-2 px-3 bg-black/40 border border-white/5 rounded-xl group hover:border-white/20 transition-all">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{cat.name}</span>
                      <button onClick={() => handleDeleteCat(cat.id)} className="text-red-500/30 hover:text-red-500 transition-colors"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seksi Author */}
            <div className="space-y-6">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 italic">Penulis ({authors.length})</h2>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 space-y-6 shadow-2xl">
                <form onSubmit={handleAddAuthor} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newAuthor} 
                    onChange={e => setNewAuthor(e.target.value)} 
                    placeholder="Nama penulis..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-yellow-400 outline-none transition-all"
                  />
                  <button type="submit" className="bg-white text-black px-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Add</button>
                </form>
                <div className="flex flex-wrap gap-2">
                  {authors.map(a => (
                    <div key={a.id} className="p-2 px-3 bg-black/40 border border-white/5 rounded-xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
