
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatWithAI } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Halo Kak! Saya adalah JAGOBOT AI. Ada yang mau ditanyain soal smartphone atau teknologi gadget terbaru?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    setLoading(true);

    try {
      const aiResponse = await chatWithAI(userMessage, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse || "Maaf Kak, aku lagi bingung. Bisa tanya lagi?" }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Duh, sistemku lagi bermasalah. Coba cek koneksi atau tanya lagi nanti ya, Kak!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 flex flex-col h-[calc(100dvh-165px)] md:h-[calc(100vh-100px)] pt-4 theme-transition">
      <div className="flex items-center justify-between mb-4 border-b border-black/10 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-1 rounded-xl shadow-xl shadow-yellow-400/20">
            <img src="https://imgur.com/d3OzP78.jpg" className="w-10 h-10 object-contain rounded-lg" alt="JAGOBOT AI" />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tighter leading-none text-black dark:text-white">JAGOBOT AI</h1>
            <p className="text-[8px] text-green-500 font-bold uppercase tracking-widest mt-1">Online • Powered by Groq Llama 3</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' ? 'bg-yellow-400 text-black font-bold' : 'bg-black/5 dark:bg-neutral-900 text-black dark:text-gray-200'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-black/5 dark:bg-neutral-900 p-3 rounded-2xl flex gap-1">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce delay-200"></span>
             </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="shrink-0 mb-4 md:mb-6">
        <div className="bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 rounded-2xl p-1.5 flex gap-2 items-center shadow-2xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya soal gadget..."
            className="flex-1 bg-transparent px-4 py-3 text-xs md:text-sm outline-none text-black dark:text-white"
          />
          <button type="submit" disabled={loading} className="bg-yellow-400 text-black px-6 h-10 rounded-xl text-[10px] font-black uppercase hover:bg-yellow-500 active:scale-95 disabled:opacity-30 transition-all">Kirim</button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;
