"use client";

import { useState, useEffect, useRef } from "react";
import { useChatbot } from "@/context/chatbotcontext";

const Chatbot = () => {
    const { chatHistory, addMessage } = useChatbot();
    const [message, setMessage] = useState("");
    const [pendingMessage, setPendingMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    // saves scroll position before closing
    const handleChatbotToggle = () => {
        if (isOpen && chatContainerRef.current) {
            setScrollPosition(chatContainerRef.current.scrollTop);
        }
        setIsOpen(!isOpen);
    };

    // restores scroll position when reopening
    useEffect(() => {
        if (isOpen && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = scrollPosition;
        }
    }, [isOpen]);

    // auto-scrolls to the latest message
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // auto-focuses input when opening
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        setPendingMessage(message);
        setLoading(true);

        addMessage({ sender: "user", text: message });
        setMessage("");

        try {
            const res = await fetch("/api/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userMessage: message }),
            });

            const data = await res.json();
            const botMessage = formatResponse(data.reply || "No response received.");
            addMessage({ sender: "bot", text: botMessage });
        } catch (error) {
            console.error("Error fetching response:", error);
            addMessage({ sender: "bot", text: "Error getting response from AI." });
        }

        setPendingMessage("");
        setLoading(false);
    };

    // formats the bot response for better readability
    const formatResponse = (text: string) => {
        return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br />");
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* chatbot toggle button */}
            <button
                className="p-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600"
                onClick={handleChatbotToggle}
            >
                💬
            </button>

            {isOpen && (
                <div className="w-96 h-[500px] p-4 border rounded-lg shadow-lg bg-white fixed bottom-16 right-5 z-50 flex flex-col">
                    {/* header with close (X) button */}
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold text-black">Dance Chatbot</h2>
                        <button 
                            onClick={handleChatbotToggle} 
                            className="text-black text-xl font-bold hover:text-gray-600"
                        >
                            ✖
                        </button>
                    </div>

                    {/* chat message container */}
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto bg-gray-100 p-2 rounded-md max-h-[400px] space-y-2">
                        {chatHistory.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg max-w-[80%] text-sm leading-relaxed ${
                                    msg.sender === "user"
                                        ? "bg-blue-500 text-white self-end ml-auto"
                                        : "bg-gray-300 text-black self-start"
                                }`}
                                dangerouslySetInnerHTML={{ __html: msg.text }}
                            />
                        ))}
                        {loading && (
                            <div className="p-3 bg-gray-300 text-black self-start rounded-lg max-w-[80%] flex items-center">
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full"></span>
                                <span className="ml-2">Thinking...</span>
                            </div>
                        )}
                    </div>

                    {/* input area */}
                    <div className="mt-2 flex">
                        <input
                            ref={inputRef}
                            type="text"
                            value={loading ? pendingMessage : message}
                            onChange={(e) => !loading && setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask about a dance..."
                            className="flex-1 p-2 border rounded text-black placeholder-gray-500"
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                        >
                            {loading ? (
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                "➤"
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
