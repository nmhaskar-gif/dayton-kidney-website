// src/components/JourneyScene.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { POSITIONS } from "../constants";
import V1RevealOverlay from "./V1RevealOverlay";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const smoothstep = (x: number) => x * x * (3 - 2 * x);
const smoothstep2 = (x: number) => smoothstep(smoothstep(x));

type GateTheme = "intro" | "rpi" | "naod";
type GateTiming = {
  approachStart: number;
  approachEnd: number;
  passEnd: number;
};
type GateState = {
  open: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

type GateContent = {
  eyebrow?: string;
  title: string;
  body: string;
  cta?: string;
  logoSrc?: string;
  logoAlt?: string;
};

const THEME: Record<
  GateTheme,
  { leftBg: string; rightBg: string; border: string; contentCard: string }
> = {
  intro: {
    leftBg:
      "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(20,184,166,0.10))",
    rightBg:
      "linear-gradient(225deg, rgba(14,165,233,0.18), rgba(20,184,166,0.10))",
    border: "rgba(255,255,255,0.22)",
    contentCard: "bg-black/30 border-white/10",
  },

  // RPI: blue/orange (subtle tint)
  rpi: {
    leftBg:
      "linear-gradient(135deg, rgba(59,130,246,0.22), rgba(249,115,22,0.12))",
    rightBg:
      "linear-gradient(225deg, rgba(59,130,246,0.22), rgba(249,115,22,0.12))",
    border: "rgba(255,255,255,0.22)",
    contentCard: "bg-white/6 border-white/15",
  },

  // NAOD: green (subtle tint)
  naod: {
    leftBg:
      "linear-gradient(135deg, rgba(34,197,94,0.22), rgba(255,255,255,0.06))",
    rightBg:
      "linear-gradient(225deg, rgba(34,197,94,0.22), rgba(255,255,255,0.06))",
    border: "rgba(255,255,255,0.22)",
    contentCard: "bg-white/6 border-white/15",
  },
};

function computeGateState(
  panelZ: number,
  worldZ: number,
  timing: GateTiming,
  isMobile: boolean
): GateState {
  const dist = panelZ + worldZ;

  const tApproach = clamp01(
    (dist - timing.approachStart) / (timing.approachEnd - timing.approachStart)
  );
  const a = smoothstep(tApproach);

  const tPassLinear = clamp01(
    (dist - timing.approachEnd) / (timing.passEnd - timing.approachEnd)
  );
  const pHeavy = smoothstep2(tPassLinear);

  // Critical: start opening before collision + smooth heavy swing
  const open = clamp01(pHeavy + 0.22 * a);

  // Keep scale safe on laptops
  const minScale = isMobile ? 0.98 : 0.62;
  const nearScale = isMobile ? 1.12 : 1.18;
  const throughScale = isMobile ? 2.05 : 2.12;
  const scale =
    open > 0
      ? nearScale + (throughScale - nearScale) * open
      : minScale + (nearScale - minScale) * a;

  const fadeIn = clamp01(a * 1.1);
  const fadeOut = 1 - open * open;
  const opacity = clamp01(fadeIn * fadeOut);

  const zIndex = 20 + Math.round(60 * Math.max(a, open));
  return { open, scale, opacity, zIndex };
}

const GatePanel: React.FC<{
  z: number;
  state: GateState;
  theme: GateTheme;
  content: GateContent;
  topClassName?: string;
  zIndexCap?: number;
}> = ({ z, state, theme, content, topClassName, zIndexCap }) => {
  const t = THEME[theme];
  const zIndex =
    typeof zIndexCap === "number"
      ? Math.min(state.zIndex, zIndexCap)
      : state.zIndex;

  return (
    <div
      className={`absolute ${
        topClassName ?? "top-1/2"
      } left-1/2 w-[92vw] max-w-[980px] h-[520px]`}
      style={{
        transform: `translate3d(-50%, -50%, ${z}px)`,
        opacity: state.opacity,
        zIndex,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        willChange: "transform, opacity",
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
        <div className="absolute inset-0 flex preserve-3d">
          <div
            className="w-1/2 h-full origin-left border border-white/20 border-r-0 backdrop-blur-2xl rounded-l-[44px]"
            style={{
              transform: `rotateY(${-72 * state.open}deg)`,
              background: t.leftBg,
              borderColor: t.border,
              backfaceVisibility: "hidden",
              willChange: "transform",
            }}
          />
          <div
            className="w-1/2 h-full origin-right border border-white/20 border-l-0 backdrop-blur-2xl rounded-r-[44px]"
            style={{
              transform: `rotateY(${72 * state.open}deg)`,
              background: t.rightBg,
              borderColor: t.border,
              backfaceVisibility: "hidden",
              willChange: "transform",
            }}
          />
        </div>

        {/* CONTENT */}
        <div
          className={`relative z-10 flex flex-col items-center justify-center text-center px-8 md:px-12 py-10 rounded-3xl border ${t.contentCard}`}
          style={{
            opacity: clamp01(1 - state.open * 1.25),
            transform: "translateZ(70px)",
            willChange: "opacity",
          }}
        >
          {content.eyebrow && (
            <div className="text-white/75 text-[11px] md:text-sm uppercase tracking-[0.35em] font-bold mb-4">
              {content.eyebrow}
            </div>
          )}

          {content.logoSrc && (
            <div className="mb-6 bg-white/10 border border-white/15 rounded-3xl px-8 py-6">
              <img
                src={content.logoSrc}
                alt={content.logoAlt ?? content.title}
                className="h-14 md:h-20 object-contain"
              />
            </div>
          )}

          <h2 className="text-white text-2xl md:text-5xl font-serif font-bold drop-shadow-2xl">
            {content.title}
          </h2>

          <p className="text-white/85 text-sm md:text-xl mt-4 font-semibold drop-shadow-lg max-w-3xl">
            {content.body}
          </p>

          {content.cta && (
            <p className="text-white/70 text-[10px] md:text-sm mt-7 tracking-[0.35em] uppercase font-bold">
              {content.cta}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const JourneyScene: React.FC<{ scrollY: number; onComplete: () => void }> = ({
  scrollY,
}) => {
  const worldRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [smoothScrollY, setSmoothScrollY] = useState(0);
  const targetScrollRef = useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    targetScrollRef.current = scrollY;
  }, [scrollY]);

  useEffect(() => {
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
  }, []);

  const worldZ = smoothScrollY;

  // Timings chosen specifically to:
  // - start opening BEFORE you reach the sign (approachEnd is negative)
  // - open slowly over a long distance (passEnd far)
  const INTRO_TIMING: GateTiming = useMemo(
    () => ({ approachStart: -2400, approachEnd: -700, passEnd: 2400 }),
    []
  );
  const GATE_TIMING: GateTiming = useMemo(
    () => ({ approachStart: -2200, approachEnd: -450, passEnd: 2600 }),
    []
  );

  const introZ = POSITIONS.START_TEXT + 400;
  const rpiZ = POSITIONS.SIGN_1 - 600;
  const naodZ = POSITIONS.SIGN_2 - 1200;

  const introState = computeGateState(introZ, worldZ, INTRO_TIMING, isMobile);
  const rpiState = computeGateState(rpiZ, worldZ, GATE_TIMING, isMobile);
  const naodState = computeGateState(naodZ, worldZ, GATE_TIMING, isMobile);

  // Scroll hint: only early, and not while intro is already opening
  const showScrollHint = worldZ < 140 && introState.open < 0.12;

  // Reveal overlay (keep yours if different)
  const postSign2Dist = naodZ + worldZ - 1200;
  const revealLayerOpacity = smoothstep(clamp01((postSign2Dist - 1800) / 300));

  return (
    <div className="relative w-full h-full bg-[#1c1917] overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=2500&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-85"
          style={{ transform: `scale(${1 + worldZ * 0.00005})` }}
          alt="Foggy Road"
        />
        <div className="absolute inset-0 bg-stone-900/45" />
      </div>

      {/* 3D WORLD */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        style={{ perspective: "1400px" }}
      >
        <div
          ref={worldRef}
          className="w-full h-full relative"
          style={{
            transform: `translateZ(${worldZ}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* INTRO GATE: placed lower to avoid overlap with fixed Skip UI */}
          <GatePanel
            theme="intro"
            z={introZ}
            state={introState}
            topClassName="top-[72%] md:top-[64%]"
            // cap z-index to stay under typical fixed top UI
            zIndexCap={38}
            content={{
              eyebrow: "Welcome to Dayton Kidney",
              title: "Your kidney health is a journey.",
              body: "We’ve been with you for over 50 years — bringing unrivaled expertise and compassionate care to the Miami Valley.",
              cta: "Scroll forward to begin",
            }}
          />

          {/* RPI */}
          <GatePanel
            theme="rpi"
            z={rpiZ}
            state={rpiState}
            content={{
              eyebrow: "Est. 1972",
              title: "Renal Physicians",
              body: "Setting the standard for excellence in kidney care in Dayton.",
              cta: "Continue scrolling to pass through",
              logoSrc: "/images/RPI-Logo.png",
              logoAlt: "Renal Physicians (RPI) logo",
            }}
          />

          {/* NAOD */}
          <GatePanel
            theme="naod"
            z={naodZ}
            state={naodState}
            content={{
              eyebrow: "Since 1980",
              title: "Nephrology Associates of Dayton",
              body: "Providing compassionate, patient-centered kidney care close to home.",
              cta: "Pass through to continue",
              // If you keep the space in the filename, use this exact path:
              logoSrc: "/images/NAOD-Logo.jpg",
              logoAlt: "Nephrology Associates of Dayton (NAOD) logo",
            }}
          />
        </div>
      </div>

      {/* SCROLL HINT */}
      {showScrollHint && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none">
          <p className="text-white/85 text-[10px] tracking-[0.35em] uppercase font-bold drop-shadow-md">
            Scroll to Begin
          </p>
          <div className="animate-bounce mt-1">
            <ArrowDown className="text-white/85" size={18} />
          </div>
        </div>
      )}

      {/* REVEAL OVERLAY */}
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

export default JourneyScene;
