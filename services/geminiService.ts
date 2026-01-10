
import { GoogleGenAI, Type } from "@google/genai";
import { PhoneReview, ComparisonResult, RecommendationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System Instruction diperbarui untuk data nyata hingga AWAL 2026 dan prioritas Indonesia
const REAL_WORLD_DATA_INSTRUCTION = `
  PENTING: Anda adalah Ahli Reviewer Gadget Senior dengan akses penelusuran web (Google Search).
  PENGETAHUAN: Data hingga 1 JANUARI 2026. Anda tahu detail IPHONE 17, XIAOMI 17, SAMSUNG S25, dll.
  
  ATURAN PRIORITAS DATA:
  1. WAJIB mengutamakan unit RESMI INDONESIA. Jika HP tersebut masuk resmi ke Indonesia, gunakan harga dan spesifikasi varian Indonesia.
  2. Jika TIDAK rilis resmi di Indonesia, gunakan data GLOBAL.
  3. Jika hanya ada di China, gunakan data versi CHINA.
  4. Manfaatkan Google Search untuk mengambil data spesifikasi terbaru dari GSMArena atau situs teknologi terpercaya lainnya.
  
  ATURAN STATUS KETERSEDIAAN (availabilityStatus):
  - "Resmi Indonesia": Unit tersedia lewat distributor resmi Indonesia.
  - "Global (Non-Indonesia)": Unit rilis internasional tapi tidak masuk resmi Indonesia.
  - "China (Eksklusif)": Unit hanya tersedia untuk pasar domestik China.

  ATURAN PRESISI:
  - Jangan menukar tipe (Xiaomi 17 Pro Max harus tetap Xiaomi 17 Pro Max).
  - Pastikan Tanggal Rilis (releaseDate) berisi Bulan dan Tahun rilis (contoh: "Oktober 2025").
`;

export interface ReviewResponseWithSources {
  review: PhoneReview;
  sources: any[];
}

export const getSmartReview = async (phoneName: string): Promise<ReviewResponseWithSources> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION}
    Berikan review profesional untuk smartphone: ${phoneName}. 
    PENTING: Tulis nama smartphone dalam HURUF KAPITAL + BRAND.
    Berikan ulasan naratif per spek dengan gaya bahasa ahli reviewer senior.
    Tambahkan analisis performa gaming (ML, Genshin, PUBG, Roblox) dan overall summary.`,
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
              cameraSummary: { type: Type.STRING },
              cameraReview: { type: Type.STRING },
              network: { type: Type.STRING },
              networkReview: { type: Type.STRING },
              connectivity: { type: Type.STRING },
              connectivityReview: { type: Type.STRING },
              releaseDate: { type: Type.STRING, description: "Bulan dan Tahun rilis (Contoh: Januari 2025)" },
              releaseReview: { type: Type.STRING },
              availabilityStatus: { type: Type.STRING, description: "Salah satu dari: 'Resmi Indonesia', 'Global (Non-Indonesia)', atau 'China (Eksklusif)'" },
            },
            required: ["processor", "processorReview", "ram", "ramReview", "storage", "storageReview", "battery", "batteryReview", "screen", "screenReview", "cameraSummary", "cameraReview", "network", "networkReview", "connectivity", "connectivityReview", "releaseDate", "releaseReview", "availabilityStatus"]
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
              description: { type: Type.STRING },
            },
            required: ["score", "dxoMarkClass", "description"]
          },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          targetAudience: { type: Type.STRING },
        },
        required: ["name", "highlight", "specs", "performance", "gamingPerformance", "overallGamingSummary", "camera", "pros", "cons", "targetAudience"]
      }
    }
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    review: JSON.parse(response.text),
    sources
  };
};

export const getComparison = async (phones: string[]): Promise<ComparisonResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION}
    Bandingkan smartphone berikut: ${phones.join(", ")}. Utamakan versi Resmi Indonesia.`,
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
          }
        },
        required: ["conclusion", "recommendation", "tableData"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getMatch = async (criteria: { 
  activities: string[], 
  cameraPrio: string, 
  budget: string, 
  count: number, 
  extra: string 
}): Promise<RecommendationResponse> => {
  const prompt = `${REAL_WORLD_DATA_INSTRUCTION}
  Rekomendasikan ${criteria.count} HP terbaru (Utamakan Resmi Indonesia) sesuai kriteria:
  - Aktivitas: ${criteria.activities.join(", ")}
  - Kamera: ${criteria.cameraPrio}
  - Budget: ${criteria.budget}
  - Tambahan: ${criteria.extra || "N/A"}`;

  const specSchema = {
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
          releaseDate: { type: Type.STRING },
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
    contents: prompt,
    config: {
      tools: [{googleSearch: {}}],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          primary: specSchema,
          alternatives: {
            type: Type.ARRAY,
            items: specSchema
          }
        },
        required: ["primary", "alternatives"]
      }
    }
  });

  return JSON.parse(response.text);
};
