import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_SCANS = [
  {
    id: "SCN-001",
    file: "pap_smear_001.png",
    prediction: "Dyskeratotic",
    confidence: 91.4,
    risk: "Abnormal",
    color: "#f43f5e",
    date: "2025-03-08",
    time: "09:14 AM",
    size: "1.2 MB",
    duration: "1.4s",
  },
  {
    id: "SCN-002",
    file: "sample_cervix_02.png",
    prediction: "Metaplastic",
    confidence: 78.2,
    risk: "Benign",
    color: "#facc15",
    date: "2025-03-07",
    time: "02:38 PM",
    size: "980 KB",
    duration: "1.1s",
  },
  {
    id: "SCN-003",
    file: "koilo_test_img.png",
    prediction: "Koilocytotic",
    confidence: 84.7,
    risk: "Monitor",
    color: "#fb923c",
    date: "2025-03-06",
    time: "11:05 AM",
    size: "1.5 MB",
    duration: "1.7s",
  },
  {
    id: "SCN-004",
    file: "parabasal_scan.png",
    prediction: "Parabasal",
    confidence: 96.1,
    risk: "Normal",
    color: "#34d399",
    date: "2025-03-05",
    time: "04:22 PM",
    size: "870 KB",
    duration: "0.9s",
  },
  {
    id: "SCN-005",
    file: "superficial_002.png",
    prediction: "Superficial-Intermediate",
    confidence: 88.3,
    risk: "Normal",
    color: "#22d3ee",
    date: "2025-03-04",
    time: "10:50 AM",
    size: "1.1 MB",
    duration: "1.2s",
  },
];

const RISK_FILTERS = ["All", "Normal", "Benign", "Monitor", "Abnormal"];

const RISK_COLOR = {
  Normal:   "#34d399",
  Benign:   "#facc15",
  Monitor:  "#fb923c",
  Abnormal: "#f43f5e",
};

function MiniBar({ pct, color }) {
  return (
    <div style={{
      height: 4, borderRadius: 4, width: 80,
      background: "rgba(255,255,255,0.06)", overflow: "hidden"
    }}>
      <div style={{
        height: "100%", borderRadius: 4,
        width: pct + "%", background: color,
        boxShadow: `0 0 6px ${color}88`,
        transition: "width 1s ease",
      }} />
    </div>
  );
}

export default function History() {
  const [scans, setScans] = useState(INITIAL_SCANS);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = scans
    .filter(s => filter === "All" || s.risk === filter)
    .filter(s =>
      s.file.toLowerCase().includes(search.toLowerCase()) ||
      s.prediction.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sortAsc
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date)
    );

  const deleteRow = (id, e) => {
    e.stopPropagation();
    setScans(prev => prev.filter(s => s.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const stats = {
    total:    scans.length,
    abnormal: scans.filter(s => s.risk === "Abnormal").length,
    monitor:  scans.filter(s => s.risk === "Monitor").length,
    avgConf:  (scans.reduce((a, s) => a + s.confidence, 0) / scans.length).toFixed(1),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes gridPan {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes borderTrace {
          0%   { background-position: 0% 0%; }
          100% { background-position: 300% 0%; }
        }

        .hist-root {
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
          background: radial-gradient(ellipse 70% 35% at 50% -5%, rgba(34,211,238,0.06) 0%, transparent 60%);
        }
        .content {
          position: relative; z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 120px 24px 0;
        }

        /* Header */
        .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px;
          background: rgba(34,211,238,0.07);
          border: 1px solid rgba(34,211,238,0.2);
          border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: #22d3ee;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 20px;
        }
        .eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #22d3ee;
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .page-title {
          font-size: clamp(32px, 5vw, 58px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
          margin-bottom: 12px;
          color: #f1f5f9;
        }
        .title-gradient {
          background: linear-gradient(90deg, #22d3ee 0%, #34d399 50%, #22d3ee 100%);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: borderTrace 4s linear infinite;
        }
        .page-sub {
          font-family: 'DM Mono', monospace;
          font-size: 13px; color: #475569;
          margin-bottom: 48px;
        }

        /* Stats row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 32px;
        }
        @media (max-width: 640px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
        .stat-tile {
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 18px 20px;
          position: relative; overflow: hidden;
        }
        .stat-tile::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--tc); opacity: 0.5;
        }
        .stat-num {
          font-size: 26px; font-weight: 800;
          font-family: 'DM Mono', monospace;
          letter-spacing: -0.04em;
          color: var(--tc);
        }
        .stat-lbl {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: #334155;
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-top: 4px;
        }

        /* Controls */
        .controls {
          display: flex; align-items: center; gap: 12px;
          flex-wrap: wrap; margin-bottom: 20px;
        }
        .search-wrap {
          position: relative; flex: 1; min-width: 200px;
        }
        .search-icon {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%);
          font-size: 14px; color: #334155; pointer-events: none;
        }
        .search-input {
          width: 100%; background: #070d1a;
          border: 1px solid #1e293b; border-radius: 10px;
          padding: 10px 12px 10px 34px;
          color: #94a3b8; font-family: 'DM Mono', monospace;
          font-size: 12px; outline: none;
          transition: border-color 0.2s;
        }
        .search-input:focus { border-color: rgba(34,211,238,0.4); color: #e2e8f0; }
        .search-input::placeholder { color: #334155; }

        .filter-pills {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .filter-pill {
          padding: 7px 14px;
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: #475569;
          cursor: pointer; transition: all 0.2s;
          letter-spacing: 0.05em;
        }
        .filter-pill:hover { color: #94a3b8; border-color: #334155; }
        .filter-pill.active {
          background: rgba(34,211,238,0.08);
          border-color: rgba(34,211,238,0.3);
          color: #22d3ee;
        }

        .sort-btn {
          padding: 8px 14px;
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: #475569;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 6px;
          white-space: nowrap;
        }
        .sort-btn:hover { color: #94a3b8; border-color: #334155; }

        /* Layout: table + detail */
        .layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        .layout.with-detail {
          grid-template-columns: 1fr 340px;
        }
        @media (max-width: 900px) { .layout.with-detail { grid-template-columns: 1fr; } }

        /* Table */
        .table-card {
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 16px;
          overflow: hidden;
        }
        .table-head-row {
          display: grid;
          grid-template-columns: 80px 1fr 130px 110px 100px 44px;
          padding: 12px 20px;
          border-bottom: 1px solid #1e293b;
          background: rgba(255,255,255,0.02);
        }
        .th {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: #334155;
          letter-spacing: 0.12em; text-transform: uppercase;
          align-self: center;
        }
        .table-body { max-height: 480px; overflow-y: auto; }
        .table-body::-webkit-scrollbar { width: 4px; }
        .table-body::-webkit-scrollbar-track { background: transparent; }
        .table-body::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }

        .table-row {
          display: grid;
          grid-template-columns: 80px 1fr 130px 110px 100px 44px;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          cursor: pointer;
          transition: background 0.15s;
          align-items: center;
        }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: rgba(255,255,255,0.025); }
        .table-row.selected { background: rgba(34,211,238,0.05); border-left: 2px solid #22d3ee; }

        .row-id {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: #334155;
        }
        .row-file {
          font-size: 13px; font-weight: 600; color: #94a3b8;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          padding-right: 12px;
        }
        .row-pred {
          display: flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 700;
        }
        .row-pred-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
        }
        .row-conf {
          display: flex; flex-direction: column; gap: 4px;
        }
        .row-conf-num {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: #94a3b8;
        }
        .row-date {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: #475569;
        }
        .del-btn {
          background: transparent; border: 1px solid transparent;
          border-radius: 6px; cursor: pointer;
          color: #334155; font-size: 14px; padding: 4px 7px;
          transition: all 0.2s;
        }
        .del-btn:hover {
          background: rgba(244,63,94,0.1);
          border-color: rgba(244,63,94,0.3);
          color: #f43f5e;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          font-family: 'DM Mono', monospace;
          color: #1e3a5f;
          font-size: 13px;
        }

        /* Detail panel */
        .detail-panel {
          background: #070d1a;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 28px;
          animation: slideIn 0.3s ease;
          align-self: start;
          position: sticky; top: 88px;
        }
        .detail-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: #334155;
          letter-spacing: 0.14em; text-transform: uppercase;
          margin-bottom: 6px;
        }
        .detail-value {
          font-size: 13px; color: #94a3b8;
          font-family: 'DM Mono', monospace;
          margin-bottom: 18px; line-height: 1.5;
        }
        .detail-pred-name {
          font-size: 20px; font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .detail-divider {
          height: 1px; background: #1e293b;
          margin: 20px 0;
        }
        .detail-conf-track {
          background: #0a0f1e; border-radius: 6px;
          height: 24px; overflow: hidden; margin-bottom: 20px;
        }
        .detail-conf-fill {
          height: 100%; border-radius: 6px;
          display: flex; align-items: center;
          justify-content: flex-end;
          padding-right: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: white;
          transition: width 0.8s cubic-bezier(0.34,1.2,0.64,1);
        }
        .risk-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .detail-close {
          width: 100%; margin-top: 20px;
          padding: 10px; border-radius: 8px;
          background: transparent;
          border: 1px solid #1e293b;
          color: #475569; font-family: 'DM Mono', monospace;
          font-size: 11px; cursor: pointer;
          transition: all 0.2s;
        }
        .detail-close:hover { border-color: #334155; color: #94a3b8; }
      `}</style>

      <div className="hist-root">
        <div className="bg-grid" />
        <div className="bg-radial" />

        <div className="content">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="eyebrow">
              <div className="eyebrow-dot" />
              Analysis Records · Local Session
            </div>
            <h1 className="page-title">
              Scan <span className="title-gradient">History</span>
            </h1>
            <p className="page-sub">
              {scans.length} records · sorted by date · click a row to inspect
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="stats-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {[
              { num: stats.total,    lbl: "Total Scans",    color: "#22d3ee" },
              { num: stats.abnormal, lbl: "Abnormal Flags", color: "#f43f5e" },
              { num: stats.monitor,  lbl: "Monitor Cases",  color: "#fb923c" },
              { num: stats.avgConf + "%", lbl: "Avg Confidence", color: "#34d399" },
            ].map((s, i) => (
              <div key={i} className="stat-tile" style={{ "--tc": s.color }}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="controls">
              <div className="search-wrap">
                <span className="search-icon">◎</span>
                <input
                  className="search-input"
                  placeholder="Search by file, class, or ID…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button
                className="sort-btn"
                onClick={() => setSortAsc(p => !p)}
              >
                {sortAsc ? "↑" : "↓"} Date
              </button>
            </div>

            <div className="filter-pills" style={{ marginBottom: 20 }}>
              {RISK_FILTERS.map(f => (
                <button
                  key={f}
                  className={`filter-pill${filter === f ? " active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f !== "All" && (
                    <span style={{
                      display: "inline-block", width: 6, height: 6,
                      borderRadius: "50%", background: RISK_COLOR[f],
                      marginRight: 6, verticalAlign: "middle"
                    }} />
                  )}
                  {f}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Table + Detail */}
          <motion.div
            className={`layout${selected ? " with-detail" : ""}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {/* Table */}
            <div className="table-card">
              <div className="table-head-row">
                <div className="th">ID</div>
                <div className="th">File</div>
                <div className="th">Prediction</div>
                <div className="th">Confidence</div>
                <div className="th">Date</div>
                <div className="th"></div>
              </div>

              <div className="table-body">
                {filtered.length === 0 ? (
                  <div className="empty-state">
                    ◎ &nbsp;No records match your filter
                  </div>
                ) : (
                  <AnimatePresence>
                    {filtered.map((scan, i) => (
                      <motion.div
                        key={scan.id}
                        className={`table-row${selected?.id === scan.id ? " selected" : ""}`}
                        onClick={() => setSelected(selected?.id === scan.id ? null : scan)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="row-id">{scan.id}</div>
                        <div className="row-file">{scan.file}</div>
                        <div className="row-pred">
                          <div
                            className="row-pred-dot"
                            style={{ background: scan.color, boxShadow: `0 0 5px ${scan.color}` }}
                          />
                          <span style={{ color: scan.color, fontSize: 12 }}>
                            {scan.prediction}
                          </span>
                        </div>
                        <div className="row-conf">
                          <span className="row-conf-num">{scan.confidence}%</span>
                          <MiniBar pct={scan.confidence} color={scan.color} />
                        </div>
                        <div className="row-date">
                          {scan.date}<br />
                          <span style={{ color: "#1e3a5f" }}>{scan.time}</span>
                        </div>
                        <button
                          className="del-btn"
                          onClick={e => deleteRow(scan.id, e)}
                          title="Delete"
                        >
                          ✕
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Detail Panel */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  className="detail-panel"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="detail-label">Scan ID</div>
                  <div className="detail-value">{selected.id}</div>

                  <div className="detail-label">File</div>
                  <div className="detail-value">{selected.file}</div>

                  <div className="detail-divider" />

                  <div className="detail-label">Prediction</div>
                  <div
                    className="detail-pred-name"
                    style={{ color: selected.color }}
                  >
                    {selected.prediction}
                  </div>

                  <div style={{ margin: "12px 0 6px" }}>
                    <span
                      className="risk-badge"
                      style={{
                        background: selected.color + "18",
                        border: `1px solid ${selected.color}44`,
                        color: selected.color,
                      }}
                    >
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: selected.color, display: "inline-block"
                      }} />
                      {selected.risk}
                    </span>
                  </div>

                  <div className="detail-divider" />

                  <div className="detail-label">Confidence</div>
                  <div className="detail-conf-track">
                    <div
                      className="detail-conf-fill"
                      style={{
                        width: selected.confidence + "%",
                        background: `linear-gradient(90deg, ${selected.color}88, ${selected.color})`,
                      }}
                    >
                      {selected.confidence}%
                    </div>
                  </div>

                  {[
                    { label: "Date",          value: selected.date },
                    { label: "Time",          value: selected.time },
                    { label: "File Size",     value: selected.size },
                    { label: "Inference Time",value: selected.duration },
                  ].map((row, i) => (
                    <div key={i}>
                      <div className="detail-label">{row.label}</div>
                      <div className="detail-value">{row.value}</div>
                    </div>
                  ))}

                  <div style={{
                    padding: "10px 14px",
                    background: "rgba(251,146,60,0.06)",
                    border: "1px solid rgba(251,146,60,0.15)",
                    borderRadius: 8,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11, color: "#64748b",
                    lineHeight: 1.6,
                  }}>
                    ⚠ Results are for research use only. Confirm with a qualified pathologist.
                  </div>

                  <button className="detail-close" onClick={() => setSelected(null)}>
                    ✕ &nbsp;Close Detail
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </>
  );
}