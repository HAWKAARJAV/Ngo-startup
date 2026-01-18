"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, MoreVertical, Phone, Video } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
    const searchParams = useSearchParams();
    const ngoId = searchParams.get('ngoId');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can we help you today?", sender: "ngo", time: "10:00 AM" },
    ]);
    const [newMessage, setNewMessage] = useState("");

    const handleSend = () => {
        if (!newMessage.trim()) return;
        setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setNewMessage("");

        // Mock auto-reply
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now(), text: "Thanks for reaching out! An NGO manager will reply shortly.", sender: "ngo", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }, 1000);
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-4">
            {/* Sidebar (List of chats - Mock for now) */}
            <div className="w-80 border-r border-slate-200 hidden md:flex flex-col">
                <div className="p-4 border-b border-slate-100 font-bold text-lg">Messages</div>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-600 cursor-pointer hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src="https://ui-avatars.com/api/?name=Smile+Foundation&background=0D8ABC&color=fff" />
                                <AvatarFallback>SF</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold text-sm text-slate-900">Smile Foundation</div>
                                <div className="text-xs text-slate-500 truncate w-40">Thanks for reaching out!</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 cursor-pointer hover:bg-slate-50 opacity-60">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>G</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold text-sm text-slate-900">Goonj</div>
                                <div className="text-xs text-slate-500 truncate w-40">Looking forward to the pa...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${ngoId ? 'Target NGO' : 'Smile Foundation'}&background=0D8ABC&color=fff`} />
                            <AvatarFallback>NG</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-bold text-slate-900">
                                {ngoId ? "Connecting with NGO..." : "Smile Foundation"}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-green-600">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Online
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Button variant="ghost" size="icon"><Phone size={18} /></Button>
                        <Button variant="ghost" size="icon"><Video size={18} /></Button>
                        <Button variant="ghost" size="icon"><MoreVertical size={18} /></Button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${msg.sender === 'me'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                                }`}>
                                {msg.text}
                                <div className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {msg.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-2"
                    >
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
                        />
                        <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
                            <Send size={18} />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
