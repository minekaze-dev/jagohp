
import { supabase } from './blogService';
import { TopTierResponse, TopTierPhone } from '../types';

export const getSavedTopTier = async (): Promise<TopTierResponse[]> => {
  const { data, error } = await supabase
    .from('top_tier_categories')
    .select(`
      id,
      name,
      description,
      top_tier_rankings (*)
    `)
    .order('name');

  if (error) throw error;

  return data.map((cat: any) => ({
    category: cat.name,
    description: cat.description,
    phones: cat.top_tier_rankings
      .sort((a: any, b: any) => a.rank - b.rank)
      .map((p: any) => ({
        rank: p.rank,
        name: p.name,
        reason: p.reason,
        price: p.price,
        specs: {
          processor: p.processor,
          screen: p.screen,
          camera: p.camera,
          battery: p.battery,
          ramStorage: p.ram_storage
        }
      }))
  }));
};

export const saveTopTierRankings = async (categoryName: string, phones: TopTierPhone[]) => {
  // 1. Dapatkan Category ID
  const { data: cat } = await supabase
    .from('top_tier_categories')
    .select('id')
    .eq('name', categoryName)
    .single();

  if (!cat) throw new Error("Kategori tidak ditemukan");

  // 2. Hapus ranking lama untuk kategori ini
  await supabase.from('top_tier_rankings').delete().eq('category_id', cat.id);

  // 3. Masukkan ranking baru
  const rows = phones.map(p => ({
    category_id: cat.id,
    rank: p.rank,
    name: p.name,
    reason: p.reason,
    price: p.price,
    processor: p.specs.processor,
    screen: p.specs.screen,
    camera: p.specs.camera,
    battery: p.specs.battery,
    ram_storage: p.specs.ramStorage
  }));

  const { error } = await supabase.from('top_tier_rankings').insert(rows);
  if (error) throw error;

  // 4. Update timestamp kategori
  await supabase.from('top_tier_categories').update({ updated_at: new Date().toISOString() }).eq('id', cat.id);
};
