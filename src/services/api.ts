/*
Purpose of this file: Functions related to API calls will be placed here.
It helps manage network requests from a centralized location.
Relationship with other files: The handleSubmit function in the Chat.tsx component will use the sendMessageToApi function from this module.
Required packages: No specific package is required by default here; the fetch API is used.
*/

// Message interface, also used in Chat.tsx
export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }
  
  // Interface for the payload to be sent to the API
  interface ChatRequestBody {
    messages: Message[];
    stream: boolean;
  }
  
  /**
   * Sends chat messages to the API.
   * @param messages - The list of messages to send.
   * @returns A Promise that resolves to the API Response object.
   */
  export const sendMessageToApi = async (messages: Message[]): Promise<Response> => {
    try {
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages,
          stream: true, // Streaming is always enabled, as per the original code
        } as ChatRequestBody),
      });
      return response;
    } catch (error) {
      console.error("API Error in sendMessageToApi:", error);
      // A custom or generic error response could be created and returned
      // so the caller can handle it gracefully.
      // For now, re-throwing the original error.
      throw error;
    }
  };