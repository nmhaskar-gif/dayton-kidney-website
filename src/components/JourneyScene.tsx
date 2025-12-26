// src/components/JourneyScene.tsx
import React, { useRef, useState, useEffect } from "react";
import { POSITIONS, SCROLL_HEIGHT, ASSETS } from "../constants";
import { Handshake } from "lucide-react";
import V1RevealOverlay from "./V1RevealOverlay";

interface JourneySceneProps {
  scrollY: number;
  onComplete: () => void;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const smoothstep = (x: number) => x * x * (3 - 2 * x);

const JourneyScene: React.FC<JourneySceneProps> = ({ scrollY }) => {
  const worldRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- SMOOTH SCROLL LOGIC ---
  const [smoothScrollY, setSmoothScrollY] = useState(0);
  const targetScrollRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    targetScrollRef.current = scrollY;
  }, [scrollY]);

  useEffect(() => {
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      setSmoothScrollY((prev) => {
        const target = targetScrollRef.current;
        const ease = 0.12;
        const next = prev + (target - prev) * ease;
        if (Math.abs(next - target) < 0.25) return target;
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // --- VARIABLES & CALCULATIONS ---
  const worldZ = smoothScrollY;
  const maxScroll =
    SCROLL_HEIGHT - (typeof window !== "undefined" ? window.innerHeight : 800);
  const scrollProgress = clamp01(worldZ / maxScroll);
  const isIntro = worldZ < 50;

  const getOpacity = (baseZ: number, scroll: number) => {
    const distance = baseZ + scroll;
    if (distance < -2000) return 0;
    if (distance < -500) return (distance + 2000) / 1500;
    if (distance <= 200) return 1;
    if (distance < 1000) return 1 - (distance - 200) / 800;
    return 0;
  };

  const computeCenteredApproach = (panelZ: number) => {
    const dist = panelZ + worldZ;
    const approachStart = -2200;
    const approachEnd = 150;
    const passEnd = 950;

    const tApproach = clamp01(
      (dist - approachStart) / (approachEnd - approachStart)
    );
    const tPass = clamp01((dist - approachEnd) / (passEnd - approachEnd));

    const a = smoothstep(tApproach);
    const p = smoothstep(tPass);

    const minScale = isMobile ? 0.95 : 0.55;
    const nearScale = isMobile ? 1.12 : 1.55;
    const throughScale = isMobile ? 1.35 : 2.35;

    const scaleApproach = minScale + (nearScale - minScale) * a;
    const scale = scaleApproach + (throughScale - nearScale) * p;

    const fadeIn = clamp01(a * 1.15);
    const fadeOut = 1 - p;
    const base = clamp01(getOpacity(panelZ, worldZ));
    const opacity = clamp01((0.7 + 0.3 * base) * fadeIn * fadeOut);

    return {
      dist,
      passEnd,
      scale,
      opacity,
      zIndex: 20 + Math.round(60 * Math.max(tApproach, tPass)),
    };
  };

  const panel1Z = POSITIONS.SIGN_1 - 600;
  const panel2Z = POSITIONS.SIGN_2 - 1200;

  const panel1State = computeCenteredApproach(panel1Z);
  const panel2State = computeCenteredApproach(panel2Z);

  // --- FINAL TIMELINE (POST-PANEL 2) ---
  const postSign2Dist = panel2State.dist - panel2State.passEnd;

  const climaxStart = 300;
  const climaxFadeIn = 600;
  const climaxHold = 1400;
  const climaxFadeOut = 600;

  let climaxTextOpacity = 0;
  if (postSign2Dist > climaxStart) {
    const into = postSign2Dist - climaxStart;
    if (into < climaxFadeIn) climaxTextOpacity = clamp01(into / climaxFadeIn);
    else if (into < climaxFadeIn + climaxHold) climaxTextOpacity = 1;
    else if (into < climaxFadeIn + climaxHold + climaxFadeOut) {
      const out = into - (climaxFadeIn + climaxHold);
      climaxTextOpacity = 1 - clamp01(out / climaxFadeOut);
    }
  }

  const revealStart = climaxStart + climaxFadeIn + climaxHold - 200;
  const revealRamp = 1100;
  const revealLayerOpacity = smoothstep(
    clamp01((postSign2Dist - revealStart) / revealRamp)
  );
  const isRevealActive = revealLayerOpacity > 0.95;

  const fogIntensity = smoothstep(
    clamp01((postSign2Dist - (climaxStart + 200)) / (climaxFadeIn + climaxHold))
  );
  const fogOpacity = clamp01(fogIntensity * (1 - revealLayerOpacity * 1.1));
  const fogDriftY = Math.max(-12, Math.min(12, worldZ * 0.006));
  const fogScale = 1 + Math.max(0, Math.min(0.04, worldZ * 0.000007));
  const fogCenter = 55;

  return (
    <div className="relative w-full h-full bg-[#1c1917] overflow-hidden">
      {/* 1. BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=2500&auto=format&fit=crop"
          alt="Foggy Forest"
          className={`w-full h-full object-cover ${
            isIntro ? "animate-ken-burns" : ""
          }`}
          style={{
            transform: `scale(${1 + worldZ * 0.00005}) translateZ(0)`,
            willChange: "transform",
          }}
        />
        <div className="absolute inset-0 bg-stone-900/20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/80" />
      </div>

      {/* 2. 3D WORLD */}
      <div className="perspective-container w-full h-full absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div
          ref={worldRef}
          className="preserve-3d w-full h-full absolute top-0 left-0"
          style={{
            transform: `translateZ(${worldZ}px) translateZ(0)`,
            willChange: "transform",
          }}
        >
          {/* INTRO WORDS */}
          <div
            className="absolute top-[60%] md:top-1/2 left-1/2 text-center w-full max-w-[90%] md:max-w-3xl lg:max-w-4xl px-6 py-8 md:p-10 bg-black/30 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl"
            style={{
              transform: `translate(-50%, -50%) translate3d(0, -100px, ${
                POSITIONS.START_TEXT + 450
              }px) translateZ(0)`,
              opacity: getOpacity(POSITIONS.START_TEXT, worldZ),
            }}
          >
            <h2 className="text-white text-xs md:text-sm lg:text-lg uppercase tracking-[0.2em] mb-4 font-bold">
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

          {/* GLASS PANEL 1 (RPI) */}
          <div
            className="absolute top-1/2 left-1/2 w-[90vw] max-w-[980px]"
            style={{
              transform: `translate(-50%, -50%) translate3d(0px, ${
                isMobile ? 40 : -10
              }px, ${panel1Z}px) translateZ(0)`,
              opacity: panel1State.opacity,
              zIndex: panel1State.zIndex,
              display: panel1State.opacity <= 0.001 ? "none" : "block",
            }}
          >
            <div
              className="relative rounded-[44px] overflow-hidden text-center"
              style={{
                transform: `scale(${panel1State.scale})`,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))",
                border: "1px solid rgba(255,255,255,0.28)",
                backdropFilter: "blur(22px)",
              }}
            >
              <div className="relative z-10 p-10 md:p-16">
                <div className="flex items-center justify-center mb-8 text-white/85">
                  <span className="text-xs md:text-xl uppercase tracking-[0.4em] font-semibold">
                    Est. 1972
                  </span>
                </div>
                {ASSETS.renalLogo ? (
                  <img
                    src={ASSETS.renalLogo}
                    alt="Renal Physicians"
                    className="w-full max-w-[600px] h-auto mb-10 mx-auto opacity-90 brightness-200 grayscale"
                    style={{
                      filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.3))",
                    }}
                  />
                ) : (
                  <h3 className="text-4xl md:text-8xl font-serif text-white mb-8 tracking-tight">
                    Renal Physicians
                  </h3>
                )}
                <p className="text-white/90 text-lg md:text-4xl font-light">
                  Setting the standard for excellence in kidney care in Dayton.
                </p>
              </div>
            </div>
          </div>

          {/* GLASS PANEL 2 (NAOD) */}
          <div
            className="absolute top-1/2 left-1/2 w-[90vw] max-w-[980px]"
            style={{
              transform: `translate(-50%, -50%) translate3d(0px, ${
                isMobile ? 70 : 30
              }px, ${panel2Z}px) translateZ(0)`,
              opacity: panel2State.opacity,
              zIndex: panel2State.zIndex + 1,
              display: panel2State.opacity <= 0.001 ? "none" : "block",
            }}
          >
            <div
              className="relative rounded-[44px] overflow-hidden text-center"
              style={{
                transform: `scale(${panel2State.scale})`,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.20), rgba(255,255,255,0.07))",
                border: "1px solid rgba(255,255,255,0.28)",
                backdropFilter: "blur(22px)",
              }}
            >
              <div className="relative z-10 p-10 md:p-16">
                <div className="flex items-center justify-center mb-8 text-white/85">
                  <span className="text-xs md:text-xl uppercase tracking-[0.4em] font-semibold">
                    Since 1980
                  </span>
                </div>
                <div
                  className="mb-10 inline-block rounded-3xl p-4 md:p-6 mx-auto"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <img
                    src="https://i.ibb.co/WvbphTZT/NAOD-Logo.jpg"
                    alt="NAOD"
                    className="w-full max-w-[520px] h-auto rounded-2xl opacity-90 brightness-200 grayscale invert"
                    style={{
                      filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.3))",
                    }}
                  />
                </div>
                <p className="text-white/90 text-lg md:text-4xl font-light">
                  Providing compassionate, patient-centered kidney care close to
                  home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOG LAYER */}
      <div
        className="absolute inset-0 z-35 pointer-events-none"
        style={{
          opacity: fogOpacity,
          transform: `translate3d(0, ${fogDriftY}px, 0) scale(${fogScale})`,
          background: `radial-gradient(circle at 50% 55%, 
            transparent 0%,           // Smaller 'hole' makes fog feel closer
            rgba(255,255,255,0.25) 60%, // Thicker white mist
            rgba(255,255,255,0.45) 100%)`,
        }}
      />

      {/* 4. CLIMAX TEXT */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full z-40 pointer-events-none"
        style={{ opacity: climaxTextOpacity }}
      >
        <div className="flex justify-center mb-6 text-amber-400/90">
          <Handshake size={isMobile ? 48 : 64} />
        </div>
        <h1 className="text-3xl md:text-7xl font-serif text-white font-bold drop-shadow-2xl">
          Now, our paths unite.
        </h1>
      </div>

      {/* 5. REVEAL OVERLAY */}
      <div
        className="absolute inset-0 z-50"
        style={{
          opacity: revealLayerOpacity,
          pointerEvents: isRevealActive ? "auto" : "none",
        }}
      >
        <V1RevealOverlay
          setView={() => {}}
          opacity={1}
          isActive={isRevealActive}
          pointerEvents={isRevealActive ? "auto" : "none"}
        />
      </div>
    </div>
  );
};

export default JourneyScene;
