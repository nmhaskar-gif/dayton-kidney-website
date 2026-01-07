// src/components/HomeView.tsx
import React, { useRef, useEffect } from "react";
import { ViewState } from "../../types";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

interface HomeViewProps {
  setView: (view: ViewState) => void;
  isActive: boolean;
}

const HomeView: React.FC<HomeViewProps> = ({ setView, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, scale: 0.98, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" }
        );

        gsap.set([titleRef.current, bodyRef.current, buttonsRef.current], {
          opacity: 0,
          y: 15,
        });

        const tl = gsap.timeline({ delay: 0.4 });
        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        })
          .to(
            bodyRef.current,
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.6"
          )
          .to(
            buttonsRef.current,
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.6"
          );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-10 h-full overflow-y-auto no-scrollbar overscroll-contain ${
        isActive ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* TOP MASK */}
      <div className="sticky top-0 left-0 right-0 h-24 z-20 bg-gradient-to-b from-[#1c1917]/80 via-[#1c1917]/40 to-transparent pointer-events-none backdrop-blur-sm md:h-32" />

      {/* CARD WRAPPER - (Keeps the card centered and pushed down) */}
      <div className="relative min-h-full w-full flex justify-center items-start px-6 pt-[5vh] md:pt-[8vh] pb-20">
        {/* INNER CARD - (The Glass Box) */}
        <div
          ref={cardRef}
          className="w-full max-w-md lg:max-w-2xl 
                      p-6 md:p-10 lg:p-12 rounded-[2rem] md:rounded-[3rem] 
                      shadow-2xl text-center opacity-0 border border-white/30 
                      backdrop-blur-sm"
          style={{
            /* TOP: 0.55 (55% opacity) -> clearly visible white/glass top
               BOTTOM: 0.15 (15% opacity) -> fades out at the bottom
            */
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.01), rgba(255,255,255,0.45))",
          }}
        >
          {/* ... Title, Body, Buttons go here ... */}

          {/* Title */}
          <div ref={titleRef} className="mb-5 md:mb-7">
            <h1 className="font-extrabold tracking-tight leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-blue-900 to-teal-800 text-3xl sm:text-4xl md:text-5xl">
                Dayton Kidney
              </span>
            </h1>
          </div>

          {/* Body */}
          <div ref={bodyRef} className="mb-6 md:mb-8 mx-auto max-w-xl">
            <p className="text-slate-900 font-bold leading-relaxed text-sm sm:text-base md:text-lg drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
              The unrivaled expertise and compassionate care of Renal Physicians
              and Nephrology Associates of Dayton have come together to form
              <span className="text-blue-900 font-extrabold ml-2">
                Dayton Kidney.
              </span>
            </p>

            <p className="mt-5 text-blue-950 font-semibold text-xs sm:text-sm md:text-base drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] leading-relaxed">
              Uniting the region's most experienced teams to help you navigate
              your kidney health journey, every step of the way.
            </p>
          </div>

          {/* Buttons */}
          <div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <button
              onClick={() => setView(ViewState.LOCATIONS)}
              className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-white bg-blue-900 hover:bg-teal-600 shadow-md transition-all transform hover:-translate-y-1 text-xs sm:text-sm"
            >
              Find a Location
            </button>

            <button
              onClick={() => setView(ViewState.PROVIDERS)}
              className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-blue-900 bg-white/60 backdrop-blur-md border border-white/40 hover:bg-white transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              Meet Our Providers
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
