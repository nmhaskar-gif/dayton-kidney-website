// src/components/JourneyScene.tsx
import React, { useEffect, useRef, useState } from "react";
import { POSITIONS } from "../constants";
import { ArrowDown, Handshake } from "lucide-react";
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
  y: number;
};

type Side = "left" | "right";

const JourneyScene: React.FC<{ scrollY: number; onComplete: () => void }> = ({
  scrollY,
  onComplete,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [smoothScrollY, setSmoothScrollY] = useState(0);
  const [handoff, setHandoff] = useState(false);
  const targetScrollRef = useRef(0);
  const introCardRef = useRef<HTMLDivElement | null>(null);
  const [hintTop, setHintTop] = useState(0);
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1000
  );

  useEffect(() => {
    const update = () => {
      const el = introCardRef.current;
      if (!el) return;

      const r = el.getBoundingClientRect();
      const margin = 28;

      const vv = window.visualViewport;
      const viewportH = vv?.height ?? window.innerHeight;

      let top = r.bottom + margin;

      const maxTop = viewportH - (isMobile ? 90 : 110);
      top = Math.min(top, maxTop);
      top = Math.max(top, 10);

      setHintTop(top);
    };

    update();

    window.addEventListener("resize", update);

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", update);
      vv.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);
      if (vv) {
        vv.removeEventListener("resize", update);
        vv.removeEventListener("scroll", update);
      }
    };
  }, [isMobile]);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024);
      setVw(window.innerWidth);
    };
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
  }, []);

  const introT = clamp01(smoothScrollY / 80);
  const easedIntroT = smoothstep(introT);

  // Freeze only at handoff
  const frozenWorldZRef = useRef(0);
  if (!handoff) frozenWorldZRef.current = smoothScrollY;
  const worldZ = handoff ? frozenWorldZRef.current : smoothScrollY;

  // ---------------- motion ----------------
  const computePanelState = (
    panelZ: number,
    side: Side,
    opts?: {
      // PIVOT + SLIDE
      turnApproachGate?: number;
      passTurnDelay?: number;
      turnEasePower?: 1 | 2 | 3;
      maxYaw?: number;
      maxX?: number;

      // POSITIONING
      baseX?: number;
      baseY?: number;
      maxY?: number;

      // SCALE
      scaleBoost?: number;

      // SPEED
      approachStart?: number;
      approachEnd?: number;
      passEnd?: number;
    }
  ): PanelState => {
    const dist = panelZ + worldZ;
    const dir = side === "left" ? -1 : 1;

    const approachStart = opts?.approachStart ?? -2200;
    const approachEnd = opts?.approachEnd ?? 420;
    const passEnd = opts?.passEnd ?? 2500;

    const tApproach = clamp01(
      (dist - approachStart) / (approachEnd - approachStart)
    );
    const tPassLinear = clamp01((dist - approachEnd) / (passEnd - approachEnd));

    const a = smoothstep(tApproach);
    const p = tPassLinear;

    let scale = isMobile ? 1.05 + a * 0.24 : 0.68 + a * 0.36 + p * 0.14;
    scale *= opts?.scaleBoost ?? 1;

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

    const baseX = opts?.baseX ?? 0;
    const baseY = opts?.baseY ?? 0;
    const maxY = opts?.maxY ?? 0;

    return {
      dist,
      tPass: p,
      scale,
      opacity,
      zIndex: 20 + Math.round(dist / 12),
      rotateY: -dir * maxYaw * u,
      x: baseX + dir * maxX * u,
      y: baseY + maxY * u,
    };
  };

  // ---------------- placements ----------------
  const introZ = POSITIONS.START_TEXT + 150;
  const duoZ = POSITIONS.SIGN_1 - 240;
  const uniteZ = POSITIONS.SIGN_2 - 1550;

  // ---------------- reveal logic ----------------
  const revealStart = -420;
  const revealSpan = 1350;
  const post = uniteZ + worldZ;
  const revealOpacity = smoothstep(clamp01((post - revealStart) / revealSpan));

  const overlayOpacityRaw = smoothstep(clamp01((revealOpacity - 0.8) / 0.2));
  const overlayOpacityLocked = handoff ? 1 : overlayOpacityRaw;

  const overlayActive = overlayOpacityLocked > 0.01;
  const overlayInteractiveLocked = handoff ? true : overlayOpacityLocked > 0.95;

  const sceneFade = smoothstep(clamp01((revealOpacity - 0.3) / 0.32));
  const sceneOpacity = 1 - sceneFade;

  // completion
  const completedRef = useRef(false);
  useEffect(() => {
    if (completedRef.current) return;
    if (handoff) return;

    if (overlayOpacityRaw >= 0.9) {
      completedRef.current = true;
      setHandoff(true);
      setTimeout(() => onComplete(), 50);
    }
  }, [overlayOpacityRaw, handoff, onComplete]);

  // ---------------- intro ----------------
  const introBase = computePanelState(introZ, "right", {
    turnApproachGate: 0.85,
    turnEasePower: 1,
    maxYaw: isMobile ? 45 : 60,
    maxX: isMobile ? 220 : 450,
  });

  const introFade = 1 - smoothstep(clamp01((smoothScrollY - 35) / 95));
  const intro: PanelState = {
    ...introBase,
    opacity: introBase.opacity * introFade * sceneOpacity,
  };

  // ---------------- RPI / NAOD ----------------
  const duoTopClass = "top-[30svh] md:top-[22svh]";

  const duoScaleBoost = Math.max(0.95, Math.min(1.12, vw / 980));

  // --- FIX 1: CALCULATE EXACT CARD WIDTH TO PREVENT COLLISION ---
  // On mobile: 42vw per card leaves 16% total gap (safe from collision)
  // On desktop: fixed 400px or capped percentage
  const duoCardW = isMobile ? vw * 0.6 : Math.min(400, vw * 0.35);

  // --- FIX 2: ADJUST SEPARATION BASED ON EXACT WIDTH ---
  const duoGap = isMobile ? Math.max(28, vw * 0.06) : Math.max(4, vw * 0.02);
  const duoSeparation = (duoCardW / 2 + duoGap) * duoScaleBoost;

  const duoCommon = {
    approachStart: -3000,
    approachEnd: 280,
    passEnd: 1450,
    turnApproachGate: 0.82,
    passTurnDelay: 0.02,
    turnEasePower: 1 as const,
    maxYaw: isMobile ? 62 : 82,
    maxX: isMobile ? 640 : 1120,
    baseY: isMobile ? -100 : -128,
    scaleBoost: duoScaleBoost,
  };

  const rpiBase = computePanelState(duoZ, "left", {
    ...duoCommon,
    baseX: -duoSeparation,
  });

  const naodBase = computePanelState(duoZ, "right", {
    ...duoCommon,
    baseX: duoSeparation,
  });

  const rpi: PanelState = {
    ...rpiBase,
    opacity: rpiBase.opacity * sceneOpacity,
  };
  const naod: PanelState = {
    ...naodBase,
    opacity: naodBase.opacity * sceneOpacity,
  };

  // ---------------- unite cue timing ----------------
  const duoDist = duoZ + worldZ;
  const uniteIn = smoothstep(clamp01((duoDist - 60) / 300));
  const uniteOut = smoothstep(clamp01((revealOpacity - 0.25) / 0.22));
  const uniteOpacity = uniteIn * (1 - uniteOut);

  // Background zoom
  const bgScale = Math.min(1.38, 1.08 + smoothScrollY * 0.00006 * easedIntroT);

  return (
    <div className="relative w-full h-full bg-[#1c1917] overflow-hidden overscroll-none">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0" style={{ opacity: sceneOpacity }}>
        <img
          src="/images/merged-roads2.png"
          alt="Two roads converging"
          className="w-full h-full object-cover"
          style={{
            willChange: "transform, opacity",
            objectPosition: "50% 14%",
            transformOrigin: "50% 14%",
            transform: `translateX(-4%) scale(${bgScale})`,
          }}
        />
        <div
          className={`absolute inset-0 bg-stone-900/20 ${
            isMobile ? "" : "mix-blend-overlay"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-900/80" />
      </div>

      {/* WORLD (3D panels) */}
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
            forwardRef={introCardRef}
            state={intro}
            z={introZ}
            topClassName="top-[38svh] md:top-[28svh]"
            eyebrow="Welcome to Dayton Kidney"
            title="Your Kidney Health Is A Journey."
            body={"We’ve Been With You\n For Over 50 Years."}
            variant="intro"
          />

          {/* Pass fixedWidth to ensure equality and prevent collision */}
          <GlassPanel
            state={rpi}
            z={duoZ}
            topClassName={duoTopClass}
            eyebrow="Est. 1972"
            logoSrc="/images/RPI-Logo.png"
            title=""
            body="Setting the standard for excellence in kidney care in Dayton."
            variant="default"
            fixedWidth={duoCardW}
          />

          <GlassPanel
            state={naod}
            z={duoZ}
            topClassName={duoTopClass}
            eyebrow="Since 1980"
            logoSrc="/images/NAOD-Logo.jpg"
            title=""
            body="Providing compassionate, patient-centered kidney care close to home."
            variant="default"
            fixedWidth={duoCardW}
          />
        </div>
      </div>

      {/* UNITE CARD (2D overlay) */}
      <div
        className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
        style={{ opacity: uniteOpacity * sceneOpacity }}
      >
        <div
          className="relative w-fit max-w-[92vw] md:max-w-[920px]"
          style={{
            transform: `translateY(${(1 - uniteIn) * 10 - 18}px)`,
            willChange: "transform, opacity",
          }}
        >
          <div
            className="absolute inset-0 rounded-[38px] border border-white/45 backdrop-blur-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.26), rgba(255,255,255,0.12))",
              boxShadow:
                "0 18px 60px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.22)",
            }}
          />

          <div className="relative z-10 px-10 pt-9 pb-12 md:px-20 md:pt-14 md:pb-16 text-center">
            <div className="flex items-center justify-center mb-3">
              <Handshake
                className="text-white"
                size={isMobile ? 46 : 64}
                style={{
                  filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.35))",
                }}
              />
            </div>
            <div className="relative">
              {/* halo */}
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(circle at 50% 55%, rgba(255,255,255,0.40), rgba(255,255,255,0) 65%)",
                  filter: "blur(18px)",
                  transform: "scale(1.2)",
                }}
              />

              {/* text */}
              <div
                className={[
                  "font-serif font-semibold",
                  "text-transparent bg-clip-text",
                  "bg-gradient-to-r from-[#0B2A5B] via-[#0B4C6B] to-[#0B6B3A]",
                  "text-3xl md:text-7xl leading-[1.2]",
                  "pb-[0.18em]",
                ].join(" ")}
                style={{
                  textShadow:
                    "0 2px 12px rgba(0,0,0,0.35), 0 10px 30px rgba(0,0,0,0.25)",
                  transform: "translateY(0.04em)",
                }}
              >
                Now our paths unite for your future.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL HINT */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-[70] text-center pointer-events-none transition-all duration-700 ease-out"
        style={
          smoothScrollY < 40
            ? { top: hintTop, opacity: 0.92 }
            : { bottom: isMobile ? "120px" : "140px", opacity: 0.92 }
        }
      >
        <p className="text-white/90 text-[14px] sm:text-[15px] tracking-[0.30em] uppercase font-bold animate-pulse">
          Scroll to Continue the Journey with Us
        </p>
      </div>

      {/* OVERLAY */}
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
  forwardRef?: React.Ref<HTMLDivElement>;
  fixedWidth?: number; // New prop for strict sizing
}> = ({
  state,
  z,
  topClassName,
  eyebrow,
  title,
  body,
  logoSrc,
  variant,
  forwardRef,
  fixedWidth,
}) => {
  const isIntro = variant === "intro";

  const glassBg = isIntro
    ? "linear-gradient(135deg, rgba(28,25,23,0.80), rgba(28,25,23,0.60))"
    : "linear-gradient(135deg, rgba(28,25,23,0.70), rgba(28,25,23,0.50))";

  const blurClass = isIntro ? "backdrop-blur-3xl" : "backdrop-blur-md";

  // If fixedWidth is provided, use it. Otherwise default to w-fit
  const widthStyle = fixedWidth ? { width: `${fixedWidth}px` } : {};

  const containerClass = fixedWidth
    ? "relative"
    : "relative w-fit max-w-[90vw] md:max-w-[860px]";

  return (
    <div
      className={`absolute ${
        topClassName ?? "top-[50svh]"
      } left-0 right-0 flex justify-center items-center pointer-events-none`}
      style={{
        transform: `translate3d(${state.x}px, ${state.y}px, ${z}px) rotateY(${state.rotateY}deg) scale(${state.scale})`,
        opacity: state.opacity,
        zIndex: state.zIndex,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      <div className={containerClass} style={widthStyle}>
        <div
          className={`absolute inset-0 rounded-[36px] border border-white/20 ${blurClass}`}
          style={{ background: glassBg }}
        />
        <div
          ref={forwardRef}
          // Added min-h and flex-col to ensure visual equality between cards
          className="relative z-10 px-3 py-6 md:px-16 md:py-14 text-center min-h-[320px] md:min-h-[400px] flex flex-col justify-start items-center"
        >
          {eyebrow && (
            <div className="text-white/70 text-[12px] md:text-sm uppercase tracking-[0.4em] font-bold mb-8">
              {eyebrow}
            </div>
          )}

          {logoSrc && (
            <div className="mb-6 md:mb-8 bg-white/10 border border-white/10 rounded-[28px] px-6 py-4 md:px-8 md:py-6 inline-block">
              <img
                src={logoSrc}
                className="h-12 md:h-28 object-contain"
                alt="logo"
              />
            </div>
          )}

          {isIntro ? (
            <>
              <div className="text-white font-serif text-2xl md:text-5xl leading-tight font-medium">
                {title}
              </div>
              <div className="text-white/90 font-serif text-2xl md:text-5xl leading-[1.35] mt-10 font-medium whitespace-pre-line">
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
              <p className="text-white/80 text-sm md:text-xl font-serif max-w-[32ch] mx-auto leading-relaxed">
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
