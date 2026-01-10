
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-24 space-y-16">
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">Cerdas Memilih <br /> <span className="text-yellow-400">Gadget Masa Depan.</span></h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          JAGOHP lahir dari keinginan untuk menyederhanakan proses pemilihan gadget yang semakin kompleks. Kami percaya teknologi harus membantu, bukan membingungkan apalagi jika sampai disalahgunakan.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12 pt-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b border-yellow-400 w-fit pb-1">Visi Kami</h2>
          <p className="text-gray-400 leading-relaxed">
            Menjadi portal gadget nomor satu yang memanfaatkan kecerdasan buatan untuk memberikan analisis objektif, ringkas, dan jujur bagi seluruh pengguna smartphone di Indonesia.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b border-yellow-400 w-fit pb-1">Misi Kami</h2>
          <p className="text-gray-400 leading-relaxed">
            Membantu user menghemat waktu dan uang dengan menyediakan tools perbandingan cerdas dan sistem rekomendasi yang dipersonalisasi sesuai kebutuhan nyata setiap individu.
          </p>
        </div>
      </div>

      <div className="bg-white/5 p-12 rounded-3xl border border-white/10 text-center space-y-6">
        <h2 className="text-2xl font-bold">Mengapa Menggunakan AI?</h2>
        <p className="text-gray-400 max-w-xl mx-auto italic">
          "Dunia gadget bergerak sangat cepat, setiap bulan ada puluhan Smartphone baru keluar. AI kami memproses ribuan data poin dari AnTuTu hingga DXOMark secara instan untuk memberikan kesimpulan yang manusiawi namun berbasis data agar konsumen tidak salah pilih."
        </p>
      </div>
    </div>
  );
};

export default About;
