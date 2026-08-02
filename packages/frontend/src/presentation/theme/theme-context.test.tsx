import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/presentation/theme/theme-context";
import type { ReactNode } from "react";

function ToggleProbe() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} aria-label="toggle">
      {theme}
    </button>
  );
}

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <ToggleProbe />
    </ThemeProvider>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it("defaults to light when no preference stored", () => {
    renderWithTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(screen.getByRole("button").textContent).toBe("light");
  });

  it("reads a stored theme from localStorage", () => {
    localStorage.setItem("theme", "dark");
    renderWithTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(screen.getByRole("button").textContent).toBe("dark");
  });

  it("toggles between light and dark and persists", () => {
    renderWithTheme();
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("useTheme throws outside of a ThemeProvider", () => {
    expect(() => render(<ToggleProbe />)).toThrow();
  });
});