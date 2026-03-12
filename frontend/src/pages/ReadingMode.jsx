import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Copy,
  Play,
  RotateCcw,
  Sparkles,
  Type,
  Volume2,
} from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";

const DEMO_TEXT = `You have the right to request reasonable accommodations when a school, employer, or public service creates barriers that make access difficult. Ask for the support as early as possible, explain what makes the task hard, and describe what change would help you participate safely and independently.

Keep copies of any emails, forms, or letters connected to your request. A short record can help later if you need to explain what you asked for, when you asked, and what response you received.

If the process feels overwhelming, break it into small steps. First gather the information you need. Next complete one section at a time. Then ask a trusted person to review it with you before you submit anything.`;

function buildParagraphs(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const blocks = trimmed
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (blocks.length > 1) {
    return blocks;
  }

  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (sentences.length <= 2) {
    return [trimmed];
  }

  const result = [];
  for (let index = 0; index < sentences.length; index += 2) {
    result.push(sentences.slice(index, index + 2).join(" "));
  }
  return result;
}

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function ReadingMode() {
  const { speak } = useAccessibility();

  const [inputText, setInputText] = useState(DEMO_TEXT);
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusMode, setFocusMode] = useState(true);
  const [readingRuler, setReadingRuler] = useState(true);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [calmMode, setCalmMode] = useState(true);
  const [copied, setCopied] = useState(false);

  const paragraphs = buildParagraphs(inputText);
  const currentParagraph = paragraphs[activeIndex] || "";
  const readingTimeMinutes = Math.max(1, Math.round(wordCount(inputText) / 180));

  useEffect(() => {
    if (!paragraphs.length) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex > paragraphs.length - 1) {
      setActiveIndex(paragraphs.length - 1);
    }
  }, [activeIndex, paragraphs.length]);

  const visibleParagraphs = focusMode
    ? (currentParagraph ? [{ text: currentParagraph, index: activeIndex }] : [])
    : paragraphs.map((text, index) => ({ text, index }));

  const copyCurrentParagraph = async () => {
    if (!currentParagraph) return;
    await navigator.clipboard.writeText(currentParagraph);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const resetDemo = () => {
    setInputText(DEMO_TEXT);
    setActiveIndex(0);
    setFocusMode(true);
    setReadingRuler(true);
    setCalmMode(true);
    setDyslexiaFont(false);
  };

  return (
    <>
      {dyslexiaFont && (
        <style>{`
          @import url('https://fonts.cdnfonts.com/css/opendyslexic');
          .reading-dyslexia {
            font-family: 'OpenDyslexic', sans-serif !important;
            line-height: 1.9 !important;
            letter-spacing: 0.05em !important;
            word-spacing: 0.18em !important;
          }
        `}</style>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reading-root {
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 64px);
          padding: 2rem 0 4rem;
        }

        .reading-header {
          margin-bottom: 1.6rem;
          animation: fadeUp 0.35s ease both;
        }

        .reading-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0369a1;
          margin-bottom: 0.5rem;
        }

        .reading-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.9rem, 4vw, 2.8rem);
          letter-spacing: -0.03em;
          margin: 0 0 0.45rem;
          color: var(--text-primary, #0f172a);
        }

        .reading-sub {
          max-width: 720px;
          color: var(--text-secondary, #64748b);
          line-height: 1.7;
        }

        .reading-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.7rem;
          margin-bottom: 1rem;
          animation: fadeUp 0.38s ease both;
        }

        .tool-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border-radius: 999px;
          border: 1px solid var(--border-color, #d8dee6);
          background: var(--bg-primary, #fff);
          color: var(--text-primary, #0f172a);
          padding: 0.65rem 0.95rem;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .tool-btn.active {
          background: rgba(3, 105, 161, 0.08);
          border-color: rgba(3, 105, 161, 0.35);
          color: #0369a1;
        }

        .tool-btn:hover {
          transform: translateY(-1px);
        }

        .reading-layout {
          display: grid;
          grid-template-columns: 0.95fr 1.15fr;
          gap: 1.2rem;
          align-items: start;
        }

        .panel {
          border-radius: 24px;
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--card-bg, #f8fafc);
          overflow: hidden;
          animation: fadeUp 0.42s ease both;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.2rem;
          border-bottom: 1px solid var(--border-color, #e2e8f0);
          background: var(--bg-primary, #fff);
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          color: var(--text-primary, #0f172a);
        }

        .meta-row {
          display: flex;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .meta-chip {
          padding: 0.3rem 0.6rem;
          border-radius: 999px;
          background: var(--card-bg, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          font-size: 0.75rem;
          color: var(--text-secondary, #64748b);
        }

        .input-area {
          width: 100%;
          min-height: 430px;
          border: none;
          resize: vertical;
          padding: 1.2rem;
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--text-primary, #0f172a);
          background: transparent;
          outline: none;
        }

        .reader-shell {
          min-height: 430px;
          padding: 1.4rem;
          background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9));
        }

        .reader-shell.calm {
          background: linear-gradient(180deg, #f7f3e8, #fdfaf3);
        }

        .reader-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .reader-progress {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          color: var(--text-secondary, #64748b);
          font-size: 0.82rem;
        }

        .progress-bar {
          width: 140px;
          height: 8px;
          border-radius: 999px;
          background: rgba(100, 116, 139, 0.18);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #0369a1, #0ea5e9);
        }

        .reader-actions {
          display: flex;
          gap: 0.55rem;
          flex-wrap: wrap;
        }

        .reader-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.55rem 0.85rem;
          border-radius: 12px;
          border: 1px solid var(--border-color, #d8dee6);
          background: rgba(255,255,255,0.9);
          color: var(--text-primary, #0f172a);
          font-size: 0.83rem;
          font-weight: 700;
          cursor: pointer;
        }

        .reader-btn.primary {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0369a1, #0f766e);
        }

        .reader-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .paragraph-card {
          max-width: 700px;
          margin: 0 auto;
          border-radius: 22px;
          border: 1px solid rgba(100, 116, 139, 0.18);
          background: rgba(255,255,255,0.88);
          box-shadow: 0 22px 40px rgba(15, 23, 42, 0.06);
          padding: 1.25rem 1.35rem;
        }

        .reader-shell.calm .paragraph-card {
          background: rgba(255, 251, 240, 0.95);
        }

        .paragraph-card.active {
          border-color: rgba(3, 105, 161, 0.35);
          box-shadow: 0 24px 48px rgba(3, 105, 161, 0.08);
        }

        .paragraph-number {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0369a1;
          margin-bottom: 0.65rem;
        }

        .paragraph-text {
          font-size: 1rem;
          line-height: 1.95;
          color: #1e293b;
          position: relative;
        }

        .paragraph-text.ruler {
          background-image: linear-gradient(
            to bottom,
            transparent 0,
            transparent 68%,
            rgba(14, 165, 233, 0.16) 68%,
            rgba(14, 165, 233, 0.16) 84%,
            transparent 84%
          );
        }

        .empty-reader {
          border-radius: 22px;
          border: 1px dashed rgba(100, 116, 139, 0.25);
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary, #64748b);
        }

        @media (max-width: 980px) {
          .reading-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="reading-root">
        <div className="reading-header">
          <div className="reading-eyebrow">
            <BookOpen size={14} />
            Distraction-Free Reading
          </div>
          <h1 className="reading-title">Read one calm step at a time.</h1>
          <p className="reading-sub">
            Paste any long article, notice, or instructions and move through it paragraph by
            paragraph. Focus Mode reduces visual clutter, Reading Ruler keeps your place, and
            read-aloud controls help when text fatigue starts to build.
          </p>
        </div>

        <div className="reading-toolbar">
          <button className={`tool-btn ${focusMode ? "active" : ""}`} onClick={() => setFocusMode(!focusMode)}>
            <Sparkles size={15} />
            Focus Mode
          </button>
          <button className={`tool-btn ${readingRuler ? "active" : ""}`} onClick={() => setReadingRuler(!readingRuler)}>
            <BookOpen size={15} />
            Reading Ruler
          </button>
          <button className={`tool-btn ${calmMode ? "active" : ""}`} onClick={() => setCalmMode(!calmMode)}>
            <Play size={15} />
            Calm View
          </button>
          <button className={`tool-btn ${dyslexiaFont ? "active" : ""}`} onClick={() => setDyslexiaFont(!dyslexiaFont)}>
            <Type size={15} />
            Dyslexia Font
          </button>
          <button className="tool-btn" onClick={resetDemo}>
            <RotateCcw size={15} />
            Reset Demo
          </button>
        </div>

        <div className="reading-layout">
          <section className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <Sparkles size={16} color="#0369a1" />
                Reading Input
              </div>
              <div className="meta-row">
                <span className="meta-chip">{wordCount(inputText)} words</span>
                <span className="meta-chip">{paragraphs.length} paragraphs</span>
                <span className="meta-chip">{readingTimeMinutes} min read</span>
              </div>
            </div>
            <textarea
              className={`input-area ${dyslexiaFont ? "reading-dyslexia" : ""}`}
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              placeholder="Paste the text you want to read in a calmer layout."
            />
          </section>

          <section className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <Volume2 size={16} color="#0f766e" />
                Reading Surface
              </div>
              <div className="meta-row">
                <span className="meta-chip">{focusMode ? "Single paragraph" : "Whole article"}</span>
                <span className="meta-chip">{calmMode ? "Calm paper" : "Standard canvas"}</span>
              </div>
            </div>

            <div className={`reader-shell ${calmMode ? "calm" : ""}`}>
              <div className="reader-top">
                <div className="reader-progress">
                  <span>
                    Paragraph {paragraphs.length ? activeIndex + 1 : 0} of {paragraphs.length}
                  </span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${paragraphs.length ? ((activeIndex + 1) / paragraphs.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="reader-actions">
                  <button
                    className="reader-btn"
                    onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
                    disabled={activeIndex === 0}
                  >
                    <ChevronLeft size={15} />
                    Previous
                  </button>
                  <button
                    className="reader-btn"
                    onClick={() => setActiveIndex((current) => Math.min(paragraphs.length - 1, current + 1))}
                    disabled={!paragraphs.length || activeIndex === paragraphs.length - 1}
                  >
                    Next
                    <ChevronRight size={15} />
                  </button>
                  <button className="reader-btn primary" onClick={() => speak(currentParagraph || inputText)}>
                    <Volume2 size={15} />
                    Read Current
                  </button>
                  <button className="reader-btn" onClick={() => speak(inputText)}>
                    <Play size={15} />
                    Read All
                  </button>
                  <button className="reader-btn" onClick={copyCurrentParagraph}>
                    <Copy size={15} />
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {visibleParagraphs.length === 0 ? (
                <div className="empty-reader">Paste text on the left to start reading in focus mode.</div>
              ) : (
                <div className="reader-stack">
                  {visibleParagraphs.map(({ text, index }) => (
                    <article key={`${index}-${text.slice(0, 16)}`} className={`paragraph-card ${index === activeIndex ? "active" : ""}`}>
                      <div className="paragraph-number">Paragraph {index + 1}</div>
                      <div className={`paragraph-text ${readingRuler && index === activeIndex ? "ruler" : ""} ${dyslexiaFont ? "reading-dyslexia" : ""}`}>
                        {text}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
