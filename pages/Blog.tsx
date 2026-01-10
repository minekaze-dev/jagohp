
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, BlogPostExtended } from '../services/blogService';

const BlogCard: React.FC<{ post: BlogPostExtended }> = ({ post }) => (
  <article className="group bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:border-yellow-400/20 shadow-2xl">
    <div className="w-full md:w-[35%] aspect-video md:aspect-auto overflow-hidden relative">
      <img 
        src={post.imageUrl} 
        alt={post.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
    </div>

    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-yellow-400 text-black">
            {post.category}
          </span>
        </div>

        <div className="space-y-2">
          <Link to={`/blog/${post.slug}`}>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-yellow-400 transition-colors">
              {post.title}
            </h2>
          </Link>
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3 italic font-medium">
            {post.excerpt}
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/blog/${post.slug}`} className="bg-transparent border border-white/10 text-white hover:bg-yellow-400 hover:text-black hover:border-yellow-400 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
            Baca Selengkapnya
          </Link>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-[10px] font-bold">{post.views}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-[10px] font-bold">{post.comments}</span>
          </div>
        </div>
      </div>
    </div>
  </article>
);

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostExtended[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getBlogPosts(false);
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-16 space-y-12">
      <div className="space-y-3 text-center md:text-left">
        <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic mb-2">
          Update Mingguan
        </div>
        <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
          Blog & <span className="text-yellow-400">Berita</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base font-medium italic">
          Informasi, wawasan dan tips  mendalam seputar dunia Smartphone.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse">
          <p className="text-gray-600 font-black uppercase tracking-widest italic">Menarik berita terbaru...</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {posts.length > 0 ? (
            posts.map(post => <BlogCard key={post.id} post={post} />)
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-600 text-[10px] md:text-xs font-black uppercase tracking-widest italic">Belum ada berita dipublikasikan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
