"use client";

import React, { useState } from "react";

const Chatbot = () => {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const sendMessage = async () => {
        if (!message.trim()) return;
        setLoading(true);

        // Append user message to history before sending
        const newUserMessage = { role: "user", content: message };
        const updatedHistory = [...chatHistory, newUserMessage];

        try {
            const res = await fetch("/api/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userMessage: message, chatHistory: updatedHistory }), // Send full history
            });

            const data = await res.json();
            if (data.reply) {
                const newAiMessage = { role: "assistant", content: data.reply };
                setChatHistory([...updatedHistory, newAiMessage]); // Append AI response to history
            }
        } catch (error) {
            console.error("Error fetching response:", error);
        }

        setMessage(""); // Clear input field
        setLoading(false);
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* Chatbot Toggle Button */}
            <button 
                className="p-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600"
                onClick={() => setIsOpen(!isOpen)}
            >
                💬
            </button>

            {/* Chatbot Popup */}
            {isOpen && (
                <div className="w-96 p-4 border rounded-lg shadow-lg bg-white fixed bottom-16 right-5 z-50">
                    <h2 className="text-lg font-semibold text-black mb-2">Dance Bot</h2>

                    {/* Chat Display (Scrollable Area) */}
                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 max-h-72 min-h-56 overflow-y-auto flex flex-col space-y-2">
                        {chatHistory.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`p-3 rounded-lg max-w-[75%] ${
                                    msg.role === "user" 
                                        ? "bg-blue-500 text-white self-end" 
                                        : "bg-gray-300 text-black self-start"
                                }`}
                            >
                                {msg.content}
                            </div>
                        ))}
                    </div>

                    {/* Input & Send Button */}
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
