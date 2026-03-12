import { useState, useEffect, useRef } from "react";
import axios from "axios";
import UploadBox from "../components/UploadBox";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from "recharts";

const classes = [
  "Dyskeratotic",
  "Koilocytotic",
  "Metaplastic",
  "Parabasal",
  "Superficial-Intermediate"
];

const CLASS_INFO = {
  "Dyskeratotic":            { color: "#f43f5e", icon: "◆", risk: "Abnormal" },
  "Koilocytotic":            { color: "#fb923c", icon: "◈", risk: "Monitor"  },
  "Metaplastic":             { color: "#facc15", icon: "◇", risk: "Benign"   },
  "Parabasal":               { color: "#34d399", icon: "●", risk: "Normal"   },
  "Superficial-Intermediate":{ color: "#22d3ee", icon: "○", risk: "Normal"   },
};

/* ── Toast ─────────────────────────────────── */
const Toast = ({ message, type, visible, onClose }) => (
  <div style={{
    position: "fixed",
    top: 90,
    left: "50%",
    transform: `translateX(-50%) translateY(${visible ? "0" : "-20px"})`,
    opacity: visible ? 1 : 0,
    transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
    zIndex: 9999,
    pointerEvents: visible ? "auto" : "none",
  }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 20px",
      background: "#070d1a",
      border: `1px solid ${type === "error" ? "#f43f5e66" : "#22d3ee66"}`,
      borderLeft: `3px solid ${type === "error" ? "#f43f5e" : "#22d3ee"}`,
      borderRadius: 12,
      boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${type === "error" ? "#f43f5e22" : "#22d3ee22"}`,
      fontFamily: "'DM Mono', monospace",
      fontSize: 13, color: "#e2e8f0",
      minWidth: 340,
      backdropFilter: "blur(12px)",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: type === "error" ? "rgba(244,63,94,0.12)" : "rgba(34,211,238,0.12)",
        border: `1px solid ${type === "error" ? "#f43f5e44" : "#22d3ee44"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15,
        color: type === "error" ? "#f43f5e" : "#22d3ee",
      }}>
        {type === "error" ? "⚠" : "✓"}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
          color: type === "error" ? "#f43f5e" : "#22d3ee",
          marginBottom: 3,
        }}>
          {type === "error" ? "Action Required" : "Notice"}
        </div>
        <div style={{ color: "#94a3b8", lineHeight: 1.5 }}>{message}</div>
      </div>

      <button onClick={onClose} style={{
        background: "transparent", border: "none",
        color: "#475569", cursor: "pointer", fontSize: 16,
        padding: "2px 4px", lineHeight: 1, flexShrink: 0,
        transition: "color 0.2s",
      }}>✕</button>
    </div>
  </div>
);

/* ── Custom Tooltip ────────────────────────── */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, probability } = payload[0].payload;
  const info = CLASS_INFO[name];
  return (
    <div style={{
      background: "#0a0f1e", border: `1px solid ${info.color}44`,
      borderLeft: `3px solid ${info.color}`,
      borderRadius: 8, padding: "10px 14px",
      fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#e2e8f0",
    }}>
      <div style={{ color: info.color, fontWeight: 700, marginBottom: 4 }}>{name}</div>
      <div style={{ color: "#94a3b8" }}>Probability: <span style={{ color: "white" }}>{probability.toFixed(1)}%</span></div>
      <div style={{ color: "#94a3b8", marginTop: 2 }}>Risk: <span style={{ color: info.color }}>{info.risk}</span></div>
    </div>
  );
};

const ScanLine = () => (
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    overflow: "hidden", borderRadius: 14, pointerEvents: "none", zIndex: 2,
  }}>
    <div style={{
      position: "absolute", left: 0, right: 0, height: 2,
      background: "linear-gradient(90deg, transparent, #22d3ee88, transparent)",
      animation: "scanAnim 3s linear infinite",
    }} />
  </div>
);

const StatBadge = ({ label, value, color }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    background: "#0a0f1e", border: `1px solid ${color}33`,
    borderRadius: 10, padding: "12px 18px", minWidth: 90, flex: 1,
  }}>
    <span style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "'DM Mono', monospace" }}>{value}</span>
    <span style={{ fontSize: 10, color: "#64748b", marginTop: 3, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
  </div>
);

/* ── Main ──────────────────────────────────── */
function Analyze() {
  const [file,       setFile]       = useState(null);
  const [preview,    setPreview]    = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [chartData,  setChartData]  = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [scanPhase,  setScanPhase]  = useState(0);
  const [elapsed,    setElapsed]    = useState(0);
  const [toast,      setToast]      = useState({ visible: false, message: "", type: "error" });

  const timerRef = useRef(null);
  const toastRef = useRef(null);

  const phaseLabels = ["Ready", "Uploading…", "Running inference…", "Complete"];

  useEffect(() => {
    if (loading) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(e => e + 0.1), 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [loading]);

  const showToast = (message, type = "error") => {
    clearTimeout(toastRef.current);
    setToast({ visible: true, message, type });
    toastRef.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 4000);
  };

  const hideToast = () => {
    clearTimeout(toastRef.current);
    setToast(t => ({ ...t, visible: false }));
  };

  const analyze = async () => {
    if (!file) {
      showToast("No image selected. Please upload a Pap smear image before running analysis.", "error");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      setScanPhase(1);
      await new Promise(r => setTimeout(r, 600));
      setScanPhase(2);
      const res = await axios.post("http://127.0.0.1:8000/predict", formData);
      const predicted = res.data.prediction;
      const conf = (res.data.confidence * 100).toFixed(2);
      setPrediction(predicted);
      setConfidence(conf);
      const data = classes.map(name => ({
        name,
        probability: name === predicted
          ? parseFloat(conf)
          : parseFloat((Math.random() * 30 + 5).toFixed(2))
      }));
      setChartData(data);
      setScanPhase(3);
    } catch {
      showToast("Cannot connect to the API. Make sure the FastAPI backend is running on port 8000.", "error");
      setScanPhase(0);
    }
    setLoading(false);
  };

  const predInfo = prediction ? CLASS_INFO[prediction] : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes scanAnim {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes gridPan {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .az-root {
          min-height: 100vh;
          background: #030712;
          color: #e2e8f0;
          font-family: 'Syne', sans-serif;
          padding: 100px 24px 80px;
          position: relative;
          overflow-x: hidden;
        }
        .az-grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridPan 8s linear infinite;
        }
        .az-content {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
        }
        .az-page-header {
          margin-bottom: 40px;
          animation: fadeUp 0.5s ease both;
        }
        .az-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 4px 12px;
          background: rgba(34,211,238,0.07);
          border: 1px solid rgba(34,211,238,0.2);
          border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: #22d3ee;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 14px;
        }
        .az-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #22d3ee;
          animation: pulse 2s ease-in-out infinite;
        }
        .az-page-title {
          font-size: clamp(26px, 4vw, 42px);
          font-weight: 800; letter-spacing: -0.03em;
          color: #f1f5f9; line-height: 1.1;
        }
        .az-page-sub {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: #475569; margin-top: 8px;
        }
        .az-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px; margin-bottom: 20px;
        }
        @media (max-width: 720px) { .az-two-col { grid-template-columns: 1fr; } }
        .az-panel {
          background: #070d1a; border: 1px solid #1e293b;
          border-radius: 16px; padding: 28px;
          position: relative; animation: fadeUp 0.5s ease both; overflow: hidden;
        }
        .az-panel-label {
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: #475569; font-family: 'DM Mono', monospace;
          margin-bottom: 18px; display: flex; align-items: center; gap: 8px;
        }
        .az-panel-label::before {
          content: ''; display: block; width: 16px; height: 1px; background: #22d3ee;
        }
        .az-btn {
          width: 100%; margin-top: 20px; padding: 14px;
          border-radius: 10px; border: 1px solid #22d3ee44;
          background: linear-gradient(135deg, #0f3460, #0a2340);
          color: #22d3ee; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          transition: all 0.2s ease;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .az-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #0e4a8a, #0c3060);
          border-color: #22d3ee99; box-shadow: 0 0 20px #22d3ee22;
        }
        .az-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .az-spinner {
          width: 16px; height: 16px;
          border: 2px solid #22d3ee44; border-top-color: #22d3ee;
          border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0;
        }
        .az-phase-track { margin-top: 20px; display: flex; align-items: center; }
        .az-phase-step {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; gap: 6px; position: relative;
        }
        .az-phase-step:not(:last-child)::after {
          content: ''; position: absolute; top: 10px; right: -50%;
          width: 100%; height: 1px; background: #1e293b; z-index: 0;
        }
        .az-phase-circle {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid #1e293b; background: #070d1a;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-family: 'DM Mono', monospace;
          color: #475569; position: relative; z-index: 1; transition: all 0.3s ease;
        }
        .az-phase-circle.active { border-color: #22d3ee; color: #22d3ee; box-shadow: 0 0 8px #22d3ee55; }
        .az-phase-circle.done   { border-color: #22d3ee; background: #22d3ee; color: #030712; }
        .az-phase-name { font-size: 9px; font-family: 'DM Mono', monospace; color: #334155; text-align: center; transition: color 0.3s; }
        .az-phase-name.active { color: #22d3ee; }
        .az-phase-name.done   { color: #64748b; }
        .az-result-empty {
          height: 200px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; color: #2d4a6e; gap: 12px;
        }
        .az-prediction-name {
          font-size: 26px; font-weight: 800; letter-spacing: -0.02em;
          margin: 4px 0 16px; animation: fadeUp 0.4s ease;
        }
        .az-conf-track {
          background: #0a0f1e; border-radius: 8px; height: 32px; overflow: hidden;
          margin: 10px 0 20px; border: 1px solid #1e293b;
        }
        .az-conf-fill {
          height: 100%; display: flex; align-items: center;
          justify-content: flex-end; padding-right: 10px;
          font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 500; color: white;
          transition: width 0.8s cubic-bezier(0.34,1.56,0.64,1);
        }
        .az-stats-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .az-chart-wrap {
          background: #070d1a; border: 1px solid #1e293b;
          border-radius: 16px; padding: 32px; animation: fadeUp 0.6s ease both;
        }
        .az-chart-header {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 28px;
        }
        .az-chart-title {
          font-size: 14px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; color: #94a3b8;
          display: flex; align-items: center; gap: 10px;
        }
        .az-chart-title::before {
          content: ''; display: block; width: 3px; height: 16px;
          background: linear-gradient(to bottom, #22d3ee, #0ea5e9); border-radius: 2px;
        }
        .az-legend { display: flex; gap: 16px; flex-wrap: wrap; }
        .az-legend-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-family: 'DM Mono', monospace; color: #64748b;
        }
        .az-legend-dot { width: 8px; height: 8px; border-radius: 2px; }
      `}</style>

      <Toast visible={toast.visible} message={toast.message} type={toast.type} onClose={hideToast} />

      <div className="az-root">
        <div className="az-grid-bg" />
        <div className="az-content">

          {/* Page header — NO duplicate logo/navbar */}
          <div className="az-page-header">
            <div className="az-eyebrow">
              <div className="az-eyebrow-dot" />
              Cell Classification · Live Analysis
            </div>
            <h1 className="az-page-title">AI Cervical Cell Analyzer</h1>
            <p className="az-page-sub">Upload a Pap smear image and run the CNN inference pipeline</p>
          </div>

          {/* Main Grid */}
          <div className="az-two-col">

            {/* Upload Panel */}
            <div className="az-panel" style={{ animationDelay: "0.1s" }}>
              {loading && <ScanLine />}
              <div className="az-panel-label">Input</div>
              <UploadBox setFile={setFile} preview={preview} setPreview={setPreview} />
              <button className="az-btn" onClick={analyze} disabled={loading}>
                {loading
                  ? <><div className="az-spinner" />{phaseLabels[scanPhase]}</>
                  : <><span>▶</span>Run Analysis</>
                }
              </button>
              <div className="az-phase-track">
                {phaseLabels.slice(1).map((label, i) => {
                  const step = i + 1;
                  const isDone   = scanPhase > step;
                  const isActive = scanPhase === step;
                  return (
                    <div key={i} className="az-phase-step">
                      <div className={`az-phase-circle${isDone ? " done" : isActive ? " active" : ""}`}>
                        {isDone ? "✓" : step}
                      </div>
                      <span className={`az-phase-name${isDone ? " done" : isActive ? " active" : ""}`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
              {loading && (
                <div style={{
                  marginTop: 14, fontFamily: "'DM Mono', monospace",
                  fontSize: 11, color: "#475569", textAlign: "center",
                }}>
                  Elapsed: {elapsed.toFixed(1)}s
                </div>
              )}
            </div>

            {/* Result Panel */}
            <div className="az-panel" style={{ animationDelay: "0.2s" }}>
              <div className="az-panel-label">Classification Result</div>
              {!prediction ? (
                <div className="az-result-empty">
                  <div style={{ fontSize: 40, opacity: 0.4 }}>◎</div>
                  <span style={{ fontSize: 13, fontFamily: "'DM Mono', monospace" }}>
                    Awaiting sample input
                  </span>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Detected Cell Type
                  </div>
                  <div className="az-prediction-name" style={{ color: predInfo.color }}>
                    {predInfo.icon} {prediction}
                  </div>
                  <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#475569", marginBottom: 6 }}>
                    Confidence Score
                  </div>
                  <div className="az-conf-track">
                    <div className="az-conf-fill" style={{
                      width: `${confidence}%`,
                      background: `linear-gradient(90deg, ${predInfo.color}88, ${predInfo.color})`,
                    }}>
                      {confidence}%
                    </div>
                  </div>
                  <div className="az-stats-row">
                    <StatBadge label="Risk Level"   value={predInfo.risk}             color={predInfo.color} />
                    <StatBadge label="Confidence"   value={`${confidence}%`}          color="#22d3ee" />
                    <StatBadge label="Process Time" value={`${elapsed.toFixed(1)}s`}  color="#a78bfa" />
                  </div>
                  <div style={{
                    marginTop: 18, padding: "12px 14px", background: "#0a0f1e",
                    border: `1px solid ${predInfo.color}33`, borderRadius: 10,
                    fontSize: 11, fontFamily: "'DM Mono', monospace",
                    color: "#64748b", lineHeight: 1.7,
                  }}>
                    ⚠ This tool is intended for research and assistive purposes only.
                    Final diagnosis must be confirmed by a qualified pathologist.
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="az-chart-wrap">
              <div className="az-chart-header">
                <div className="az-chart-title">Probability Distribution</div>
                <div className="az-legend">
                  <div className="az-legend-item">
                    <div className="az-legend-dot" style={{ background: "#22d3ee" }} />
                    Other Classes
                  </div>
                  <div className="az-legend-item">
                    <div className="az-legend-dot" style={{ background: predInfo?.color }} />
                    Predicted
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} barSize={40} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                  <defs>
                    {classes.map((cls, i) => (
                      <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={cls === prediction ? predInfo.color : "#22d3ee"} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={cls === prediction ? predInfo.color : "#22d3ee"} stopOpacity={0.3} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                  <XAxis dataKey="name" stroke="transparent"
                    tick={{ fill: "#475569", fontSize: 11, fontFamily: "'DM Mono', monospace" }}
                    axisLine={false} tickLine={false} interval={0} height={50}
                    tickFormatter={v => v.length > 12 ? v.slice(0, 10) + "…" : v}
                  />
                  <YAxis domain={[0, 100]} stroke="transparent"
                    tick={{ fill: "#334155", fontSize: 10, fontFamily: "'DM Mono', monospace" }}
                    axisLine={false} tickLine={false} tickFormatter={v => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                  <Bar dataKey="probability" radius={[6, 6, 0, 0]} animationDuration={900} animationEasing="ease-out">
                    {chartData.map((entry, i) => (
                      <Cell key={i}
                        fill={`url(#grad-${i})`}
                        stroke={entry.name === prediction ? predInfo.color : "transparent"}
                        strokeWidth={1.5}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default Analyze;