// src/components/views/ProvidersView.tsx
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { PROVIDERS_DATA } from "../../constants";
import { Provider } from "../../types";
import {
  ChevronLeft,
  ChevronRight,
  User,
  X,
  GraduationCap,
  Heart,
  BookOpen,
  LayoutGrid,
  Vote,
  LayoutList,
  MousePointerClick,
  Info,
} from "lucide-react";
import gsap from "gsap";
import { createPortal } from "react-dom";

// --- CUSTOM CONTENT OVERRIDES ---
const getProviderOverrides = (provider: Provider) => {
  const name = provider.name;
  const role = provider.role;

  let cardTitle = provider.title;
  let credentials = "";

  if (role === "MD") {
    credentials = "MD, FASN, FACP";
    cardTitle = "General Nephrology";

    if (["Eze", "Odunsi", "Lane"].some((n) => name.includes(n))) {
      cardTitle = "General & Interventional Nephrology";
    } else if (
      ["Mhaskar", "Schnell", "Maroz", "Thiruveedi"].some((n) =>
        name.includes(n)
      )
    ) {
      cardTitle = "General Nephrology & Plasmapheresis";
    } else if (["Eduafo", "Mirza"].some((n) => name.includes(n))) {
      cardTitle = "General & Transplant Nephrology";
    }
  } else if (role === "APP") {
    if (
      ["Esther Bassaw", "Gillian Wenzke", "Stephen Langley"].some((n) =>
        name.includes(n)
      )
    ) {
      cardTitle = "Nurse Practitioner";
      credentials = "APRN";
    } else if (
      ["Elizabeth Pavlica", "Katherine Simpson", "Jayla Treadwell"].some((n) =>
        name.includes(n)
      )
    ) {
      cardTitle = "Physician Assistant";
      credentials = "PA-C";
    } else {
      cardTitle = "Advanced Practice Provider";
      credentials = "CNP/PA";
    }
  } else if (role === "MGMT") {
    credentials = "";
    if (name.includes("Lisa Pouliot")) {
      cardTitle = "Practice Administrator";
    } else if (name.includes("Jill Combs") || name.includes("Rachel Ary")) {
      cardTitle = "Practice Manager";
    }
  }

  let cleanName = name.replace(", MD", "").replace(", DO", "");
  if (role === "MD" && !cleanName.startsWith("Dr")) {
    cleanName = `Dr ${cleanName}`;
  }
  const cardName = cleanName;

  if (name.includes("Mhaskar")) {
    return {
      cardName,
      cardTitle,
      credentials,
      bio: "Dr Mhaskar joined Renal Physicians in 2007 and is a founding partner of Dayton Kidney. He served as the President of Renal Physicians from 2019-2025 and Chairman of Dayton Kidney from 2026-2027. His interests include General Nephrology, Hypertension, and Glomerular Diseases.",
      education: [
        "Needham Elementary, Lodi, California",
        "Undergraduate: University of California, Berkeley",
        "Medical School: University of Southern California",
        "Residency: New York Presbyterian Hospital- Cornell",
        "Fellowship: New York Presbyterian Hospital- Cornell",
      ],
      interests: [
        "Doing the New York Times Crossword Puzzle",
        "Cooking and Baking",
        "Taking walks with my dogs",
        "Travelling with my family",
      ],
    };
  }

  return {
    cardName,
    cardTitle,
    credentials,
    bio: provider.bio,
    education: provider.education,
    interests: provider.interests,
  };
};

const ProvidersView: React.FC = () => {
  const [filter, setFilter] = useState<"MD" | "APP" | "MGMT">("MD");
  const [viewMode, setViewMode] = useState<"3D" | "GRID" | "LIST">("3D");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [previewProvider, setPreviewProvider] = useState<Provider | null>(null);

  const filteredProviders = PROVIDERS_DATA.filter((p) => p.role === filter);
  const count = filteredProviders.length;

  // Only override MGMT when user is in the 3D carousel view
  const effectiveViewMode: "3D" | "GRID" | "LIST" =
    viewMode === "3D" && filter === "MGMT" ? "GRID" : viewMode;

  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // ✅ Gate first paint to prevent initial iPhone “smear”
  const [carouselReady, setCarouselReady] = useState(false);

  // ✅ Keep rotation smooth by animating relative deltas (prevents jump vs rotate mismatch)
  const prevIndexRef = useRef(0);
  const rotationRef = useRef(0);

  const CARD_WIDTH = 238;
  const CARD_HEIGHT = 350;
  const GAP = 40;
  const MIN_RADIUS = 400;

  const calculatedRadius = (count * (CARD_WIDTH + GAP)) / (2 * Math.PI);
  const RADIUS = Math.max(MIN_RADIUS, calculatedRadius);
  const THETA = count > 0 ? 360 / count : 0;

  // --- Helpers ---
  const clampIndex = (idx: number) => {
    if (count <= 0) return 0;
    return ((idx % count) + count) % count;
  };

  const goToIndex = (idx: number) => {
    if (count <= 0) return;
    setActiveIndex(clampIndex(idx));
  };

  const handleNext = () => goToIndex(activeIndex + 1);
  const handlePrev = () => goToIndex(activeIndex - 1);

  const handleCardClick = (index: number, provider: Provider) => {
    if (provider.role === "MGMT") {
      if (viewMode === "3D") goToIndex(index);
      return;
    }
    setSelectedProvider(provider);
    if (viewMode === "3D") goToIndex(index);
  };

  // Keep index safe when switching filters/modes (DO NOT REMOVE)
  useEffect(() => {
    setActiveIndex(0);
    prevIndexRef.current = 0;
    rotationRef.current = 0;
  }, [filter, effectiveViewMode]);

  // ✅ Reset readiness when leaving/entering carousel or count changes
  useEffect(() => {
    setCarouselReady(false);
  }, [effectiveViewMode, filter, count, RADIUS]);

  // ✅ BEFORE-PAINT: hard set transform so first visible frame is correct
  useLayoutEffect(() => {
    if (effectiveViewMode !== "3D") return;
    const el = carouselRef.current;
    if (!el || count === 0) return;

    setCarouselReady(false);

    // Reset refs on mount/re-entry
    prevIndexRef.current = clampIndex(activeIndex);
    rotationRef.current = -prevIndexRef.current * THETA;

    gsap.killTweensOf(el);
    gsap.set(el, {
      rotationY: rotationRef.current,
      z: -RADIUS,
      force3D: true,
      transformPerspective: 1000,
      transformStyle: "preserve-3d",
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setCarouselReady(true));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveViewMode, filter, RADIUS, THETA, count]);

  // ✅ Smooth rotation: animate delta steps (shortest path)
  useEffect(() => {
    if (!carouselReady) return;
    if (effectiveViewMode !== "3D") return;
    const el = carouselRef.current;
    if (!el || count === 0) return;

    const next = clampIndex(activeIndex);
    const prev = clampIndex(prevIndexRef.current);

    // compute shortest delta around circle
    let delta = next - prev;
    const half = count / 2;
    if (delta > half) delta -= count;
    if (delta < -half) delta += count;

    prevIndexRef.current = next;

    // update continuous rotation target
    rotationRef.current += -delta * THETA;

    gsap.killTweensOf(el);
    gsap.to(el, {
      rotationY: rotationRef.current,
      z: -RADIUS,
      duration: 0.65,
      ease: "power3.out",
      force3D: true,
      overwrite: "auto",
    });
  }, [carouselReady, activeIndex, effectiveViewMode, RADIUS, THETA, count]);

  const headerSubtitle =
    viewMode === "3D"
      ? "Spin to meet the experts"
      : viewMode === "LIST"
      ? "Browse detailed profiles"
      : "Select a team member";

  return (
    <div
      className={`w-full h-full overflow-hidden flex flex-col pt-24 pb-4 animate-fade-in relative 
        ${effectiveViewMode === "3D" ? "perspective-container" : ""} 
      `}
    >
      {/* --- BACKGROUND LAYER --- */}
      <div className="fixed inset-0 -z-30">
        <img
          src="https://i.ibb.co/93YdWhP4/i-Stock-529983003.jpg"
          alt="Dayton Skyline"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="fixed inset-0 bg-white/40 backdrop-blur-[1px] -z-20" />

      {/* =========================================================
         MOBILE-SAFE HEADER STACK (NO ABSOLUTE TOP OFFSETS)
         ========================================================= */}
      <div
        className={`relative z-30 w-full px-4 pt-2 pb-2 transition-opacity duration-300 ${
          selectedProvider ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Line 1: Title + subtitle */}
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-blue-900 drop-shadow-sm leading-tight">
            The Region&apos;s Most Trusted Team
          </h2>
          <p className="text-blue-900/80 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">
            {headerSubtitle}
          </p>
        </div>

        {/* Lines 2–4: Controls */}
        <div className="mt-4 flex flex-col items-center gap-3">
          {/* Line 2: Provider / APP / MGMT switcher */}
          <div className="w-full flex justify-center">
            <div className="flex bg-white/60 backdrop-blur-md rounded-full p-1.5 border border-white/50 shadow-inner max-w-full overflow-x-auto no-scrollbar">
              {(["MD", "APP", "MGMT"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 md:px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    filter === type
                      ? "bg-blue-900 text-white shadow-md transform scale-105"
                      : "text-blue-900 hover:bg-white/50"
                  }`}
                >
                  {type === "MD"
                    ? "Physicians"
                    : type === "APP"
                    ? "APPs"
                    : "Management"}
                </button>
              ))}
            </div>
          </div>

          {/* Line 3: View switcher */}
          <div className="flex bg-white/60 backdrop-blur-md rounded-full p-1.5 border border-white/50 shadow-inner">
            <button
              onClick={() => setViewMode("3D")}
              className={`p-2 rounded-full transition-all ${
                viewMode === "3D"
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-blue-900 hover:bg-white/50"
              }`}
              title="Carousel View"
            >
              <Vote size={18} />
            </button>
            <button
              onClick={() => setViewMode("GRID")}
              className={`p-2 rounded-full transition-all ${
                viewMode === "GRID"
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-blue-900 hover:bg-white/50"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("LIST")}
              className={`p-2 rounded-full transition-all ${
                viewMode === "LIST"
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-blue-900 hover:bg-white/50"
              }`}
              title="List View"
            >
              <LayoutList size={18} />
            </button>
          </div>

          {/* Line 4: “Narrow width” chevrons row (flip above carousel) */}
          {effectiveViewMode === "3D" && (
            <div className="hidden [@media(max-width:1190px)]:flex w-full max-w-md items-center justify-between px-1">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-white/80 backdrop-blur-md shadow-xl text-blue-900 border border-white/50 transition-all active:scale-95 hover:bg-teal-500 hover:text-white"
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-white/80 backdrop-blur-md shadow-xl text-blue-900 border border-white/50 transition-all active:scale-95 hover:bg-teal-500 hover:text-white"
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      {effectiveViewMode === "3D" ? (
        // --- 3D CAROUSEL VIEW ---
        <div
          key="3d-container"
          className={`flex-grow w-full flex items-center justify-center relative overflow-visible perspective-container transition-all duration-500 ${
            selectedProvider
              ? // ✅ iPhone blur smear fix: no blur on base breakpoint
                "scale-95 opacity-60 pointer-events-none sm:blur-sm"
              : "scale-100 opacity-100"
          }`}
          style={{
            // ✅ iOS: keep a stable compositor layer
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
          }}
        >
          {/* ✅ DESKTOP-ONLY OVERLAY CHEVRONS (hidden at <=1190px to prevent overlap) */}
          <div
            className="
              hidden [@media(min-width:1191px)]:flex
              absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              z-50 items-center justify-between
              pointer-events-none
              w-[min(1180px,88vw)]
            "
          >
            <button
              onClick={handlePrev}
              className="
                pointer-events-auto
                p-3 md:p-4 rounded-full
                bg-white/80 backdrop-blur-md shadow-xl
                text-blue-900 border border-white/50
                transition-all transform active:scale-95
                hover:bg-teal-500 hover:text-white
              "
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              className="
                pointer-events-auto
                p-3 md:p-4 rounded-full
                bg-white/80 backdrop-blur-md shadow-xl
                text-blue-900 border border-white/50
                transition-all transform active:scale-95
                hover:bg-teal-500 hover:text-white
              "
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Carousel */}
          <div
            ref={carouselRef}
            className={`relative preserve-3d will-change-transform ${
              carouselReady ? "opacity-100" : "opacity-0"
            }`}
            style={{
              width: `${CARD_WIDTH}px`,
              height: `${CARD_HEIGHT}px`,
              transition: "opacity 120ms linear",
            }}
          >
            {filteredProviders.map((provider, i) => {
              const angle = i * THETA;

              return (
                <div
                  key={`3d-${provider.id}`}
                  onPointerUp={(e) => {
                    e.preventDefault();
                    handleCardClick(i, provider);
                  }}
                  className={`absolute top-0 left-0 w-full h-full transition-[filter] duration-300 hover:brightness-110 ${
                    provider.role === "MGMT"
                      ? "cursor-default"
                      : "cursor-pointer"
                  }`}
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transformStyle: "preserve-3d",
                    WebkitTransformStyle: "preserve-3d",
                    willChange: "transform",
                    touchAction: "manipulation",
                  }}
                >
                  <ProviderCard provider={provider} />
                </div>
              );
            })}
          </div>
        </div>
      ) : effectiveViewMode === "GRID" ? (
        // --- GRID VIEW ---
        <div
          key="grid-container"
          className={`w-full flex-grow mt-26 md:mt-32 overflow-y-auto px-4 pb-20 custom-scrollbar transition-opacity duration-300 ${
            selectedProvider ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-full flex justify-center">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center w-fit ${
                filter === "MD" ? "xl:grid-cols-4" : "xl:grid-cols-3"
              }`}
            >
              {filteredProviders.map((provider, i) => (
                <div
                  key={`grid-${provider.id}`}
                  onClick={() => handleCardClick(i, provider)}
                  style={{ transform: "none" }}
                  className={`h-96 transition-transform duration-300 hover:-translate-y-2 ${
                    provider.role === "MGMT"
                      ? "cursor-default"
                      : "cursor-pointer"
                  } ${filter === "MD" ? "w-[16rem]" : "w-[18rem]"}`}
                >
                  <ProviderCard provider={provider} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // --- MASTER DETAIL (LIST) VIEW ---
        <div
          key="list-container"
          className="w-full flex-grow overflow-hidden px-4 pb-4 max-w-7xl mx-auto flex gap-6 pt-6"
        >
          {/* LEFT COLUMN: THE LIST */}
          <div className="w-full lg:w-1/3 xl:w-1/4 h-full overflow-y-auto custom-scrollbar pr-2 space-y-2 pb-20">
            <div className="block lg:hidden p-3 rounded-xl border border-blue-200 bg-blue-50/80 mb-2 flex items-center gap-3 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Info size={20} />
              </div>
              <div>
                <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wide">
                  Instructions
                </h4>
                <p className="text-[10px] text-slate-600 leading-tight">
                  Tap a provider below to open their profile.
                </p>
              </div>
            </div>

            {filteredProviders.map((provider) => {
              const details = getProviderOverrides(provider);
              const isActive = previewProvider?.id === provider.id;

              return (
                <div
                  key={provider.id}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setSelectedProvider(provider);
                    } else {
                      setPreviewProvider(provider);
                    }
                  }}
                  className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer
                    ${
                      isActive
                        ? "bg-blue-900 border-blue-900 shadow-md"
                        : "bg-white/80 hover:bg-white border-white/50 hover:border-teal-200"
                    }
                  `}
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-slate-200">
                    <img
                      src={provider.imageUrl}
                      alt={provider.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-bold text-sm truncate ${
                        isActive ? "text-white" : "text-blue-900"
                      }`}
                    >
                      {details.cardName}
                    </h4>
                    <p
                      className={`text-[10px] truncate ${
                        isActive ? "text-teal-200" : "text-slate-500"
                      }`}
                    >
                      {details.cardTitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: THE DETAIL CARD (Desktop Only) */}
          <div className="hidden lg:flex lg:w-2/3 xl:w-3/4 h-full pb-20 items-center justify-center">
            {previewProvider ? (
              <div className="w-full h-[600px] bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl overflow-hidden flex flex-row animate-fade-in">
                <div className="w-2/5 h-full relative bg-slate-800 flex-shrink-0">
                  <img
                    src={previewProvider.imageUrl}
                    alt={previewProvider.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <h2 className="text-3xl font-extrabold text-white leading-tight mb-1">
                      {getProviderOverrides(previewProvider).cardName}
                    </h2>
                    <p className="text-teal-400 font-bold uppercase tracking-wider text-xs mb-1">
                      {getProviderOverrides(previewProvider).credentials}
                    </p>
                    <p className="text-white/90 text-lg font-medium">
                      {getProviderOverrides(previewProvider).cardTitle}
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900 mb-3 border-b border-blue-100 pb-2">
                      <BookOpen size={20} className="text-teal-600" />
                      Biography
                    </h3>
                    <p className="text-slate-700 leading-relaxed text-sm">
                      {getProviderOverrides(previewProvider).bio ||
                        "No biography available."}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900 mb-3 border-b border-blue-100 pb-2">
                      <GraduationCap size={20} className="text-teal-600" />
                      Education & Training
                    </h3>
                    <ul className="space-y-2">
                      {(
                        getProviderOverrides(previewProvider).education || []
                      ).map((edu, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-slate-700 text-sm group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0"></span>
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900 mb-3 border-b border-blue-100 pb-2">
                      <Heart size={20} className="text-teal-600" />
                      Interests & Hobbies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(
                        getProviderOverrides(previewProvider).interests || []
                      ).map((int, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-1.5 bg-white border border-blue-100 text-blue-800 rounded-full text-xs font-bold shadow-sm"
                        >
                          {int}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 bg-white/30 backdrop-blur-md rounded-3xl border-2 border-dashed border-blue-900/20">
                <div className="bg-white/60 p-4 rounded-full mb-4 shadow-sm animate-bounce">
                  <MousePointerClick size={48} className="text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">
                  Meet Our Experts
                </h3>
                <p className="text-slate-600 max-w-sm">
                  Scroll through the list on the left and click on a provider to
                  view their full profile, biography, and areas of expertise.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedProvider && (
        <ModalPortal>
          <ProfileModal
            provider={selectedProvider}
            onClose={() => setSelectedProvider(null)}
          />
        </ModalPortal>
      )}
    </div>
  );
};

// --- ProviderCard ---
const ProviderCard: React.FC<{ provider: Provider }> = ({ provider }) => {
  const details = getProviderOverrides(provider);
  const isMgmt = provider.role === "MGMT";

  return (
    <div
      className={`w-full h-full bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl shadow-lg overflow-hidden flex flex-col group transition-all
        ${!isMgmt ? "hover:border-teal-400 hover:shadow-xl" : ""}
      `}
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <div className="h-[75%] w-full relative overflow-hidden bg-slate-200">
        {provider.imageUrl ? (
          <img
            src={provider.imageUrl}
            alt={provider.name}
            style={{
              objectPosition: isMgmt
                ? "center center"
                : provider.imagePosition || "center top",
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <User size={64} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent to-transparent opacity-60" />

        <div
          className={`absolute bottom-0 left-0 w-full p-4 translate-y-1 transition-transform ${
            !isMgmt ? "group-hover:translate-y-0" : ""
          }`}
        >
          <h3 className="font-bold text-white leading-none drop-shadow-md text-lg md:text-xl mb-1 line-clamp-2">
            {details.cardName}
          </h3>
          <p className="text-teal-200 font-medium line-clamp-2 leading-tight opacity-100 text-xs md:text-sm">
            {details.cardTitle}
          </p>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center bg-white px-4 py-3">
        {!isMgmt ? (
          <div className="w-full bg-slate-50 border border-slate-200 text-blue-900 font-bold uppercase tracking-widest rounded-lg text-center hover:bg-blue-900 hover:text-white transition-colors shadow-sm cursor-pointer py-2 text-[10px] md:text-xs">
            View Profile
          </div>
        ) : (
          <div className="w-full h-1" />
        )}
      </div>
    </div>
  );
};

// --- MODAL ---
const ProfileModal: React.FC<{ provider: Provider; onClose: () => void }> = ({
  provider,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const details = getProviderOverrides(provider);

  const education = details.education || ["Medical Degree: Unknown"];
  const interests = details.interests || ["General Nephrology"];
  const bio = details.bio || "No biography available.";

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 }
      );
      gsap.fromTo(
        modalRef.current,
        { scale: 0.3, y: 150, opacity: 0, rotationX: 10 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.6,
          ease: "back.out(1.2)",
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      scale: 0.3,
      y: 150,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: onClose,
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.4 });
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-sm animate-fade-in"
    >
      <div
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()}
        className="bg-white/95 w-[90%] md:w-[80%] lg:w-full max-w-4xl h-auto max-h-[85vh] lg:h-[600px] rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden relative border border-white/50"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X size={24} />
        </button>

        {/* MOBILE/TABLET HEADER */}
        <div className="lg:hidden flex flex-row p-6 bg-slate-800 items-center gap-4 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              src={provider.imageUrl}
              className="w-full h-full object-cover blur-md scale-110"
              alt=""
            />
          </div>

          <img
            src={provider.imageUrl}
            alt={provider.name}
            className="w-24 h-32 md:w-28 md:h-36 object-cover object-top rounded-xl z-10 border-2 border-white/30 shadow-lg shrink-0"
          />

          <div className="z-10 flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight mb-1 truncate">
              {details.cardName}
            </h2>
            <p className="text-teal-300 text-xs md:text-sm font-bold uppercase tracking-wider mb-1 truncate">
              {details.credentials}
            </p>
            <p className="text-white/80 text-sm md:text-base font-medium line-clamp-2">
              {details.cardTitle}
            </p>
          </div>
        </div>

        {/* DESKTOP SIDEBAR IMAGE */}
        <div className="hidden lg:block lg:w-2/5 relative bg-slate-800 flex-shrink-0">
          <img
            src={provider.imageUrl}
            alt={provider.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-full p-8">
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-1">
              {details.cardName}
            </h2>
            <p className="text-teal-400 text-sm font-bold uppercase tracking-wider mb-2">
              {details.credentials}
            </p>
            <p className="text-white/90 text-lg font-medium">
              {details.cardTitle}
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-gradient-to-br from-white to-blue-50/50 custom-scrollbar">
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900 mb-3 border-b border-blue-100 pb-2">
              <BookOpen size={20} className="text-teal-600" />
              Biography
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm md:text-base">
              {bio}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900 mb-3 border-b border-blue-100 pb-2">
              <GraduationCap size={20} className="text-teal-600" />
              Education & Training
            </h3>
            <ul className="space-y-3">
              {education.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-slate-700 text-sm group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0 group-hover:scale-150 transition-transform"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900 mb-3 border-b border-blue-100 pb-2">
              <Heart size={20} className="text-teal-600" />
              Interests & Hobbies
            </h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((item, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 bg-white border border-blue-100 text-blue-800 rounded-full text-xs font-bold shadow-sm hover:bg-blue-50 transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
};

export default ProvidersView;
