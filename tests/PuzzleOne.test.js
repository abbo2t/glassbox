import "./mocks/matchMedia.mock";
import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react-native";
import { Appearance } from "react-native";
import PuzzleOne from "../components/PuzzleOne";

describe("<PuzzleOne />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("switches to light mode and back to dark mode", async () => {
    let currentScheme = "dark";
    jest
      .spyOn(Appearance, "getColorScheme")
      .mockImplementation(() => currentScheme);

    const appearanceListeners = [];
    jest
      .spyOn(Appearance, "addChangeListener")
      .mockImplementation((handler) => {
        appearanceListeners.push(handler);
        return { remove: jest.fn() };
      });

    render(<PuzzleOne />);

    expect(screen.getByText(/good luck!/i)).toBeTruthy();
    await waitFor(() => expect(Appearance.addChangeListener).toHaveBeenCalled());
    expect(appearanceListeners.length).toBeGreaterThan(0);

    act(() => {
      currentScheme = "light";
      appearanceListeners.forEach((handler) =>
        handler({ colorScheme: "light" })
      );
    });

    expect(await screen.findByText(/almost there!/i)).toBeTruthy();

    act(() => {
      currentScheme = "dark";
      appearanceListeners.forEach((handler) =>
        handler({ colorScheme: "dark" })
      );
    });

    expect(await screen.findByText(/nice!/i)).toBeTruthy();
  });
});
