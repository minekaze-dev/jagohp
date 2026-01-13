
import { GoogleGenAI, Type } from "@google/genai";
import { PhoneReview, ComparisonResult, RecommendationResponse, TopTierResponse } from "../types";
import { supabase, generateSlug } from "./blogService";

const REAL_WORLD_DATA_INSTRUCTION = `
  PENTING: Anda adalah Ahli Reviewer Gadget Senior.
  PENGETAHUAN: Data harus bersumber dari riset web terbaru (GSMArena, DXOMark, AnTuTu).
  BAHASA: WAJIB menggunakan Bahasa Indonesia yang profesional dan lugas untuk SEMUA output teks, terutama bagian 'highlight', 'description', 'review', dan 'targetAudience'.
  
  ATURAN PRIORITAS DATA:
  1. WAJIB mengutamakan unit RESMI INDONESIA jika tersedia.
  2. Gunakan Google Search untuk mengambil data spesifikasi dan harga terbaru Januari 2026.
  3. Status: 'Resmi Indonesia', 'Global (Non-Indonesia)', atau 'China (Eksklusif)'.
  4. Berikan output dalam format JSON yang valid sesuai schema yang diminta.
`;

export const getTopTierRankings = async (category: string): Promise<TopTierResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION}
    Berikan HANYA 1 smartphone terbaik mutlak (Peringkat #1) untuk kategori: ${category}.
    Jangan berikan ranking 2 atau 3. Fokus pada pemenang utama di kategori tersebut.
    Gunakan harga pasar Indonesia terbaru.`,
    config: {
      tools: [{googleSearch: {}}],
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
                  },
                  required: ["processor", "screen", "camera", "battery", "ramStorage"]
                }
              },
              required: ["rank", "name", "reason", "price", "specs"]
            }
          }
        },
        required: ["category", "description", "phones"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
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
      console.log("JAGOHP Engine: Memuat data dari cache database (Supabase)...");
      return {
        review: cachedData.review_data,
        sources: cachedData.sources || []
      };
    }
  } catch (err) {
    console.error("Database check failed, falling back to AI:", err);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION}
    Lakukan riset mendalam untuk smartphone: ${phoneName}.
    PASTIKAN BAGIAN 'HIGHLIGHT' DITULIS DALAM BAHASA INDONESIA YANG MENARIK.
    
    Cari detail:
    1. Jaringan & Sistem Operasi (OS saat ini & janji update).
    2. Material Body (Bahan frame/belakang) & Kualitas Layar.
    3. Chipset (Processor) & Penyimpanan (Internal Storage).
    4. Kamera Utama & Kamera Depan (Selfie).
    5. Kapasitas RAM & Konektivitas (Wi-Fi, NFC, Bluetooth).
    6. Kualitas Audio & Daya Tahan Baterai.`,
    config: {
      tools: [{googleSearch: {}}],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          highlight: { type: Type.STRING },
          specs: {
            type: Type.OBJECT,
            properties: {
              processor: { type: Type.STRING },
              processorReview: { type: Type.STRING },
              ram: { type: Type.STRING },
              ramReview: { type: Type.STRING },
              storage: { type: Type.STRING },
              storageReview: { type: Type.STRING },
              battery: { type: Type.STRING },
              batteryReview: { type: Type.STRING },
              screen: { type: Type.STRING },
              screenReview: { type: Type.STRING },
              body: { type: Type.STRING },
              bodyReview: { type: Type.STRING },
              mainCamera: { type: Type.STRING },
              mainCameraReview: { type: Type.STRING },
              selfieCamera: { type: Type.STRING },
              selfieCameraReview: { type: Type.STRING },
              sound: { type: Type.STRING },
              soundReview: { type: Type.STRING },
              os: { type: Type.STRING },
              osReview: { type: Type.STRING },
              network: { type: Type.STRING },
              networkReview: { type: Type.STRING },
              connectivity: { type: Type.STRING },
              connectivityReview: { type: Type.STRING },
              releaseDate: { type: Type.STRING },
              availabilityStatus: { type: Type.STRING },
              price: { type: Type.STRING }
            },
            required: [
              "processor", "processorReview", "ram", "ramReview", "storage", "storageReview", 
              "battery", "batteryReview", "screen", "screenReview", "body", "bodyReview",
              "mainCamera", "mainCameraReview", "selfieCamera", "selfieCameraReview", 
              "sound", "soundReview", "os", "osReview", "network", "networkReview", 
              "connectivity", "connectivityReview", "releaseDate", "availabilityStatus", "price"
            ]
          },
          performance: {
            type: Type.OBJECT,
            properties: {
              antutu: { type: Type.STRING },
              description: { type: Type.STRING },
              rivals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    score: { type: Type.STRING }
                  },
                  required: ["name", "score"]
                }
              }
            },
            required: ["antutu", "description", "rivals"]
          },
          gamingPerformance: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                game: { type: Type.STRING },
                setting: { type: Type.STRING },
                experience: { type: Type.STRING }
              },
              required: ["game", "setting", "experience"]
            }
          },
          overallGamingSummary: { type: Type.STRING },
          camera: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.STRING },
              dxoMarkClass: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["score", "dxoMarkClass", "description"]
          },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          targetAudience: { type: Type.STRING }
        },
        required: ["name", "highlight", "specs", "performance", "gamingPerformance", "overallGamingSummary", "camera", "pros", "cons", "targetAudience"]
      }
    }
  });

  const parsedReview = JSON.parse(response.text || "{}");
  const parsedSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  if (parsedReview && parsedReview.name) {
    supabase.from('smart_reviews').upsert([{
      slug: slug,
      phone_name: parsedReview.name,
      review_data: parsedReview,
      sources: parsedSources,
      updated_at: new Date().toISOString()
    }], { onConflict: 'slug' }).then(({ error }) => {
      if (error) console.error("JAGOHP Engine Error:", error.message);
    });
  }

  return {
    review: parsedReview,
    sources: parsedSources
  };
};

export const getComparison = async (phones: string[]): Promise<ComparisonResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const scoresSchema = {
    type: Type.OBJECT,
    properties: {
      chipset: { type: Type.NUMBER },
      memory: { type: Type.NUMBER },
      camera: { type: Type.NUMBER },
      gaming: { type: Type.NUMBER },
      battery: { type: Type.NUMBER },
      charging: { type: Type.NUMBER }
    },
    required: ["chipset", "memory", "camera", "gaming", "battery", "charging"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION}
    Bandingkan secara objektif: ${phones.join(", ")}.
    Lakukan riset web untuk parameter teknis, benchmark, dan harga terbaru.`,
    config: {
      tools: [{googleSearch: {}}],
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
              },
              required: ["feature", "phone1", "phone2", "winnerIndex"]
            }
          },
          performanceScores: {
            type: Type.OBJECT,
            properties: {
              phone1: scoresSchema,
              phone2: scoresSchema,
              phone3: scoresSchema
            },
            required: ["phone1", "phone2"]
          }
        },
        required: ["conclusion", "recommendation", "tableData", "performanceScores"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const getMatch = async (criteria: any): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const phoneSchema = {
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
        },
        required: ["processor", "ram", "storage", "battery", "charging", "screen", "cameraSummary", "network", "connectivity", "releaseDate"]
      },
      performance: {
        type: Type.OBJECT,
        properties: { antutu: { type: Type.STRING } },
        required: ["antutu"]
      },
      camera: {
        type: Type.OBJECT,
        properties: { score: { type: Type.STRING } },
        required: ["score"]
      }
    },
    required: ["name", "reason", "price", "specs", "performance", "camera"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION}
    Cari smartphone terbaik untuk kebutuhan:
    - Aktivitas: ${criteria.activities?.join(", ")}
    - Prioritas Kamera: ${criteria.cameraPrio}
    - Budget: ${criteria.budget}
    - Tambahan: ${criteria.extra}
    
    Riset pasar Januari 2026 untuk memberikan pilihan paling relevan.`,
    config: {
      tools: [{googleSearch: {}}],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          primary: phoneSchema,
          alternatives: {
            type: Type.ARRAY,
            items: phoneSchema
          }
        },
        required: ["primary", "alternatives"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};
