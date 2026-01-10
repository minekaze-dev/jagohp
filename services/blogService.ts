
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { BlogPost, BlogComment } from "../types";

const SUPABASE_URL = 'https://jgxdvxczmcpcazdhyqbi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpneGR2eGN6bWNwY2F6ZGh5cWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMTg3NTAsImV4cCI6MjA4MzU5NDc1MH0.xDWITn4cJXAgij9-32lT4hNZ2poRAFoFyPhhlCrs8EY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface BlogPostExtended extends BlogPost {
  categories: string[];
  imageUrl: string;
  views: number;
  comments: number;
  category_id?: string;
  author_id?: string;
}

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getBlogPosts = async (includeDrafts: boolean = true): Promise<BlogPostExtended[]> => {
  try {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        authors (name),
        categories (name)
      `)
      .order('created_at', { ascending: false });

    if (!includeDrafts) {
      const today = new Date().toISOString().split('T')[0];
      query = query.eq('status', 'published').lte('publish_date', today);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      author: p.authors?.name || 'Anonim',
      author_id: p.author_id,
      excerpt: p.excerpt,
      content: p.content,
      date: p.created_at,
      publishDate: p.publish_date,
      status: p.status,
      category: p.categories?.name || 'Uncategorized',
      category_id: p.category_id,
      categories: [p.categories?.name || 'General'],
      imageUrl: p.image_url,
      views: p.views || 0,
      comments: 0 // Will be handled if needed
    }));
  } catch (err) {
    console.error("Fetch Blog Error:", err);
    return [];
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPostExtended | null> => {
  try {
    // 1. Coba ambil dengan join (lebih rapi)
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        authors (name),
        categories (name)
      `)
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error("Query Error detail slug:", error);
      // 2. Fallback: ambil raw data jika join gagal karena isu skema
      const { data: rawData, error: rawError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (rawError || !rawData) return null;
      return mapToExtended(rawData);
    }

    if (!data) return null;

    // Increment views (Fixed: Removed .catch as it's not a native promise method on the builder)
    await supabase.rpc('increment_views', { post_id: data.id });

    return mapToExtended(data);
  } catch (err) {
    console.error("System Error getBlogPostBySlug:", err);
    return null;
  }
};

// Helper mapper to avoid redundancy
const mapToExtended = (data: any): BlogPostExtended => ({
  id: data.id,
  slug: data.slug,
  title: data.title,
  excerpt: data.excerpt,
  content: data.content,
  date: data.created_at,
  status: data.status,
  publishDate: data.publish_date,
  views: data.views || 0,
  imageUrl: data.image_url,
  author: data.authors?.name || 'Admin JAGOHP',
  category: data.categories?.name || 'Berita Gadget',
  categories: [data.categories?.name || 'Tech'],
  comments: 0
});

export const saveBlogPost = async (post: any) => {
  const payload = {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image_url: post.imageUrl,
    author_id: post.author_id,
    category_id: post.category_id,
    status: post.status,
    publish_date: post.publishDate
  };

  if (post.id && post.id.length > 20) {
    return await supabase.from('blog_posts').update(payload).eq('id', post.id);
  } else {
    return await supabase.from('blog_posts').insert([payload]);
  }
};

export const deleteBlogPost = async (id: string) => {
  return await supabase.from('blog_posts').delete().eq('id', id);
};

export const getCategories = async () => {
  const { data } = await supabase.from('categories').select('*').order('name');
  return data || [];
};

export const saveCategory = async (name: string) => {
  return await supabase.from('categories').insert([{ name }]);
};

export const deleteCategory = async (id: string) => {
  return await supabase.from('categories').delete().eq('id', id);
};

export const getAuthors = async () => {
  const { data } = await supabase.from('authors').select('*').order('name');
  return data || [];
};

export const saveAuthor = async (name: string) => {
  return await supabase.from('authors').insert([{ name }]);
};

export const getCommentsByPostId = async (postId: string): Promise<BlogComment[]> => {
  const { data } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false });

  return (data || []).map(c => ({
    id: c.id,
    postId: c.post_id,
    author: c.author_name,
    authorId: c.author_id,
    content: c.content,
    date: c.created_at
  }));
};

export const saveComment = async (comment: any) => {
  return await supabase.from('comments').insert([{
    post_id: comment.postId,
    author_name: comment.author,
    author_id: comment.authorId,
    content: comment.content
  }]);
};

export const deleteComment = async (id: string) => {
  return await supabase.from('comments').delete().eq('id', id);
};
