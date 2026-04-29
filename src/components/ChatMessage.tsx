import React from "react";
import { motion } from "motion/react";
import { User, Cpu } from "lucide-react";
import { Message } from "../services/geminiService";

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isTyping }) => {
  const isAlex = message.role === "model";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full mb-6 ${isAlex ? "justify-start" : "justify-end"}`}
    >
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isAlex ? "flex-row" : "flex-row-reverse"}`}>
        <div 
          className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border ${
            isAlex 
              ? "bg-neutral-900 border-neutral-700 text-neutral-300 mr-3" 
              : "bg-blue-600 border-blue-500 text-white ml-3"
          }`}
        >
          {isAlex ? <Cpu size={16} /> : <User size={16} />}
        </div>
        
        <div 
          className={`px-4 py-3 rounded-2xl ${
            isAlex 
              ? "bg-neutral-900/80 border border-neutral-800 text-neutral-200 rounded-tl-none" 
              : "bg-neutral-100 text-neutral-950 rounded-tr-none"
          }`}
        >
          {isAlex && (
            <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 mb-1">
              Alex
            </div>
          )}
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
            {isTyping && (
              <span className="inline-flex gap-1 ml-1">
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-neutral-400"
                />
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-neutral-400"
                />
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-1.5 h-1.5 rounded-full bg-neutral-400"
                />
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
