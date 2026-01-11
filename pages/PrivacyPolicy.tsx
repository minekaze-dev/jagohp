
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-20 space-y-12 pb-32">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white"><span className="text-yellow-400">Privacy</span> Policy</h1>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Terakhir Diperbarui: Januari 2026</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">1. Pengantar</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            Privasi lo adalah prioritas utama di JAGOHP. Kami berkomitmen untuk melindungi data pribadi lo sambil memberikan pengalaman analisis gadget terbaik berbasis AI. Kebijakan ini menjelaskan bagaimana informasi lo dikelola dalam seluruh ekosistem JAGOHP.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">2. Informasi Yang Kami Kumpulkan</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic">
            Kami mengumpulkan informasi minimal untuk menjalankan fitur cerdas kami:
          </p>
          <ul className="list-disc list-inside text-gray-400 text-sm space-y-2 italic ml-4">
            <li><strong>Fitur Phone Match:</strong> Data kriteria pencarian (budget, aktivitas, prioritas kamera) untuk memberikan rekomendasi yang akurat.</li>
            <li><strong>Sistem Blog:</strong> Nama (opsional/anonim) dan konten komentar yang lo kirimkan untuk membangun diskusi komunitas.</li>
            <li><strong>Identifier Unik:</strong> Kami menghasilkan <i>Guest ID</i> anonim yang disimpan secara lokal di browser lo untuk mengelola fitur komentar dan preferensi tanpa memerlukan pendaftaran akun formal.</li>
            <li><strong>Interaksi AI:</strong> Input teks pada JAGOBOT untuk memberikan jawaban seputar gadget.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">3. Pengolahan Data & Pihak Ketiga</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            JAGOHP menggunakan teknologi dari pihak ketiga terpercaya:
          </p>
          <ul className="list-disc list-inside text-gray-400 text-sm space-y-2 italic ml-4">
            <li><strong>Google Gemini API:</strong> Digunakan untuk pemrosesan logika AI dan riset web. Data yang dikirim bersifat anonim dan teknis.</li>
            <li><strong>Supabase:</strong> Digunakan sebagai infrastruktur Cloud Database dan Media Storage untuk menyimpan konten blog, komentar, dan aset gambar secara aman.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">4. Keamanan & Penyimpanan</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            Seluruh komunikasi data dienkripsi menggunakan protokol HTTPS. Kami tidak menjual, menyewakan, atau memberikan data pencarian lo kepada pengiklan pihak ketiga. Data komentar lo akan tersimpan secara permanen kecuali jika lo meminta penghapusan atau melanggar ketentuan komunitas.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">5. Hak Pengguna</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            Lo berhak untuk membersihkan data lokal (Guest ID & Riwayat Chat) melalui pengaturan browser lo kapan saja. Untuk permintaan penghapusan komentar spesifik, lo bisa menghubungi tim admin kami.
          </p>
        </section>
      </div>

      <div className="pt-10 border-t border-white/5 text-center">
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest italic leading-relaxed max-w-md mx-auto">
          Dengan menggunakan JAGOHP, lo menyetujui praktik pengelolaan data yang dijelaskan dalam Kebijakan Privasi ini.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
