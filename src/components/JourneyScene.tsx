// src/components/JourneyScene.tsx
import React, { useRef, useState, useEffect } from "react";
import { POSITIONS, SCROLL_HEIGHT, ASSETS } from "../constants";
import { MoveRight, MapPin, Handshake } from "lucide-react";
import V1RevealOverlay from "./V1RevealOverlay";
import { ViewState } from "../types";

interface JourneySceneProps {
  scrollY: number;
  onComplete: () => void;
}

const JourneyScene: React.FC<JourneySceneProps> = ({ scrollY }) => {
  const worldRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // --- SCREEN CHECK ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- SMOOTH SCROLL (reduces jarring / stutter) ---
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
        const ease = 0.12; // adjust: 0.08 smoother / 0.18 snappier
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

  // --- 1. SETUP & CALCULATIONS ---
  const currentZ = smoothScrollY;
  const maxScroll =
    SCROLL_HEIGHT - (typeof window !== "undefined" ? window.innerHeight : 800);
  const scrollProgress = Math.min(Math.max(currentZ / maxScroll, 0), 1);

  // --- FOG PARALLAX (subtle, scroll-tied) ---
  const fogDriftY = Math.max(-12, Math.min(12, currentZ * 0.006)); // clamp to ±12px
  const fogScale = 1 + Math.max(0, Math.min(0.015, currentZ * 0.000003)); // up to +1.5%

  // --- 2. OPACITY LOGIC ---
  const getOpacity = (baseZ: number, scroll: number) => {
    const distance = baseZ + scroll;
    if (distance < -2000) return 0;
    if (distance < -500) return (distance + 2000) / 1500;
    if (distance <= 200) return 1;
    if (distance < 1000) return 1 - (distance - 200) / 800;
    return 0;
  };

  // --- 3. REVEAL LOGIC ---
  const revealStart = 0.9;
  const revealEnd = 1.0;
  let revealLayerOpacity = 0;

  if (scrollProgress > revealStart) {
    const t = (scrollProgress - revealStart) / (revealEnd - revealStart);
    revealLayerOpacity = t * t * (3 - 2 * t);
  }
  revealLayerOpacity = Math.max(0, Math.min(1, revealLayerOpacity));

  const isRevealActive = revealLayerOpacity > 0.95;
  const isIntro = currentZ < 50;

  // --- FREEZE WORLD ON REVEAL (reduces heavy concurrent updates during crossfade) ---
  const freezeWorld = revealLayerOpacity > 0.2;
  const frozenZRef = useRef(0);
  if (!freezeWorld) frozenZRef.current = currentZ;
  const worldZ = freezeWorld ? frozenZRef.current : currentZ;

  // --- OPENING TEXT ---
  const START_TEXT_BOOST = 450;

  // --- 4. CLIMAX TEXT TIMING ---
  let climaxTextOpacity = 0;
  if (currentZ > 5200 && currentZ < 7100) {
    if (currentZ < 5600) {
      climaxTextOpacity = (currentZ - 5200) / 400;
    } else if (currentZ < 6700) {
      climaxTextOpacity = 1;
    } else {
      climaxTextOpacity = 1 - (currentZ - 6700) / 400;
    }
  }

  // --- Fog center step (reduces repaint churn) ---
  const fogCenter = 55; // locked center (fastest)
  // If you want gentle stepped drift instead, use this line instead:
  // const fogCenter = 50 + Math.round((currentZ * 0.015) / 2) * 2;

  return (
    <div className="relative w-full h-full bg-[#1c1917] overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=2500&auto=format&fit=crop"
          alt="Foggy Forest Road"
          className={`w-full h-full object-cover ${
            isIntro ? "animate-ken-burns" : ""
          }`}
          style={{
            willChange: "transform",
            transform: isIntro
              ? "translateZ(0)"
              : `scale(${1 + currentZ * 0.00005}) translateZ(0)`,
          }}
        />
        {/* Blend modes are expensive; disable on mobile */}
        <div
          className={`absolute inset-0 bg-stone-900/20 ${
            isMobile ? "" : "mix-blend-overlay"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-900/80" />
      </div>

      {/* 3D World Container */}
      <div className="perspective-container w-full h-full absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div
          ref={worldRef}
          className="preserve-3d w-full h-full absolute top-0 left-0"
          style={{
            transform: `translateZ(${worldZ}px) translateZ(0)`,
            willChange: "transform",
          }}
        >
          {/* ----- 1. OPENING TEXT ----- */}
          <div
            className={`absolute top-[60%] md:top-1/2 left-1/2 text-center w-full max-w-[90%] md:max-w-3xl lg:max-w-4xl px-6 py-8 md:p-10 bg-black/30 ${
              isMobile ? "" : "backdrop-blur-sm"
            } rounded-3xl border border-white/10 shadow-2xl`}
            style={{
              transform: `translate(-50%, -50%) translate3d(0, -100px, ${
                POSITIONS.START_TEXT + START_TEXT_BOOST
              }px) translateZ(0)`,
              opacity: getOpacity(POSITIONS.START_TEXT, worldZ),
              willChange: "transform, opacity",
            }}
          >
            <h2 className="text-white text-xs md:text-sm lg:text-lg uppercase tracking-[0.2em] mb-4 font-bold drop-shadow-md">
              Welcome to Dayton Kidney
            </h2>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-white font-bold leading-tight drop-shadow-lg">
              Your kidney health is a journey.
              <br />
              <span className="text-white">
                We&apos;ve been with you for over{" "}
                <br className="hidden lg:block" /> 50 years.
              </span>
            </h1>

            <div className="mt-8 lg:mt-12 inline-block">
              <div className="text-white font-bold text-xs md:text-xs lg:text-sm tracking-[0.2em] animate-pulse bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-4 md:px-6 md:py-3 rounded-full border border-white/30 shadow-lg transition-all">
                SCROLL TO CONTINUE THE PATH
              </div>
            </div>
          </div>

          {/* ----- 2. SIGNPOST 1 (RPI) ----- */}
          <div
            className="absolute top-1/2 left-1/2 w-80 md:w-96"
            style={{
              transform: `translate(-50%, -50%) translate3d(${
                isMobile ? 0 : -1100
              }px, ${isMobile ? 100 : 150}px, ${
                POSITIONS.SIGN_1
              }px) rotateY(15deg) translateZ(0)`,
              opacity: getOpacity(POSITIONS.SIGN_1, worldZ),
              willChange: "transform, opacity",
            }}
          >
            <div className="absolute left-1/2 top-0 w-3 h-[500px] bg-[#271c19] -translate-x-1/2 shadow-2xl" />
            <div className="relative bg-[#2e2622] border-[3px] border-[#4a3b32] p-6 shadow-2xl rounded-sm transform -translate-y-[200px] overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-40 pointer-events-none mix-blend-soft-light" />
              <div className="relative border border-white/10 p-5">
                <div className="flex items-center gap-3 mb-3 text-amber-500/90">
                  <MapPin size={20} />
                  <span className="text-xs uppercase tracking-widest font-semibold">
                    By your side since 1972
                  </span>
                </div>
                {ASSETS.renalLogo ? (
                  <img
                    src={ASSETS.renalLogo}
                    alt="Renal Physicians"
                    className="w-full h-auto mb-4 opacity-90 mix-blend-screen"
                    style={{ transform: "translateZ(0)" }}
                  />
                ) : (
                  <h3 className="text-3xl font-serif text-amber-50 mb-3 drop-shadow-md">
                    Renal Physicians
                  </h3>
                )}
                <p className="text-amber-100/70 text-sm leading-relaxed font-light">
                  Setting the standard for excellent nephrology care in Dayton
                  for five decades.
                </p>
              </div>
            </div>
          </div>

          {/* ----- 3. SIGNPOST 2 (NAOD) ----- */}
          <div
            className="absolute top-1/2 left-1/2 w-80 md:w-96"
            style={{
              transform: `translate(-50%, -50%) translate3d(${
                isMobile ? 0 : 900
              }px, ${isMobile ? 100 : 150}px, ${
                POSITIONS.SIGN_2
              }px) rotateY(-15deg) translateZ(0)`,
              opacity: getOpacity(POSITIONS.SIGN_2, worldZ),
              willChange: "transform, opacity",
            }}
          >
            <div className="absolute left-1/2 top-0 w-3 h-[500px] bg-[#271c19] -translate-x-1/2 shadow-2xl" />
            <div className="relative bg-[#2e2622] border-[3px] border-[#4a3b32] p-6 shadow-2xl rounded-sm transform -translate-y-[200px] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-40 pointer-events-none mix-blend-soft-light" />
              <div className="relative border border-white/10 p-5 text-right">
                <div className="flex items-center justify-end gap-3 mb-3 text-amber-500/90">
                  <span className="text-xs uppercase tracking-widest font-semibold">
                    Serving since 1980
                  </span>
                  <MoveRight size={20} />
                </div>
                <div className="bg-amber-50/95 p-3 rounded shadow-md mb-4 border border-amber-100/20">
                  <img
                    src="https://i.ibb.co/WvbphTZT/NAOD-Logo.jpg"
                    alt="Nephrology Associates of Dayton"
                    className="w-full h-auto opacity-95 rounded-sm"
                    style={{ transform: "translateZ(0)" }}
                  />
                </div>
                <p className="text-amber-100/70 text-sm leading-relaxed font-light">
                  Providing compassionate, patient-centered kidney care close to
                  home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----- 4. CLIMAX TEXT (FOREGROUND) ----- */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-4xl px-4 z-40 pointer-events-none transition-opacity duration-300"
        style={{ opacity: climaxTextOpacity, willChange: "opacity" }}
      >
        <div className="flex justify-center mb-4 md:mb-6 text-amber-400/90 drop-shadow-lg">
          <Handshake size={isMobile ? 48 : 64} />
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif text-white font-bold leading-tight drop-shadow-2xl mb-2 md:mb-4">
          Now, our paths unite.
        </h1>
        <h2 className="text-white/90 text-sm md:text-xl lg:text-3xl uppercase tracking-[0.2em] font-light drop-shadow-md">
          FOR YOUR FUTURE.
        </h2>
      </div>

      {/* ----- FOREGROUND FOG ----- */}
      <div
        className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-300 ease-out"
        style={{
          willChange: "transform, opacity",
          transform: `translate3d(0, ${fogDriftY}px, 0) scale(${fogScale}) translateZ(0)`,
          background: `radial-gradient(circle at 50% ${fogCenter}%, transparent 25%, rgba(255, 255, 255, ${Math.min(
            1.0,
            Math.max(0, (currentZ - 5200) * 0.0006)
          )}) 100%)`,
          opacity: Math.max(0, 1 - revealLayerOpacity * 1.5),
        }}
      />

      {/* --- REVEAL OVERLAY --- */}
      <div
        className="absolute inset-0 z-50"
        style={{
          opacity: revealLayerOpacity,
          pointerEvents: isRevealActive ? "auto" : "none",
          willChange: "opacity",
          transform: "translateZ(0)",
        }}
      >
        <V1RevealOverlay
          setView={() => {}}
          opacity={1}
          pointerEvents={isRevealActive ? "auto" : "none"}
          isActive={isRevealActive}
        />
      </div>
    </div>
  );
};

export default JourneyScene;
