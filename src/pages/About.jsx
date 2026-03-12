import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const STACK = [
  { icon: "⬡", name: "React",       role: "Frontend UI",         color: "#22d3ee" },
  { icon: "◈", name: "FastAPI",      role: "Backend REST API",    color: "#34d399" },
  { icon: "◇", name: "TensorFlow",   role: "ML Framework",        color: "#fb923c" },
  { icon: "○", name: "MobileNetV2",  role: "CNN Architecture",    color: "#a78bfa" },
  { icon: "◎", name: "Keras",        role: "Model Training API",  color: "#f43f5e" },
  { icon: "●", name: "Recharts",     role: "Data Visualization",  color: "#facc15" },
];

const TIMELINE = [
  { phase: "01", title: "Dataset Collection",   desc: "Curated cervical Pap smear image datasets across 5 morphological cell classes.",  color: "#22d3ee" },
  { phase: "02", title: "Model Training",        desc: "Fine-tuned MobileNetV2 with transfer learning, achieving 97% accuracy at epoch 10.", color: "#34d399" },
  { phase: "03", title: "API Development",       desc: "Built a FastAPI inference server exposing a /predict endpoint for real-time classification.", color: "#a78bfa" },
  { phase: "04", title: "Frontend Integration",  desc: "Developed a React dashboard with live analysis, probability charts, and scan history.", color: "#fb923c" },
];

const PRINCIPLES = [
  { icon: "◎", title: "Research First",    text: "Designed as an assistive tool for academic and clinical research, not a replacement for professional diagnosis.", color: "#22d3ee" },
  { icon: "◈", title: "Transparent AI",    text: "Full probability distribution exposed for every prediction — no black-box outputs.", color: "#34d399" },
  { icon: "◇", title: "Open Architecture", text: "Built on open-source frameworks (TensorFlow, FastAPI, React) for reproducibility and extensibility.", color: "#a78bfa" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function About() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

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
          50%       { opacity: 0.35; }
        }
        @keyframes borderTrace {
          0%   { background-position: 0% 0%; }
          100% { background-position: 300% 0%; }
        }
        @keyframes avatarGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,211,238,0.2); }
          50%       { box-shadow: 0 0 0 10px rgba(34,211,238,0.05); }
        }
        @keyframes scanLine {
          0%   { top: 0%; opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .about-root {
          min-height: 100vh;
          background: #030712;
          color: #e2e8f0;
          font-family: 'Syne', sans-serif;
          padding-bottom: 120px;
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
            radial-gradient(ellipse 80% 40% at 50% -5%, rgba(34,211,238,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 10% 80%, rgba(167,139,250,0.05) 0%, transparent 60%);
        }
        .content {
          position: relative; z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 120px 24px 0;
        }

        /* ── HEADER ── */
        .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px;
          background: rgba(34,211,238,0.07);
          border: 1px solid rgba(34,211,238,0.2);
          border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: #22d3ee;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 22px;
        }
        .eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #22d3ee;
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .page-title {
          font-size: clamp(36px, 5.5vw, 66px);
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
          line-height: 1.8; max-width: 580px;
          margin-bottom: 72px;
        }

        .section-label {
          display: flex; align-items: center; gap: 10px;
          font-family: 'DM Mono', monospace; font-size: 10px;
          color: #334155; letter-spacing: 0.14em; text-transform: uppercase;
          margin-bottom: 28px;
        }
        .section-label::before {
          content: ''; display: block;
          width: 20px; height: 1px; background: #22d3ee;
        }

        /* ── HERO CARD ── */
        .hero-card {
          background: #070d1a;
          border: 1px solid rgba(34,211,238,0.15);
          border-radius: 20px;
          padding: 48px;
          margin-bottom: 32px;
          position: relative; overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (max-width: 720px) { .hero-card { grid-template-columns: 1fr; gap: 32px; } }

        .hero-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #22d3ee55, transparent);
        }
        .hero-card-glow {
          position: absolute; top: -80px; right: -80px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(34,211,238,0.06), transparent 70%);
          pointer-events: none;
        }

        .project-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          color: #334155; letter-spacing: 0.14em; text-transform: uppercase;
          margin-bottom: 14px;
        }
        .project-name {
          font-size: 36px; font-weight: 800;
          letter-spacing: -0.03em; color: #f1f5f9;
          margin-bottom: 16px; line-height: 1.1;
        }
        .project-desc {
          font-family: 'DM Mono', monospace;
          font-size: 13px; color: #475569;
          line-height: 1.8; margin-bottom: 24px;
        }
        .project-tags {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .tag {
          padding: 4px 12px;
          background: rgba(34,211,238,0.07);
          border: 1px solid rgba(34,211,238,0.15);
          border-radius: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: #22d3ee;
          letter-spacing: 0.08em; text-transform: uppercase;
        }

        /* Stats column */
        .stats-col {
          display: flex; flex-direction: column; gap: 14px;
        }
        .stat-row {
          display: flex; align-items: center;
          gap: 14px; padding: 14px 18px;
          background: rgba(255,255,255,0.02);
          border: 1px solid #1e293b;
          border-radius: 10px;
        }
        .stat-icon {
          font-size: 16px; width: 32px;
          text-align: center; flex-shrink: 0;
        }
        .stat-body { flex: 1; }
        .stat-val {
          font-size: 16px; font-weight: 800;
          font-family: 'DM Mono', monospace;
          letter-spacing: -0.02em;
        }
        .stat-lbl {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: #334155;
          letter-spacing: 0.08em; text-transform: uppercase;
          margin-top: 2px;
        }

        /* ── PRINCIPLES ── */
        .principles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          margin-bottom: 64px;
        }
        .principle-card {
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 14px;
          padding: 28px;
          position: relative; overflow: hidden;
          transition: transform 0.25s, border-color 0.25s;
        }
        .principle-card:hover {
          transform: translateY(-3px);
          border-color: var(--pc);
        }
        .principle-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: var(--pc); opacity: 0.5;
        }
        .p-icon { font-size: 20px; color: var(--pc); margin-bottom: 14px; }
        .p-title { font-size: 16px; font-weight: 700; color: #e2e8f0; margin-bottom: 10px; }
        .p-text {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: #475569; line-height: 1.7;
        }
        .p-bg {
          position: absolute; bottom: -8px; right: 12px;
          font-size: 56px; opacity: 0.04; color: var(--pc);
          font-weight: 800; pointer-events: none; line-height: 1;
        }

        /* ── TIMELINE ── */
        .timeline-card {
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 18px;
          padding: 36px;
          margin-bottom: 64px;
        }
        .timeline-steps { display: flex; flex-direction: column; gap: 0; }
        .tl-step {
          display: flex; gap: 20px; padding: 22px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          align-items: flex-start;
        }
        .tl-step:last-child { border-bottom: none; }
        .tl-left {
          display: flex; flex-direction: column;
          align-items: center; gap: 0; flex-shrink: 0;
        }
        .tl-num {
          font-family: 'DM Mono', monospace; font-size: 10px;
          padding: 4px 8px; border-radius: 6px;
          letter-spacing: 0.06em; margin-bottom: 8px;
          border: 1px solid; flex-shrink: 0;
        }
        .tl-line {
          width: 1px; flex: 1; min-height: 28px;
          background: linear-gradient(to bottom, rgba(34,211,238,0.25), transparent);
        }
        .tl-step:last-child .tl-line { display: none; }
        .tl-body { flex: 1; padding-top: 2px; }
        .tl-title {
          font-size: 15px; font-weight: 700;
          color: #e2e8f0; margin-bottom: 6px;
        }
        .tl-desc {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: #475569; line-height: 1.6;
        }

        /* ── TECH STACK ── */
        .stack-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
          margin-bottom: 64px;
        }
        .stack-tile {
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 22px 18px;
          display: flex; flex-direction: column; gap: 8px;
          transition: transform 0.2s, border-color 0.2s;
          position: relative; overflow: hidden;
        }
        .stack-tile:hover {
          transform: translateY(-2px);
          border-color: var(--stc);
        }
        .stack-icon { font-size: 18px; color: var(--stc); }
        .stack-name {
          font-size: 14px; font-weight: 700; color: #94a3b8;
        }
        .stack-role {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: #334155;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .stack-bg {
          position: absolute; bottom: -6px; right: 8px;
          font-size: 40px; opacity: 0.04; color: var(--stc);
          pointer-events: none; line-height: 1;
        }

        /* ── DEVELOPER CARD ── */
        .dev-card {
          background: #070d1a;
          border: 1px solid rgba(34,211,238,0.15);
          border-radius: 20px;
          padding: 44px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 36px;
          align-items: start;
          margin-bottom: 32px;
          position: relative; overflow: hidden;
        }
        @media (max-width: 600px) { .dev-card { grid-template-columns: 1fr; } }
        .dev-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #22d3ee55, transparent);
        }
        .avatar-wrap {
          position: relative; flex-shrink: 0;
        }
        .avatar {
          width: 88px; height: 88px;
          border-radius: 16px;
          background: linear-gradient(135deg, #0f172a, #0a2340);
          border: 2px solid rgba(34,211,238,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
          animation: avatarGlow 3s ease-in-out infinite;
          position: relative; overflow: hidden;
        }
        .avatar-scan {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #22d3ee88, transparent);
          animation: scanLine 3s linear infinite;
        }
        .dev-name {
          font-size: 28px; font-weight: 800;
          letter-spacing: -0.02em; color: #f1f5f9;
          margin-bottom: 6px;
        }
        .dev-handle {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: #22d3ee;
          letter-spacing: 0.06em; margin-bottom: 16px;
        }
        .dev-bio {
          font-family: 'DM Mono', monospace;
          font-size: 13px; color: #475569;
          line-height: 1.8; margin-bottom: 20px;
          max-width: 560px;
        }
        .dev-badges {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .dev-badge {
          padding: 5px 12px; border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ── DISCLAIMER ── */
        .disclaimer-card {
          background: rgba(251,146,60,0.04);
          border: 1px solid rgba(251,146,60,0.18);
          border-radius: 14px;
          padding: 28px 32px;
          display: flex; gap: 18px; align-items: flex-start;
        }
        .disclaimer-icon {
          font-size: 22px; flex-shrink: 0; margin-top: 2px;
          color: #fb923c;
        }
        .disclaimer-title {
          font-size: 13px; font-weight: 700; color: #fb923c;
          margin-bottom: 8px;
        }
        .disclaimer-text {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: #475569; line-height: 1.7;
        }
      `}</style>

      <div className="about-root">
        <div className="bg-grid" />
        <div className="bg-radial" />

        <div className="content">

          {/* Header */}
          <motion.div {...fadeUp(0.05)}>
            <div className="eyebrow">
              <div className="eyebrow-dot" />
              Research Project · v2.1
            </div>
            <h1 className="page-title">
              About <span className="title-gradient">CervAI</span>
            </h1>
            <p className="page-sub">
              An open-source AI system for cervical cell morphology classification,
              built to assist researchers and clinicians in the early detection
              of abnormal Pap smear findings.
            </p>
          </motion.div>

          {/* Hero Project Card */}
          <motion.div className="hero-card" {...fadeUp(0.15)}>
            <div className="hero-card-glow" />
            <div>
              <div className="project-label">Project Overview</div>
              <div className="project-name">Cervical Cell<br />AI Classifier</div>
              <p className="project-desc">
                This AI system analyzes Pap smear images using a convolutional
                neural network to classify cervical cell morphology across five
                distinct categories. Designed for educational and research
                purposes to support — not replace — clinical diagnosis.
              </p>
              <div className="project-tags">
                {["Medical AI", "Deep Learning", "Research", "Open Source"].map((t, i) => (
                  <span key={i} className="tag">{t}</span>
                ))}
              </div>
            </div>

            <div className="stats-col">
              {[
                { icon: "◎", val: "97%",    lbl: "Model Accuracy",    color: "#22d3ee" },
                { icon: "◈", val: "5",      lbl: "Cell Classes",      color: "#34d399" },
                { icon: "◇", val: "<2s",    lbl: "Inference Time",    color: "#a78bfa" },
                { icon: "○", val: "CNN",    lbl: "Architecture",      color: "#fb923c" },
              ].map((s, i) => (
                <div key={i} className="stat-row">
                  <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
                  <div className="stat-body">
                    <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
                    <div className="stat-lbl">{s.lbl}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Principles */}
          <motion.div {...fadeUp(0.2)}>
            <div className="section-label">Design Principles</div>
            <div className="principles-grid">
              {PRINCIPLES.map((p, i) => (
                <div key={i} className="principle-card" style={{ "--pc": p.color }}>
                  <div className="p-icon">{p.icon}</div>
                  <div className="p-title">{p.title}</div>
                  <div className="p-text">{p.text}</div>
                  <div className="p-bg">{p.icon}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div {...fadeUp(0.25)}>
            <div className="section-label">Development Timeline</div>
            <div className="timeline-card">
              <div className="timeline-steps">
                {TIMELINE.map((step, i) => (
                  <motion.div
                    key={i} className="tl-step"
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.1, duration: 0.5 }}
                  >
                    <div className="tl-left">
                      <div
                        className="tl-num"
                        style={{
                          color: step.color,
                          borderColor: step.color + "44",
                          background: step.color + "10"
                        }}
                      >
                        {step.phase}
                      </div>
                      <div className="tl-line" />
                    </div>
                    <div className="tl-body">
                      <div className="tl-title">{step.title}</div>
                      <div className="tl-desc">{step.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div {...fadeUp(0.3)}>
            <div className="section-label">Technology Stack</div>
            <div className="stack-grid">
              {STACK.map((s, i) => (
                <motion.div
                  key={i} className="stack-tile"
                  style={{ "--stc": s.color }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <div className="stack-icon">{s.icon}</div>
                  <div className="stack-name">{s.name}</div>
                  <div className="stack-role">{s.role}</div>
                  <div className="stack-bg">{s.icon}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Developer */}
          <motion.div {...fadeUp(0.35)}>
            <div className="section-label">Developer</div>
            <div className="dev-card">
              <div className="avatar-wrap">
                <div className="avatar">
                  🧬
                  <div className="avatar-scan" />
                </div>
              </div>
              <div>
                <div className="dev-name">Jothika & Ramya</div>
                <div className="dev-handle">@jo&ramya · Full-Stack AI Developer</div>
                <p className="dev-bio">
                  Built CervAI as a research project combining deep learning and
                  modern web technologies to make AI-assisted cervical cell analysis
                  accessible for researchers and medical educators. Passionate about
                  applying AI to real-world healthcare challenges.
                </p>
                <div className="dev-badges">
                  {[
                    { label: "React",       color: "#22d3ee" },
                    { label: "Python",      color: "#34d399" },
                    { label: "TensorFlow",  color: "#fb923c" },
                    { label: "FastAPI",     color: "#a78bfa" },
                  ].map((b, i) => (
                    <span
                      key={i} className="dev-badge"
                      style={{
                        background: b.color + "15",
                        border: `1px solid ${b.color}35`,
                        color: b.color,
                      }}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div {...fadeUp(0.4)}>
            <div className="disclaimer-card">
              <div className="disclaimer-icon">⚠</div>
              <div>
                <div className="disclaimer-title">Research & Educational Use Only</div>
                <p className="disclaimer-text">
                  CervAI is intended solely for research, educational, and assistive
                  purposes. It must not be used as the primary basis for any clinical
                  or medical decision. All predictions should be reviewed and confirmed
                  by a qualified pathologist or medical professional. The developers
                  accept no liability for misuse of this tool in clinical settings.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}