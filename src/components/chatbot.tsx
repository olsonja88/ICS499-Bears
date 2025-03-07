"use client";

import { useState, useEffect, useRef } from "react";
import { useChatbot } from "@/context/chatbotcontext";
import styles from "./chatbot.module.css";

const Chatbot = () => {
    const { chatHistory, addMessage } = useChatbot();
    const [message, setMessage] = useState("");
    const [pendingMessage, setPendingMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    // Saves scroll position before closing
    const handleChatbotToggle = () => {
        if (isOpen && chatContainerRef.current) {
            setScrollPosition(chatContainerRef.current.scrollTop);
        }
        setIsOpen(!isOpen);
    };

    // Restores scroll position when reopening
    useEffect(() => {
        if (isOpen && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = scrollPosition;
        }
    }, [isOpen]);

    // Auto-scrolls to the latest message
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // Auto-focuses input when opening
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

    // Formats bot responses for better readability
    const formatResponse = (text: string) => {
        return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br />");
    };

    return (
        <div className={styles.chatbotContainer}>
            {/* Chatbot Toggle Button */}
            <button className={styles.chatbotToggle} onClick={handleChatbotToggle}>
                💬
            </button>

            {isOpen && (
                <div className={styles.chatbotWindow}>
                    {/* Header with Close (X) Button */}
                    <div className={styles.chatbotHeader}>
                        <h2 className={styles.chatbotTitle}>Dance Chatbot</h2>
                        <button className={styles.closeButton} onClick={handleChatbotToggle}>
                            ✖
                        </button>
                    </div>

                    {/* Chat Message Container */}
                    <div ref={chatContainerRef} className={styles.chatContainer}>
                        {chatHistory.map((msg, index) => (
                            <div
                                key={index}
                                className={`${styles.chatMessage} ${
                                    msg.sender === "user" ? styles.userMessage : styles.botMessage
                                }`}
                                dangerouslySetInnerHTML={{ __html: msg.text }}
                            />
                        ))}
                        {loading && (
                            <div className={`${styles.botMessage} ${styles.loadingMessage}`}>
                                <span className={styles.spinner}></span>
                                <span>Thinking...</span>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className={styles.inputArea}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={loading ? pendingMessage : message}
                            onChange={(e) => !loading && setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask about a dance..."
                            className={styles.chatInput}
                            disabled={loading}
                        />
                        <button onClick={sendMessage} disabled={loading} className={styles.sendButton}>
                            {loading ? <span className={styles.spinner}></span> : "➤"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
