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

      {/* TOP MASK: This creates the "fade behind nav" effect.
          As you scroll the card up, it hits this gradient and disappears. 
      */}
      <div className="sticky top-0 left-0 right-0 h-24 z-20 bg-gradient-to-b from-[#1c1917]/80 via-[#1c1917]/40 to-transparent pointer-events-none backdrop-blur-sm md:h-32" />

      {/* CARD WRAPPER */}
      <div className="relative min-h-full w-full flex justify-center items-start px-6 pt-[5vh] md:pt-[8vh] pb-20">
        <div
          ref={cardRef}
          className="w-full max-w-lg lg:max-w-3xl 
                     p-8 md:p-12 lg:p-14 rounded-[2.5rem] md:rounded-[3.5rem] 
                     shadow-2xl text-center opacity-0 border border-white/20 
                     bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-md"
        >
          {/* Title - Restored to original legible sizes */}
          <div ref={titleRef} className="mb-6 md:mb-8">
            <h1 className="font-extrabold tracking-tight leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-blue-900 to-teal-800 text-4xl sm:text-5xl md:text-6xl">
                Dayton Kidney
              </span>
            </h1>
          </div>

          {/* Body Text - Restored sizes */}
          <div ref={bodyRef} className="mb-8 md:mb-10 mx-auto max-w-2xl">
            <p className="text-slate-900 font-bold leading-relaxed text-base sm:text-lg md:text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
              The unrivaled expertise and compassionate care of Renal Physicians
              and Nephrology Associates of Dayton have come together to form
              <span className="text-blue-900 font-extrabold ml-2">
                Dayton Kidney.
              </span>
            </p>

            <p className="mt-6 text-blue-950 font-semibold text-sm sm:text-base md:text-lg drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] leading-relaxed">
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
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-white bg-blue-900 hover:bg-teal-600 shadow-md transition-all transform hover:-translate-y-1 text-sm md:text-base"
            >
              Find a Location
            </button>

            <button
              onClick={() => setView(ViewState.PROVIDERS)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-blue-900 bg-white/60 backdrop-blur-md border border-white/40 hover:bg-white transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              Meet Our Providers
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
