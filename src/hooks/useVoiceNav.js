import { useEffect, useRef, useState, useCallback } from "react";
import { useAccessibility } from "../context/AccessibilityContext";
import { useNavigate } from "react-router-dom";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

// ── Command definitions ───────────────────────────────────────────────────────
// Each entry: { keywords, description, category, action }
// action receives (navigate, accessibilityContext) and returns a feedback string

export const COMMANDS = [
  // Navigation
  {
    keywords: ["scroll down", "go down", "move down", "page down"],
    description: "Scroll down the page",
    category: "navigation",
    action: () => { window.scrollBy({ top: 300, behavior: "smooth" }); return "Scrolling down"; },
  },
  {
    keywords: ["scroll up", "go up", "move up", "page up"],
    description: "Scroll up the page",
    category: "navigation",
    action: () => { window.scrollBy({ top: -300, behavior: "smooth" }); return "Scrolling up"; },
  },
  {
    keywords: ["scroll to top", "go to top", "top of page", "beginning"],
    description: "Jump to top of page",
    category: "navigation",
    action: () => { window.scrollTo({ top: 0, behavior: "smooth" }); return "Going to top"; },
  },
  {
    keywords: ["scroll to bottom", "go to bottom", "end of page", "bottom"],
    description: "Jump to bottom of page",
    category: "navigation",
    action: () => { window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); return "Going to bottom"; },
  },
  {
    keywords: ["go back", "go backward", "previous page", "back"],
    description: "Go to previous page",
    category: "navigation",
    action: (navigate) => { navigate(-1); return "Going back"; },
  },
  {
    keywords: ["go home", "open home", "home page", "go to home"],
    description: "Open home page",
    category: "navigation",
    action: (navigate) => { navigate("/"); return "Opening home"; },
  },
  {
    keywords: ["open sign language", "sign language", "go to sign", "open sign"],
    description: "Open Sign Language page",
    category: "navigation",
    action: (navigate) => { navigate("/sign"); return "Opening Sign Language"; },
  },
  {
    keywords: ["open voice", "voice navigator", "go to voice"],
    description: "Open Voice Navigator",
    category: "navigation",
    action: (navigate) => { navigate("/voice"); return "Opening Voice Navigator"; },
  },
  {
    keywords: ["open simplifier", "text simplifier", "simplify", "go to simplify"],
    description: "Open Text Simplifier",
    category: "navigation",
    action: (navigate) => { navigate("/simplify"); return "Opening Simplifier"; },
  },
  {
    keywords: ["open image", "image describer", "describe image", "go to image"],
    description: "Open Image Describer",
    category: "navigation",
    action: (navigate) => { navigate("/image"); return "Opening Image Describer"; },
  },

  // Accessibility
  {
    keywords: ["increase text", "bigger text", "larger text", "increase font", "zoom in"],
    description: "Increase font size",
    category: "accessibility",
    action: (_, ctx) => { ctx.setFontSize((p) => Math.min(p + 2, 28)); return "Text size increased"; },
  },
  {
    keywords: ["decrease text", "smaller text", "reduce text", "decrease font", "zoom out"],
    description: "Decrease font size",
    category: "accessibility",
    action: (_, ctx) => { ctx.setFontSize((p) => Math.max(p - 2, 14)); return "Text size decreased"; },
  },
  {
    keywords: ["high contrast", "contrast on", "dark mode", "enable contrast"],
    description: "Enable high contrast",
    category: "accessibility",
    action: (_, ctx) => { ctx.setHighContrast(true); return "High contrast enabled"; },
  },
  {
    keywords: ["disable contrast", "contrast off", "light mode", "normal mode"],
    description: "Disable high contrast",
    category: "accessibility",
    action: (_, ctx) => { ctx.setHighContrast(false); return "High contrast disabled"; },
  },
  {
    keywords: ["priya mode", "enable priya", "activate priya", "priya on"],
    description: "Toggle Priya Mode",
    category: "accessibility",
    action: (_, ctx) => { ctx.togglePriyaMode(); return "Priya Mode toggled"; },
  },

  // Reading
  {
    keywords: ["read page", "read this", "read aloud", "speak page", "read everything"],
    description: "Read page content aloud",
    category: "reading",
    action: (_, ctx) => {
      const text = document.body.innerText.slice(0, 3000);
      ctx.speak(text);
      return "Reading page aloud";
    },
  },
  {
    keywords: ["stop reading", "stop speaking", "stop", "quiet", "silence"],
    description: "Stop reading",
    category: "reading",
    action: () => { window.speechSynthesis?.cancel(); return "Stopped reading"; },
  },
  {
    keywords: ["read heading", "read title", "what is this page"],
    description: "Read page heading",
    category: "reading",
    action: (_, ctx) => {
      const h = document.querySelector("h1")?.innerText || "No heading found";
      ctx.speak(h);
      return `Reading: "${h}"`;
    },
  },
];

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useVoiceNav() {
  const [isListening, setIsListening]     = useState(false);
  const [transcript, setTranscript]       = useState("");
  const [interimText, setInterimText]     = useState("");
  const [lastAction, setLastAction]       = useState(null);  // { text, success }
  const [supported, setSupported]         = useState(true);
  const [transcriptLog, setTranscriptLog] = useState([]);

  const recognitionRef = useRef(null);
  const navigate       = useNavigate();
  const ctx            = useAccessibility();

  // Check support
  useEffect(() => {
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  // Match transcript to a command
  const matchCommand = useCallback((text) => {
    const lower = text.toLowerCase().trim();
    for (const cmd of COMMANDS) {
      for (const kw of cmd.keywords) {
        if (lower.includes(kw)) {
          return cmd;
        }
      }
    }
    return null;
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (!SpeechRecognition || isListening) return;

    const recognition = new SpeechRecognition();
    recognition.continuous     = true;
    recognition.interimResults = true;
    recognition.lang           = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let interim = "";
      let final   = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t;
        } else {
          interim += t;
        }
      }

      setInterimText(interim);

      if (final) {
        setTranscript(final.trim());
        setTranscriptLog((prev) =>
          [{ text: final.trim(), ts: Date.now() }, ...prev].slice(0, 20)
        );

        const cmd = matchCommand(final);
        if (cmd) {
          try {
            const feedback = cmd.action(navigate, ctx);
            setLastAction({ text: feedback, success: true, ts: Date.now() });
          } catch {
            setLastAction({ text: "Command failed", success: false, ts: Date.now() });
          }
        } else {
          setLastAction({
            text: `"${final.trim()}" — no command matched`,
            success: false,
            ts: Date.now(),
          });
        }
        setInterimText("");
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== "no-speech") {
        setLastAction({ text: `Error: ${e.error}`, success: false, ts: Date.now() });
      }
    };

    recognition.onend = () => {
      // Auto-restart if still meant to be listening
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch { /* ignore */ }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening, matchCommand, navigate, ctx]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null; // prevent auto-restart
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText("");
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  const clearLog = useCallback(() => {
    setTranscriptLog([]);
    setTranscript("");
    setLastAction(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimText,
    lastAction,
    supported,
    transcriptLog,
    toggleListening,
    startListening,
    stopListening,
    clearLog,
    COMMANDS,
  };
}