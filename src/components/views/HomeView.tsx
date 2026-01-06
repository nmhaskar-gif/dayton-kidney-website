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
          { opacity: 0, scale: 0.95, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" }
        );

        gsap.set([titleRef.current, bodyRef.current, buttonsRef.current], {
          opacity: 0,
          y: 20,
        });

        const tl = gsap.timeline({ delay: 0.5 });

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
      /* FIX 1: Keep pt-24 at all breakpoints. 
         This creates a 96px "dead zone" at the top so the card 
         mathematically cannot sit behind the fixed navbar.
      */
      className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-4 pt-24"
    >
      {/* FIX 2: Removed all negative translate-y classes. 
         This stops the "vacuum" effect that was pulling the card upward.
      */}
      <div className="w-full flex justify-center">
        {/* INNER CARD */}
        <div
          ref={cardRef}
          /* FIX 3: added max-h-[calc(100vh-10rem)] and overflow-y-auto. 
             If the screen is short (laptop) or zoomed in, the card stays 
             within view and becomes scrollable internally.
          */
          className="pointer-events-auto w-[95%] sm:w-[85%] md:w-full md:max-w-lg lg:max-w-3xl 
                     p-5 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl text-center 
                     opacity-0 border border-white/20 bg-gradient-to-b from-white/5 to-white/20 
                     backdrop-blur-sm max-h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar"
        >
          {/* Title */}
          <div ref={titleRef} className="mb-4 sm:mb-8 md:mb-8 lg:mb-10">
            <h1 className="font-extrabold tracking-tight leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-blue-900 to-teal-800 text-4xl sm:text-5xl md:text-5xl lg:text-6xl">
                Dayton Kidney
              </span>
            </h1>
          </div>

          {/* Body Text */}
          <div ref={bodyRef} className="mb-8 md:mb-10 mx-auto">
            <p className="text-slate-900 font-bold leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
              The unrivaled expertise and
              <br className="block sm:hidden" />
              compassionate care of
              <br className="block sm:hidden" />
              <span className="text-teal-900 font-extrabold">
                Renal Physicians
              </span>
              <br className="block sm:hidden" />
              and
              <br className="block sm:hidden" />
              <span className="text-teal-900 font-extrabold">
                Nephrology Associates of Dayton
              </span>
              <br className="block sm:hidden" />
              have come together to form
              <br className="block sm:hidden" />
              <strong>Dayton Kidney</strong>
            </p>

            <p className="mt-4 sm:mt-6 text-blue-950 font-extrabold text-xs sm:text-sm md:text-base lg:text-lg drop-shadow-[0_0_20px_rgba(255,255,255,1)] max-w-xl mx-auto">
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
              className="w-full sm:w-auto px-6 py-3 sm:px-8 rounded-full font-bold text-white bg-blue-900 hover:bg-teal-600 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 text-sm sm:text-base"
            >
              Find a Location
            </button>

            <button
              onClick={() => setView(ViewState.PROVIDERS)}
              className="w-full sm:w-auto px-6 py-3 sm:px-8 rounded-full font-bold text-blue-900 bg-white/60 backdrop-blur-md border border-white/50 hover:bg-white hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-sm sm:text-base"
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
