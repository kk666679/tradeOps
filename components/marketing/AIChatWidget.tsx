"use client";

import { Bot, MessageSquare, X, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputBody,
} from "@/components/ai-elements/prompt-input";
import {
  Message,
  MessageContent,
} from "@/components/ai-elements/message";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am your TradeOps AI Agent. I can help you with HS codes, free zone regulations, customs declarations, brokerage workflows, or any TradeOps capabilities. How can I assist you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, role: "user" | "assistant") => {
    if (!text) return;
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content: text,
    };
    setMessages((prev) => [...prev, message]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    addMessage(userText, "user");
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you look up HS codes, check free zone eligibility, or generate customs documentation. What specific trade operation are you working with?",
        "For Malaysian Free Zones (FCZ, FIZ), I can help you navigate the regulations, licensing requirements, and customs procedures. What zone are you interested in?",
        "Let me explain how TradeOps can streamline your brokerage workflows. Would you like to schedule a demo or explore specific modules?",
        "I can assist with trade documentation, BOM analysis, compliance checks, and supply chain visibility. Tell me more about your use case.",
        "Our platform integrates with customs systems, ERP solutions, and digital trade corridors. Which integration are you looking to implement?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        ?? "I don't have a response available right now.";

      addMessage(randomResponse, "assistant");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <Card className="w-[380px] h-[500px] flex flex-col border-white/10 bg-[#0A0A0A]/95 backdrop-blur-2xl shadow-2xl animate-in slide-in-from-bottom-4 fade-in">
          <CardHeader className="border-b border-white/10 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">AI Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <Message key={message.id} from={message.role} className="gap-1">
                <MessageContent className="text-sm bg-white/5 rounded-lg px-3 py-2">
                  {message.content}
                </MessageContent>
              </Message>
            ))}
            {isLoading && (
              <Message from="assistant" className="gap-1">
                <MessageContent className="text-sm bg-white/5 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="flex gap-1">
                      <span className="animate-bounce w-1.5 h-1.5 bg-slate-400 rounded-full [animation-delay:-0.3s]"></span>
                      <span className="animate-bounce w-1.5 h-1.5 bg-slate-400 rounded-full [animation-delay:-0.15s]"></span>
                      <span className="animate-bounce w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                    </div>
                    <span className="text-xs">Thinking...</span>
                  </div>
                </MessageContent>
              </Message>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="border-t border-white/10 p-3">
            <PromptInput
              className="w-full"
              onSubmit={(message) => {
                const text = typeof message === "string" ? message : message.text;
                if (!text) return;
                addMessage(text, "user");
                setInput("");
                setIsLoading(true);

                // Simulate AI response
                setTimeout(() => {
                  const responses = [
                    "I can help you look up HS codes, check free zone eligibility, or generate customs documentation. What specific trade operation are you working with?",
                    "For Malaysian Free Zones (FCZ, FIZ), I can help you navigate the regulations, licensing requirements, and customs procedures. What zone are you interested in?",
                    "Let me explain how TradeOps can streamline your brokerage workflows. Would you like to schedule a demo or explore specific modules?",
                    "I can assist with trade documentation, BOM analysis, compliance checks, and supply chain visibility. Tell me more about your use case.",
                    "Our platform integrates with customs systems, ERP solutions, and digital trade corridors. Which integration are you looking to implement?",
                  ];
                  const randomResponse = responses[Math.floor(Math.random() * responses.length)]
                    ?? "I don't have a response available right now.";
                  addMessage(randomResponse, "assistant");
                  setIsLoading(false);
                }, 1000);
              }}
            >
              <PromptInputBody>
                <PromptInputTextarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about TradeOps..."
                  className="min-h-[40px] text-sm"
                />
                <PromptInputSubmit className="h-8 w-8">
                  <Send className="w-4 h-4" />
                </PromptInputSubmit>
              </PromptInputBody>
            </PromptInput>
          </CardFooter>
        </Card>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-110 transition-transform"
        aria-label="Open AI assistant"
      >
        <div className="absolute inset-0 rounded-full bg-blue-400 blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <Bot className="relative z-10 w-7 h-7 text-white" />
      </button>
    </div>
  );
}
