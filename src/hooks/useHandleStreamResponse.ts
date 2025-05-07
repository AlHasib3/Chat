/*
Purpose of this file: A custom React hook to handle streaming responses from an API.
It processes data in chunks and triggers a callback function when the complete message is formed.
Relationship with other files: The Chat.tsx component uses this hook to receive and display streaming data.
Required packages: react (for using useCallback, useState, etc.).

Important Note: In the original code, `useHandleStreamResponse` was imported from an external `../utilities/runtime-helpers`.
Since the code for that file is not available here, this is a basic and functional implementation.
You might need to modify or enhance it based on your specific streaming logic or format.
It uses asynchronous generators and the ReadableStream API to process data.
*/
import { useCallback } from 'react';

interface UseHandleStreamResponseOptions {
  onChunk: (chunk: string) => void; // Called after each data chunk is received
  onFinish: (fullMessage: string) => void; // Called with the full message when streaming ends
  onError?: (error: Error) => void; // Called if an error occurs
}

export const useHandleStreamResponse = ({
  onChunk,
  onFinish,
  onError,
}: UseHandleStreamResponseOptions) => {
  const handleStream = useCallback(async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Streaming error response:", errorText);
      if (onError) {
        onError(new Error(`API request failed with status ${response.status}: ${errorText}`));
      } else {
        onChunk(`Error: ${response.status}. ${errorText || "Unable to fetch response."}`);
        onFinish("");
      }
      return;
    }

    if (!response.body) {
      if (onError) {
        onError(new Error("Response body is null."));
      } else {
        onChunk("Error: Response body is empty.");
        onFinish("");
      }
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullMessage = "";
    // let buffer = ""; // Buffer might be needed for more complex stream parsing (e.g. JSON objects per chunk)

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const decodedChunk = decoder.decode(value, { stream: true }); // stream: true for intermediate chunks
        fullMessage += decodedChunk;
        onChunk(fullMessage); // Call onChunk with the accumulating full message
      }
    } catch (error) {
      console.error("Error reading stream:", error);
      if (onError) {
        onError(error as Error);
      } else {
        onChunk("Error: Could not read stream.");
      }
    } finally {
      // The last part of the stream might not be decoded if stream:true was used for all chunks
      // However, TextDecoder handles this if 'done' is reached.
      // If any remaining part in a buffer needs processing, it would be done here.
      onFinish(fullMessage);
      reader.releaseLock();
    }
  }, [onChunk, onFinish, onError]);

  return handleStream;
};