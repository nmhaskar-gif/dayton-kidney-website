// src/App.tsx
import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import JourneyScene from "./components/JourneyScene";
import { SCROLL_HEIGHT } from "./constants";
import V1RevealOverlay from "./components/V1RevealOverlay";
import { FastForward } from "lucide-react";

type Phase = "JOURNEY" | "FADING" | "REVEAL";

const FADE_MS = 350;

const App: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [phase, setPhase] = useState<Phase>("JOURNEY");
  const [hasStartedScrolling, setHasStartedScrolling] = useState(false);

  // RAF-gated scroll tracking (prevents render storms)
  const scrollRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const transitioningRef = useRef(false);

  // ---- SINGLE TRANSITION FUNCTION (no duplicates / no undefined) ----
  const enterReveal = () => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;

    localStorage.setItem("dk_story_seen", "true");

    // Start crossfade
    setPhase("FADING");

    // Finish transition after fade
    window.setTimeout(() => {
      setPhase("REVEAL");

      // Reset scroll AFTER reveal is visible (reduces iOS hitch)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => window.scrollTo(0, 0));
      });

      transitioningRef.current = false;
    }, FADE_MS);
  };

  // ---- FORCE TOP & MEMORY CHECK ----
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const hasSeenStory = localStorage.getItem("dk_story_seen");
    if (hasSeenStory === "true") {
      // If they've seen it, go straight to REVEAL (no fade needed)
      setPhase("REVEAL");
    }
  }, []);

  // ---- SCROLL LISTENER (only during JOURNEY; during FADING we stop updating) ----
  useEffect(() => {
    if (phase !== "JOURNEY") return;

    const onScroll = () => {
      scrollRef.current = window.scrollY;

      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;

        const currentY = scrollRef.current;
        setScrollY((prev) => (prev === currentY ? prev : currentY));

        const started = currentY > 50;
        if (startedRef.current !== started) {
          startedRef.current = started;
          setHasStartedScrolling(started);
        }

        const endThreshold = SCROLL_HEIGHT - window.innerHeight - 50;
        if (currentY >= endThreshold) {
          enterReveal();
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [phase]);

  // ---- SKIP BUTTON (single button that repositions; avoids “swap” jitter) ----
  const SkipButton = (
    <button
      onClick={enterReveal}
      className={`
        fixed z-50 group flex items-center gap-2
        px-3 py-1.5 text-[9px] md:px-6 md:py-3 md:text-sm
        bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30
        rounded-full text-white font-semibold tracking-wider uppercase
        transition-[transform,opacity,top,right,bottom,left] duration-500 ease-out
        will-change-transform
        ${
          hasStartedScrolling
            ? "left-1/2 bottom-10 top-auto right-auto -translate-x-1/2 opacity-95"
            : "top-8 right-8 md:right-32 left-auto bottom-auto translate-x-0 opacity-100"
        }
      `}
    >
      <span>Skip to Main Page</span>
      <FastForward
        size={16}
        className="group-hover:translate-x-1 transition-transform"
      />
    </button>
  );

  // ---------------- RENDER ----------------
  // IMPORTANT: Do NOT wrap everything in fixed+overflow-hidden.
  // Keep the spacer in normal flow so scrolling works.
  return (
    <>
      {/* JOURNEY LAYER (visible during JOURNEY and during FADING) */}
      {(phase === "JOURNEY" || phase === "FADING") && (
        <>
          {SkipButton}

          {/* Fixed visual layer */}
          <div
            className="fixed inset-0 z-10"
            style={{
              opacity: phase === "FADING" ? 0 : 1,
              transition: `opacity ${FADE_MS}ms ease`,
              willChange: "opacity",
              pointerEvents: "none",
            }}
          >
            <JourneyScene scrollY={scrollY} onComplete={enterReveal} />
          </div>

          {/* Scroll spacer (keeps scroll working) */}
          <div style={{ height: `${SCROLL_HEIGHT}px` }} />
        </>
      )}

      {/* REVEAL LAYER (always mounted once phase leaves JOURNEY; crossfades in) */}
      {(phase === "FADING" || phase === "REVEAL") && (
        <div
          className="fixed inset-0 z-40"
          style={{
            opacity: phase === "FADING" ? 1 : 1, // visible in both FADING and REVEAL
            transition: `opacity ${FADE_MS}ms ease`,
            willChange: "opacity",
            // Critical: stop accidental clicks during fade (your “Provider bio” issue)
            pointerEvents: phase === "REVEAL" ? "auto" : "none",
          }}
        >
          <V1RevealOverlay
            setView={() => {}}
            opacity={1}
            pointerEvents="auto"
            isActive={phase === "REVEAL"}
          />
        </div>
      )}
    </>
  );
};

export default App;
