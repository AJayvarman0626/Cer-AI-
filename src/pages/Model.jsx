import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

const accuracyData = [
  { epoch: 1,  accuracy: 41,  loss: 89 },
  { epoch: 2,  accuracy: 78,  loss: 62 },
  { epoch: 3,  accuracy: 86,  loss: 44 },
  { epoch: 4,  accuracy: 90,  loss: 33 },
  { epoch: 5,  accuracy: 92,  loss: 25 },
  { epoch: 6,  accuracy: 95,  loss: 18 },
  { epoch: 7,  accuracy: 95,  loss: 15 },
  { epoch: 8,  accuracy: 96,  loss: 12 },
  { epoch: 9,  accuracy: 96,  loss: 10 },
  { epoch: 10, accuracy: 97,  loss: 8  },
];

const classRadar = [
  { subject: "Dyskeratotic", score: 90 },
  { subject: "Koilocytotic", score: 84 },
  { subject: "Metaplastic",  score: 82 },
  { subject: "Parabasal",    score: 80 },
  { subject: "Superficial",  score: 88 },
];

const SPECS = [
  { icon: "◈", label: "Architecture", lines: ["MobileNetV2", "Transfer Learning"],  color: "#22d3ee" },
  { icon: "◎", label: "Framework",    lines: ["TensorFlow 2.x", "Keras API"],        color: "#34d399" },
  { icon: "◇", label: "Dataset",      lines: ["Pap Smear Images", "5 Cell Classes"], color: "#a78bfa" },
  { icon: "○", label: "Input Shape",  lines: ["224 × 224 px", "RGB (3-channel)"],    color: "#fb923c" },
];

const PIPELINE = [
  { step: "01", label: "Image Upload",           desc: "JPEG / PNG Pap smear input",        icon: "⬡" },
  { step: "02", label: "Preprocessing",          desc: "Resize → Normalize → Augment",       icon: "◎" },
  { step: "03", label: "Feature Extraction",     desc: "MobileNetV2 convolutional backbone",  icon: "◈" },
  { step: "04", label: "Classification Layer",   desc: "Dense softmax · 5 classes",           icon: "◇" },
  { step: "05", label: "Prediction Output",      desc: "Class label + confidence score",      icon: "○" },
];

const CustomLineTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0a0f1e",
      border: "1px solid #1e293b",
      borderLeft: "3px solid #22d3ee",
      borderRadius: 8, padding: "10px 14px",
      fontFamily: "'DM Mono', monospace", fontSize: 12,
    }}>
      <div style={{ color: "#475569", marginBottom: 6 }}>Epoch {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <span style={{ color: "white" }}>{p.value}{p.name === "Accuracy" ? "%" : "%"}</span>
        </div>
      ))}
    </div>
  );
};

const CustomRadarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0a0f1e", border: "1px solid #22d3ee33",
      borderRadius: 8, padding: "8px 14px",
      fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#22d3ee"
    }}>
      {payload[0].payload.subject}: <span style={{ color: "white" }}>{payload[0].value}%</span>
    </div>
  );
};

function CountUp({ target, duration = 1400, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * target));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);
  return <>{val}{suffix}</>;
}

export default function Model() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes gridPan {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes borderTrace {
          0%   { background-position: 0% 0%; }
          100% { background-position: 300% 0%; }
        }
        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pipeFlow {
          0%   { opacity: 0.3; transform: scaleX(0); }
          100% { opacity: 1;   transform: scaleX(1); }
        }

        .model-root {
          min-height: 100vh;
          background: #030712;
          color: #e2e8f0;
          font-family: 'Syne', sans-serif;
          padding-bottom: 100px;
          overflow-x: hidden;
        }

        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridPan 10s linear infinite;
        }
        .bg-radial {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 40% at 50% -5%, rgba(34,211,238,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 85% 90%, rgba(167,139,250,0.06) 0%, transparent 60%);
        }
        .content {
          position: relative; z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 120px 24px 0;
        }

        /* ── HEADER ── */
        .page-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px;
          background: rgba(34,211,238,0.07);
          border: 1px solid rgba(34,211,238,0.2);
          border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: #22d3ee;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 24px;
        }
        .page-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #22d3ee;
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .page-title {
          font-size: clamp(36px, 5.5vw, 64px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
          margin-bottom: 16px;
          color: #f1f5f9;
        }
        .title-gradient {
          background: linear-gradient(90deg, #22d3ee 0%, #a78bfa 50%, #22d3ee 100%);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: borderTrace 4s linear infinite;
        }
        .page-sub {
          font-family: 'DM Mono', monospace;
          font-size: 14px; color: #475569;
          line-height: 1.7; margin-bottom: 64px;
          max-width: 520px;
        }

        /* ── METRICS ROW ── */
        .metrics-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 64px;
        }
        @media (max-width: 700px) {
          .metrics-row { grid-template-columns: repeat(2, 1fr); }
        }
        .metric-tile {
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 14px;
          padding: 24px 20px;
          display: flex; flex-direction: column; gap: 6px;
          position: relative; overflow: hidden;
          transition: border-color 0.3s, transform 0.3s;
        }
        .metric-tile:hover { transform: translateY(-2px); }
        .metric-tile::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--mc);
          opacity: 0.6;
        }
        .metric-value {
          font-size: 30px; font-weight: 800;
          font-family: 'DM Mono', monospace;
          letter-spacing: -0.04em;
          color: var(--mc);
        }
        .metric-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: #334155;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .metric-sub {
          font-size: 11px; color: #1e3a5f;
          font-family: 'DM Mono', monospace;
          margin-top: 2px;
        }

        /* ── SPECS GRID ── */
        .section-label {
          display: flex; align-items: center; gap: 10px;
          font-family: 'DM Mono', monospace; font-size: 10px;
          color: #334155; letter-spacing: 0.14em; text-transform: uppercase;
          margin-bottom: 24px;
        }
        .section-label::before {
          content: ''; display: block;
          width: 20px; height: 1px; background: #22d3ee;
        }

        .specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 16px;
          margin-bottom: 64px;
        }
        .spec-card {
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 14px;
          padding: 26px;
          position: relative; overflow: hidden;
          transition: transform 0.25s, border-color 0.25s;
        }
        .spec-card:hover {
          transform: translateY(-3px);
          border-color: var(--sc);
        }
        .spec-icon {
          font-size: 22px; margin-bottom: 16px;
          color: var(--sc);
        }
        .spec-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          color: #334155; letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 10px;
        }
        .spec-line {
          font-size: 15px; font-weight: 700; color: #94a3b8;
          line-height: 1.6;
        }
        .spec-bg {
          position: absolute; bottom: -10px; right: 10px;
          font-size: 52px; opacity: 0.04; color: var(--sc);
          font-weight: 800; line-height: 1;
          pointer-events: none;
        }

        /* ── CHARTS ── */
        .chart-wrap {
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 18px;
          padding: 32px;
          margin-bottom: 32px;
        }
        .chart-head {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap; gap: 12px;
        }
        .chart-title {
          font-size: 14px; font-weight: 700;
          color: #94a3b8; letter-spacing: 0.05em;
          text-transform: uppercase;
          display: flex; align-items: center; gap: 10px;
        }
        .chart-title::before {
          content: ''; display: block;
          width: 3px; height: 16px;
          background: linear-gradient(to bottom, #22d3ee, #a78bfa);
          border-radius: 2px;
        }
        .chart-legend {
          display: flex; gap: 16px; flex-wrap: wrap;
        }
        .legend-dot {
          width: 8px; height: 8px; border-radius: 2px;
        }
        .legend-item {
          display: flex; align-items: center; gap: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: #475569;
        }

        /* ── PIPELINE ── */
        .pipeline-wrap {
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 18px;
          padding: 36px;
          margin-bottom: 32px;
        }
        .pipeline-steps {
          display: flex; flex-direction: column; gap: 0;
          margin-top: 8px;
        }
        .pipeline-step {
          display: flex; align-items: flex-start; gap: 20px;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          position: relative;
        }
        .pipeline-step:last-child { border-bottom: none; }

        .pipeline-step-left {
          display: flex; flex-direction: column; align-items: center;
          gap: 0; flex-shrink: 0;
        }
        .pipeline-num {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: #22d3ee;
          letter-spacing: 0.08em;
          background: rgba(34,211,238,0.08);
          border: 1px solid rgba(34,211,238,0.18);
          border-radius: 6px;
          padding: 4px 8px;
          margin-bottom: 8px;
        }
        .pipeline-line {
          width: 1px; flex: 1; min-height: 30px;
          background: linear-gradient(to bottom, rgba(34,211,238,0.3), transparent);
        }
        .pipeline-step:last-child .pipeline-line { display: none; }

        .pipeline-body { flex: 1; padding-top: 2px; }
        .pipeline-icon { font-size: 16px; margin-bottom: 6px; color: #334155; }
        .pipeline-name {
          font-size: 15px; font-weight: 700; color: #e2e8f0;
          margin-bottom: 4px;
        }
        .pipeline-desc {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: #334155; line-height: 1.5;
        }

        .pipeline-arrow {
          flex-shrink: 0; padding-top: 6px;
          color: #1e3a5f; font-size: 18px;
        }

        /* ── FINAL METRICS ── */
        .conf-table {
          width: 100%; border-collapse: collapse;
          font-family: 'DM Mono', monospace; font-size: 13px;
        }
        .conf-table th {
          text-align: left; padding: 12px 16px;
          font-size: 10px; color: #334155;
          letter-spacing: 0.1em; text-transform: uppercase;
          border-bottom: 1px solid #1e293b;
        }
        .conf-table td {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          color: #94a3b8;
          vertical-align: middle;
        }
        .conf-table tr:last-child td { border-bottom: none; }
        .conf-table tr:hover td { background: rgba(255,255,255,0.02); }

        .conf-bar-bg {
          background: #0a0f1e; border-radius: 4px;
          height: 6px; overflow: hidden; width: 120px;
        }
        .conf-bar-fill {
          height: 100%; border-radius: 4px;
          transition: width 1s ease;
        }
      `}</style>

      <div className="model-root">
        <div className="bg-grid" />
        <div className="bg-radial" />

        <div className="content">

          {/* Header */}
          <motion.div {...fadeUp(0.05)}>
            <div className="page-eyebrow">
              <div className="page-eyebrow-dot" />
              Model Architecture · MobileNetV2
            </div>
            <h1 className="page-title">
              Deep Learning<br />
              <span className="title-gradient">Model Insights</span>
            </h1>
            <p className="page-sub">
              A MobileNetV2-based convolutional neural network fine-tuned on
              cervical Pap smear datasets for 5-class cell morphology classification.
            </p>
          </motion.div>

          {/* Metrics Row */}
          <motion.div className="metrics-row" {...fadeUp(0.15)}>
            {[
              { label: "Final Accuracy", val: 97,  suffix: "%", sub: "Epoch 10",         color: "#22d3ee" },
              { label: "Cell Classes",   val: 5,   suffix: "",  sub: "Softmax output",   color: "#34d399" },
              { label: "Input Size",     val: 224, suffix: "px",sub: "RGB 3-channel",    color: "#a78bfa" },
              { label: "Min Loss",       val: 8,   suffix: "%", sub: "Final epoch",      color: "#fb923c" },
            ].map((m, i) => (
              <div key={i} className="metric-tile" style={{ "--mc": m.color }}>
                <div className="metric-value">
                  {mounted && <CountUp target={m.val} duration={900 + i * 150} suffix={m.suffix} />}
                </div>
                <div className="metric-label">{m.label}</div>
                <div className="metric-sub">{m.sub}</div>
              </div>
            ))}
          </motion.div>

          {/* Specs */}
          <motion.div {...fadeUp(0.2)}>
            <div className="section-label">Model Specifications</div>
            <div className="specs-grid">
              {SPECS.map((s, i) => (
                <div key={i} className="spec-card" style={{ "--sc": s.color }}>
                  <div className="spec-icon">{s.icon}</div>
                  <div className="spec-label">{s.label}</div>
                  <div className="spec-line">
                    {s.lines.map((l, j) => <div key={j}>{l}</div>)}
                  </div>
                  <div className="spec-bg">{s.icon}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Training Curve */}
          <motion.div {...fadeUp(0.25)}>
            <div className="section-label">Training Performance</div>
            <div className="chart-wrap">
              <div className="chart-head">
                <div className="chart-title">Accuracy & Loss Over Epochs</div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: "#22d3ee" }} /> Accuracy
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: "#f43f5e" }} /> Loss
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={accuracyData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"   stopColor="#22d3ee" stopOpacity={0.2} />
                      <stop offset="95%"  stopColor="#22d3ee" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                  <XAxis dataKey="epoch" stroke="transparent"
                    tick={{ fill: "#334155", fontSize: 11, fontFamily: "'DM Mono', monospace" }}
                    axisLine={false} tickLine={false}
                    label={{ value: "Epoch", position: "insideBottom", offset: -2, fill: "#334155", fontSize: 10, fontFamily: "'DM Mono', monospace" }}
                  />
                  <YAxis stroke="transparent"
                    tick={{ fill: "#334155", fontSize: 10, fontFamily: "'DM Mono', monospace" }}
                    axisLine={false} tickLine={false} tickFormatter={v => `${v}%`}
                  />
                  <Tooltip content={<CustomLineTooltip />} cursor={{ stroke: "#1e293b", strokeWidth: 1 }} />
                  <Line type="monotone" dataKey="accuracy" name="Accuracy"
                    stroke="#22d3ee" strokeWidth={2.5}
                    dot={{ r: 4, fill: "#22d3ee", stroke: "#070d1a", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#22d3ee", stroke: "#070d1a", strokeWidth: 2 }}
                    animationDuration={1400} animationEasing="ease-out"
                  />
                  <Line type="monotone" dataKey="loss" name="Loss"
                    stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 3"
                    dot={{ r: 3, fill: "#f43f5e", stroke: "#070d1a", strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                    animationDuration={1600} animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Radar + Table */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
            <motion.div {...fadeUp(0.3)}>
              <div className="chart-wrap" style={{ height: "100%", marginBottom: 0 }}>
                <div className="chart-head">
                  <div className="chart-title">Class Detection</div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={classRadar} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <defs>
                      <radialGradient id="radarFill">
                        <stop offset="0%"   stopColor="#22d3ee" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
                      </radialGradient>
                    </defs>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject"
                      tick={{ fill: "#475569", fontSize: 10, fontFamily: "'DM Mono', monospace" }}
                    />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip content={<CustomRadarTooltip />} />
                    <Radar dataKey="score" name="Accuracy"
                      stroke="#22d3ee" strokeWidth={1.5}
                      fill="url(#radarFill)"
                      animationDuration={1200}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.35)}>
              <div className="chart-wrap" style={{ height: "100%", marginBottom: 0 }}>
                <div className="chart-head">
                  <div className="chart-title">Per-Class Scores</div>
                </div>
                <table className="conf-table">
                  <thead>
                    <tr>
                      <th>Cell Type</th>
                      <th>F1</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Dyskeratotic", f1: "0.91", score: 90, color: "#f43f5e" },
                      { name: "Koilocytotic", f1: "0.85", score: 84, color: "#fb923c" },
                      { name: "Metaplastic",  f1: "0.83", score: 82, color: "#facc15" },
                      { name: "Parabasal",    f1: "0.81", score: 80, color: "#34d399" },
                      { name: "Superficial",  f1: "0.89", score: 88, color: "#22d3ee" },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: row.color, flexShrink: 0, boxShadow: `0 0 5px ${row.color}` }} />
                          {row.name}
                        </td>
                        <td style={{ color: row.color }}>{row.f1}</td>
                        <td>
                          <div className="conf-bar-bg">
                            <div className="conf-bar-fill" style={{
                              width: mounted ? row.score + "%" : "0%",
                              background: row.color,
                              transitionDelay: 0.5 + i * 0.1 + "s"
                            }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Pipeline */}
          <motion.div {...fadeUp(0.4)}>
            <div className="section-label">Inference Pipeline</div>
            <div className="pipeline-wrap">
              <div className="chart-head" style={{ marginBottom: 8 }}>
                <div className="chart-title">AI Processing Steps</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#334155" }}>
                  avg. latency &lt; 2s
                </div>
              </div>
              <div className="pipeline-steps">
                {PIPELINE.map((step, i) => (
                  <motion.div
                    key={i}
                    className="pipeline-step"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                  >
                    <div className="pipeline-step-left">
                      <div className="pipeline-num">{step.step}</div>
                      {i < PIPELINE.length - 1 && <div className="pipeline-line" />}
                    </div>
                    <div className="pipeline-body">
                      <div className="pipeline-icon">{step.icon}</div>
                      <div className="pipeline-name">{step.label}</div>
                      <div className="pipeline-desc">{step.desc}</div>
                    </div>
                    <div className="pipeline-arrow">›</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}