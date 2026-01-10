
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-20 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white"><span className="text-yellow-400">Privacy</span> Policy</h1>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Terakhir Diperbarui: 20 Mei 2025</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">1. Pengantar</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic">
            Privasi lo sangat penting bagi kami. Kebijakan Privasi ini menjelaskan bagaimana JAGOHP mengumpulkan, menggunakan, dan melindungi informasi lo saat menggunakan layanan portal gadget berbasis AI kami.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">2. Data Yang Kami Kumpulkan</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic">
            Kami hanya mengumpulkan data yang diperlukan untuk meningkatkan pengalaman lo:
          </p>
          <ul className="list-disc list-inside text-gray-400 text-sm space-y-2 italic ml-4">
            <li>Riwayat pencarian smartphone untuk personalisasi rekomendasi.</li>
            <li>Input chat pada asisten AI (JAGOBOT) untuk memproses jawaban.</li>
            <li>Data teknis anonim seperti tipe browser dan resolusi layar untuk optimasi UI.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">3. Penggunaan Google Gemini API</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic">
            JAGOHP menggunakan layanan Google Gemini API untuk memproses analisis teks dan percakapan. Data yang dikirimkan ke API ini bersifat teknis dan anonim terkait kueri gadget yang lo ajukan. Kami tidak mengirimkan data identitas pribadi lo ke pihak ketiga.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">4. Keamanan Data</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic">
            Kami mengimplementasikan standar keamanan industri untuk melindungi data lo dari akses yang tidak sah. Segala bentuk penyimpanan data lokal dilakukan secara terenkripsi.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">5. Perubahan Kebijakan</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic">
            JAGOHP berhak memperbarui kebijakan ini sewaktu-waktu. Kami menyarankan lo untuk memeriksa halaman ini secara berkala untuk mengetahui perubahan terbaru.
          </p>
        </section>
      </div>

      <div className="pt-10 border-t border-white/5 text-center">
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest italic leading-relaxed max-w-md mx-auto">
          Dengan menggunakan layanan kami, lo dianggap menyetujui seluruh poin dalam Kebijakan Privasi ini.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
