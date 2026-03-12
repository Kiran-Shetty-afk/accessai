import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSignDetection } from "../hooks/useSignDetection";
import { useAccessibility } from "../context/AccessibilityContext";
import {
  Hand,
  Volume2,
  Trash2,
  Camera,
  CameraOff,
  Wifi,
  WifiOff,
  Loader2,
  Info,
} from "lucide-react";

const SIGN_LABELS = [
  "hello","yes","no","thanks","help",
  "stop","good","bad","water","more",
];

export default function SignLanguage() {
  const webcamRef  = useRef(null);
  const canvasRef  = useRef(null);
  const [camOn, setCamOn] = useState(false);
  const { priyaMode } = useAccessibility();

  // Auto-enable camera if Priya Mode is active
  const isActive = camOn || priyaMode;

  const {
    detectedSign,
    confidence,
    history,
    isConnected,
    modelReady,
    error,
    clearHistory,
    speakSign,
  } = useSignDetection(webcamRef, canvasRef, isActive);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;600&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes signPop {
          0%   { transform: scale(0.85); opacity:0; }
          60%  { transform: scale(1.08); }
          100% { transform: scale(1);   opacity:1; }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(124,58,237,0.5); }
          70%  { box-shadow: 0 0 0 14px rgba(124,58,237,0); }
          100% { box-shadow: 0 0 0 0 rgba(124,58,237,0); }
        }
        @keyframes scan {
          0%,100% { top: 0%; }
          50%      { top: 96%; }
        }

        .sl-root {
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 64px);
          padding: 2rem 0;
        }

        /* ── Page header ── */
        .sl-header {
          margin-bottom: 2rem;
          animation: fadeUp 0.4s ease both;
        }
        .sl-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7c3aed;
          margin-bottom: 0.5rem;
        }
        .sl-title {
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          letter-spacing: -0.03em;
          color: var(--text-primary, #0f172a);
          margin: 0 0 0.4rem;
        }
        .sl-sub {
          color: var(--text-secondary, #64748b);
          font-size: 0.95rem;
        }

        /* ── Main layout ── */
        .sl-layout {
          display: grid;
          grid-template-columns: 60fr 40fr;
          gap: 1.25rem;
          align-items: start;
        }

        /* ── Camera panel ── */
        .cam-panel {
          background: #0a0a0f;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(124,58,237,0.2);
          animation: fadeUp 0.5s 0.1s ease both;
          position: relative;
        }
        .cam-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .cam-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          color: #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .status-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        .status-dot.connected    { background: #4ade80; animation: pulse-ring 1.8s ease infinite; }
        .status-dot.disconnected { background: #f87171; }
        .status-dot.loading      { background: #fbbf24; }

        .cam-body {
          position: relative;
          aspect-ratio: 4/3;
          background: #05050a;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cam-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: rgba(255,255,255,0.3);
        }
        .cam-placeholder-icon {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(124,58,237,0.15);
          border: 2px dashed rgba(124,58,237,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cam-placeholder p {
          font-size: 0.85rem;
          margin: 0;
        }

        /* Scan line when active */
        .scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(124,58,237,0.7), transparent);
          animation: scan 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 10;
        }

        .webcam-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
          display: block;
        }
        .landmark-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform: scaleX(-1);
          pointer-events: none;
        }

        /* Loading overlay */
        .model-loading {
          position: absolute;
          inset: 0;
          background: rgba(5,5,10,0.75);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: #c4b5fd;
          font-size: 0.875rem;
          z-index: 20;
        }

        .cam-footer {
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .cam-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.2rem;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .cam-toggle.on {
          background: rgba(239,68,68,0.15);
          color: #fca5a5;
          border: 1px solid rgba(239,68,68,0.25);
        }
        .cam-toggle.on:hover {
          background: rgba(239,68,68,0.25);
        }
        .cam-toggle.off {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          box-shadow: 0 4px 16px rgba(124,58,237,0.35);
        }
        .cam-toggle.off:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(124,58,237,0.5);
        }

        .ws-status {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
        }

        /* ── Right panel ── */
        .right-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: fadeUp 0.5s 0.2s ease both;
        }

        /* Detected sign card */
        .sign-card {
          background: var(--card-bg, #f8fafc);
          border: 1px solid var(--border-color, #e8e8e8);
          border-radius: 18px;
          padding: 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .sign-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #7c3aed, #4f46e5, #06b6d4);
        }
        .sign-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-secondary, #94a3b8);
          margin-bottom: 0.75rem;
        }
        .sign-output {
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: 3.5rem;
          letter-spacing: -0.03em;
          color: #7c3aed;
          min-height: 4.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: capitalize;
        }
        .sign-output.has-sign {
          animation: signPop 0.35s ease both;
        }
        .sign-empty {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--text-secondary, #cbd5e1);
        }

        /* Confidence bar */
        .conf-section {
          margin-top: 0.75rem;
        }
        .conf-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: var(--text-secondary, #64748b);
        }
        .conf-value {
          font-family: 'JetBrains Mono', monospace;
          color: #7c3aed;
        }

        /* Speak button */
        .speak-btn {
          margin-top: 1rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.65rem;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          opacity: 0.5;
        }
        .speak-btn:not(:disabled) {
          opacity: 1;
          box-shadow: 0 4px 16px rgba(124,58,237,0.3);
        }
        .speak-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(124,58,237,0.45);
        }

        /* History card */
        .history-card {
          background: var(--card-bg, #f8fafc);
          border: 1px solid var(--border-color, #e8e8e8);
          border-radius: 18px;
          padding: 1.25rem;
          flex: 1;
        }
        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.875rem;
        }
        .history-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary, #0f172a);
        }
        .clear-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary, #94a3b8);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          transition: all 0.15s;
        }
        .clear-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          max-height: 220px;
          overflow-y: auto;
        }
        .history-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          background: var(--bg-primary, #fff);
          border: 1px solid var(--border-color, #f1f5f9);
          transition: all 0.15s;
        }
        .history-item:first-child {
          border-color: rgba(124,58,237,0.3);
          background: rgba(124,58,237,0.04);
        }
        .history-sign {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary, #0f172a);
          text-transform: capitalize;
        }
        .history-conf {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: #7c3aed;
        }
        .history-empty {
          text-align: center;
          padding: 1.5rem;
          color: var(--text-secondary, #cbd5e1);
          font-size: 0.85rem;
        }

        /* Instructions card */
        .instructions-card {
          background: rgba(124,58,237,0.06);
          border: 1px solid rgba(124,58,237,0.15);
          border-radius: 14px;
          padding: 1rem 1.25rem;
        }
        .instructions-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.825rem;
          color: #7c3aed;
          margin-bottom: 0.6rem;
        }
        .instructions-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .instructions-list li {
          font-size: 0.8rem;
          color: var(--text-secondary, #64748b);
          list-style: none;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .instructions-list li::before {
          content: '→';
          color: #7c3aed;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        /* Signs reference */
        .signs-ref {
          background: var(--card-bg, #f8fafc);
          border: 1px solid var(--border-color, #e8e8e8);
          border-radius: 18px;
          padding: 1.25rem;
          margin-top: 1.25rem;
          animation: fadeUp 0.5s 0.3s ease both;
        }
        .signs-ref-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary, #0f172a);
          margin-bottom: 0.875rem;
        }
        .signs-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .sign-chip {
          padding: 0.3rem 0.75rem;
          background: var(--bg-primary, #fff);
          border: 1px solid var(--border-color, #e8e8e8);
          border-radius: 100px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          color: var(--text-secondary, #64748b);
          transition: all 0.15s;
        }
        .sign-chip.active {
          background: rgba(124,58,237,0.1);
          border-color: rgba(124,58,237,0.4);
          color: #7c3aed;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .sl-layout { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="sl-root">

        {/* Header */}
        <div className="sl-header">
          <div className="sl-eyebrow">
            <Hand size={14} /> Sign Language Detection
          </div>
          <h1 className="sl-title">ASL Recognition</h1>
          <p className="sl-sub">
            Show your hand to the camera — MediaPipe detects landmarks in real time.
          </p>
        </div>

        {/* Main layout */}
        <div className="sl-layout">

          {/* ── LEFT: Camera panel ── */}
          <div className="cam-panel">
            <div className="cam-header">
              <span className="cam-title">
                <Camera size={15} />
                Live Feed
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {/* WebSocket status */}
                <span className="ws-status">
                  {isConnected
                    ? <><Wifi size={12} style={{ color: "#4ade80" }} /> WS Live</>
                    : <><WifiOff size={12} style={{ color: "#f87171" }} /> WS Off</>
                  }
                </span>
                {/* Model status badge */}
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "100px",
                  background: modelReady
                    ? "rgba(74,222,128,0.15)"
                    : "rgba(251,191,36,0.15)",
                  color: modelReady ? "#4ade80" : "#fbbf24",
                  border: `1px solid ${modelReady ? "rgba(74,222,128,0.3)" : "rgba(251,191,36,0.3)"}`,
                }}>
                  {modelReady ? "Model Ready" : "Loading..."}
                </span>
              </div>
            </div>

            <div className="cam-body">
              {isActive ? (
                <>
                  {/* Scan line animation */}
                  <div className="scan-line" />

                  <Webcam
                    ref={webcamRef}
                    className="webcam-video"
                    videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
                    mirrored={false} /* we mirror via CSS */
                  />
                  <canvas ref={canvasRef} className="landmark-canvas" />

                  {/* Model loading overlay */}
                  {!modelReady && (
                    <div className="model-loading">
                      <Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} />
                      <span>Loading hand detection model…</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="cam-placeholder">
                  <div className="cam-placeholder-icon">
                    <CameraOff size={28} style={{ color: "rgba(124,58,237,0.5)" }} />
                  </div>
                  <p>Camera is off</p>
                  <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                    Click "Start Camera" to begin
                  </p>
                </div>
              )}
            </div>

            <div className="cam-footer">
              <button
                className={`cam-toggle ${isActive ? "on" : "off"}`}
                onClick={() => setCamOn(!camOn)}
              >
                {isActive ? (
                  <><CameraOff size={15} /> Stop Camera</>
                ) : (
                  <><Camera size={15} /> Start Camera</>
                )}
              </button>

              <div className="ws-status" style={{ color: "rgba(255,255,255,0.3)" }}>
                <span
                  className={`status-dot ${
                    isConnected ? "connected" : isActive ? "disconnected" : "loading"
                  }`}
                />
                {isConnected ? "Connected to backend" : "Backend offline — using local model"}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Results panel ── */}
          <div className="right-panel">

            {/* Detected sign */}
            <div className="sign-card">
              <div className="sign-label">Detected Sign</div>
              <div className={`sign-output ${detectedSign ? "has-sign" : ""}`}>
                {detectedSign
                  ? detectedSign
                  : <span className="sign-empty">—</span>
                }
              </div>

              {/* Confidence bar */}
              <div className="conf-section">
                <div className="conf-header">
                  <span>Confidence</span>
                  <span className="conf-value">{confidence}%</span>
                </div>
                <Progress value={confidence} className="h-2" />
              </div>

              {/* Speak button */}
              <button
                className="speak-btn"
                disabled={!detectedSign}
                onClick={() => speakSign(detectedSign)}
              >
                <Volume2 size={15} />
                Speak "{detectedSign || "..."}"
              </button>
            </div>

            {/* History */}
            <div className="history-card">
              <div className="history-header">
                <span className="history-title">Detection History</span>
                <button className="clear-btn" onClick={clearHistory}>
                  <Trash2 size={12} /> Clear
                </button>
              </div>

              {history.length === 0 ? (
                <div className="history-empty">
                  No signs detected yet.<br />Start the camera and show your hand.
                </div>
              ) : (
                <div className="history-list">
                  {history.map((h, i) => (
                    <div key={h.ts} className="history-item">
                      <span className="history-sign">{h.sign}</span>
                      <span className="history-conf">{h.conf}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="instructions-card">
              <div className="instructions-title">
                <Info size={13} /> How to use
              </div>
              <ul className="instructions-list">
                <li>Click "Start Camera" and allow access</li>
                <li>Hold your hand clearly in frame</li>
                <li>Purple dots = detected landmarks</li>
                <li>Green dots = fingertips</li>
                <li>Signs auto-speak when detected</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Signs reference chips */}
        <div className="signs-ref">
          <div className="signs-ref-title">Supported Signs</div>
          <div className="signs-chips">
            {SIGN_LABELS.map((s) => (
              <span
                key={s}
                className={`sign-chip ${detectedSign === s ? "active" : ""}`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Spin keyframe for loader */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}