import { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(16);         // 14 / 16 / 20 / 24
  const [highContrast, setHighContrast] = useState(false);
  const [priyaMode, setPriyaMode] = useState(false);
  const [signActive, setSignActive] = useState(false);
  
  const [ttsSpeed, setTtsSpeed] = useState(1);
const [hoverMode, setHoverMode] = useState(false);
  const [colourBlind, setColourBlind] = useState("none"); // none | protanopia | deuteranopia
          // 0.5 | 1 | 1.5
  
  // Apply font size + contrast to :root CSS vars whenever they change
  useEffect(() => {
    const root = document.documentElement;

    // Font size — set both CSS var AND body directly
    root.style.setProperty("--font-size-base", `${fontSize}px`);
    document.documentElement.style.fontSize = `${fontSize}px`;

    // Contrast CSS vars
    root.style.setProperty("--bg-primary",     highContrast ? "#000000" : "#ffffff");
    root.style.setProperty("--text-primary",   highContrast ? "#ffffff" : "#0f172a");
    root.style.setProperty("--text-secondary", highContrast ? "#facc15" : "#64748b");
    root.style.setProperty("--border-color",   highContrast ? "#ffffff" : "#e2e8f0");
    root.style.setProperty("--card-bg",        highContrast ? "#1a1a1a" : "#f8fafc");

    // Colour-blind CSS filters
    const filters = {
      none:         "none",
      protanopia:   "url(#protanopia)",
      deuteranopia: "url(#deuteranopia)",
    };
    document.body.style.filter = filters[colourBlind] || "none";

    // High-contrast class for components that need it
    document.body.classList.toggle("high-contrast", highContrast);

  }, [fontSize, highContrast, colourBlind]);

  // Priya Mode: turns on all accessibility features at once
  const togglePriyaMode = () => {
    const next = !priyaMode;
    setPriyaMode(next);
    if (next) {
      setHighContrast(true);
      setFontSize(20);
      setSignActive(true);
    } else {
      setHighContrast(false);
      setFontSize(16);
      setSignActive(false);
    }
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = ttsSpeed;
    window.speechSynthesis.speak(utt);
  };

  const value = {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    priyaMode,
    setPriyaMode,
    togglePriyaMode,
    hoverMode,
setHoverMode,
    signActive,
    setSignActive,
    colourBlind,
    setColourBlind,
    ttsSpeed,
    setTtsSpeed,
    speak,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {/* SVG filters for colour-blind modes — hidden, applied via CSS filter on body */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="protanopia">
            <feColorMatrix
              type="matrix"
              values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </AccessibilityContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx)
    throw new Error("useAccessibility must be used inside AccessibilityProvider");
  return ctx;
}