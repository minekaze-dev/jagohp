
import { GoogleGenAI, Type } from "@google/genai";
import { PhoneReview, ComparisonResult, RecommendationResponse, TopTierResponse } from "../types";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const REAL_WORLD_DATA_INSTRUCTION = `
  PENTING: Anda adalah Ahli Reviewer Gadget Senior.
  PENGETAHUAN: Data hingga 1 JANUARI 2026. Anda tahu detail IPHONE 17, XIAOMI 17, SAMSUNG S25, dll.
  
  ATURAN PRIORITAS DATA:
  1. WAJIB mengutamakan unit RESMI INDONESIA.
  2. Gunakan Google Search untuk mengambil data spesifikasi terbaru.
  3. Status: 'Resmi Indonesia', 'Global (Non-Indonesia)', atau 'China (Eksklusif)'.
`;

export const getTopTierRankings = async (category: string): Promise<TopTierResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${REAL_WORLD_DATA_INSTRUCTION}
    Berikan ranking 3 smartphone teratas (Top Tier) untuk kategori: ${category}.
    
    Kategori Detail: 
    - Gaming, Kamera, Flagship, Mid-Range, Entry-Level.
    - All Rounder: HP paling seimbang di semua sisi.
    - Baterai Awet: HP dengan ketahanan daya terbaik di pasar.
    - Daily Driver (Range Harga): HP yang paling pas untuk penggunaan harian pada rentang harga tersebut.

    Berikan analisis singkat mengapa HP tersebut menduduki posisi itu di awal 2026.
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

// Exporting existing functions to maintain compatibility
export const getComparison = async (phones: string[]): Promise<ComparisonResult> => { /* implementation... */ return {} as any; };
export const getSmartReview = async (phoneName: string): Promise<{review: PhoneReview, sources: any[]}> => { /* implementation... */ return {} as any; };
export const getMatch = async (criteria: any): Promise<RecommendationResponse> => { /* implementation... */ return {} as any; };
