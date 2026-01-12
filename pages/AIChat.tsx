
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const AIChat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Halo Kak! Saya adalah JAGOBOT AI. Tulis aja yang mau ditanyain ya.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminWaiting, setIsAdminWaiting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Update UI with user message
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    // Secret Admin Logic
    if (userMessage === '#admindash') {
      setIsAdminWaiting(true);
      setMessages(prev => [...prev, { role: 'model', content: 'MODE ADMIN TERDETEKSI. Silakan masukkan password akses:' }]);
      return;
    }

    if (isAdminWaiting) {
      if (userMessage === 'admin1') {
        setMessages(prev => [...prev, { role: 'model', content: 'Akses Diberikan. Mengalihkan ke Dashboard Admin...' }]);
        sessionStorage.setItem('admin_token', 'granted');
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: 'Password Salah. Kembali ke mode chat normal.' }]);
        setIsAdminWaiting(false);
      }
      return;
    }

    setLoading(true);

    try {
      const history = newMessages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: history,
        config: {
          systemInstruction: `Anda adalah 'Ahli Reviewer Gadget Senior' dari JAGOHP. 
          
          CAKUPAN TOPIK: Anda HANYA boleh menjawab pertanyaan seputar smartphone, teknologi mobile, gadget pendukung smartphone (TWS, Smartwatch), dan berita industri smartphone.
          PEMBATASAN KETAT: Jika user bertanya di luar topik smartphone (misal: cara memasak, politik, otomotif, matematika, sejarah umum, laptop, atau hal umum lainnya), Anda WAJIB menjawab: "Maaf Kak, saya hanya bisa infokan tentang dunia smartphone." JANGAN memberikan jawaban atau informasi lain untuk topik di luar cakupan tersebut.

          PENGETAHUAN: Anda tahu semua smartphone hingga 1 JANUARI 2026. Anda tahu detail iPhone 17 series, Xiaomi 17 series, ROG Phone 10, dsb.
          PRESISI: Jika user menyebutkan tipe spesifik (misal Xiaomi 17 Pro Max), Anda harus menjawab spesifik untuk tipe itu. JANGAN ganti dengan tipe lama.
          Gaya bicara: Profesional, teknis namun mudah dimengerti, gunakan panggilan 'Kak', objektif, dan lugas.
          
          Aturan Jawaban Gadget:
          1. Berikan analisis mendalam (Chipset, Kamera, Layar, Baterai).
          2. Jika user minta rekomendasi: Berikan 3-4 opsi terbaik sesuai budget awal 2026.
          3. Format rekomendasi: Nama HP (Bold) WAJIB lengkap dengan BRAND di awal (contoh: XIAOMI 17 PRO MAX, IPHONE 17 PRO), Poin Keunggulan, dan Estimasi Harga.
          4. JANGAN HALUSINASI model yang belum rilis di 1 Januari 2026.
          5. Gunakan bahasa Indonesia yang luwes namun cerdas.`,
        }
      });
      
      const aiText = response.text || "Waduh Kak, sinyal satelit saya lagi drop. Coba tanya lagi ya!";
      setMessages(prev => [...prev, { role: 'model', content: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Maaf ya Kak, sistem AI saya lagi overload data 2026. Coba ketik ulang pertanyaannya!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 flex flex-col h-[calc(100dvh-165px)] md:h-[calc(100vh-100px)] pt-4">
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-1 rounded-xl shadow-xl shadow-yellow-400/20 shrink-0">
            <img src="https://imgur.com/d3OzP78.jpg" className="w-10 h-10 object-contain rounded-lg" alt="JAGOBOT AI" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-black uppercase tracking-tighter italic leading-none truncate">JAGOBOT AI</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[8px] text-gray-500 font-bold tracking-widest uppercase">Sedang Online</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'model', content: 'Halo Kak! Ada yang bisa saya bantu lagi soal gadget terbaru?' }])}
          className="text-[8px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Messages List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scroll-smooth custom-scrollbar"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-yellow-400 text-black font-bold rounded-tr-none' 
                : 'bg-neutral-900 text-gray-200 font-medium rounded-tl-none border border-white/5'
            }`}>
              <div className="whitespace-pre-wrap">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-neutral-900 p-3 rounded-2xl border border-white/5 flex gap-1 items-center">
              <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form - Mobile Optimized Flex Layout */}
      <form onSubmit={handleSend} className="shrink-0 mb-4 md:mb-6">
        <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-1.5 flex gap-2 items-center group focus-within:border-yellow-400/50 transition-all shadow-2xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya soal gadget..."
            className="flex-1 bg-transparent px-4 py-3 text-xs md:text-sm focus:outline-none text-white placeholder:text-gray-700 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-yellow-400 text-black h-10 px-5 md:px-7 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 disabled:opacity-30 transition-all active:scale-95 shadow-lg shrink-0"
          >
            Kirim
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;
