"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, SendHorizontal, X, MessageSquare, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AIChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", content: "Hi! I'm your CSR Scout. Tell me your mandate (e.g., 'Find verified education NGOs in Delhi'), and I'll find matches." }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch('/api/ai/scout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMsg.content })
            });

            if (!res.ok) throw new Error("AI Failed");

            const data = await res.json();

            const botResponse = {
                role: "bot",
                content: data.message || "Here is what I found:",
                cards: data.matches || []
            };

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting to the scout network right now." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            {!isOpen && (
                <Button
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-blue-600 hover:bg-blue-700 z-50 transition-all hover:scale-105"
                    onClick={() => setIsOpen(true)}
                >
                    <Sparkles className="h-6 w-6 text-white" />
                </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
                    {/* Header */}
                    <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <Bot className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">CSR Scout AI</h3>
                                <p className="text-xs text-slate-300 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </Button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                                {msg.role === "bot" && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-blue-100 text-blue-700">AI</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "max-w-[80%] rounded-2xl p-3 text-sm",
                                    msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border shadow-sm rounded-tl-none text-slate-800"
                                )}>
                                    <p>{msg.content}</p>

                                    {/* Render "Smart Cards" if available */}
                                    {msg.cards && (
                                        <div className="mt-3 space-y-2">
                                            {msg.cards.map((card, idx) => (
                                                <div key={idx} className="bg-slate-50 border p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors block text-left">
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-bold text-slate-900">{card.title}</span>
                                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">{card.match}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">{card.reason}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-2 text-slate-400 text-xs ml-12">
                                <span className="animate-bounce">●</span>
                                <span className="animate-bounce delay-100">●</span>
                                <span className="animate-bounce delay-200">●</span>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ask me anything..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="flex-1 focus-visible:ring-blue-600"
                            />
                            <Button size="icon" className="bg-blue-600 hover:bg-blue-700" onClick={handleSend}>
                                <SendHorizontal size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
