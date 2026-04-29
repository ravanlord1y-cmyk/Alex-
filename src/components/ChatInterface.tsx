import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, ArrowDown, Trash2, Cpu, Info, X, Zap, Code, MessageSquare, Sparkles } from "lucide-react";
import { Message, getAlexResponseStream } from "../services/geminiService";
import { ChatMessage } from "./ChatMessage";

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "model", 
      content: "Hello! I'm Alex, your dedicated AI Agent. How can I assist you in achieving your goals today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const assistantMessage: Message = { role: "model", content: "" };
      setMessages(prev => [...prev, assistantMessage]);

      const stream = getAlexResponseStream(updatedMessages);
      let fullResponse = "";

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { 
            role: "model", 
            content: fullResponse 
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [
        ...prev,
        { role: "model", content: "I encountered an error. Please check your API key or try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { icon: <Zap size={14} />, label: "Plan my day", text: "Help me plan a productive day." },
    { icon: <Code size={14} />, label: "Review code", text: "Can you help me review some code?" },
    { icon: <Sparkles size={14} />, label: "Creative idea", text: "Give me a creative project idea." },
  ];

  return (
    <div className="flex h-screen w-full bg-black relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar - Alex Profile */}
      <AnimatePresence>
        {showProfile && (
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="w-72 border-r border-neutral-800 glass z-30 flex flex-col hidden lg:flex"
          >
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
              <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-500">Alex Profile</h2>
              <button onClick={() => setShowProfile(false)} className="text-neutral-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-700 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <Cpu size={40} className="text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-white">Alex</h3>
                <p className="text-xs text-neutral-500 font-mono">Agent Version: v1.0.4-beta</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] uppercase font-mono tracking-[0.2em] text-neutral-600 mb-3">Core Directives</h4>
                  <ul className="space-y-2 text-xs text-neutral-400">
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" />
                      Assistance first
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" />
                      Technical precision
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" />
                      Dynamic adaptation
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-mono tracking-[0.2em] text-neutral-600 mb-3">Engine Status</h4>
                  <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-neutral-500 uppercase">Uptime</span>
                      <span className="text-[10px] text-emerald-500 font-mono tracking-widest">99.9%</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "95%" }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-neutral-800 bg-neutral-950/20">
              <p className="text-[10px] text-neutral-600 leading-relaxed font-mono">
                ALEX is an autonomous intelligence unit designed for multi-tasking and cognitive support.
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 glass border-b border-neutral-800 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {!showProfile && (
              <button 
                onClick={() => setShowProfile(true)}
                className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-all shadow-inner"
              >
                <Info size={16} />
              </button>
            )}
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold tracking-tight cursor-default">ALEX-01</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">System Active</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMessages([{ role: "model", content: "Hello! I'm Alex. How can I assist you today?" }])}
              className="p-2 text-neutral-500 hover:text-red-400 transition-colors rounded-lg hover:bg-neutral-900"
              title="Reset System"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
          <div className="max-w-3xl mx-auto w-full">
            {messages.map((msg, index) => (
              <ChatMessage 
                key={index} 
                message={msg} 
                isTyping={isLoading && index === messages.length - 1 && msg.content === ""}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <footer className="p-6 glass border-t border-neutral-800">
          <div className="max-w-3xl mx-auto w-full">
            {/* Quick Actions */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  disabled={isLoading}
                  onClick={() => handleSubmit(action.text)}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 hover:text-white hover:border-neutral-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Alex anything..."
                className="w-full bg-neutral-900/50 border border-neutral-800 text-neutral-100 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-neutral-600 shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all ${
                  !input.trim() || isLoading 
                    ? "text-neutral-600 cursor-not-allowed" 
                    : "text-white bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                }`}
              >
                <Send size={18} />
              </button>
            </form>
            <div className="mt-3 flex justify-center items-center gap-4">
              <p className="text-[10px] text-neutral-700 font-mono tracking-tighter">
                CORE: GEMINI_V3_FLASH
              </p>
              <div className="w-1 h-1 rounded-full bg-neutral-800" />
              <p className="text-[10px] text-neutral-700 font-mono tracking-tighter">
                SECURE_MODE: ON
              </p>
            </div>
          </div>
        </footer>

        {/* Scroll Button */}
        <AnimatePresence>
          {messages.length > 5 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={scrollToBottom}
              className="absolute bottom-32 right-8 p-3 rounded-full glass border-neutral-700 text-neutral-400 hover:text-white shadow-xl"
            >
              <ArrowDown size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
