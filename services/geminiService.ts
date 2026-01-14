
import { GoogleGenAI, Type } from "@google/genai";
import { PhoneReview, ComparisonResult, RecommendationResponse, TopTierResponse, CatalogItem } from "../types";
import { supabase, generateSlug } from "./blogService";

const REAL_WORLD_DATA_INSTRUCTION = `
  PENTING: Anda adalah Ahli Reviewer Gadget Senior dan Perancang Katalog Smartphone Profesional.
  PENGETAHUAN: Data harus bersumber dari riset web terbaru (GSMArena, DXOMark, AnTuTu, serta situs resmi brand di Indonesia).
  AKURASI STATUS: Prioritaskan status RESMI di Indonesia. Jika sebuah smartphone sudah rilis resmi (contoh: Samsung Galaxy A56 5G), berikan data retail resmi Indonesia. HINDARI memberikan data rumor, bocoran, atau spekulasi jika produk sudah tersedia di pasar.
  FORMAT TANGGAL RILIS: Gunakan format 'Nama Bulan Tahun' (Contoh: 'Maret 2025'). DILARANG KERAS menggunakan format kuartal (Q1, Q2, Q3, Q4) atau 'Segera Hadir' jika data bulanan sudah tersedia.
  BAHASA: WAJIB menggunakan Bahasa Indonesia yang profesional, lugas, dan teknis namun mudah dipahami.
  NETRALITAS: Fokus pada spesifikasi teknis dan klasifikasi objektif.
  PENTING: Selalu cari detail IP Rating (Ketahanan Air & Debu). Berikan detail kedalaman dan durasi jika tersedia (misal: IP68, 1.5m selama 30 menit).
`;

/**
 * Mengambil semua data review mentah dari database untuk dikelola di katalog
 */
export const getAllCatalogItems = async (): Promise<CatalogItem[]> => {
  const { data: dbReviews, error } = await supabase
    .from('smart_reviews')
    .select('review_data, updated_at')
    .order('updated_at', { ascending: false });

  if (error || !dbReviews) return [];

  return dbReviews.map(d => {
    const r: PhoneReview = d.review_data;
    const priceStr = r.specs.price || "Rp 0";
    
    // Parsing harga yang lebih cerdas
    const cleanPricePart = priceStr.split('-')[0].split('~')[0].split('(')[0].trim();
    const priceNum = parseInt(cleanPricePart.replace(/[^0-9]/g, '')) || 0;

    let segment: 'Entry' | 'Midrange' | 'Flagship' = 'Midrange';
    if (priceNum < 3000000) segment = 'Entry';
    else if (priceNum >= 9000000) segment = 'Flagship';

    // Ekstraksi brand yang lebih robust
    const brandName = r.name.trim().split(' ')[0];

    return {
      name: r.name,
      brand: brandName,
      year: r.specs.releaseDate?.split(' ').pop() || "2025",
      price: priceStr,
      releaseDateRaw: r.specs.releaseDate || d.updated_at,
      segment: segment,
      specs: {
        network: r.specs.network,
        chipset: r.specs.processor,
        ramStorage: `${r.specs.ram} / ${r.specs.storage}`,
        screen: r.specs.screen,
        mainCamera: r.specs.mainCamera,
        selfieCamera: r.specs.selfieCamera,
        audio: r.specs.sound,
        batteryCharging: r.specs.battery,
        features: `${r.specs.connectivity} ${r.specs.connectivityReview} ${r.specs.bodyReview}`
      },
      classification: {
        suitableFor: r.targetAudience.split(',').slice(0, 3).map(s => s.trim()),
        targetAudience: r.targetAudience
      },
      aiNote: r.highlight
    };
  });
};

export const getTopTierRankings = async (category: string): Promise<TopTierResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION}
    Berikan HANYA 1 smartphone terbaik mutlak (Peringkat #1) untuk kategori: ${category}.
    Gunakan harga pasar Indonesia terbaru dan pastikan statusnya sudah resmi jika sudah rilis.`,
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
    
    INSTRUKSI KHUSUS:
    - Jika smartphone ini sudah rilis resmi di Indonesia, WAJIB menggunakan data spesifikasi dan harga resmi Indonesia.
    - Sertifikasi IP: Cari informasi apakah HP ini memiliki sertifikasi IP67, IP68, atau IP69. Jika ada, WAJIB masukkan ke dalam daftar 'pros' (Kelebihan) dan sebutkan di bagian ringkasan/highlight.
    - Bagian 'specs.releaseDate' WAJIB menggunakan format 'Bulan Tahun' (Contoh: Januari 2025). JANGAN gunakan Q1/Q2/dst.
    - Pastikan bagian 'highlight' ditulis dalam bahasa Indonesia yang sangat meyakinkan dan berbasis fakta retail terbaru.`,
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
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION}
    Bandingkan secara objektif: ${phones.join(", ")}. Pastikan data yang dibandingkan adalah data resmi retail jika produk sudah rilis.`,
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
              phone1: {
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
                },
                required: ["chipset", "memory", "camera", "gaming", "battery", "charging"]
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
                },
                required: ["chipset", "memory", "camera", "gaming", "battery", "charging"]
              }
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
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION}
    Cari smartphone terbaik untuk kebutuhan:
    - Aktivitas: ${criteria.activities?.join(", ")}
    - Budget: ${criteria.budget}
    Pastikan rekomendasi memprioritaskan HP yang sudah resmi rilis di Indonesia dengan format tanggal rilis 'Bulan Tahun'.`,
    config: {
      tools: [{googleSearch: {}}],
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
                },
                required: ["processor", "ram", "storage", "battery", "charging", "screen", "cameraSummary", "network", "connectivity", "releaseDate"]
              },
              performance: {
                type: Type.OBJECT,
                properties: {
                  antutu: { type: Type.STRING }
                },
                required: ["antutu"]
              },
              camera: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.STRING }
                },
                required: ["score"]
              }
            },
            required: ["name", "reason", "price", "specs", "performance", "camera"]
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
                    cameraSummary: { type: Type.STRING },
                    network: { type: Type.STRING },
                    connectivity: { type: Type.STRING },
                    releaseDate: { type: Type.STRING }
                  },
                  required: ["processor", "ram", "storage", "battery", "charging", "screen", "cameraSummary", "network", "connectivity", "releaseDate"]
                },
                performance: {
                  type: Type.OBJECT,
                  properties: {
                    antutu: { type: Type.STRING }
                  },
                  required: ["antutu"]
                },
                camera: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.STRING }
                  },
                  required: ["score"]
                }
              },
              required: ["name", "reason", "price", "specs", "performance", "camera"]
            }
          }
        },
        required: ["primary", "alternatives"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};
