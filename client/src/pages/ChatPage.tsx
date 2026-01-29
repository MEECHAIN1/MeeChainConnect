import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Volume2, 
  Mic, 
  Trash2, 
  MoreVertical,
  BrainCircuit
} from "lucide-react";
// import { geminiService } from "../../services/geminiService";
// import { ttsService } from "../../services/ttsService";

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ฟังก์ชันเลื่อนหน้าจอลงล่างสุดอัตโนมัติ
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // ตรงนี้ในอนาคตคุณจะเรียก: const response = await geminiService.generateResponse(input);
      // ตอนนี้ทำ Mockup ไว้ก่อน
      setTimeout(() => {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: `สวัสดีครับ! ผม MeeBot AI ผู้ช่วยส่วนตัวของคุณ ข้อมูลที่คุณถามมาคือ "${userMsg.content}" ผมกำลังประมวลผลผ่านระบบ Gemini และเตรียมคำตอบที่ดีที่สุดให้คุณครับ`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Chat Error:", error);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto bg-gray-900/40 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl relative">

      {/* --- Chat Header --- */}
      <div className="p-4 border-b border-gray-800 bg-gray-800/30 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20 rotate-3">
              <Bot className="text-white" size={28} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="font-black text-white tracking-wide">MeeBot Intelligence</h2>
            <div className="flex items-center gap-2 text-[10px] text-blue-400 font-mono uppercase tracking-widest">
              <BrainCircuit size={12} /> System: Active | Model: Gemini 1.5
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-500 hover:text-red-400 transition-colors" title="Clear Chat">
            <Trash2 size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-white transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* --- Messages Window --- */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
            <div className="p-8 bg-gray-800/50 rounded-full border border-gray-700 animate-pulse">
              <Sparkles size={64} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">ต้องการให้ MeeBot ช่วยอะไรดีครับ?</p>
              <p className="text-gray-500 mt-2">คุณสามารถถามเกี่ยวกับระบบ Mining, Governance หรือข้อมูลทั่วไปได้เลย</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div className="space-y-2">
                <div className={`p-4 rounded-3xl shadow-lg leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-800/80 text-gray-200 border border-gray-700 rounded-tl-none backdrop-blur-md'
                }`}>
                  <p className="text-sm md:text-base">{msg.content}</p>
                </div>

                <div className={`flex items-center gap-3 text-[10px] text-gray-500 font-mono ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.role === 'bot' && (
                    <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                      <Volume2 size={12} /> Listen
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center bg-gray-800/50 px-5 py-3 rounded-2xl border border-gray-700 animate-pulse">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-xs text-gray-500 font-mono">MeeBot is thinking...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* --- Input Area --- */}
      <div className="p-6 bg-gray-800/40 border-t border-gray-800 backdrop-blur-xl">
        <div className="relative flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-2xl p-1 shadow-inner focus-within:border-blue-500 transition-all">
          <button className="p-3 text-gray-500 hover:text-blue-400 transition-colors">
            <Mic size={22} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message to MeeBot..."
            className="flex-1 bg-transparent border-none py-3 text-white focus:ring-0 placeholder:text-gray-600"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className={`p-3 rounded-xl transition-all ${
              input.trim() && !isTyping 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 hover:scale-105' 
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            <Send size={22} />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-600 mt-3 font-mono">
          Powered by Gemini 1.5 Pro | Conversations are encrypted on-chain
        </p>
      </div>
    </div>
  );
};

export default ChatPage;