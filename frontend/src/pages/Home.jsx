import { useNavigate } from "react-router-dom";
import {
  Hand,
  Mic,
  FileText,
  ImageIcon,
  ArrowRight,
  Play,
  Globe,
  Users,
  Eye,
  Brain,
  Settings,
} from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";

// ─── Data ─────//

const STATS = [
  {
    number: "1.3B",
    label: "People with disabilities worldwide",
    icon: Globe,
    color: "#6d28d9",
    bg: "#ede9fe",
  },
  {
    number: "70M",
    label: "Deaf & hard of hearing",
    icon: Hand,
    color: "#0369a1",
    bg: "#e0f2fe",
  },
  {
    number: "253M",
    label: "Visually impaired",
    icon: Eye,
    color: "#065f46",
    bg: "#d1fae5",
  },
  {
    number: "200M",
    label: "Cognitive disabilities",
    icon: Brain,
    color: "#92400e",
    bg: "#fef3c7",
  },
];

const FEATURES = [
  {
    icon: Hand,
    title: "Sign Language AI",
    desc: "Real-time ASL detection via webcam. MediaPipe landmarks → TF.js model → live spoken output.",
    path: "/sign",
    tag: "Live Camera",
    accent: "#6d28d9",
    accentBg: "#ede9fe",
  },
  {
    icon: Mic,
    title: "Voice Navigator",
    desc: "Control any webpage with your voice. Scroll, navigate, read — completely hands-free.",
    path: "/voice",
    tag: "Hands-Free",
    accent: "#0369a1",
    accentBg: "#e0f2fe",
  },
  {
    icon: FileText,
    title: "Cognitive Simplifier",
    desc: "Paste any article. Choose Grade 3–8 reading level. Get plain-language output instantly.",
    path: "/simplify",
    tag: "AI Powered",
    accent: "#065f46",
    accentBg: "#d1fae5",
  },
  {
    icon: ImageIcon,
    title: "Image Describer",
    desc: "Upload or hover over any image for an instant AI-generated audio description.",
    path: "/image",
    tag: "Hover Mode",
    accent: "#92400e",
    accentBg: "#fef3c7",
  },
];

const SUPPORT_TOOLS = [
  {
    icon: Settings,
    title: "Saved Profiles",
    desc: "Store the accessibility setup that works for you and switch back to it instantly.",
    path: "/profiles",
    accent: "#7c3aed",
    accentBg: "#ede9fe",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();
  const { togglePriyaMode, priyaMode } = useAccessibility();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

        /* ── Fade-up animation ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-18px) scale(1.04); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.8) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .home-root {
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 88vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 5rem 1.5rem 3rem;
          overflow: hidden;
        }

        /* Mesh background */
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(109,40,217,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(3,105,161,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(6,95,70,0.06) 0%, transparent 60%),
            #fafafa;
        }
        .high-contrast .hero-bg {
          background: #0a0a0a;
        }

        /* Floating orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.35;
          pointer-events: none;
          animation: floatOrb 7s ease-in-out infinite;
        }
        .orb-1 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, #7c3aed, transparent 70%);
          top: -100px; left: -80px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, #0284c7, transparent 70%);
          bottom: -60px; right: -60px;
          animation-delay: 2.5s;
        }
        .orb-3 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, #10b981, transparent 70%);
          top: 40%; left: 60%;
          animation-delay: 4.5s;
          opacity: 0.2;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 860px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(109,40,217,0.1);
          border: 1px solid rgba(109,40,217,0.25);
          color: #6d28d9;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.35rem 0.9rem;
          border-radius: 100px;
          margin-bottom: 1.5rem;
          animation: fadeUp 0.5s ease both;
        }
        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #7c3aed;
          animation: dotPulse 1.4s ease infinite;
        }
        @keyframes dotPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.6); }
        }

        .hero-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: clamp(2.8rem, 7vw, 5.2rem);
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--text-primary, #0f172a);
          margin: 0 0 0.6rem;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .hero-heading .italic-word {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          color: #7c3aed;
        }
        .hero-heading .shimmer-text {
          background: linear-gradient(
            90deg,
            #7c3aed 0%,
            #0284c7 30%,
            #10b981 55%,
            #7c3aed 80%,
            #0284c7 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .hero-sub {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: var(--text-secondary, #64748b);
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .hero-ctas {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeUp 0.6s 0.3s ease both;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.75rem 1.6rem;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(124,58,237,0.3);
          text-decoration: none;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(124,58,237,0.45);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: transparent;
          color: var(--text-primary, #0f172a);
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.75rem 1.6rem;
          border-radius: 12px;
          border: 1.5px solid var(--border-color, #e2e8f0);
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .btn-secondary:hover {
          background: #f3f0ff;
          border-color: #7c3aed;
          color: #7c3aed;
        }
        .high-contrast .btn-secondary:hover {
          background: #2d1f5e;
        }

        /* Scroll indicator */
        .scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          opacity: 0.4;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-secondary, #64748b);
          animation: fadeUp 1s 1s ease both;
        }
        .scroll-line {
          width: 1px;
          height: 32px;
          background: linear-gradient(to bottom, var(--text-secondary, #94a3b8), transparent);
          animation: scrollLine 1.8s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        /* ── STATS ── */
        .stats-section {
          padding: 0 1.5rem 4rem;
        }
        .stats-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .stats-label {
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-secondary, #94a3b8);
          margin-bottom: 1.25rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .stat-card {
          position: relative;
          background: var(--card-bg, #f8fafc);
          border: 1px solid var(--border-color, #e8e8e8);
          border-radius: 18px;
          padding: 1.5rem 1.25rem;
          text-align: center;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: countUp 0.5s ease both;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 18px 18px 0 0;
          background: var(--stat-accent);
        }
        .stat-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
          background: var(--stat-bg);
          color: var(--stat-accent);
        }
        .stat-number {
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: 2.4rem;
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--stat-accent);
          margin-bottom: 0.4rem;
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary, #64748b);
          line-height: 1.4;
        }

        /* ── FEATURES ── */
        .features-section {
          padding: 1rem 1.5rem 5rem;
        }
        .features-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .section-eyebrow {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7c3aed;
          margin-bottom: 0.6rem;
        }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          letter-spacing: -0.03em;
          color: var(--text-primary, #0f172a);
          margin: 0 0 0.75rem;
        }
        .section-sub {
          font-size: 1rem;
          color: var(--text-secondary, #64748b);
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }

        .feature-card {
          position: relative;
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--border-color, #e8e8e8);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.25s ease;
          overflow: hidden;
          animation: fadeUp 0.5s ease both;
          text-decoration: none;
        }
        .feature-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          opacity: 0;
          background: var(--feat-accent-bg);
          transition: opacity 0.25s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          border-color: var(--feat-accent);
        }
        .feature-card:hover::after {
          opacity: 0.04;
        }

        .feat-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .feat-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--feat-accent-bg);
          color: var(--feat-accent);
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .feature-card:hover .feat-icon {
          transform: scale(1.1) rotate(-4deg);
        }
        .feat-tag {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--feat-accent);
          background: var(--feat-accent-bg);
          padding: 0.25rem 0.65rem;
          border-radius: 100px;
          border: 1px solid var(--feat-accent);
          opacity: 0.8;
        }

        .feat-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
          color: var(--text-primary, #0f172a);
          margin: 0;
        }
        .feat-desc {
          font-size: 0.9rem;
          color: var(--text-secondary, #64748b);
          line-height: 1.65;
          margin: 0;
          flex: 1;
        }

        .feat-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--feat-accent);
          padding: 0;
          background: none;
          border: none;
          cursor: pointer;
          transition: gap 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
        }
        .feature-card:hover .feat-cta {
          gap: 0.6rem;
        }

        .support-card-grid {
          display: grid;
          grid-template-columns: minmax(280px, 420px);
          justify-content: center;
          gap: 1rem;
        }

        .support-card {
          border-radius: 18px;
          border: 1px solid var(--border-color, #e8e8e8);
          background: var(--card-bg, #ffffff);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .support-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.08);
          border-color: var(--tool-accent);
        }

        .support-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--tool-accent-bg);
          color: var(--tool-accent);
        }

        .support-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: -0.02em;
          color: var(--text-primary, #0f172a);
          margin: 0;
        }

        .support-desc {
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--text-secondary, #64748b);
          margin: 0;
          flex: 1;
        }

        .support-link {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--tool-accent);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        /* ── NARRATIVE STRIP ── */
        .narrative {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          text-align: center;
          margin: 0 0 4rem;
          position: relative;
          overflow: hidden;
          max-width: 1100px;
          margin: 0 auto 5rem;
        }
        .narrative::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .narrative-quote {
          position: relative;
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: clamp(1.2rem, 3vw, 1.7rem);
          color: #e0e7ff;
          line-height: 1.6;
          max-width: 760px;
          margin: 0 auto 1.5rem;
        }
        .narrative-quote strong {
          color: #a5b4fc;
          font-style: normal;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
        }
        .narrative-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.65rem 1.4rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        .narrative-cta:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .support-card-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .stat-number { font-size: 1.9rem; }
          .narrative { padding: 2rem 1.25rem; }
        }
      `}</style>

      <div className="home-root">

        {/* ── HERO ─── */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              NMIMS Hackathon 2026 · Disability Inclusion
            </div>

            <h1 className="hero-heading">
              The Web,{" "}
              <span className="italic-word">finally</span>
              <br />
              <span className="shimmer-text">accessible to all.</span>
            </h1>

            <p className="hero-sub">
              One platform removing four barriers at once — sign language,
              voice control, cognitive simplification &amp; image description,
              plus reusable accessibility profiles.
              Real-time. Free. Open source.
            </p>

            <div className="hero-ctas">
              <button
                className="btn-primary"
                onClick={() => navigate("/sign")}
              >
                <Play size={15} fill="white" />
                See Live Demo
              </button>
              <button
                className="btn-secondary"
                onClick={togglePriyaMode}
              >
                <Users size={15} />
                {priyaMode ? "Exit Priya Mode" : "Meet Priya"}
              </button>
            </div>
          </div>

          <div className="scroll-hint">
            <div className="scroll-line" />
            scroll
          </div>
        </section>

        {/* ── STATS ────────────────────────────────── */}
        <section className="stats-section">
          <div className="stats-inner">
            <p className="stats-label">The scale of the problem</p>
            <div className="stats-grid">
              {STATS.map((s, i) => (
                <div
                  key={s.number}
                  className="stat-card"
                  style={{
                    "--stat-accent": s.color,
                    "--stat-bg": s.bg,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <div className="stat-icon-wrap">
                    <s.icon size={18} />
                  </div>
                  <div className="stat-number">{s.number}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="features-section">
          <div className="features-inner">
            <div className="section-header">
              <p className="section-eyebrow">Core Features</p>
              <h2 className="section-title">
                Every barrier has<br />a solution.
              </h2>
              <p className="section-sub">
                Built in 20 hours. Powered by MediaPipe, TensorFlow.js,
                HuggingFace, and the Web Speech API.
              </p>
            </div>

            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div
                  key={f.path}
                  className="feature-card"
                  style={{
                    "--feat-accent": f.accent,
                    "--feat-accent-bg": f.accentBg,
                    animationDelay: `${0.3 + i * 0.1}s`,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(f.path)}
                >
                  <div className="feat-top">
                    <div className="feat-icon">
                      <f.icon size={22} />
                    </div>
                    <span className="feat-tag">{f.tag}</span>
                  </div>

                  <h3 className="feat-title">{f.title}</h3>
                  <p className="feat-desc">{f.desc}</p>

                  <span className="feat-cta">
                    Try it now <ArrowRight size={15} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        

        {/* ── NARRATIVE STRIP ── */}
        <section style={{ padding: "0 1.5rem 5rem" }}>
          <div className="features-inner" style={{ marginBottom: "5rem" }}>
            <div className="section-header">
              <p className="section-eyebrow">New Support Tools</p>
              <h2 className="section-title">
                Keep your setup ready.
              </h2>
              <p className="section-sub">
                Save a setup that works for you and switch back to it instantly.
              </p>
            </div>

            <div className="support-card-grid" style={{ marginBottom: "3rem" }}>
              {SUPPORT_TOOLS.map((tool) => (
                <div
                  key={tool.path}
                  className="support-card"
                  style={{
                    "--tool-accent": tool.accent,
                    "--tool-accent-bg": tool.accentBg,
                  }}
                  onClick={() => navigate(tool.path)}
                >
                  <div className="support-icon">
                    <tool.icon size={18} />
                  </div>
                  <h3 className="support-title">{tool.title}</h3>
                  <p className="support-desc">{tool.desc}</p>
                  <span className="support-link">
                    Explore tool <ArrowRight size={14} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="narrative">
            <p className="narrative-quote">
              "The internet was built for able-bodied people.{" "}
              <strong>1.3 billion people</strong> face a barrier every time
              they open a browser. AccessAI removes{" "}
              <strong>four barriers at once</strong> — in real time, for free."
            </p>
            <button
              className="narrative-cta"
              onClick={() => navigate("/sign")}
            >
              <Zap size={15} />
              Start the demo
            </button>
          </div>
        </section>

      </div>
    </>
  );
}

// needed because narrative-cta uses Zap
function Zap({ size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
