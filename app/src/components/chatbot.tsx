"use client";

import React, { useState } from "react";

const Chatbot = () => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

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
            if (data.reply) {
                setResponse(formatResponse(data.reply));
            } else {
                setResponse("No response received.");
            }
        } catch (error) {
            console.error("Error fetching response:", error);
            setResponse("Error getting response from AI.");
        }

        setLoading(false);
    };

    // Format response: Adds bold styling and line breaks
    const formatResponse = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold (**text**)
            .replace(/\* (.*?)\*/g, "<li>$1</li>") // Bullet points (* item *)
            .replace(/\n/g, "<br />"); // Preserve new lines
    };

    return (
        <div className="p-4 border rounded-lg shadow-md max-w-lg bg-white">
            <h2 className="text-xl font-semibold text-black">Ask about a Dance</h2>

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

            {/* Display chatbot response */}
            {response && (
                <div
                    className="chat-response mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg text-black leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: response }} // Render formatted text
                />
            )}
        </div>
    );
};

export default Chatbot;
