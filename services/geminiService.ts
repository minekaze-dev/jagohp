
import { GoogleGenAI, Type } from "@google/genai";
import { PhoneReview, ComparisonResult, RecommendationResponse } from "../types";

// Inisialisasi aman
const getAI = () => {
  const apiKey = process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

const REAL_WORLD_DATA_INSTRUCTION = `
  PENTING: Anda adalah Ahli Reviewer Gadget Senior.
  PENGETAHUAN: Data hingga 1 JANUARI 2026. Anda tahu detail IPHONE 17, XIAOMI 17, SAMSUNG S25, dll.
  
  ATURAN PRIORITAS DATA:
  1. WAJIB mengutamakan unit RESMI INDONESIA.
  2. Gunakan Google Search untuk mengambil data spesifikasi terbaru.
  3. Status: 'Resmi Indonesia', 'Global (Non-Indonesia)', atau 'China (Eksklusif)'.
`;

const scoreSchema = {
  type: Type.OBJECT,
  properties: {
    chipset: { type: Type.NUMBER, description: "Skor 1-10" },
    memory: { type: Type.NUMBER, description: "Skor 1-10" },
    camera: { type: Type.NUMBER, description: "Skor 1-10" },
    gaming: { type: Type.NUMBER, description: "Skor 1-10" },
    battery: { type: Type.NUMBER, description: "Skor 1-10" },
    charging: { type: Type.NUMBER, description: "Skor 1-10" }
  },
  required: ["chipset", "memory", "camera", "gaming", "battery", "charging"]
};

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
        releaseDate: { type: Type.STRING },
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
};

export const getComparison = async (phones: string[]): Promise<ComparisonResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION} 
    Bandingkan smartphone berikut secara mendalam: ${phones.join(", ")}. 
    
    WAJIB:
    1. Sertakan estimasi 'HARGA PASAR INDONESIA (RESMI)' sebagai baris PERTAMA di tableData.
    2. Berikan skor performa 1-10 untuk masing-masing kategori di performanceScores.
    3. Pastikan data spesifikasi akurat sesuai rilis 2025/2026.`,
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
              phone1: scoreSchema,
              phone2: scoreSchema,
              phone3: scoreSchema
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

export const getSmartReview = async (phoneName: string): Promise<{review: PhoneReview, sources: any[]}> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION}
    Berikan review profesional untuk smartphone: ${phoneName}. 
    Berikan ulasan naratif per spek. Tambahkan analisis gaming (ML, Genshin, PUBG, Roblox).`,
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
              releaseDate: { type: Type.STRING },
              releaseReview: { type: Type.STRING },
              availabilityStatus: { type: Type.STRING },
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
                  properties: { name: { type: Type.STRING }, score: { type: Type.STRING } },
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
              properties: { game: { type: Type.STRING }, setting: { type: Type.STRING }, experience: { type: Type.STRING } },
              required: ["game", "setting", "experience"]
            }
          },
          overallGamingSummary: { type: Type.STRING },
          camera: {
            type: Type.OBJECT,
            properties: { score: { type: Type.STRING }, dxoMarkClass: { type: Type.STRING }, description: { type: Type.STRING } },
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

  return {
    review: JSON.parse(response.text || "{}"),
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const getMatch = async (criteria: any): Promise<RecommendationResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION}
    Tugas: Carikan 3 Smartphone terbaik (1 Utama, 2 Alternatif) untuk user dengan kriteria berikut:
    - Aktivitas Utama: ${criteria.activities.join(", ")}
    - Prioritas Kamera: ${criteria.cameraPrio}
    - Budget Maksimal: ${criteria.budget}
    - Preferensi Tambahan: ${criteria.extra || 'Tidak ada'}
    
    WAJIB memberikan total 3 HP. Sesuaikan harga dengan pasar Indonesia terbaru 2025/2026.`,
    config: {
      tools: [{googleSearch: {}}],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          primary: phoneSchema,
          alternatives: {
            type: Type.ARRAY,
            items: phoneSchema,
            minItems: 2,
            maxItems: 2
          }
        },
        required: ["primary", "alternatives"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};
