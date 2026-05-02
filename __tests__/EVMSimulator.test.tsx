import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EVMSimulator from "../components/EVMSimulator";
import * as UserContext from "../context/UserContext";

// Mock the UserContext to provide a stable useUser hook
vi.mock("../context/UserContext", () => {
  return {
    useUser: vi.fn(),
  };
});

describe("EVMSimulator", () => {
  it("mounts, simulates voting, and shows VVPAT slip", async () => {
    const mockAddExp = vi.fn();
    const mockAwardBadge = vi.fn();
    const mockSetDigitalMark = vi.fn();
    
    // Provide mocked context values
    vi.mocked(UserContext.useUser).mockReturnValue({
      user: { name: "Test User", loginType: "guest", exp: 0, badges: [], hasDigitalMark: false },
      isLoggedIn: true,
      login: vi.fn(),
      logout: vi.fn(),
      addExp: mockAddExp,
      awardBadge: mockAwardBadge,
      setDigitalMark: mockSetDigitalMark,
    });

    // We use vitest's fake timers to speed up the test.
    vi.useFakeTimers();

    render(<EVMSimulator language="en" />);

    // 1. Initial State
    expect(screen.getByText("Press a blue button on the EVM to cast your vote")).toBeInTheDocument();
    
    const voteButton = screen.getByRole("button", { name: "Vote for Candidate A" });
    expect(voteButton).toBeInTheDocument();

    // 2. Click Candidate Button
    fireEvent.click(voteButton);

    // It should immediately enter 'pressed' state, showing BEEP!
    expect(screen.getByText("BEEP!")).toBeInTheDocument();

    // 3. VVPAT verification
    // Advance past the 800ms timeout to enter VVPAT state
    act(() => {
      vi.advanceTimersByTime(850); 
    });
    
    // It should now show the VVPAT state with the candidate details
    expect(screen.getAllByText("Candidate A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("National Progress Party").length).toBeGreaterThan(0);
    expect(screen.getByText(/Slip visible for/)).toBeInTheDocument();

    // 4. Verification of completing voting
    act(() => {
      vi.advanceTimersByTime(7500); // Advance past the 7 seconds VVPAT timer
    });
    
    // Should show Vote Recorded
    expect(screen.getByText("Vote Recorded!")).toBeInTheDocument();
    expect(mockAddExp).toHaveBeenCalledWith(100);
    expect(mockAwardBadge).toHaveBeenCalledWith("virtual-voter");
    expect(mockSetDigitalMark).toHaveBeenCalledWith(true);

    vi.useRealTimers();
  });
});
