import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const STATS = [
  { value: "99.2%", label: "Model Accuracy" },
  { value: "5",     label: "Cell Classes"   },
  { value: "<2s",   label: "Inference Time" },
  { value: "CNN",   label: "Architecture"   },
];

const FEATURES = [
  {
    icon: "◎",
    color: "#22d3ee",
    title: "Instant Analysis",
    text: "Upload Pap smear images and receive predictions in seconds using a deep learning model trained on cervical cell datasets.",
  },
  {
    icon: "◈",
    color: "#34d399",
    title: "CNN-Based Model",
    text: "Powered by MobileNet-based convolutional neural networks with transfer learning for high-accuracy cell morphology classification.",
  },
  {
    icon: "◇",
    color: "#a78bfa",
    title: "Confidence Scoring",
    text: "Full probability distribution across all five cell types, visualized as an interactive bar chart for transparent AI reasoning.",
  },
];

const CELL_TYPES = [
  { name: "Dyskeratotic",             risk: "Abnormal", color: "#f43f5e", pct: 87 },
  { name: "Koilocytotic",             risk: "Monitor",  color: "#fb923c", pct: 72 },
  { name: "Metaplastic",              risk: "Benign",   color: "#facc15", pct: 64 },
  { name: "Parabasal",                risk: "Normal",   color: "#34d399", pct: 93 },
  { name: "Superficial-Intermediate", risk: "Normal",   color: "#22d3ee", pct: 96 },
];

function AnimatedBar({ pct, color, delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{
      height: 4, borderRadius: 4,
      background: "rgba(255,255,255,0.06)",
      overflow: "hidden", flex: 1
    }}>
      <div style={{
        height: "100%", borderRadius: 4,
        background: color,
        width: width + "%",
        transition: "width 1s cubic-bezier(0.34,1.2,0.64,1)",
        boxShadow: `0 0 8px ${color}88`
      }} />
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes gridPan {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes scanLine {
          0%   { top: 0%; opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes borderTrace {
          0%   { background-position: 0% 0%; }
          100% { background-position: 300% 0%; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }

        .home-root {
          min-height: 100vh;
          background: #030712;
          color: #e2e8f0;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
        }

        /* BG layers */
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(34,211,238,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.035) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridPan 10s linear infinite;
        }

        .bg-radial {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,211,238,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(52,211,153,0.07) 0%, transparent 60%);
        }

        .content { position: relative; z-index: 1; }

        /* ── HERO ─────────────────────────────────── */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          gap: 0;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(34,211,238,0.07);
          border: 1px solid rgba(34,211,238,0.2);
          border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #22d3ee;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 36px;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : 12}px);
          transition: all 0.6s ease 0.1s;
        }

        .hero-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22d3ee;
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .hero-title {
          font-size: clamp(42px, 7vw, 82px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 28px;
          max-width: 900px;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : 20}px);
          transition: all 0.7s ease 0.2s;
        }

        .title-line1 { color: #f1f5f9; }

        .title-gradient {
          background: linear-gradient(90deg, #22d3ee 0%, #34d399 50%, #22d3ee 100%);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: borderTrace 4s linear infinite;
        }

        .hero-sub {
          max-width: 580px;
          font-size: 17px;
          line-height: 1.7;
          color: #64748b;
          margin-bottom: 48px;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : 16}px);
          transition: all 0.7s ease 0.35s;
        }

        .cta-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 80px;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : 12}px);
          transition: all 0.7s ease 0.45s;
        }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 34px;
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #030712;
          background: linear-gradient(135deg, #22d3ee, #06b6d4);
          border: none; border-radius: 10px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 0 20px rgba(34,211,238,0.3);
        }

        .btn-primary:hover {
          box-shadow: 0 0 36px rgba(34,211,238,0.5);
          transform: translateY(-1px);
        }

        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 34px;
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #94a3b8;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          color: #e2e8f0;
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.04);
        }

        /* Stats strip */
        .stats-strip {
          display: flex;
          gap: 0;
          border: 1px solid rgba(34,211,238,0.1);
          border-radius: 14px;
          overflow: hidden;
          background: rgba(7,13,26,0.9);
          opacity: ${mounted ? 1 : 0};
          transition: opacity 0.7s ease 0.6s;
        }

        .stat-item {
          flex: 1;
          padding: 20px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          border-right: 1px solid rgba(34,211,238,0.07);
          animation: countUp 0.5s ease both;
        }

        .stat-item:last-child { border-right: none; }

        .stat-value {
          font-size: 26px;
          font-weight: 800;
          color: #22d3ee;
          font-family: 'DM Mono', monospace;
          letter-spacing: -0.03em;
        }

        .stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #334155;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ── FEATURES ─────────────────────────────── */
        .section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px 120px;
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #334155;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 48px;
        }

        .section-label::before {
          content: '';
          display: block;
          width: 20px; height: 1px;
          background: #22d3ee;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .feature-card {
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-3px);
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: var(--card-color);
          opacity: 0.4;
        }

        .feature-icon {
          font-size: 22px;
          margin-bottom: 20px;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .feature-text {
          font-size: 14px;
          line-height: 1.7;
          color: #475569;
          font-family: 'DM Mono', monospace;
        }

        .feature-corner {
          position: absolute;
          bottom: 20px; right: 24px;
          font-size: 48px;
          opacity: 0.04;
          font-weight: 800;
          color: var(--card-color);
          letter-spacing: -0.05em;
          line-height: 1;
        }

        /* ── CELL TYPES TABLE ─────────────────────── */
        .cells-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px 120px;
        }

        .cells-card {
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 20px;
          overflow: hidden;
        }

        .cells-header {
          padding: 28px 32px;
          border-bottom: 1px solid #1e293b;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cells-title {
          font-size: 14px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          display: flex; align-items: center; gap: 10px;
        }

        .cells-title::before {
          content: '';
          display: block;
          width: 3px; height: 16px;
          background: linear-gradient(to bottom, #22d3ee, #34d399);
          border-radius: 2px;
        }

        .cells-count {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #334155;
          letter-spacing: 0.06em;
        }

        .cell-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: background 0.2s;
        }

        .cell-row:last-child { border-bottom: none; }
        .cell-row:hover { background: rgba(255,255,255,0.02); }

        .cell-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .cell-name {
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
          min-width: 200px;
          flex-shrink: 0;
        }

        .cell-risk {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 999px;
          flex-shrink: 0;
          min-width: 76px;
          text-align: center;
        }

        .cell-bar-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cell-pct {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #475569;
          min-width: 36px;
          text-align: right;
          flex-shrink: 0;
        }

        /* ── INFO SECTION ─────────────────────────── */
        .info-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px 120px;
        }

        .info-card {
          background: #070d1a;
          border: 1px solid rgba(34,211,238,0.15);
          border-radius: 20px;
          padding: 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .info-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent, #22d3ee55, transparent
          );
        }

        .info-glow {
          position: absolute;
          top: -60px; left: 50%;
          transform: translateX(-50%);
          width: 400px; height: 200px;
          background: radial-gradient(ellipse, rgba(34,211,238,0.07), transparent 70%);
          pointer-events: none;
        }

        .info-title {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #f1f5f9;
          margin-bottom: 20px;
        }

        .info-text {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          line-height: 1.8;
          color: #475569;
          max-width: 600px;
          margin: 0 auto 36px;
        }

        .disclaimer {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: rgba(251,146,60,0.07);
          border: 1px solid rgba(251,146,60,0.2);
          border-radius: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #fb923c;
          letter-spacing: 0.04em;
        }

        @media (max-width: 680px) {
          .stats-strip { flex-wrap: wrap; }
          .stat-item { min-width: 45%; border-right: none; border-bottom: 1px solid rgba(34,211,238,0.07); }
          .cells-card .cell-name { min-width: 140px; font-size: 12px; }
          .info-card { padding: 36px 20px; }
        }
      `}</style>

      <div className="home-root">
        <div className="bg-grid" />
        <div className="bg-radial" />

        <div className="content">

          {/* ── HERO ── */}
          <section className="hero">
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-dot" />
              AI Medical Imaging · Cervical Cell Classification
            </div>

            <h1 className="hero-title">
              <span className="title-line1">AI-Powered Cervical<br /></span>
              <span className="title-gradient">Cancer Detection</span>
            </h1>

            <p className="hero-sub">
              Upload Pap smear images and instantly receive AI-powered cervical
              cell classification with confidence scoring and full probability
              distribution analysis.
            </p>

            <div className="cta-row">
              <Link to="/analyze" className="btn-primary">
                ▶ &nbsp;Start Analysis
              </Link>
              <Link to="/model" className="btn-secondary">
                ◈ &nbsp;View Model
              </Link>
            </div>

            <div className="stats-strip">
              {STATS.map((s, i) => (
                <div key={i} className="stat-item" style={{ animationDelay: `${0.7 + i * 0.1}s` }}>
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── FEATURES ── */}
          <section className="section">
            <div className="section-label">Core Capabilities</div>
            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="feature-card"
                  style={{ "--card-color": f.color, animationDelay: `${i * 0.1}s` }}
                >
                  <div className="feature-icon" style={{ color: f.color }}>{f.icon}</div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-text">{f.text}</div>
                  <div className="feature-corner">{f.icon}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CELL TYPES ── */}
          <section className="cells-section">
            <div className="section-label">Supported Cell Classifications</div>
            <div className="cells-card">
              <div className="cells-header">
                <div className="cells-title">Cell Type Reference</div>
                <div className="cells-count">5 classes · MobileNet CNN</div>
              </div>
              {CELL_TYPES.map((cell, i) => (
                <div key={i} className="cell-row">
                  <div className="cell-dot" style={{ background: cell.color, boxShadow: `0 0 6px ${cell.color}` }} />
                  <div className="cell-name">{cell.name}</div>
                  <div
                    className="cell-risk"
                    style={{
                      background: cell.color + "18",
                      border: `1px solid ${cell.color}44`,
                      color: cell.color,
                    }}
                  >
                    {cell.risk}
                  </div>
                  <div className="cell-bar-wrap">
                    <AnimatedBar pct={cell.pct} color={cell.color} delay={i * 120} />
                    <div className="cell-pct">{cell.pct}%</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── INFO ── */}
          <section className="info-section">
            <div className="info-card">
              <div className="info-glow" />
              <h2 className="info-title">Built for Research & Early Screening</h2>
              <p className="info-text">
                This AI system assists in analyzing cervical cell morphology from
                Pap smear images. It is designed for educational and research
                purposes, providing fast, consistent classification to support
                — not replace — professional medical diagnosis.
              </p>
              <div className="disclaimer">
                ⚠ &nbsp;Not a substitute for professional medical diagnosis
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}