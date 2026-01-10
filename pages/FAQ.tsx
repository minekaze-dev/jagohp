
import React from 'react';

const FAQ: React.FC = () => {
  const faqs = [
    {
      q: "Apa itu JAGOHP?",
      a: "JAGOHP adalah portal teknologi cerdas yang memanfaatkan Artificial Intelligence (AI) untuk memberikan ulasan, perbandingan, dan rekomendasi smartphone secara objektif dan instan."
    },
    {
      q: "Dari mana data spesifikasi JAGOHP berasal?",
      a: "Data kami ditarik dari basis data teknis global, termasuk referensi benchmark terpercaya seperti AnTuTu dan DxOMark, serta informasi resmi dari produsen smartphone."
    },
    {
      q: "Apakah review di JAGOHP disponsori oleh brand tertentu?",
      a: "Tidak. Semua analisis yang dihasilkan oleh sistem AI kami bersifat objektif berdasarkan data teknis dan parameter performa nyata di pasar, tanpa campur tangan promosi brand."
    },
    {
      q: "Bagaimana cara kerja fitur Phone Match?",
      a: "Phone Match bekerja dengan mencocokkan kriteria unik lo (budget, kebutuhan gaming, kualitas kamera) dengan database smartphone kami menggunakan algoritma AI untuk menemukan 'The Perfect Match'."
    },
    {
      q: "Apakah JAGOHP menjual smartphone secara langsung?",
      a: "Saat ini JAGOHP adalah platform informasi dan rekomendasi. Kami tidak menjual unit secara langsung, namun kami memberikan estimasi harga pasar terbaru sebagai referensi lo saat membeli."
    }
  ];

  return (
    <div className="max-w-[800px] mx-auto px-4 py-20 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white">Frequently Asked <span className="text-yellow-400">Questions</span></h1>
        <p className="text-gray-500 text-sm md:text-base font-medium italic">Semua jawaban yang lo butuhin ada di sini.</p>
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
        <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em]">Punya pertanyaan lain?</p>
        <p className="text-gray-400 text-xs font-medium italic">Kirimkan pertanyaan lo langsung ke tim kami melalui email di bawah.</p>
        <a href="mailto:support@jagohp.com" className="inline-block text-white text-xs font-black uppercase border-b border-white hover:text-yellow-400 hover:border-yellow-400 transition-all pb-1">support@jagohp.com</a>
      </div>
    </div>
  );
};

export default FAQ;
