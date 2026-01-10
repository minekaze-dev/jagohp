
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getBlogPosts, deleteBlogPost, BlogPostExtended, 
  getCategories, saveCategory, deleteCategory,
  getAuthors, saveAuthor, deleteAuthor 
} from '../services/blogService';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem('admin_token') === 'granted';

  const [posts, setPosts] = useState<BlogPostExtended[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  
  const [newCat, setNewCat] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);

  const [newAuthor, setNewAuthor] = useState('');
  const [editingAuthor, setEditingAuthor] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    setPosts(getBlogPosts(true));
    setCategories(getCategories());
    setAuthors(getAuthors());
  }, [navigate, isAdmin]);

  // Sangat penting: jangan render apa pun jika bukan admin untuk mencegah crash blank screen
  if (!isAdmin) return null;

  const handleEditPost = (id: string) => navigate(`/admin/editor/${id}`);
  const handleAddPost = () => navigate('/admin/editor');

  const handleDeletePost = (id: string) => {
    if (window.confirm('Yakin ingin menghapus berita ini?')) {
      deleteBlogPost(id);
      setPosts(getBlogPosts(true));
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    saveCategory(editingCat, newCat.trim());
    setCategories(getCategories());
    setNewCat('');
    setEditingCat(null);
  };

  const handleAddAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim()) return;
    saveAuthor(editingAuthor, newAuthor.trim());
    setAuthors(getAuthors());
    setNewAuthor('');
    setEditingAuthor(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 space-y-12 pb-32 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter"><span className="text-yellow-400">Admin</span> Dashboard</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Pusat Kontrol JAGOHP</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={handleAddPost} className="flex-1 md:flex-none bg-yellow-400 text-black px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-400/10 cursor-pointer">
            + Berita Baru
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-10">
        <div className="lg:col-span-2 space-y-6 overflow-hidden">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 italic">Daftar Artikel ({posts.length})</h2>
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-[#0a0a0a] border border-white/5 p-4 md:p-5 rounded-3xl flex items-center gap-4 md:gap-5 hover:border-white/10 transition-all group overflow-hidden">
                <img src={post.imageUrl} className="w-16 h-16 md:w-24 md:h-16 object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[7px] font-black bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded uppercase tracking-widest">{post.category}</span>
                    <span className={`text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${post.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                      {post.status}
                    </span>
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-white uppercase italic tracking-tight truncate">{post.title}</h3>
                </div>
                <div className="flex flex-col md:flex-row gap-2 shrink-0">
                  <button onClick={() => handleEditPost(post.id)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                  <button onClick={() => handleDeletePost(post.id)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-red-500/5 rounded-xl text-red-500/40 hover:text-red-500 transition-colors cursor-pointer"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-10 overflow-hidden">
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 italic">Manajemen Kategori</h2>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-4 md:p-6 space-y-6">
              <form onSubmit={handleAddCategory} className="space-y-3">
                <input 
                  type="text" 
                  value={newCat} 
                  onChange={e => setNewCat(e.target.value)} 
                  placeholder={editingCat ? "Edit nama kategori..." : "Nama kategori baru..."}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:border-yellow-400 outline-none text-white"
                />
                <button type="submit" className="w-full bg-white text-black py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all">
                  {editingCat ? 'Simpan' : 'Tambah'}
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center gap-2 p-2 px-3 bg-black/40 border border-white/5 rounded-xl group shrink-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{cat}</span>
                    <button onClick={() => {setEditingCat(cat); setNewCat(cat)}} className="text-gray-600 hover:text-white cursor-pointer"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                    <button onClick={() => {if(window.confirm('Hapus?')) deleteCategory(cat); setCategories(getCategories())}} className="text-red-500/30 hover:text-red-500 cursor-pointer"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 italic">Manajemen Author</h2>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-4 md:p-6 space-y-6 border-yellow-400/10">
              <form onSubmit={handleAddAuthor} className="space-y-3">
                <input 
                  type="text" 
                  value={newAuthor} 
                  onChange={e => setNewAuthor(e.target.value)} 
                  placeholder={editingAuthor ? "Edit nama author..." : "Nama author baru..."}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:border-yellow-400 outline-none text-white"
                />
                <button type="submit" className="w-full bg-yellow-400 text-black py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all">
                  Tambah
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                {authors.map(author => (
                  <div key={author} className="flex items-center gap-2 p-2 px-3 bg-black/40 border border-white/5 rounded-xl group shrink-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{author}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
