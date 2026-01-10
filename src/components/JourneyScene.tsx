import React, { useEffect, useRef, useState } from "react";
import { POSITIONS } from "../constants";
import { ArrowDown } from "lucide-react";
import V1RevealOverlay from "./V1RevealOverlay";

// ---------------- helpers ----------------
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const smoothstep = (x: number) => x * x * (3 - 2 * x);

// ---------------- types ----------------
type PanelState = {
  dist: number;
  tPass: number;
  scale: number;
  opacity: number;
  zIndex: number;
  rotateY: number;
  x: number;
};

type Side = "left" | "right";

const JourneyScene: React.FC<{ scrollY: number; onComplete: () => void }> = ({
  scrollY,
  onComplete,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [smoothScrollY, setSmoothScrollY] = useState(0);
  const [handoff, setHandoff] = useState(false); // Freezes physics
  const targetScrollRef = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    targetScrollRef.current = scrollY;
  }, [scrollY]);

  // SCROLL PHYSICS LOOP
  useEffect(() => {
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      setSmoothScrollY((prev) => {
        const t = targetScrollRef.current;
        const n = prev + (t - prev) * 0.08;
        return Math.abs(n - t) < 0.25 ? t : n;
      });
      requestAnimationFrame(tick);
    };
    tick();
    return () => {
      mounted = false;
    };
  }, [handoff]);

  const introT = Math.max(0, Math.min(1, smoothScrollY / 80));
  const easedIntroT = introT * introT * (3 - 2 * introT);
  const frozenWorldZRef = useRef(0);
  if (!handoff) frozenWorldZRef.current = smoothScrollY;
  const worldZ = handoff ? frozenWorldZRef.current : smoothScrollY;

  const isIntro = worldZ < 120;

  // ---------------- motion ----------------
  const computePanelState = (
    panelZ: number,
    side: Side,
    opts?: {
      turnApproachGate?: number;
      passTurnDelay?: number;
      turnEasePower?: 1 | 2 | 3;
      maxYaw?: number;
      maxX?: number;
    }
  ): PanelState => {
    const dist = panelZ + worldZ;
    const dir = side === "left" ? -1 : 1;
    const approachStart = -2200;
    const approachEnd = 420;
    const passEnd = 2500;

    const tApproach = clamp01(
      (dist - approachStart) / (approachEnd - approachStart)
    );
    const tPassLinear = clamp01((dist - approachEnd) / (passEnd - approachEnd));

    const a = smoothstep(tApproach);
    const p = tPassLinear;

    const scale = isMobile ? 0.95 + a * 0.22 : 0.68 + a * 0.36 + p * 0.14;
    const opacity = clamp01(a * (1 - p * p));

    const gate = clamp01(opts?.turnApproachGate ?? 0.72);
    const aTurn = clamp01((a - gate) / (1 - gate));
    const delay = clamp01(opts?.passTurnDelay ?? 0.0);
    const pTurn = clamp01((p - delay) / (1 - delay));

    let u = clamp01(1 - (1 - aTurn) * (1 - pTurn));

    const power = opts?.turnEasePower ?? 2;
    u = smoothstep(u);
    if (power >= 2) u = smoothstep(u);
    if (power >= 3) u = smoothstep(u);

    const maxYaw = opts?.maxYaw ?? (isMobile ? 62 : 80);
    const maxX = opts?.maxX ?? (isMobile ? 300 : 560);

    return {
      dist,
      tPass: p,
      scale,
      opacity,
      zIndex: 20 + Math.round(dist / 12),
      rotateY: -dir * maxYaw * u,
      x: dir * maxX * u,
    };
  };

  const introZ = POSITIONS.START_TEXT + 150;
  const rpiZ = POSITIONS.SIGN_1 - 600;
  const naodZ = POSITIONS.SIGN_2 - 1200;

  const intro = computePanelState(introZ, "right", {
    turnApproachGate: 0.85,
    turnEasePower: 1,
    maxYaw: isMobile ? 45 : 60,
    maxX: isMobile ? 220 : 450,
  });

  const rpi = computePanelState(rpiZ, "left", {
    turnApproachGate: 0.72,
    turnEasePower: 1,
  });
  const naod = computePanelState(naodZ, "right", {
    turnApproachGate: 0.64,
    turnEasePower: 1,
  });

  // --- REVEAL LOGIC ---
  const revealStart = -350;
  const revealSpan = 2500;
  const post = naodZ + worldZ;
  const revealOpacity = smoothstep(clamp01((post - revealStart) / revealSpan));

  // 1. Compute raw opacity
  const overlayOpacityRaw = smoothstep(clamp01((revealOpacity - 0.88) / 0.12));

  // 2. Lock opacity to 1 if handoff has started
  const overlayOpacityLocked = handoff ? 1 : overlayOpacityRaw;
  const overlayActive = overlayOpacityLocked > 0.01;
  const overlayInteractiveLocked = handoff ? true : overlayOpacityLocked > 0.95;

  const cloudOpacity = smoothstep(clamp01(revealOpacity / 0.35));
  const textOpacity = smoothstep(clamp01((revealOpacity - 0.1) / 0.25));

  // --- COMPLETION HANDLER ---
  const completedRef = useRef(false);
  useEffect(() => {
    if (completedRef.current) return;
    if (handoff) return;

    // FIX 1: Lower threshold to 0.94 guarantees this fires before scroll ends
    if (overlayOpacityRaw >= 0.94) {
      completedRef.current = true;
      setHandoff(true); // LOCKS SCENE

      // Wait 50ms for lock to settle (showing white screen), then swap
      setTimeout(() => {
        onComplete();
      }, 50);
    }
  }, [overlayOpacityRaw, handoff, onComplete]);

  return (
    <div className="relative w-full h-full bg-[#1c1917] overflow-hidden">
      <style>{`
        @keyframes dkCloudDrift1 { 0% { transform: translateX(-6%) } 100% { transform: translateX(6%) } }
        @keyframes dkCloudDrift2 { 0% { transform: translateX(8%) } 100% { transform: translateX(-8%) } }
      `}</style>

      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=2500&auto=format&fit=crop"
          alt="Foggy Forest Road"
          className="w-full h-full object-cover"
          style={{
            willChange: "transform",
            transform: `scale(${Math.min(
              1.3,
              1.08 + smoothScrollY * 0.00004 * easedIntroT
            )}) translateZ(0)`,
          }}
        />

        <div
          className={`absolute inset-0 bg-stone-900/20 ${
            isMobile ? "" : "mix-blend-overlay"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-900/80" />
      </div>

      {/* WORLD */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ perspective: "1400px" }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `translateZ(${worldZ}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          <GlassPanel
            state={intro}
            z={introZ}
            topClassName="top-[38%] md:top-[28%]"
            eyebrow="Welcome to Dayton Kidney"
            title="Your kidney health is a journey."
            body="We’ve been with you for over 50 years."
            variant="intro"
          />
          <GlassPanel
            state={rpi}
            z={rpiZ}
            topClassName="top-[36%] md:top-[26%]"
            eyebrow="Est. 1972"
            logoSrc="/images/RPI-Logo.png"
            title=""
            body="Setting the standard for excellence in kidney care in Dayton."
            variant="default"
          />
          <GlassPanel
            state={naod}
            z={naodZ}
            topClassName="top-[36%] md:top-[26%]"
            eyebrow="Since 1980"
            logoSrc="/images/NAOD-Logo.jpg"
            title=""
            body="Providing compassionate, patient-centered kidney care close to home."
            variant="default"
          />
        </div>
      </div>
      {/* SCROLL HINT */}
      {isIntro && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-40 text-center pointer-events-none"
          style={{
            top: "clamp(68%, 60% + 180px, 78%)",
          }}
        >
          <p className="text-white/90 text-[12px] sm:text-[13px] tracking-[0.32em] uppercase font-bold mb-2">
            Scroll to Continue the Journey with Us
          </p>
          <ArrowDown
            className="mx-auto animate-bounce text-white/90"
            size={20}
          />
        </div>
      )}

      {/* REVEAL VISUALS (TEXT) */}
      <div
        className="absolute inset-0 z-50"
        style={{ opacity: revealOpacity, pointerEvents: "none" }}
      >
        <div className="absolute inset-0" style={{ opacity: cloudOpacity }}>
          <div
            className="absolute -inset-[20%]"
            style={{
              background:
                "radial-gradient(circle at 30% 35%, rgba(255,255,255,1), rgba(255,255,255,0) 70%)",
              filter: "blur(30px)",
              animation: "dkCloudDrift1 9s ease-in-out infinite alternate",
            }}
          />
          <div
            className="absolute -inset-[20%]"
            style={{
              background:
                "radial-gradient(circle at 70% 45%, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)",
              filter: "blur(40px)",
              animation: "dkCloudDrift2 11s ease-in-out infinite alternate",
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="text-center px-6"
            style={{
              opacity: textOpacity,
              transform: `translateY(${(1 - textOpacity) * 15}px)`,
            }}
          >
            <div
              className="text-white font-serif text-4xl md:text-7xl font-bold leading-tight"
              style={{
                textShadow:
                  "0 10px 40px rgba(0,0,0,0.85), 0 2px 10px rgba(0,0,0,0.6)",
              }}
            >
              Now our paths unite <br className="hidden md:block" /> for your
              future.
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY */}
      {/* FIX 2: bg-white added here. This guarantees the overlay is opaque regardless of V1RevealOverlay internals */}
      <div
        className="absolute inset-0 z-[60] bg-white"
        style={{
          opacity: overlayOpacityLocked,
          pointerEvents: overlayInteractiveLocked ? "auto" : "none",
        }}
      >
        <V1RevealOverlay
          opacity={overlayOpacityLocked}
          isActive={overlayActive}
          pointerEvents={overlayInteractiveLocked ? "auto" : "none"}
          setView={() => {}}
        />
      </div>
    </div>
  );
};

const GlassPanel: React.FC<{
  state: PanelState;
  z: number;
  topClassName?: string;
  eyebrow?: string;
  title: string;
  body: string;
  logoSrc?: string;
  variant?: "intro" | "default";
}> = ({ state, z, topClassName, eyebrow, title, body, logoSrc, variant }) => {
  const isIntro = variant === "intro";
  return (
    <div
      className={`absolute ${
        topClassName ?? "top-1/2"
      } left-0 right-0 flex justify-center items-center pointer-events-none`}
      style={{
        transform: `translate3d(${state.x}px, 0, ${z}px) rotateY(${state.rotateY}deg) scale(${state.scale})`,
        opacity: state.opacity,
        zIndex: state.zIndex,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      <div className="relative w-fit max-w-[90vw] md:max-w-[800px]">
        <div
          className={`absolute inset-0 rounded-[36px] border border-white/20 ${
            isIntro ? "backdrop-blur-3xl" : "backdrop-blur-md"
          }`}
          style={{
            background: isIntro
              ? "linear-gradient(135deg, rgba(28,25,23,0.80), rgba(28,25,23,0.60))"
              : "linear-gradient(135deg, rgba(28,25,23,0.70), rgba(28,25,23,0.50))",
          }}
        />
        <div className="relative z-10 px-8 py-10 md:px-16 md:py-14 text-center">
          {eyebrow && (
            <div className="text-white/70 text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-4">
              {eyebrow}
            </div>
          )}
          {logoSrc && (
            <div className="mb-8 bg-white/10 border border-white/10 rounded-[28px] px-8 py-6 inline-block">
              <img
                src={logoSrc}
                className="h-16 md:h-28 object-contain"
                alt="logo"
              />
            </div>
          )}
          {isIntro ? (
            <>
              <div className="text-white font-serif text-2xl md:text-5xl leading-tight font-medium">
                {title}
              </div>
              <div className="text-white/90 font-serif text-2xl md:text-5xl leading-tight mt-5 font-medium">
                {body}
              </div>
            </>
          ) : (
            <>
              {title && (
                <h2 className="text-white text-3xl md:text-6xl font-serif font-bold leading-tight mb-4">
                  {title}
                </h2>
              )}
              <p className="text-white/80 text-base md:text-xl font-serif max-w-[32ch] mx-auto leading-relaxed">
                {body}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JourneyScene;
