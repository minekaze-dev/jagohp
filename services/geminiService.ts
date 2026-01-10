
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

export interface ReviewResponseWithSources {
  review: PhoneReview;
  sources: any[];
}

export const getSmartReview = async (phoneName: string): Promise<ReviewResponseWithSources> => {
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

export const getComparison = async (phones: string[]): Promise<ComparisonResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION} Bandingkan: ${phones.join(", ")}.`,
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
  return JSON.parse(response.text || "{}");
};

export const getMatch = async (criteria: any): Promise<RecommendationResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION} Rekomendasi HP: ${JSON.stringify(criteria)}`,
    config: {
      tools: [{googleSearch: {}}],
      responseMimeType: "application/json",
      // Schema simplified for brevity here
    }
  });
  return JSON.parse(response.text || "{}");
};
