import React, { useRef, useState, useEffect } from "react";
import { POSITIONS, SCROLL_HEIGHT, ASSETS } from "../constants";
import { ArrowDown } from "lucide-react";
import V1RevealOverlay from "./V1RevealOverlay";

// --- HELPERS ---
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const smoothstep = (x: number) => x * x * (3 - 2 * x);

// --- TYPES ---
type GateState = {
  tPass: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

interface JourneySceneProps {
  scrollY: number;
  onComplete: () => void;
}

const JourneyScene: React.FC<JourneySceneProps> = ({ scrollY }) => {
  const worldRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [smoothScrollY, setSmoothScrollY] = useState(0);
  const targetScrollRef = useRef(0);

  // Handle Responsive Check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth Scroll Interpolation
  useEffect(() => {
    targetScrollRef.current = scrollY;
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      setSmoothScrollY((prev) => {
        const target = targetScrollRef.current;
        const next = prev + (target - prev) * 0.12;
        return Math.abs(next - target) < 0.25 ? target : next;
      });
      requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
    };
  }, [scrollY]);

  const worldZ = smoothScrollY;
  const isIntro = worldZ < 100;

  // Gate Logic Calculation
  const computeGateState = (panelZ: number): GateState => {
    const dist = panelZ + worldZ;
    const approachStart = -2200;
    const approachEnd = 150;
    const passEnd = 950;

    const tApproach = clamp01(
      (dist - approachStart) / (approachEnd - approachStart)
    );
    const tPassLinear = clamp01((dist - approachEnd) / (passEnd - approachEnd));

    const a = smoothstep(tApproach);
    const p = smoothstep(tPassLinear);

    // Scale capped at 2.4 to prevent clipping on short/wide laptop screens
    const minScale = isMobile ? 0.95 : 0.55;
    const nearScale = isMobile ? 1.15 : 1.25;
    const throughScale = isMobile ? 2.3 : 2.4;

    const scale =
      p > 0
        ? nearScale + (throughScale - nearScale) * p
        : minScale + (nearScale - minScale) * a;

    return {
      tPass: p,
      scale,
      opacity: clamp01(
        (0.7 + 0.3 * smoothstep(clamp01((panelZ + worldZ + 2000) / 1500))) *
          (a * 1.15) *
          (1 - p * p)
      ),
      zIndex: 20 + Math.round(60 * Math.max(a, p)),
    };
  };

  const panel1State = computeGateState(POSITIONS.SIGN_1 - 600);
  const panel2State = computeGateState(POSITIONS.SIGN_2 - 1200);

  // Reveal Timing
  const postSign2Dist = POSITIONS.SIGN_2 - 1200 + worldZ - 950;
  const revealLayerOpacity = smoothstep(clamp01((postSign2Dist - 1950) / 250));

  return (
    <div className="relative w-full h-full bg-[#1c1917] overflow-hidden">
      {/* 1. BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=2500&auto=format&fit=crop"
          className="w-full h-full object-cover"
          style={{ transform: `scale(${1 + worldZ * 0.00005})` }}
          alt="Forest Path"
        />
        <div className="absolute inset-0 bg-stone-900/40" />
      </div>

      {/* 2. 3D WORLD WRAPPER */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
      >
        <div
          ref={worldRef}
          className="w-full h-full relative"
          style={{
            transform: `translateZ(${worldZ}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* INTRO TEXT */}
          <div
            className="absolute top-1/2 left-1/2 text-center w-full"
            style={{
              transform: `translate3d(-50%, -50%, ${
                POSITIONS.START_TEXT + 450
              }px) translateY(-100px)`,
            }}
          >
            <h1 className="text-4xl md:text-6xl font-serif text-white font-bold px-6 leading-tight drop-shadow-2xl">
              Your kidney health <br className="md:hidden" /> is a journey.
            </h1>
          </div>

          {/* GATE 1 */}
          <GatePanel
            state={panel1State}
            z={POSITIONS.SIGN_1 - 600}
            logo={ASSETS.renalLogo}
            title="Renal Physicians"
            est="Est. 1972"
          />

          {/* GATE 2 */}
          <GatePanel
            state={panel2State}
            z={POSITIONS.SIGN_2 - 1200}
            logo="https://i.ibb.co/WvbphTZT/NAOD-Logo.jpg"
            title="Nephrology Associates"
            est="Since 1980"
          />
        </div>
      </div>

      {/* 3. DYNAMIC SCROLL HINT */}
      {isIntro && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
          <p className="text-white/80 text-[10px] tracking-[0.3em] uppercase font-bold drop-shadow-md">
            {worldZ < 200 ? "Scroll to Begin" : "Pass through to continue"}
          </p>
          <div className="animate-bounce mt-1">
            <ArrowDown className="text-white/80" size={18} />
          </div>
        </div>
      )}

      {/* 4. REVEAL OVERLAY */}
      <div
        className="absolute inset-0 z-50"
        style={{
          opacity: revealLayerOpacity,
          pointerEvents: revealLayerOpacity > 0.9 ? "auto" : "none",
        }}
      >
        <V1RevealOverlay
          opacity={1}
          isActive={revealLayerOpacity > 0.9}
          pointerEvents={revealLayerOpacity > 0.9 ? "auto" : "none"}
          setView={() => {}}
        />
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: GATEPANEL ---
const GatePanel: React.FC<{
  state: GateState;
  z: number;
  logo: string;
  title: string;
  est: string;
}> = ({ state, z, logo, title, est }) => (
  <div
    className="absolute top-1/2 left-1/2 w-[90vw] max-w-[900px] h-[400px]"
    style={{
      transform: `translate3d(-50%, -50%, ${z}px)`,
      opacity: state.opacity,
      zIndex: state.zIndex,
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
    }}
  >
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{
        transform: `scale(${state.scale})`,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* DOORS */}
      <div
        className="absolute inset-0 flex preserve-3d"
        style={{ willChange: "transform" }}
      >
        {/* LEFT DOOR */}
        <div
          className="w-1/2 h-full origin-left border border-white/20 border-r-0 backdrop-blur-xl rounded-l-[40px]"
          style={{
            transform: `rotateY(${-75 * state.tPass}deg)`,
            background: "rgba(255,255,255,0.1)",
            backfaceVisibility: "hidden",
            willChange: "transform",
          }}
        />
        {/* RIGHT DOOR */}
        <div
          className="w-1/2 h-full origin-right border border-white/20 border-l-0 backdrop-blur-xl rounded-r-[40px]"
          style={{
            transform: `rotateY(${75 * state.tPass}deg)`,
            background: "rgba(255,255,255,0.1)",
            backfaceVisibility: "hidden",
            willChange: "transform",
          }}
        />
      </div>

      {/* CONTENT LAYER */}
      <div
        className="relative z-10 flex flex-col items-center p-8 pointer-events-none"
        style={{
          opacity: clamp01(1 - state.tPass * 2.5),
          transform: "translateZ(50px)",
          willChange: "opacity",
        }}
      >
        <span className="text-white/60 text-xs md:text-sm tracking-[.3em] uppercase mb-4 font-bold">
          {est}
        </span>
        <img
          src={logo}
          className="h-16 md:h-28 object-contain brightness-200 grayscale mb-6"
          alt={title}
        />
        <h2 className="text-white text-xl md:text-3xl font-serif text-center drop-shadow-lg">
          {title}
        </h2>
      </div>
    </div>
  </div>
);

export default JourneyScene;
