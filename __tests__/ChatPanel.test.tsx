import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatPanel from "../components/ChatPanel";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Mock the GoogleGenerativeAI SDK
vi.mock("@google/generative-ai", () => {
  const sendMessageMock = vi.fn();
  const startChatMock = vi.fn(() => ({
    sendMessage: sendMessageMock,
  }));
  const getGenerativeModelMock = vi.fn(() => ({
    startChat: startChatMock,
  }));
  
  return {
    GoogleGenerativeAI: vi.fn(() => ({
      getGenerativeModel: getGenerativeModelMock,
    })),
  };
});

describe("ChatPanel", () => {
  beforeEach(() => {
    // Reset mocks and environment before each test
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = "test-api-key";
  });

  it("handles 429 Rate Limit error gracefully without crashing", async () => {
    // 1. Get the mocked GoogleGenerativeAI to simulate a 429 error
    const getGenAIMock = new GoogleGenerativeAI("test-api-key");
    const model = getGenAIMock.getGenerativeModel({ model: "gemini-test" });
    const chat = model.startChat();
    
    // Make the mock throw an error containing '429'
    vi.mocked(chat.sendMessage).mockRejectedValueOnce(new Error("429 Too Many Requests"));
    vi.mocked(chat.sendMessage).mockRejectedValueOnce(new Error("429 Too Many Requests"));

    render(<ChatPanel currentStep="registration" language="en" />);

    // Open chat panel
    const openButton = screen.getByLabelText("Open AI chat assistant");
    fireEvent.click(openButton);

    // Enter a message
    const input = screen.getByPlaceholderText("Ask about the election process...");
    fireEvent.change(input, { target: { value: "Hello" } });

    // Send the message
    const sendButton = screen.getByLabelText("Send message");
    fireEvent.click(sendButton);

    // We expect the fallback message to be displayed eventually
    await waitFor(() => {
      expect(screen.getByText(/VoteSmart hit its rate limit/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
