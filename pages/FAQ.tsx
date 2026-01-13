
import React from 'react';

const FAQ: React.FC = () => {
  const faqs = [
    {
      q: "Apa itu JAGOHP?",
      a: "JAGOHP adalah portal teknologi cerdas nomor satu di Indonesia yang memanfaatkan Artificial Intelligence (AI) canggih untuk memberikan ulasan, perbandingan, dan rekomendasi smartphone secara objektif dan instan."
    },
    {
      q: "Bagaimana cara kerja Smart Review?",
      a: "Smart Review menggunakan AI untuk meriset data teknis terbaru dari berbagai sumber global terpercaya. AI kami menganalisis Chipset, Kamera, Layar, hingga Performa Gaming secara mendalam untuk memberikan ringkasan yang jujur dan mudah dimengerti."
    },
    {
      q: "Apakah fitur Compare memberikan skor yang akurat?",
      a: "Ya. Fitur Compare kami menggunakan algoritma pembobotan cerdas untuk membandingkan parameter teknis antar perangkat. Skor yang dihasilkan mencerminkan keunggulan relatif masing-masing HP dalam aspek Chipset, Memori, Kamera, Gaming, Baterai, dan Pengisian Daya."
    },
    {
      q: "Bagaimana Phone Match mencarikan HP yang cocok untuk saya?",
      a: "Phone Match bekerja dengan menganalisis kriteria unik yang lo masukkan—mulai dari aktivitas harian, prioritas kamera, hingga budget spesifik. AI kami kemudian memfilter database smartphone awal 2026 untuk menemukan 'The Perfect Match' dan memberikan beberapa opsi alternatif terbaik."
    },
    {
      q: "Apa itu fitur Top Tier Rank?",
      a: "Top Tier adalah kurasi eksklusif dari JAGOHP yang menampilkan juara mutlak (#1) di setiap kategori (Flagship, Gaming, Kamera, dll). Ranking ini diperbarui setiap 3 bulan untuk memastikan lo selalu mendapatkan informasi mengenai smartphone kasta tertinggi di pasaran."
    },
    {
      q: "Dari mana data, harga dan spesifikasi berasal?",
      a: "Data kami ditarik secara real-time melalui riset web yang didukung AI, merujuk pada standar industri seperti GSMArena, AnTuTu, DXOMark, Google (Gemini AI), serta harga pasar resmi di Indonesia per Januari 2026."
    },
    {
      q: "Apakah saya bisa memberikan opini di blog JAGOHP?",
      a: "Tentu! Setiap artikel di Blog JAGOHP memiliki kolom komentar. Lo bisa berdiskusi, memberikan pendapat, atau bertanya seputar artikel tersebut kepada komunitas dan tim editorial kami."
    }
  ];

  return (
    <div className="max-w-[800px] mx-auto px-4 py-20 space-y-12 pb-32">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white">Frequently Asked <span className="text-yellow-400">Questions</span></h1>
        <p className="text-gray-500 text-sm md:text-base font-medium italic">Panduan lengkap menggunakan ekosistem cerdas JAGOHP.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((item, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-yellow-400/30 transition-all group">
            <h3 className="text-sm md:text-base font-black text-white uppercase italic tracking-tight mb-3 flex gap-3">
              <span className="text-yellow-400">Q.</span> {item.q}
            </h3>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium italic border-l-2 border-white/5 pl-6 ml-1 group-hover:border-yellow-400/20 transition-colors">
              {item.a}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-3xl p-8 text-center space-y-4">
        <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em]">Punya pertanyaan teknis?</p>
        <p className="text-gray-400 text-xs font-medium italic">Tim AI kami dan editorial siap membantu lo 24/7 melalui email.</p>
        <a href="mailto:timjagohp@gmail.com" className="inline-block text-white text-xs font-black uppercase border-b border-white hover:text-yellow-400 hover:border-yellow-400 transition-all pb-1">timjagohp@gmail.com</a>
      </div>
    </div>
  );
};

export default FAQ;
