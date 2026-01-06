import React, { useRef, useState, useEffect } from "react";
import { POSITIONS, SCROLL_HEIGHT, ASSETS } from "../constants";
import { ArrowDown } from "lucide-react";
import V1RevealOverlay from "./V1RevealOverlay";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const smoothstep = (x: number) => x * x * (3 - 2 * x);

type GateState = {
  tPass: number;
  scale: number;
  opacity: number;
  zIndex: number;
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

  const computeGateState = (panelZ: number): GateState => {
    const dist = panelZ + worldZ;
    const approachStart = -2200;
    const approachEnd = 250;
    /* FIX: Changed passEnd to 1700 to make the doors swing slowly and feel "heavy" */
    const passEnd = 1700;

    const tApproach = clamp01(
      (dist - approachStart) / (approachEnd - approachStart)
    );
    const tPassLinear = clamp01((dist - approachEnd) / (passEnd - approachEnd));

    const a = smoothstep(tApproach);
    const p = smoothstep(tPassLinear);

    const minScale = isMobile ? 0.95 : 0.55;
    const nearScale = isMobile ? 1.15 : 1.25;
    const throughScale = isMobile ? 2.2 : 2.4;

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

  const postSign2Dist = POSITIONS.SIGN_2 - 1200 + worldZ - 950;
  const revealLayerOpacity = smoothstep(clamp01((postSign2Dist - 1950) / 250));

  return (
    <div className="relative w-full h-full bg-[#1c1917] overflow-hidden">
      {/* 1. BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=2500&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-80"
          style={{ transform: `scale(${1 + worldZ * 0.00005})` }}
          alt="Foggy Road"
        />
        <div className="absolute inset-0 bg-stone-900/40" />
      </div>

      {/* 2. 3D WORLD */}
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
            className="absolute top-[62%] md:top-[55%] left-1/2 text-center w-full max-w-[90%] md:max-w-3xl px-6 py-8 bg-black/30 backdrop-blur-sm rounded-3xl border border-white/10"
            style={{
              transform: `translate3d(-50%, -50%, ${
                POSITIONS.START_TEXT + 450
              }px) translateY(-100px)`,
            }}
          >
            <h2 className="text-white text-xs md:text-sm uppercase tracking-[0.2em] mb-4 font-bold">
              Welcome to Dayton Kidney
            </h2>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-white font-bold leading-tight">
              Your kidney health is a journey.
              <br />
              <span className="text-white">
                We&apos;ve been with you for over{" "}
                <br className="hidden lg:block" /> 50 years.
              </span>
            </h1>
          </div>

          {/* GATE 1 - RENAL PHYSICIANS */}
          <GatePanel
            state={panel1State}
            z={POSITIONS.SIGN_1 - 600}
            logo={ASSETS.renalLogo}
            title="Renal Physicians"
            subtitle="Setting the standard for excellence in kidney care in Dayton."
            est="Est. 1972"
            isInvert={false}
          />

          {/* GATE 2 - NAOD */}
          <GatePanel
            state={panel2State}
            z={POSITIONS.SIGN_2 - 1200}
            logo="https://i.ibb.co/WvbphTZT/NAOD-Logo.jpg"
            title="Nephrology Associates of Dayton"
            subtitle="Providing compassionate, patient-centered kidney care close to home."
            est="Since 1980"
            isInvert={true}
          />
        </div>
      </div>

      {/* 3. SCROLL HINT */}
      {isIntro && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
          <p className="text-white/80 text-[10px] tracking-[0.3em] uppercase font-bold drop-shadow-md">
            Scroll to Begin
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

const GatePanel: React.FC<{
  state: GateState;
  z: number;
  logo: string;
  title: string;
  subtitle: string;
  est: string;
  isInvert: boolean;
}> = ({ state, z, logo, title, subtitle, est, isInvert }) => (
  <div
    className="absolute top-1/2 left-1/2 w-[90vw] max-w-[980px] h-[500px]"
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
      }}
    >
      {/* DOORS */}
      <div className="absolute inset-0 flex preserve-3d">
        <div
          className="w-1/2 h-full origin-left border border-white/20 border-r-0 backdrop-blur-2xl rounded-l-[44px]"
          style={{
            transform: `rotateY(${-70 * state.tPass}deg)`,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
            backfaceVisibility: "hidden",
          }}
        />
        <div
          className="w-1/2 h-full origin-right border border-white/20 border-l-0 backdrop-blur-2xl rounded-r-[44px]"
          style={{
            transform: `rotateY(${70 * state.tPass}deg)`,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
            backfaceVisibility: "hidden",
          }}
        />
      </div>

      {/* CONTENT LAYER */}
      <div
        className="relative z-10 flex flex-col items-center p-12 text-center"
        style={{
          opacity: clamp01(1 - state.tPass * 2.5),
          transform: "translateZ(60px)",
        }}
      >
        <span className="text-white/80 text-xs md:text-xl uppercase tracking-[0.4em] font-semibold mb-8">
          {est}
        </span>
        <div
          className={`mb-10 ${
            isInvert ? "bg-white/10 p-6 rounded-3xl border border-white/20" : ""
          }`}
        >
          <img
            src={logo}
            className={`w-full max-w-[550px] object-contain brightness-200 grayscale ${
              isInvert ? "invert" : ""
            }`}
            alt={title}
          />
        </div>
        <p className="text-white/90 text-lg md:text-4xl font-light max-w-2xl leading-tight">
          {subtitle}
        </p>
      </div>
    </div>
  </div>
);

export default JourneyScene;
