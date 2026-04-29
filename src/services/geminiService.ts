import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export interface Message {
  role: "user" | "model";
  content: string;
}

export const getAlexResponse = async (history: Message[]) => {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please configure it in the Secrets panel.");
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are Alex, a helpful, intelligent, and friendly AI assistant. Your tone is professional yet approachable, with a touch of modern tech-savvy wit. You respond concisely but with depth. Your goal is to assist the user while maintaining your unique persona as 'Alex'.",
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
    });

    // We assume the last message in history is the new user message
    const lastMessage = history[history.length - 1];
    const response = await chat.sendMessage({
      message: lastMessage.content
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

export const getAlexResponseStream = async function* (history: Message[]) {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please configure it in the Secrets panel.");
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are Alex, a helpful, intelligent, and friendly AI assistant. Your tone is professional yet approachable, with a touch of modern tech-savvy wit. You respond concisely but with depth. Your goal is to assist the user while maintaining your unique persona as 'Alex'.",
      },
      history: history.slice(0, -1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
    });

    const lastMessage = history[history.length - 1];
    const stream = await chat.sendMessageStream({
      message: lastMessage.content
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error during streaming Gemini API:", error);
    throw error;
  }
};
