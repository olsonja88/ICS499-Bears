import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/header";
import { ChatbotProvider } from "@/context/chatbotcontext";
import Chatbot from "@/components/chatbot";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dancepedia",
  description: "Dancepedia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ChatbotProvider> {/* Ensure ChatbotProvider wraps everything */}
          <Header />
          {children}
          <Chatbot /> {/* Add Chatbot inside provider for persistence */}
        </ChatbotProvider>
      </body>
    </html>
  );
}