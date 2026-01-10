
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { BlogPost, BlogComment } from "../types";

const SUPABASE_URL = 'https://jgxdvxczmcpcazdhyqbi.supabase.co';
// Anon key yang diberikan oleh user
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

/**
 * Mengambil semua post
 * @param includeDrafts Jika true, akan mengambil semua data (untuk admin)
 */
export const getBlogPosts = async (includeDrafts: boolean = true): Promise<BlogPostExtended[]> => {
  try {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        authors (name),
        categories (name),
        comments (count)
      `)
      .order('created_at', { ascending: false });

    // Jika bukan admin, hanya ambil yang 'published'
    if (!includeDrafts) {
      const today = new Date().toISOString().split('T')[0];
      query = query.eq('status', 'published').lte('publish_date', today);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase Error:", error);
      return [];
    }

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
      comments: p.comments?.[0]?.count || 0
    }));
  } catch (err) {
    console.error("Critical Blog Fetch Error:", err);
    return [];
  }
};

/**
 * Simpan atau Update Post
 */
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

  // Cek apakah ID adalah UUID Supabase yang valid (biasanya > 30 karakter)
  if (post.id && post.id.length > 20) {
    return await supabase.from('blog_posts').update(payload).eq('id', post.id);
  } else {
    return await supabase.from('blog_posts').insert([payload]);
  }
};

export const deleteBlogPost = async (id: string) => {
  return await supabase.from('blog_posts').delete().eq('id', id);
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPostExtended | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      authors (name),
      categories (name)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  // Increment views secara asinkron tanpa menunggu
  supabase.rpc('increment_views', { post_id: data.id }).catch(() => {
    // Fallback jika RPC tidak tersedia
    supabase.from('blog_posts').update({ views: (data.views || 0) + 1 }).eq('id', data.id).then();
  });

  return {
    ...data,
    author: data.authors?.name,
    category: data.categories?.name,
    categories: [data.categories?.name],
    imageUrl: data.image_url,
    publishDate: data.publish_date
  } as BlogPostExtended;
};

// --- Manajemen Kategori ---
export const getCategories = async (): Promise<{id: string, name: string}[]> => {
  const { data } = await supabase.from('categories').select('*').order('name');
  return data || [];
};

export const saveCategory = async (name: string) => {
  return await supabase.from('categories').insert([{ name }]);
};

export const deleteCategory = async (id: string) => {
  return await supabase.from('categories').delete().eq('id', id);
};

// --- Manajemen Author ---
export const getAuthors = async (): Promise<{id: string, name: string}[]> => {
  const { data } = await supabase.from('authors').select('*').order('name');
  return data || [];
};

export const saveAuthor = async (name: string) => {
  return await supabase.from('authors').insert([{ name }]);
};

// --- Manajemen Komentar ---
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
