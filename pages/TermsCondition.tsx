
import React from 'react';

const TermsCondition: React.FC = () => {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-20 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white"><span className="text-yellow-400">Terms</span> & Condition</h1>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Terakhir Diperbarui: 20 Mei 2025</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">1. Ketentuan Umum</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            Dengan mengakses dan menggunakan portal JAGOHP, lo setuju untuk terikat oleh Syarat dan Ketentuan ini. Layanan kami disediakan "apa adanya" dan bertujuan sebagai referensi informasi gadget.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">2. Penggunaan Konten AI</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            Analisis yang dihasilkan oleh AI kami (JAGOBOT) adalah hasil pemrosesan data teknis secara otomatis. Meskipun kami berusaha memberikan data yang paling akurat, hasil analisis AI tidak dapat dianggap sebagai nasihat keuangan atau instruksi teknis mutlak. Keputusan akhir pembelian sepenuhnya di tangan pengguna.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">3. Hak Kekayaan Intelektual</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            Seluruh konten, logo, grafis, dan algoritma yang ada di JAGOHP adalah milik kami dan dilindungi oleh undang-undang hak cipta. Penggunaan konten tanpa izin tertulis dilarang keras.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">4. Batasan Tanggung Jawab</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            JAGOHP tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari ketidakakuratan data harga pasar (yang bersifat estimasi) atau perubahan spesifikasi dari pihak produsen smartphone setelah data diterbitkan.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">5. Larangan Penggunaan</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            Dilarang menggunakan bot atau skrip otomatis untuk melakukan scraping data dari JAGOHP. Pelanggaran terhadap sistem keamanan kami akan ditindaklanjuti secara hukum.
          </p>
        </section>
      </div>

      <div className="pt-10 border-t border-white/5 text-center">
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest italic leading-relaxed max-w-md mx-auto">
          Terima kasih telah menggunakan JAGOHP sebagai portal gadget andalan lo.
        </p>
      </div>
    </div>
  );
};

export default TermsCondition;
