
import { PhoneReview, ComparisonResult, RecommendationResponse, TopTierResponse, CatalogItem } from "../types";
import { supabase, generateSlug } from "./blogService";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_NAME = "llama-3.3-70b-versatile";

const SYSTEM_INSTRUCTION = `
  Anda adalah Ahli Gadget Senior dari JAGOHP. 
  Tugas Anda memberikan analisis teknis smartphone yang sangat akurat, tajam, dan objektif.
  Gunakan standar benchmark terbaru (AnTuTu V11, DXOMark).
  Prioritaskan status rilis resmi di pasar Indonesia.
  Bahasa: Indonesia profesional (Lugas & Informatif).
  Jika meminta JSON, berikan JSON murni tanpa markdown.
`;

/**
 * Helper untuk memanggil Groq API
 */
const callGroq = async (prompt: string, system: string = SYSTEM_INSTRUCTION, isJson: boolean = true) => {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: system + (isJson ? " Berikan hasil dalam format JSON murni." : "") },
        { role: "user", content: prompt }
      ],
      response_format: isJson ? { type: "json_object" } : undefined,
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Groq API Error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

/**
 * Mendapatkan Kamus Gadget untuk Sidebar
 */
export const getGadgetDictionary = async (): Promise<{term: string, definition: string}[]> => {
  try {
    const text = await callGroq("Berikan 6 jargon teknis smartphone terbaru beserta definisinya (max 10 kata).");
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : (parsed.jargon || parsed.terms || []);
  } catch (e) {
    console.error("Dictionary error:", e);
    return [];
  }
};

/**
 * Mendapatkan Trending dari Database
 */
export const getTrendingReviews = async (limit: number = 3): Promise<any[]> => {
  const { data, error } = await supabase
    .from('smart_reviews')
    .select('phone_name, updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((item, index) => ({
    rank: index + 1,
    title: item.phone_name
  }));
};

/**
 * Mendapatkan Semua Item untuk Katalog
 */
export const getAllCatalogItems = async (): Promise<CatalogItem[]> => {
  const { data: dbReviews, error } = await supabase
    .from('smart_reviews')
    .select('review_data, updated_at')
    .order('updated_at', { ascending: false });

  if (error || !dbReviews) return [];

  return dbReviews.map(d => {
    const r: PhoneReview = d.review_data;
    if (!r || !r.specs) return null;

    const priceStr = r.specs.price || "Rp 0";
    const cleanPricePart = priceStr.split('-')[0].split('~')[0].split('(')[0].trim();
    const priceNum = parseInt(cleanPricePart.replace(/[^0-9]/g, '')) || 0;

    let segment: 'Entry' | 'Midrange' | 'Flagship' = 'Midrange';
    if (priceNum < 3000000) segment = 'Entry';
    else if (priceNum >= 9000000) segment = 'Flagship';

    const brandName = (r.name || "Unknown").trim().split(' ')[0];

    return {
      name: r.name || "Unknown Phone",
      brand: brandName,
      year: r.specs.releaseDate?.split(' ').pop() || "2025",
      price: priceStr,
      releaseDateRaw: r.specs.releaseDate || d.updated_at,
      segment: segment,
      specs: {
        network: r.specs.network || "N/A",
        chipset: r.specs.processor || "N/A",
        ramStorage: `${r.specs.ram || "N/A"} / ${r.specs.storage || "N/A"}`,
        screen: r.specs.screen || "N/A",
        mainCamera: r.specs.mainCamera || "N/A",
        selfieCamera: r.specs.selfieCamera || "N/A",
        audio: r.specs.sound || "N/A",
        batteryCharging: r.specs.battery || "N/A",
        features: `${r.specs.connectivity || ""} ${r.specs.connectivityReview || ""} ${r.specs.bodyReview || ""}`
      },
      classification: {
        suitableFor: (r.targetAudience || "Harian").split(',').slice(0, 3).map(s => s.trim()),
        targetAudience: r.targetAudience || "N/A"
      },
      aiNote: r.highlight || ""
    };
  }).filter(item => item !== null) as CatalogItem[];
};

/**
 * Smart Review Engine
 */
export const getSmartReview = async (phoneName: string): Promise<{review: PhoneReview, sources: any[]}> => {
  const slug = generateSlug(phoneName);
  
  try {
    const { data: cachedData, error: fetchError } = await supabase
      .from('smart_reviews')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (cachedData && !fetchError) {
      supabase.from('smart_reviews').update({ updated_at: new Date().toISOString() }).eq('slug', slug).then();
      return { review: cachedData.review_data, sources: cachedData.sources || [] };
    }
  } catch (err) {
    console.error("Database check failed:", err);
  }

  const text = await callGroq(`Lakukan riset teknis mendalam untuk: ${phoneName}. Berikan ulasan spesifikasi, performa gaming, dan kamera dalam format JSON sesuai interface PhoneReview.`);
  const parsedReview: PhoneReview = JSON.parse(text);

  if (parsedReview && parsedReview.name) {
    supabase.from('smart_reviews').upsert([{
      slug: slug,
      phone_name: parsedReview.name,
      review_data: parsedReview,
      updated_at: new Date().toISOString()
    }], { onConflict: 'slug' }).then(({ error }) => {
      if (error) console.error("DB Sync Error:", error.message);
    });
  }

  return { review: parsedReview, sources: [] };
};

/**
 * Compare Engine
 */
export const getComparison = async (phones: string[]): Promise<ComparisonResult> => {
  const text = await callGroq(`Bandingkan secara objektif: ${phones.join(", ")}. Berikan kesimpulan dan pemenang di tiap sektor dalam JSON.`);
  return JSON.parse(text);
};

/**
 * Phone Match Engine
 */
export const getMatch = async (criteria: any): Promise<RecommendationResponse> => {
  const text = await callGroq(`Cari HP terbaik untuk: ${criteria.activities?.join(", ")}, Budget: ${criteria.budget}, Prioritas Kamera: ${criteria.cameraPrio}. Berikan JSON.`);
  return JSON.parse(text);
};

/**
 * Top Tier Rankings
 */
export const getTopTierRankings = async (category: string): Promise<TopTierResponse> => {
  const text = await callGroq(`Siapa smartphone #1 mutlak saat ini untuk kategori: ${category}? Berikan alasan dan spesifikasi utamanya dalam JSON.`);
  return JSON.parse(text);
};

/**
 * Chat helper for JAGOBOT
 */
export const chatWithAI = async (message: string, history: any[]) => {
  return await callGroq(message, "Anda adalah JAGOBOT, asisten gadget pintar dari JAGOHP. Jawab dengan cerdas, santai tapi profesional. Panggil user dengan 'Kak'.", false);
};
