import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { SATELLITES, RADIUS_DESKTOP, RADIUS_MOBILE } from "../constants";
import { SatelliteItem, Coordinates } from "../types";

// Helper to calculate position based on angle and radius
const getPosition = (angleInDegrees: number, radius: number): Coordinates => {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: radius * Math.cos(angleInRadians),
    y: radius * Math.sin(angleInRadians),
  };
};

const GlassHub: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(SVGPathElement | null)[]>([]);
  const satelliteRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [radius, setRadius] = useState(RADIUS_DESKTOP);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Responsive radius adjustment
  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth < 768 ? RADIUS_MOBILE : RADIUS_DESKTOP);
    };
    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize GSAP Context
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Animation
      gsap.fromTo(
        centerRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" }
      );

      satelliteRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              delay: 0.3 + i * 0.1,
              ease: "back.out(1.7)",
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Handle Hover Interactions
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reset all states first
      linesRef.current.forEach((line) => {
        if (line) {
          gsap.to(line, {
            strokeDashoffset: radius,
            opacity: 0.3,
            duration: 0.3,
          });
        }
      });

      if (centerRef.current) {
        gsap.to(centerRef.current, {
          scale: 1,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        });
      }

      satelliteRefs.current.forEach((sat) => {
        if (sat)
          gsap.to(sat, {
            scale: 1,
            opacity: 0.9,
            borderColor: "rgba(255,255,255,0.2)",
          });
      });

      // Apply active hover effects
      if (hoveredIndex !== null) {
        const activeLine = linesRef.current[hoveredIndex];
        const activeSat = satelliteRefs.current[hoveredIndex];

        // 1. Draw the connecting line
        if (activeLine) {
          gsap.to(activeLine, {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        }

        // 2. Pulse the Center Hub
        if (centerRef.current) {
          gsap.to(centerRef.current, {
            scale: 1.05,
            boxShadow:
              "0 0 30px rgba(45, 212, 191, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2)",
            duration: 0.4,
          });
        }

        // 3. Highlight the Satellite
        if (activeSat) {
          gsap.to(activeSat, {
            scale: 1.15,
            opacity: 1,
            borderColor: "rgba(45, 212, 191, 0.6)",
            boxShadow: "0 0 20px rgba(45, 212, 191, 0.3)",
            duration: 0.3,
          });
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [hoveredIndex, radius]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
    >
      {/* SVG Layer for Connector Lines - Placed behind UI elements */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 overflow-visible"
        width={radius * 2 + 150}
        height={radius * 2 + 150}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {SATELLITES.map((item, index) => {
          const pos = getPosition(item.angle, radius);
          // Start line slightly outside the center hub (radius ~90) and end slightly inside satellite
          // We calculate the path from Center (0,0) to Satellite (pos.x, pos.y)
          // We center the SVG on the screen, so (0,0) is the middle of the SVG.
          // The SVG viewBox center is width/2, height/2.

          const centerX = (radius * 2 + 150) / 2;
          const centerY = (radius * 2 + 150) / 2;

          return (
            <path
              key={`line-${item.id}`}
              ref={(el) => {
                linesRef.current[index] = el;
              }}
              d={`M${centerX},${centerY} L${centerX + pos.x},${
                centerY + pos.y
              }`}
              stroke="url(#lineGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray={radius} // Roughly the length of the line
              strokeDashoffset={radius} // Start hidden
              strokeLinecap="round"
              filter="url(#glow)"
              className="opacity-30 transition-opacity"
            />
          );
        })}
      </svg>

      {/* Central Hub */}
      <div
        ref={centerRef}
        className="relative z-20 flex flex-col items-center justify-center rounded-full bg-glass-100 backdrop-blur-xl border border-glass-200 shadow-glass w-48 h-48 md:w-64 md:h-64 transition-all duration-300 group cursor-default"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

        {/* Placeholder for Logo */}
        <div className="mb-3 text-white">
          {/* Using a simple SVG shape as a placeholder for the specific 'dk-logo-white.svg' */}
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21.36L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.36Z" />
          </svg>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest text-center leading-tight drop-shadow-md">
          DAYTON
          <br />
          KIDNEY
        </h1>
        <p className="text-white/60 text-xs mt-2 font-light uppercase tracking-[0.2em]">
          Excellence in Care
        </p>
      </div>

      {/* Satellite Spokes */}
      {SATELLITES.map((item, index) => {
        const pos = getPosition(item.angle, radius);

        return (
          <button
            key={item.id}
            ref={(el) => {
              satelliteRefs.current[index] = el;
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="absolute z-30 flex flex-col items-center justify-center p-4 rounded-full bg-glass-100 backdrop-blur-md border border-glass-200 shadow-glass w-24 h-24 md:w-32 md:h-32 transition-colors outline-none focus:ring-2 focus:ring-brand-teal/50"
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px)`,
              // Center the element on the coordinate
              marginLeft: window.innerWidth < 768 ? "-3rem" : "-4rem",
              marginTop: window.innerWidth < 768 ? "-3rem" : "-4rem",
            }}
            aria-label={item.label}
          >
            <div className="bg-white/10 p-2 md:p-3 rounded-full mb-1 md:mb-2 text-white group-hover:text-brand-teal transition-colors">
              <item.icon
                size={window.innerWidth < 768 ? 20 : 28}
                strokeWidth={1.5}
              />
            </div>
            <span className="text-[10px] md:text-xs font-semibold text-white text-center leading-tight tracking-wide drop-shadow-sm">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default GlassHub;
