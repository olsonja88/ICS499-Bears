"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ChatMessage {
    sender: "user" | "bot";
    text: string;
}

interface ChatbotContextProps {
    chatHistory: ChatMessage[];
    addMessage: (message: ChatMessage) => void;
    resetChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextProps | undefined>(undefined);

export const ChatbotProvider = ({ children }: { children: React.ReactNode }) => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
        // Load chat history from local storage on first render
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("chatHistory") || "[]");
        }
        return [];
    });

    useEffect(() => {
        // Save chat history in local storage whenever it updates
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }, [chatHistory]);

    const addMessage = (message: ChatMessage) => {
        setChatHistory((prev) => [...prev, message]);
    };

    const resetChat = () => {
        setChatHistory([{ sender: "bot", text: "Ask me questions related to dances!" }]);
    };
    
    return (
        <ChatbotContext.Provider value={{ chatHistory, addMessage, resetChat }}>
            {children}
        </ChatbotContext.Provider>
    );
};

export const useChatbot = () => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error("useChatbot must be used within a ChatbotProvider");
    }
    return context;
};
