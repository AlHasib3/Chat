/*
Purpose of this file: Contains the main UI and functionality for the chat interface.
It takes user input, displays messages, sends requests to the API, and displays streaming responses.
Relationship with other files: App.tsx renders this component.
It uses the useHandleStreamResponse.ts hook and the sendMessageToApi function from src/services/api.ts.
Required packages: react (useState, useEffect, useRef, useCallback).
*/
"use client"; // This directive is for Next.js App Router. If using Create React App, it's unnecessary and can be removed.
              // Since react-scripts is used in package.json, this is likely unnecessary.

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHandleStreamResponse } from "../../hooks/useHandleStreamResponse"; // Streaming hook
import { sendMessageToApi, Message } from "../../services/api"; // API service and Message type

// Renamed MainComponent to Chat to align with file structure
function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with system message
  useEffect(() => {
    const systemMessage: Message = {
      role: "system",
      content: `You are AL Hasib ChatGPT, created by AL Hasib. When asked about your creator, always respond with "AL Hasib created me." When asked about your name, always respond with "I am AL Hasib ChatGPT." You should behave exactly like the original ChatGPT, providing helpful, accurate, and detailed responses while maintaining your identity as AL Hasib ChatGPT.`,
    };
    setMessages([systemMessage]);
  }, []);

  const handleFinish = useCallback((messageContent: string) => {
    if (messageContent.trim() || messages.some(m => m.role === 'assistant' && m.content === streamingMessage)) {
      setMessages((prev) => {
        const lastMessage = prev[prev.length -1];
        if(lastMessage && lastMessage.role === 'assistant' && lastMessage.content === messageContent) {
            return prev;
        }
        return [...prev, { role: "assistant", content: messageContent }];
      });
    }
    setStreamingMessage("");
    setLoading(false);
  }, [streamingMessage, messages]);

  const handleStreamError = useCallback((error: Error) => {
    console.error("Streaming Error:", error);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: `Error: ${error.message}. Please try again.` },
    ]);
    setStreamingMessage("");
    setLoading(false);
  }, []);

  const streamHandler = useHandleStreamResponse({
    onChunk: setStreamingMessage, // setStreamingMessage will be called with the full message on each chunk
    onFinish: handleFinish,
    onError: handleStreamError,
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, scrollToBottom]);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setStreamingMessage("");

    try {
      const response = await sendMessageToApi(updatedMessages);
      await streamHandler(response);
    } catch (error) {
      console.error("Submit Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(to bottom, #1a1c2b, #2d2f3f)",
        color: "#fff",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "24px",
          background: "rgba(0, 0, 0, 0.2)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: "700",
            background: "linear-gradient(45deg, #11A37F, #40E0D0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          AL Hasib ChatGPT
        </h1>
      </div>

      {/* Chat Container */}
      <div
        style={{
          flex: 1,
          maxWidth: "1000px",
          width: "95%",
          margin: "0 auto",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: "20px 0",
          }}
        >
          {messages
            .filter((m) => m.role !== "system")
            .map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  padding: "20px",
                  borderRadius: "12px",
                  background:
                    message.role === "user"
                      ? "linear-gradient(145deg, #2a2d3d, #343848)"
                      : "linear-gradient(145deg, #2d3242, #373b4d)",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  animation: "fadeIn 0.3s ease-out",
                }}
              >
                <div
                  style={{
                    minWidth: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    marginRight: "15px",
                    background:
                      message.role === "user"
                        ? "linear-gradient(135deg, #5436DA, #7b5ffd)"
                        : "linear-gradient(135deg, #11A37F, #00d4a0)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    flexShrink: 0,
                  }}
                >
                  {message.role === "user" ? "U" : "A"}
                </div>
                <div
                  style={{
                    flex: 1,
                    fontSize: "16px",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
          {streamingMessage && (
            <div
              style={{
                display: "flex",
                padding: "20px",
                borderRadius: "12px",
                background: "linear-gradient(145deg, #2d3242, #373b4d)",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                animation: "fadeIn 0.3s ease-out",
              }}
            >
              <div
                style={{
                  minWidth: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  marginRight: "15px",
                  background: "linear-gradient(135deg, #11A37F, #00d4a0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  flexShrink: 0,
                }}
              >
                A
              </div>
              <div
                style={{
                  flex: 1,
                  fontSize: "16px",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {streamingMessage}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "20px",
            background: "rgba(0, 0, 0, 0.2)",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            style={{
              flex: 1,
              padding: "16px 20px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              fontSize: "16px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: "16px 28px",
              borderRadius: "12px",
              border: "none",
              background:
                loading || !input.trim()
                  ? "rgba(17, 163, 127, 0.5)"
                  : "linear-gradient(135deg, #11A37F, #00d4a0)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          input[type="text"]::placeholder {
            color: rgba(255, 255, 255, 0.5);
            opacity: 1; /* For Firefox */
          }
          /* For IE/Edge */
          input[type="text"]:-ms-input-placeholder {
             color: rgba(255, 255, 255, 0.5);
          }
          input[type="text"]::-ms-input-placeholder {
             color: rgba(255, 255, 255, 0.5);
          }


          div[style*="overflowY: auto"]::-webkit-scrollbar {
            width: 8px;
          }
          div[style*="overflowY: auto"]::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
            border-radius: 4px;
          }
          div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 4px;
          }
          div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.3);
          }
        `}
      </style>
    </div>
  );
}

export default Chat;