import { useEffect, useRef, useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import { WS_SIGN_URL } from "../api/api";

const SIGN_LABELS = [
  "hello", "yes", "no", "thanks", "help",
  "stop", "good", "bad", "water", "more",
];

// Normalise 21 keypoints → flat 63-number array relative to wrist
function extractLandmarks(hand) {
  const wrist = hand.keypoints3D[0];
  return hand.keypoints3D.flatMap(({ x, y, z }) => [
    x - wrist.x,
    y - wrist.y,
    z - wrist.z,
  ]);
}

export function useSignDetection(webcamRef, canvasRef, isActive) {
  const [detectedSign, setDetectedSign]   = useState("");
  const [confidence, setConfidence]       = useState(0);
  const [history, setHistory]             = useState([]);
  const [isConnected, setIsConnected]     = useState(false);
  const [modelReady, setModelReady]       = useState(false);
  const [error, setError]                 = useState(null);

  const detectorRef  = useRef(null);
  const tfModelRef   = useRef(null);
  const wsRef        = useRef(null);
  const rafRef       = useRef(null);
  const lastSignRef  = useRef("");
  const lastSentRef  = useRef(0);

  // ── Load MediaPipe + TF.js model ──────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;

    let cancelled = false;

    async function loadModels() {
      try {
        await tf.ready();

        // Hand pose detector (MediaPipe)
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
          runtime: "tfjs",
          modelType: "lite",
          maxHands: 1,
        };
        detectorRef.current = await handPoseDetection.createDetector(
          model,
          detectorConfig
        );

        // Optional: load custom TF.js sign model from /public/models/
        try {
          tfModelRef.current = await tf.loadLayersModel(
            "/models/sign_model/model.json"
          );
        } catch {
          // Model not available yet — will use WebSocket fallback only
          console.info("Custom TF.js model not found, using WS fallback.");
        }

        if (!cancelled) setModelReady(true);
      } catch (err) {
        if (!cancelled) setError("Failed to load hand detection model.");
        console.error(err);
      }
    }

    loadModels();
    return () => { cancelled = true; };
  }, [isActive]);

  // ── WebSocket ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;

    function connect() {
      try {
        const ws = new WebSocket(WS_SIGN_URL);
        wsRef.current = ws;

        ws.onopen  = () => setIsConnected(true);
        ws.onclose = () => {
          setIsConnected(false);
          // Reconnect after 3s
          setTimeout(connect, 3000);
        };
        ws.onerror = () => setIsConnected(false);

        ws.onmessage = (evt) => {
          try {
            const { sign, confidence: conf } = JSON.parse(evt.data);
            if (sign && sign !== lastSignRef.current) {
              lastSignRef.current = sign;
              setDetectedSign(sign);
              setConfidence(Math.round(conf * 100));
              setHistory((prev) =>
                [{ sign, conf: Math.round(conf * 100), ts: Date.now() }, ...prev].slice(0, 10)
              );
              // TTS
              if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(new SpeechSynthesisUtterance(sign));
              }
            }
          } catch { /* ignore parse errors */ }
        };
      } catch {
        setIsConnected(false);
      }
    }

    connect();
    return () => {
      wsRef.current?.close();
      setIsConnected(false);
    };
  }, [isActive]);

  // ── Detection loop ────────────────────────────────────────────────────────
  const detect = useCallback(async () => {
    if (
      !detectorRef.current ||
      !webcamRef.current?.video ||
      webcamRef.current.video.readyState !== 4
    ) {
      rafRef.current = requestAnimationFrame(detect);
      return;
    }

    const video  = webcamRef.current.video;
    const canvas = canvasRef.current;

    // Draw landmarks on canvas overlay
    if (canvas) {
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      try {
        const hands = await detectorRef.current.estimateHands(video);

        if (hands.length > 0) {
          drawLandmarks(ctx, hands[0]);

          const landmarks = extractLandmarks(hands[0]);

          // ── Local TF.js model (if loaded) ──
          if (tfModelRef.current) {
            const tensor = tf.tensor2d([landmarks]);
            const pred   = tfModelRef.current.predict(tensor);
            const probs  = await pred.data();
            const idx    = probs.indexOf(Math.max(...probs));
            tensor.dispose();
            pred.dispose();

            const sign = SIGN_LABELS[idx] || "";
            const conf = Math.round(probs[idx] * 100);

            if (sign !== lastSignRef.current && conf > 60) {
              lastSignRef.current = sign;
              setDetectedSign(sign);
              setConfidence(conf);
              setHistory((prev) =>
                [{ sign, conf, ts: Date.now() }, ...prev].slice(0, 10)
              );
            }
          }

          // ── WebSocket fallback (throttled to every 200ms) ──
          const now = Date.now();
          if (
            wsRef.current?.readyState === WebSocket.OPEN &&
            now - lastSentRef.current > 200
          ) {
            wsRef.current.send(JSON.stringify({ landmarks }));
            lastSentRef.current = now;
          }
        } else {
          // No hand visible — clear sign after 1.5s
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      } catch { /* frame error — skip */ }
    }

    rafRef.current = requestAnimationFrame(detect);
  }, [webcamRef, canvasRef]);

  // Start / stop detection loop
  useEffect(() => {
    if (isActive && modelReady) {
      rafRef.current = requestAnimationFrame(detect);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, modelReady, detect]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setDetectedSign("");
    setConfidence(0);
    lastSignRef.current = "";
  }, []);

  const speakSign = useCallback((text) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }, []);

  return {
    detectedSign,
    confidence,
    history,
    isConnected,
    modelReady,
    error,
    clearHistory,
    speakSign,
  };
}

// ── Canvas landmark drawing helper ───────────────────────────────────────────
function drawLandmarks(ctx, hand) {
  const kp = hand.keypoints;

  // Connections between landmarks
  const connections = [
    [0,1],[1,2],[2,3],[3,4],         // thumb
    [0,5],[5,6],[6,7],[7,8],         // index
    [0,9],[9,10],[10,11],[11,12],    // middle
    [0,13],[13,14],[14,15],[15,16],  // ring
    [0,17],[17,18],[18,19],[19,20],  // pinky
    [5,9],[9,13],[13,17],            // palm
  ];

  ctx.strokeStyle = "rgba(124, 58, 237, 0.8)";
  ctx.lineWidth = 2;
  connections.forEach(([a, b]) => {
    if (!kp[a] || !kp[b]) return;
    ctx.beginPath();
    ctx.moveTo(kp[a].x, kp[a].y);
    ctx.lineTo(kp[b].x, kp[b].y);
    ctx.stroke();
  });

  // Dots
  kp.forEach((point, i) => {
    const isFingerTip = [4, 8, 12, 16, 20].includes(i);
    ctx.beginPath();
    ctx.arc(point.x, point.y, isFingerTip ? 6 : 4, 0, 2 * Math.PI);
    ctx.fillStyle = isFingerTip
      ? "rgba(167, 243, 208, 0.95)"
      : "rgba(196, 181, 253, 0.9)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}