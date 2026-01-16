import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface Message {
  role: "user" | "model";
  text: string;
}

export function useGemini() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Hello! I am your MeeChain assistant. Ask me anything about the ecosystem, tokens, or how to get started." }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !API_KEY) return;

    const newMessages = [...messages, { role: "user" as const, text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const chat = model.startChat({
        history: newMessages.slice(0, -1).map(m => ({
          role: m.role,
          parts: [{ text: m.text }],
        })),
      });

      const result = await chat.sendMessage(text);
      const response = await result.response;
      const responseText = response.text();

      setMessages([...newMessages, { role: "model", text: responseText }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages([...newMessages, { role: "model", text: "I'm having trouble connecting to the network right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
}
