import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

import Navbar from "./components/Navbar";

import Home    from "./pages/Home";
import Analyze from "./pages/Analyze";
import Model   from "./pages/Model";
import History from "./pages/History";
import About   from "./pages/About";

const pageVariants = {
  initial:  { opacity: 0, y: 14 },
  animate:  { opacity: 1, y: 0  },
  exit:     { opacity: 0, y: -8 },
};

// ✅ `as const` makes TS infer the tuple as readonly [number,number,number,number]
// which satisfies framer-motion's Easing type — no more red underline
const pageTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};

function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Mono', monospace",
      color: "#334155",
      gap: 12,
    }}>
      <div style={{ fontSize: 64, color: "#1e293b" }}>◎</div>
      <div style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        404 · Page Not Found
      </div>
      <a href="/" style={{
        marginTop: 8, fontSize: 11, color: "#22d3ee",
        letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        ← Return Home
      </a>
    </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"        element={<PageWrapper><Home     /></PageWrapper>} />
          <Route path="/analyze" element={<PageWrapper><Analyze  /></PageWrapper>} />
          <Route path="/model"   element={<PageWrapper><Model    /></PageWrapper>} />
          <Route path="/history" element={<PageWrapper><History  /></PageWrapper>} />
          <Route path="/about"   element={<PageWrapper><About    /></PageWrapper>} />
          <Route path="*"        element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;