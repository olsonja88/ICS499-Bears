"use client";

import React, { useState } from "react";

const Chatbot = () => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const sendMessage = async () => {
        if (!message.trim()) return;
        setLoading(true);

        try {
            const res = await fetch("/api/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userMessage: message }),
            });

            const data = await res.json();
            setResponse(formatResponse(data.reply || "No response received."));
        } catch (error) {
            console.error("Error fetching response:", error);
            setResponse("Error getting response from AI.");
        }

        setLoading(false);
    };

    // Format response for better readability (bold text, lists, line breaks)
    const formatResponse = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold (**text** → <strong>text</strong>)
            .replace(/\* (.*?)\*/g, "<li>$1</li>") // Bullet points (* item * → <li>item</li>)
            .replace(/\n/g, "<br />"); // Preserve new lines
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
                <div className="w-80 p-4 border rounded-lg shadow-lg bg-white fixed bottom-16 right-5 z-50">
                    <h2 className="text-lg font-semibold text-black">Ask about a Dance</h2>

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask about a dance..."
                        className="w-full p-2 mt-2 border rounded text-black placeholder-gray-500"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                    >
                        {loading ? "Thinking..." : "Send"}
                    </button>

                    {/* Scrollable Chatbot Response */}
                    {response && (
                        <div 
                            className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg text-black leading-relaxed overflow-y-auto max-h-40"
                            dangerouslySetInnerHTML={{ __html: response }} // Render formatted response
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Chatbot;
