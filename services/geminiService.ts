import { GoogleGenAI, Type } from "@google/genai";
import { PhoneReview, ComparisonResult, RecommendationResponse, TopTierResponse, CatalogItem } from "../types";
import { supabase, generateSlug } from "./blogService";

const REAL_WORLD_DATA_INSTRUCTION = `
  PENTING: Anda adalah Ahli Reviewer Gadget Senior dan Perancang Katalog Smartphone Profesional.
  PENGETAHUAN: Gunakan data teknis akurat (AnTuTu V11, DXOMark, serta spesifikasi resmi).
  AKURASI STATUS: Prioritaskan status RESMI di Indonesia. Jika sudah rilis, berikan data retail resmi.
  FORMAT TANGGAL RILIS: Gunakan format 'Nama Bulan Tahun' (Contoh: 'Maret 2025').
  BAHASA: WAJIB menggunakan Bahasa Indonesia yang profesional, lugas, tajam, namun mudah dipahami.
  NETRALITAS: Fokus pada spesifikasi teknis dan ulasan kualitatif yang jujur.
  KEWAJIBAN: Setiap field ulasan (seperti processorReview, cameraReview, dll) HARUS berisi analisis singkat (5-10 kata), dilarang memberikan string kosong atau hanya tanda kutip.
`;

/**
 * Helper untuk membersihkan output JSON dari model jika tidak menggunakan schema secara penuh
 */
const parseAiJson = (text: string) => {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Gagal mem-parse JSON AI:", e);
    return null;
  }
};

/**
 * Mengambil 6 istilah teknis gadget (Kamus Gadget) dari AI
 */
export const getGadgetDictionary = async (): Promise<{term: string, definition: string}[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Berikan 6 istilah/jargon teknis smartphone yang sedang tren atau esensial. Berikan penjelasan singkat namun profesional (max 10 kata) dalam Bahasa Indonesia.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              definition: { type: Type.STRING }
            },
            required: ['term', 'definition']
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Dictionary error:", e);
    return [];
  }
};

/**
 * Mengambil data smartphone yang paling populer/sering diulas (Trending)
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
 * Mengambil semua data ulasan untuk katalog
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

export const getTopTierRankings = async (category: string): Promise<TopTierResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION} Berikan smartphone terbaik mutlak (#1) untuk kategori: ${category}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          description: { type: Type.STRING },
          phones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                rank: { type: Type.NUMBER },
                name: { type: Type.STRING },
                reason: { type: Type.STRING },
                price: { type: Type.STRING },
                specs: {
                  type: Type.OBJECT,
                  properties: {
                    processor: { type: Type.STRING },
                    screen: { type: Type.STRING },
                    camera: { type: Type.STRING },
                    battery: { type: Type.STRING },
                    ramStorage: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

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

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION} Lakukan riset teknis mendalam untuk smartphone: ${phoneName}. Pastikan untuk data benchmark menggunakan estimasi skor AnTuTu V11.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Nama lengkap smartphone" },
          highlight: { type: Type.STRING, description: "Satu kalimat kesimpulan utama" },
          specs: {
            type: Type.OBJECT,
            properties: {
              processor: { type: Type.STRING, description: "Nama chipset spesifik" },
              processorReview: { type: Type.STRING, description: "Ulasan singkat performa chipset (5-10 kata)" },
              ram: { type: Type.STRING, description: "Kapasitas RAM" },
              ramReview: { type: Type.STRING, description: "Ulasan manajemen RAM" },
              storage: { type: Type.STRING, description: "Kapasitas & tipe internal storage" },
              storageReview: { type: Type.STRING, description: "Ulasan kecepatan storage" },
              battery: { type: Type.STRING, description: "Kapasitas mAh & speed charging" },
              batteryReview: { type: Type.STRING, description: "Ulasan daya tahan & charging" },
              screen: { type: Type.STRING, description: "Ukuran, panel, refresh rate" },
              screenReview: { type: Type.STRING, description: "Ulasan kualitas visual layar" },
              body: { type: Type.STRING, description: "Material & proteksi body" },
              bodyReview: { type: Type.STRING, description: "Ulasan build quality & ergonomi" },
              mainCamera: { type: Type.STRING, description: "Spek kamera utama" },
              mainCameraReview: { type: Type.STRING, description: "Ulasan kualitas foto kamera belakang" },
              selfieCamera: { type: Type.STRING, description: "Spek kamera depan" },
              selfieCameraReview: { type: Type.STRING, description: "Ulasan kualitas foto selfie" },
              sound: { type: Type.STRING, description: "Tipe speaker & audio jack" },
              soundReview: { type: Type.STRING, description: "Ulasan kualitas audio" },
              os: { type: Type.STRING, description: "Versi Android/iOS & UI" },
              osReview: { type: Type.STRING, description: "Ulasan stabilitas software" },
              network: { type: Type.STRING, description: "Dukungan 4G/5G" },
              networkReview: { type: Type.STRING, description: "Ulasan stabilitas sinyal" },
              connectivity: { type: Type.STRING, description: "NFC, Wi-Fi, Bluetooth" },
              connectivityReview: { type: Type.STRING, description: "Ulasan kelengkapan konektivitas" },
              releaseDate: { type: Type.STRING, description: "Bulan dan Tahun Rilis" },
              releaseReview: { type: Type.STRING, description: "Ulasan relevansi saat ini" },
              availabilityStatus: { type: Type.STRING, description: "Resmi Indonesia, Global, atau China" },
              price: { type: Type.STRING, description: "Estimasi harga terbaru" }
            },
            required: ['processor', 'processorReview', 'ram', 'ramReview', 'battery', 'batteryReview', 'screen', 'screenReview', 'price', 'mainCameraReview', 'selfieCameraReview', 'osReview']
          },
          performance: {
            type: Type.OBJECT,
            properties: {
              antutu: { type: Type.STRING, description: "Skor estimasi AnTuTu V11" },
              description: { type: Type.STRING, description: "Analisis performa berdasarkan skor AnTuTu" },
              rivals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { name: { type: Type.STRING }, score: { type: Type.STRING } }
                }
              }
            },
            required: ['antutu', 'description']
          },
          gamingPerformance: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                game: { type: Type.STRING },
                setting: { type: Type.STRING },
                experience: { type: Type.STRING }
              }
            }
          },
          overallGamingSummary: { type: Type.STRING, description: "Kesimpulan pengalaman gaming menyeluruh" },
          camera: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.STRING, description: "Estimasi skor DXOMark" },
              dxoMarkClass: { type: Type.STRING, description: "Kasta kamera (Top, Great, Standard)" },
              description: { type: Type.STRING, description: "Analisis kemampuan fotografi/videografi" }
            }
          },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          targetAudience: { type: Type.STRING, description: "Rekomendasi pengguna yang cocok" }
        },
        required: ['name', 'highlight', 'specs', 'performance', 'pros', 'cons', 'targetAudience', 'overallGamingSummary']
      }
    }
  });

  const parsedReview = JSON.parse(response.text);
  if (parsedReview && parsedReview.name) {
    supabase.from('smart_reviews').upsert([{
      slug: slug,
      phone_name: parsedReview.name,
      review_data: parsedReview,
      updated_at: new Date().toISOString()
    }], { onConflict: 'slug' }).then(({ error }) => {
      if (error) console.error("JAGOHP Engine Error:", error.message);
    });
  }

  return { review: parsedReview, sources: [] };
};

export const getComparison = async (phones: string[]): Promise<ComparisonResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION} Bandingkan secara objektif: ${phones.join(", ")}. Gunakan benchmark AnTuTu V11 untuk penilaian performa.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          conclusion: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          tableData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                feature: { type: Type.STRING },
                phone1: { type: Type.STRING },
                phone2: { type: Type.STRING },
                phone3: { type: Type.STRING },
                winnerIndex: { type: Type.NUMBER }
              }
            }
          },
          performanceScores: {
            type: Type.OBJECT,
            properties: {
              phone1: {
                type: Type.OBJECT,
                properties: {
                  chipset: { type: Type.NUMBER },
                  memory: { type: Type.NUMBER },
                  camera: { type: Type.NUMBER },
                  gaming: { type: Type.NUMBER },
                  battery: { type: Type.NUMBER },
                  charging: { type: Type.NUMBER }
                }
              },
              phone2: {
                type: Type.OBJECT,
                properties: {
                  chipset: { type: Type.NUMBER },
                  memory: { type: Type.NUMBER },
                  camera: { type: Type.NUMBER },
                  gaming: { type: Type.NUMBER },
                  battery: { type: Type.NUMBER },
                  charging: { type: Type.NUMBER }
                }
              },
              phone3: {
                type: Type.OBJECT,
                properties: {
                  chipset: { type: Type.NUMBER },
                  memory: { type: Type.NUMBER },
                  camera: { type: Type.NUMBER },
                  gaming: { type: Type.NUMBER },
                  battery: { type: Type.NUMBER },
                  charging: { type: Type.NUMBER }
                }
              }
            }
          }
        },
        required: ['conclusion', 'recommendation', 'tableData', 'performanceScores']
      }
    }
  });
  return JSON.parse(response.text);
};

export const getMatch = async (criteria: any): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION} Cari smartphone terbaik untuk aktivitas: ${criteria.activities?.join(", ")}, Prioritas Kamera: ${criteria.cameraPrio}, Budget: ${criteria.budget}. Tambahan: ${criteria.extra || 'Tidak ada'}. Gunakan data performa AnTuTu V11.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          primary: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING },
              price: { type: Type.STRING },
              specs: {
                type: Type.OBJECT,
                properties: {
                  processor: { type: Type.STRING },
                  ram: { type: Type.STRING },
                  storage: { type: Type.STRING },
                  battery: { type: Type.STRING },
                  charging: { type: Type.STRING },
                  screen: { type: Type.STRING },
                  cameraSummary: { type: Type.STRING },
                  network: { type: Type.STRING },
                  connectivity: { type: Type.STRING },
                  releaseDate: { type: Type.STRING }
                }
              },
              performance: { type: Type.OBJECT, properties: { antutu: { type: Type.STRING } } },
              camera: { type: Type.OBJECT, properties: { score: { type: Type.STRING } } }
            }
          },
          alternatives: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING },
                price: { type: Type.STRING },
                specs: {
                  type: Type.OBJECT,
                  properties: {
                    processor: { type: Type.STRING },
                    ram: { type: Type.STRING },
                    storage: { type: Type.STRING },
                    battery: { type: Type.STRING },
                    charging: { type: Type.STRING },
                    screen: { type: Type.STRING },
                    cameraSummary: { type: Type.STRING }
                  }
                },
                performance: { type: Type.OBJECT, properties: { antutu: { type: Type.STRING } } },
                camera: { type: Type.OBJECT, properties: { score: { type: Type.STRING } } }
              }
            }
          }
        },
        required: ['primary', 'alternatives']
      }
    }
  });
  return JSON.parse(response.text);
};