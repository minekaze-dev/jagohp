
import { BlogPost, BlogComment } from "../types";

export interface BlogPostExtended extends BlogPost {
  categories: string[];
  imageUrl: string;
  views: number;
  comments: number;
}

const STORAGE_KEY = 'jagohp_blog_posts';
const CATEGORY_KEY = 'jagohp_blog_categories';
const AUTHOR_KEY = 'jagohp_blog_authors';
const COMMENT_KEY = 'jagohp_blog_comments';

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const INITIAL_POSTS: BlogPostExtended[] = [
  {
    id: '1',
    slug: '10-game-android-terpopuler-sepanjang-2025',
    title: '10 Game Android Terpopuler Sepanjang 2025',
    author: 'Tim JAGOHP',
    excerpt: 'Tahun 2025 menjadi musim yang luar biasa bagi dunia mobile gaming.',
    content: '<h1>Mobile Gaming di 2025</h1><p>Tahun 2025 menjadi musim yang luar biasa bagi dunia mobile gaming. Game-game Android menunjukkan pertumbuhan besar dalam jumlah unduhan, keterlibatan pemain, dan pendapatan dari pembelian dalam aplikasi.</p><h2>Trend Utama</h2><ul><li>Graphics setara konsol</li><li>Integrasi AI dalam gameplay</li><li>Esports mobile semakin masif</li></ul>',
    date: new Date().toISOString(),
    publishDate: new Date().toISOString().split('T')[0],
    status: 'published',
    categories: ['Gaming'],
    category: 'Gaming',
    imageUrl: 'https://imgur.com/3Uf7swJ.jpg',
    views: 1240,
    comments: 0
  }
];

const INITIAL_CATEGORIES = ['Gaming', 'Tech', 'News', 'Review', 'Tips'];
const INITIAL_AUTHORS = ['Tim JAGOHP', 'Admin'];

export const getBlogPosts = (includeDrafts: boolean = true): BlogPostExtended[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    let posts: BlogPostExtended[] = data ? JSON.parse(data) : INITIAL_POSTS;
    
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
    }

    const allComments = getAllComments();
    posts = posts.map(p => ({
      ...p,
      author: p.author || 'Tim JAGOHP',
      comments: allComments.filter(c => c.postId === p.id).length
    }));

    if (!includeDrafts) {
      const now = new Date();
      return posts.filter(post => {
        const pubDate = new Date(post.publishDate);
        return post.status === 'published' && pubDate <= now;
      });
    }

    return posts;
  } catch (e) {
    console.error("Storage error:", e);
    return INITIAL_POSTS;
  }
};

export const saveBlogPost = (post: BlogPostExtended) => {
  const posts = getBlogPosts();
  const index = posts.findIndex(p => p.id === post.id);
  if (index > -1) {
    posts[index] = post;
  } else {
    posts.unshift(post);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const deleteBlogPost = (id: string) => {
  const posts = getBlogPosts().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  
  const comments = getAllComments().filter(c => c.postId !== id);
  localStorage.setItem(COMMENT_KEY, JSON.stringify(comments));
};

export const getBlogPostById = (id: string): BlogPostExtended | undefined => {
  return getBlogPosts().find(p => p.id === id);
};

export const getBlogPostBySlug = (slug: string): BlogPostExtended | undefined => {
  return getBlogPosts().find(p => p.slug === slug);
};

export const getCategories = (): string[] => {
  try {
    const data = localStorage.getItem(CATEGORY_KEY);
    if (!data) {
      localStorage.setItem(CATEGORY_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_CATEGORIES;
  }
};

export const saveCategory = (oldName: string | null, newName: string) => {
  let cats = getCategories();
  if (oldName) {
    cats = cats.map(c => c === oldName ? newName : c);
  } else if (!cats.includes(newName)) {
    cats.push(newName);
  }
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(cats));
};

export const deleteCategory = (name: string) => {
  const cats = getCategories().filter(c => c !== name);
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(cats));
};

export const getAuthors = (): string[] => {
  try {
    const data = localStorage.getItem(AUTHOR_KEY);
    if (!data) {
      localStorage.setItem(AUTHOR_KEY, JSON.stringify(INITIAL_AUTHORS));
      return INITIAL_AUTHORS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_AUTHORS;
  }
};

export const saveAuthor = (oldName: string | null, newName: string) => {
  let authors = getAuthors();
  if (oldName) {
    authors = authors.map(a => a === oldName ? newName : a);
  } else if (!authors.includes(newName)) {
    authors.push(newName);
  }
  localStorage.setItem(AUTHOR_KEY, JSON.stringify(authors));
};

export const deleteAuthor = (name: string) => {
  const authors = getAuthors().filter(a => a !== name);
  localStorage.setItem(AUTHOR_KEY, JSON.stringify(authors));
};

export const getAllComments = (): BlogComment[] => {
  try {
    const data = localStorage.getItem(COMMENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const getCommentsByPostId = (postId: string): BlogComment[] => {
  return getAllComments().filter(c => c.postId === postId);
};

export const saveComment = (comment: BlogComment) => {
  const comments = getAllComments();
  comments.unshift(comment);
  localStorage.setItem(COMMENT_KEY, JSON.stringify(comments));
};

export const deleteComment = (id: string) => {
  const comments = getAllComments().filter(c => c.id !== id);
  localStorage.setItem(COMMENT_KEY, JSON.stringify(comments));
};
