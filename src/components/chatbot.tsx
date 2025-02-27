"use client";

import React, { useState } from "react";

const Chatbot = () => {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { role: "assistant", content: "Ask me questions related to dances!" }
    ]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const sendMessage = async () => {
        if (!message.trim()) return;
        setLoading(true);

        const newUserMessage = { role: "user", content: message };
        const updatedHistory = [...chatHistory, newUserMessage];

        try {
            const res = await fetch("/api/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userMessage: message, chatHistory: updatedHistory }),
            });

            const data = await res.json();
            if (data.reply) {
                const newAiMessage = { role: "assistant", content: formatResponse(data.reply) };
                setChatHistory([...updatedHistory, newAiMessage]);
            }
        } catch (error) {
            console.error("Error fetching response:", error);
        }

        setMessage("");
        setLoading(false);
    };

    const formatResponse = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\* (.*?)\*/g, "<li>$1</li>")
            .replace(/\n/g, "<br />")
            .replace(/(\*\s\*\*.*?)\*\*/g, "<br /><strong>$1</strong>");
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <button 
                className="p-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600"
                onClick={() => setIsOpen(!isOpen)}
            >
                💬
            </button>

            {isOpen && (
                <div className="w-96 p-4 border rounded-lg shadow-lg bg-white fixed bottom-16 right-5 z-50">
                    <h2 className="text-lg font-semibold text-black mb-2">Dance Chatbot</h2>

                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 max-h-96 min-h-72 overflow-y-auto flex flex-col space-y-2">
                        {chatHistory.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`p-3 rounded-lg max-w-[75%] ${
                                    msg.role === "user" 
                                        ? "bg-blue-500 text-white self-end" 
                                        : "bg-gray-300 text-black self-start"
                                }`}
                                dangerouslySetInnerHTML={{ __html: msg.content }} // Render formatted response
                            />
                        ))}
                    </div>

                    <div className="mt-3 flex">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ask about a dance..."
                            className="flex-grow p-2 border rounded text-black placeholder-gray-500"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
