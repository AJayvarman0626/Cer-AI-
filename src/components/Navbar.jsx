import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const links = [
  { name: "Home",    path: "/",        icon: "⬡" },
  { name: "Analyze", path: "/analyze", icon: "◎" },
  { name: "Model",   path: "/model",   icon: "◈" },
  { name: "History", path: "/history", icon: "◷" },
  { name: "About",   path: "/about",   icon: "◇" },
];

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');

        @keyframes navFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 #22d3ee33; }
          50%       { opacity: 0.6; box-shadow: 0 0 0 4px #22d3ee11; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cerv-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 68px;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          font-family: 'Syne', sans-serif;
          transition: all 0.3s ease;
          animation: navFadeIn 0.5s ease both;
          background: ${`rgba(3, 7, 18, ${scrolled ? 0.97 : 0.85})`};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(34, 211, 238, 0.08);
        }

        .cerv-nav::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(34,211,238,0.3) 30%,
            rgba(34,211,238,0.5) 50%,
            rgba(34,211,238,0.3) 70%,
            transparent 100%
          );
        }

        /* Logo */
        .cerv-logo {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .cerv-logo-mark {
          width: 36px; height: 36px;
          border: 1.5px solid #22d3ee;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          color: #22d3ee;
          animation: pulseGlow 3s ease-in-out infinite;
          background: rgba(34,211,238,0.05);
          flex-shrink: 0;
        }

        .cerv-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .cerv-logo-name {
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.01em;
          background: linear-gradient(90deg, #e2e8f0, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cerv-logo-sub {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #334155;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* Desktop links */
        .cerv-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cerv-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.03em;
          color: #475569;
          transition: color 0.2s ease, background 0.2s ease;
          border: 1px solid transparent;
        }

        .cerv-link:hover {
          color: #94a3b8;
          background: rgba(255,255,255,0.04);
        }

        .cerv-link.active {
          color: #22d3ee;
          background: rgba(34,211,238,0.08);
          border-color: rgba(34,211,238,0.18);
        }

        .cerv-link-icon {
          font-size: 11px;
          opacity: 0.6;
        }

        .cerv-link.active .cerv-link-icon {
          opacity: 1;
          color: #22d3ee;
        }

        /* Active underline dot */
        .cerv-link.active::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #22d3ee;
          box-shadow: 0 0 6px #22d3ee;
        }

        /* Right side badge */
        .cerv-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 12px;
          background: rgba(10, 15, 30, 0.8);
          border: 1px solid rgba(34,211,238,0.15);
          border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #334155;
          letter-spacing: 0.06em;
          flex-shrink: 0;
        }

        .cerv-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22d3ee;
          animation: pulseGlow 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* Hamburger */
        .cerv-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          border: 1px solid rgba(34,211,238,0.15);
          background: rgba(34,211,238,0.05);
          transition: background 0.2s;
        }

        .cerv-hamburger:hover {
          background: rgba(34,211,238,0.1);
        }

        .cerv-hamburger span {
          display: block;
          width: 20px; height: 1.5px;
          background: #22d3ee;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .cerv-hamburger.open span:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        .cerv-hamburger.open span:nth-child(2) {
          opacity: 0; transform: scaleX(0);
        }
        .cerv-hamburger.open span:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* Mobile menu */
        .cerv-mobile-menu {
          position: fixed;
          top: 68px; left: 0; right: 0;
          background: rgba(3, 7, 18, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(34,211,238,0.1);
          padding: 20px 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          animation: slideDown 0.25s ease both;
          z-index: 999;
        }

        .cerv-mobile-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 700;
          color: #475569;
          border: 1px solid transparent;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }

        .cerv-mobile-link:hover {
          color: #94a3b8;
          background: rgba(255,255,255,0.04);
        }

        .cerv-mobile-link.active {
          color: #22d3ee;
          background: rgba(34,211,238,0.07);
          border-color: rgba(34,211,238,0.15);
        }

        .cerv-mobile-icon {
          font-size: 14px;
          width: 20px;
          text-align: center;
          opacity: 0.5;
        }

        .cerv-mobile-link.active .cerv-mobile-icon {
          opacity: 1;
        }

        .cerv-mobile-divider {
          height: 1px;
          background: rgba(34,211,238,0.06);
          margin: 8px 0;
        }

        .cerv-mobile-footer {
          margin-top: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #1e293b;
          text-align: center;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .cerv-nav { padding: 0 20px; }
          .cerv-links { display: none; }
          .cerv-badge { display: none; }
          .cerv-hamburger { display: flex; }
        }
      `}</style>

      <nav className="cerv-nav">

        {/* Logo */}
        <Link to="/" className="cerv-logo">
          <div className="cerv-logo-mark">⬡</div>
          <div className="cerv-logo-text">
            <span className="cerv-logo-name">CervAI</span>
            <span className="cerv-logo-sub">Cell Classifier</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="cerv-links">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`cerv-link${location.pathname === link.path ? " active" : ""}`}
            >
              <span className="cerv-link-icon">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Status badge (desktop) */}
        <div className="cerv-badge">
          <div className="cerv-badge-dot" />
          System Online
        </div>

        {/* Hamburger (mobile) */}
        <div
          className={`cerv-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="cerv-mobile-menu">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`cerv-mobile-link${location.pathname === link.path ? " active" : ""}`}
            >
              <span className="cerv-mobile-icon">{link.icon}</span>
              {link.name}
            </Link>
          ))}
          <div className="cerv-mobile-divider" />
          <div className="cerv-mobile-footer">CervAI · v2.1 · System Online</div>
        </div>
      )}
    </>
  );
}

export default Navbar;