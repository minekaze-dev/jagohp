
import React from 'react';

const TermsCondition: React.FC = () => {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-20 space-y-12 pb-32">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white"><span className="text-yellow-400">Terms</span> & Condition</h1>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Terakhir Diperbarui: Januari 2026</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">1. Ketentuan Penggunaan Layanan</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            JAGOHP menyediakan layanan informasi gadget berbasis AI sebagai alat bantu referensi. Dengan mengakses portal ini, lo setuju untuk menggunakan informasi yang disediakan secara bijak dan mematuhi seluruh hukum yang berlaku di wilayah Republik Indonesia.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">2. Disclaimer Konten AI</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            Seluruh analisis dalam fitur <strong>Smart Review</strong>, <strong>Compare</strong>, dan <strong>Phone Match</strong> dihasilkan secara otomatis oleh sistem AI JAGOHP. Meskipun sistem kami dirancang dengan standar akurasi tinggi:
          </p>
          <ul className="list-disc list-inside text-gray-400 text-sm space-y-2 italic ml-4">
            <li>Hasil analisis AI bukanlah jaminan mutlak atas kualitas produk di dunia nyata.</li>
            <li>Estimasi harga dapat berubah sewaktu-waktu tergantung kebijakan retailer atau ketersediaan stok di Indonesia.</li>
            <li>Skor benchmark dan performa gaming bersifat indikatif berdasarkan pengolahan data teknis terbaru.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">3. Tanggung Jawab Pengguna</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            Keputusan akhir untuk melakukan pembelian smartphone sepenuhnya berada di tangan lo. JAGOHP tidak bertanggung jawab atas segala kerugian finansial atau teknis yang mungkin timbul akibat penggunaan informasi dari platform kami. Kami sangat menyarankan lo untuk melakukan verifikasi fisik produk di toko resmi sebelum membeli.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">4. Etika Komunitas (Blog & Komentar)</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            Dalam menggunakan fitur interaktif kami, lo dilarang:
          </p>
          <ul className="list-disc list-inside text-gray-400 text-sm space-y-2 italic ml-4">
            <li>Mengirimkan komentar yang mengandung unsur SARA, ujaran kebencian, atau konten pornografi.</li>
            <li>Melakukan spamming link afiliasi atau iklan tanpa izin.</li>
            <li>Menggunakan identitas palsu yang bertujuan untuk menipu atau merugikan pihak lain.</li>
          </ul>
          <p className="text-gray-400 text-sm italic">Admin JAGOHP berhak menghapus komentar atau memblokir akses jika terjadi pelanggaran berat terhadap etika komunitas.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-yellow-400 w-fit pb-1">5. Batasan Akses Admin</h2>
          <p className="text-gray-400 text-sm leading-relaxed italic text-justify">
            Area Admin dan Dashboard Database bersifat rahasia dan hanya untuk penggunaan internal tim editorial JAGOHP. Segala upaya peretasan, scraping data otomatis secara masif, atau akses tidak sah akan ditindaklanjuti melalui jalur hukum.
          </p>
        </section>
      </div>

      <div className="pt-10 border-t border-white/5 text-center">
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest italic leading-relaxed max-w-md mx-auto">
          Terima kasih telah mempercayakan riset gadget lo kepada ekosistem cerdas JAGOHP.
        </p>
      </div>
    </div>
  );
};

export default TermsCondition;
