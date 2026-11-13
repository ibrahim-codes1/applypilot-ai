
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useChat } from "@ai-sdk/react";
import { ChatWorkspace } from "../components/chat-workspace.jsx";

// Mock AI SDK so no real API requests are made.
vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(),
}));

vi.mock("ai", () => ({
  DefaultChatTransport: class DefaultChatTransport {},
}));

const providerStatus = {
  configured: true,
  provider: "google",
};

function mockChat(overrides = {}) {
  const chat = {
    messages: [],
    setMessages: vi.fn(),
    sendMessage: vi.fn(),
    status: "ready",
    stop: vi.fn(),
    error: null,
    regenerate: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };

  vi.mocked(useChat).mockReturnValue(chat);
  return chat;
}

describe("ChatWorkspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    mockChat();
  });

  it("shows pending feedback while waiting for the first AI token", () => {
    const chat = mockChat({
      status: "submitted",
      messages: [
        {
          id: "user-1",
          role: "user",
          parts: [{ type: "text", text: "Help me prepare" }],
        },
      ],
    });

    render(<ChatWorkspace providerStatus={providerStatus} />);

    expect(
      screen.getByRole("status", {
        name: "ApplyPilot AI is preparing a response",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "Your message" })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /stop/i }));

    expect(chat.stop).toHaveBeenCalledOnce();
  });

  it("renders partial text while the AI response streams", () => {
    mockChat({
      status: "streaming",
      messages: [
        {
          id: "assistant-1",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "Here are **three interview tips**",
            },
          ],
        },
      ],
    });

    render(<ChatWorkspace providerStatus={providerStatus} />);

    expect(
      screen.getByRole("log", { name: "Conversation" })
    ).toHaveTextContent("Here are three interview tips");

    expect(
      screen.queryByRole("status", {
        name: "ApplyPilot AI is preparing a response",
      })
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /stop/i })
    ).toBeInTheDocument();
  });

  it("renders AI Markdown as accessible headings and lists", () => {
    mockChat({
      messages: [
        {
          id: "assistant-2",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "## Next Steps\n\n- Update your CV\n- Practice interviews",
            },
          ],
        },
      ],
    });

    render(<ChatWorkspace providerStatus={providerStatus} />);

    expect(
      screen.getByRole("heading", { name: "Next Steps" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Update your CV")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Practice interviews")
    ).toBeInTheDocument();
  });

  it("renders structured Job Match tool results", () => {
    mockChat({
      messages: [
        {
          id: "assistant-3",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "Your analysis is complete.",
            },
            {
              type: "tool-analyzeJobMatch",
              toolCallId: "tool-1",
              state: "output-available",
              output: {
                jobTitle: "Flutter Developer",
                score: 50,
                matchedCount: 2,
                totalRequirements: 4,
                matchedSkills: ["Flutter", "Dart"],
                missingSkills: ["REST APIs", "Widget Testing"],
              },
            },
          ],
        },
      ],
    });

    render(<ChatWorkspace providerStatus={providerStatus} />);

    expect(
      screen.getByRole("region", {
        name: "Job match analysis result",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("progressbar", {
        name: "Skill match percentage",
      })
    ).toHaveAttribute("aria-valuenow", "50");

    expect(screen.getByText("REST APIs")).toBeInTheDocument();
    expect(screen.getByText("Widget Testing")).toBeInTheDocument();
  });

  it("shows an accessible error and retries the failed response", async () => {
    const chat = mockChat({
      error: new Error("Network request failed"),
      messages: [
        {
          id: "user-2",
          role: "user",
          parts: [{ type: "text", text: "Analyze my skills" }],
        },
      ],
    });

    render(<ChatWorkspace providerStatus={providerStatus} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "The AI response failed or was interrupted."
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Retry AI Response" })
    );

    await waitFor(() => {
      expect(chat.regenerate).toHaveBeenCalledOnce();
    });
  });
});
