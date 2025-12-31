// src/components/views/ProvidersView.tsx
/* eslint-disable */
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
        "High School: Fountain Valley High School, California - GO BARONS!",
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
  const [viewMode, setViewMode] = useState<"3D" | "GRID" | "LIST">("LIST");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [previewProvider, setPreviewProvider] = useState<Provider | null>(null);

  const filteredProviders = PROVIDERS_DATA.filter((p) => p.role === filter);
  const count = filteredProviders.length;

  /* =======================
     MGMT VIEW ENFORCEMENT (FIXED)
     ======================= */
  const lastNonMgmtViewRef = useRef<"GRID" | "LIST">("LIST");
  const prevFilterRef = useRef<"MD" | "APP" | "MGMT">("MD");

  // 1. SAVE: Update our memory only when the user manually toggles view on MD/APP tabs
  useEffect(() => {
    if (filter !== "MGMT") {
      lastNonMgmtViewRef.current = viewMode as "GRID" | "LIST";
    }
  }, [viewMode, filter]);

  // 2. SWITCH: Only run when the tab changes
  useEffect(() => {
    if (prevFilterRef.current !== filter) {
      if (filter === "MGMT") {
        setViewMode("GRID");
      } else if (prevFilterRef.current === "MGMT") {
        // Restore whatever they were looking at before they entered MGMT
        setViewMode(lastNonMgmtViewRef.current);
      }
      prevFilterRef.current = filter;
    }
  }, [filter]); // Only trigger on tab (filter) changes
  const effectiveViewMode: "3D" | "GRID" | "LIST" =
    viewMode === "3D" && filter === "MGMT" ? "GRID" : viewMode;

  /* =======================
     CAROUSEL STATE (UNCHANGED)
     ======================= */
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null); // outer page wrapper
  const gridScrollRef = useRef<HTMLDivElement>(null); // the grid scroll container

  const [carouselReady, setCarouselReady] = useState(false);
  const prevIndexRef = useRef(0);
  const rotationRef = useRef(0);

  const CARD_WIDTH = 238;
  const CARD_HEIGHT = 350;
  const GAP = 40;
  const MIN_RADIUS = 400;

  const calculatedRadius = (count * (CARD_WIDTH + GAP)) / (2 * Math.PI);
  const RADIUS = Math.max(MIN_RADIUS, calculatedRadius);
  const THETA = count > 0 ? 360 / count : 0;

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
    if (provider.role === "MGMT") return;
    setSelectedProvider(provider);
    if (effectiveViewMode === "3D") goToIndex(index);
  };
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // ONLY affect Physicians + APPs in TILE (GRID) view
      if (effectiveViewMode !== "GRID") return;
      if (filter === "MGMT") return;
      if (!gridScrollRef.current) return;
      if (selectedProvider) return; // don't interfere when modal is open

      const target = gridScrollRef.current;

      // If it can't scroll, do nothing
      if (target.scrollHeight <= target.clientHeight) return;

      // Stop page/body scroll and push scroll into the grid container
      e.preventDefault();
      target.scrollTop += e.deltaY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel as any);
  }, [effectiveViewMode, filter, selectedProvider]);

  useEffect(() => {
    setActiveIndex(0);
    prevIndexRef.current = 0;
    rotationRef.current = 0;
  }, [filter, effectiveViewMode]);

  useEffect(() => {
    setCarouselReady(false);
  }, [effectiveViewMode, filter, count, RADIUS]);

  useLayoutEffect(() => {
    if (effectiveViewMode !== "3D") return;
    const el = carouselRef.current;
    if (!el || count === 0) return;

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
  }, [effectiveViewMode, filter, RADIUS, THETA, count]);

  useEffect(() => {
    if (!carouselReady || effectiveViewMode !== "3D") return;
    const el = carouselRef.current;
    if (!el || count === 0) return;

    const next = clampIndex(activeIndex);
    const prev = clampIndex(prevIndexRef.current);

    let delta = next - prev;
    const half = count / 2;
    if (delta > half) delta -= count;
    if (delta < -half) delta += count;

    prevIndexRef.current = next;
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
    effectiveViewMode === "3D"
      ? "Spin to meet the experts"
      : effectiveViewMode === "LIST"
      ? "Browse detailed profiles"
      : "Select a team member";

  return (
    <div
      ref={gridWrapperRef}
      className={`w-full flex flex-col pt-24 pb-4 animate-fade-in relative 
      ${
        effectiveViewMode === "GRID" && filter !== "MGMT"
          ? "h-[100dvh] overflow-hidden"
          : "h-full overflow-hidden"
      }
      ${effectiveViewMode === "3D" ? "perspective-container" : ""}
    `}
    >
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-30">
        <img
          src="https://i.ibb.co/93YdWhP4/i-Stock-529983003.jpg"
          alt="Dayton Skyline"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="fixed inset-0 bg-white/40 backdrop-blur-[1px] -z-20" />

      {/* HEADER */}
      <div
        className={`relative z-30 w-full px-4 pt-2 pb-2 transition-opacity duration-300 ${
          selectedProvider ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-blue-900 leading-tight">
            The Region&apos;s Most Trusted Team
          </h2>
          <p className="text-blue-900/80 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">
            {headerSubtitle}
          </p>
        </div>

        <div className="mt-4 flex flex-col items-center gap-3">
          <div className="flex bg-white/60 backdrop-blur-md rounded-full p-1.5 border border-white/50 shadow-inner">
            {(["MD", "APP", "MGMT"] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  // 1. If moving TO Management, force Grid
                  if (type === "MGMT") {
                    setViewMode("GRID");
                  }
                  // 2. If moving AWAY from Management, restore the last user choice
                  else if (filter === "MGMT") {
                    setViewMode(lastNonMgmtViewRef.current);
                  }

                  // 3. Update the filter state
                  setFilter(type);
                }}
                className={`px-4 md:px-5 py-2 rounded-full text-xs font-bold transition-all ${
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

          <div className="flex bg-white/60 backdrop-blur-md rounded-full p-1.5 border border-white/50 shadow-inner">
            <button
              onClick={() => setViewMode("GRID")}
              className={`p-2 rounded-full transition-all ${
                effectiveViewMode === "GRID"
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-blue-900 hover:bg-white/50"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("LIST")}
              className={`p-2 rounded-full transition-all ${
                effectiveViewMode === "LIST"
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-blue-900 hover:bg-white/50"
              }`}
            >
              <LayoutList size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT SWITCHER */}
      {effectiveViewMode === "3D" ? (
        <div
          className={`flex-grow w-full flex items-center justify-center relative overflow-visible transition-all duration-500 ${
            selectedProvider ? "scale-95 opacity-60 sm:blur-sm" : ""
          }`}
        >
          <div ref={carouselRef} className="relative preserve-3d">
            {filteredProviders.map((p, i) => (
              <div
                key={p.id}
                className="absolute"
                style={{
                  transform: `rotateY(${i * THETA}deg) translateZ(${RADIUS}px)`,
                }}
              >
                <ProviderCard provider={p} />
              </div>
            ))}
          </div>
        </div>
      ) : effectiveViewMode === "GRID" ? (
        <div
          key="grid-container"
          ref={gridScrollRef}
          className="w-full flex-1 min-h-0 overflow-y-auto custom-scrollbar mt-24 px-4 pb-20"
        >
          <div className="w-full flex justify-center">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ${
                filter === "MD" ? "xl:grid-cols-4" : "xl:grid-cols-3"
              }`}
            >
              {filteredProviders.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => handleCardClick(i, p)}
                  className="h-96 w-[16rem] cursor-pointer hover:-translate-y-2 transition-transform"
                >
                  <ProviderCard provider={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW: Fixed alignment and scrollbar */
        <div
          key="list-container"
          className="w-full flex-grow overflow-hidden px-4 max-w-7xl mx-auto flex gap-6 mt-8 md:mt-10"
        >
          <div className="w-full lg:w-1/3 xl:w-1/4 h-[650px] flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-2 pb-20">
              {filteredProviders.map((provider) => {
                const details = getProviderOverrides(provider);
                const isActive = previewProvider?.id === provider.id;
                return (
                  <div
                    key={provider.id}
                    onClick={() =>
                      window.innerWidth < 1024
                        ? setSelectedProvider(provider)
                        : setPreviewProvider(provider)
                    }
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-900 border-blue-900 text-white shadow-md scale-[1.02]"
                        : "bg-white/80 border-white/50 hover:border-teal-200"
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 border-2 border-white shadow-sm">
                      <img
                        src={provider.imageUrl}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">
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
          </div>

          <div className="hidden lg:flex lg:w-2/3 xl:w-3/4 h-full pb-20 items-start justify-center">
            {previewProvider ? (
              <div className="w-full h-[650px] bg-white/95 rounded-3xl border border-white/60 shadow-xl overflow-hidden flex flex-row animate-fade-in">
                <div className="w-2/5 h-full relative bg-slate-800 flex-shrink-0">
                  <img
                    src={previewProvider.imageUrl}
                    className="w-full h-full object-cover object-top"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 w-full p-8 z-10 text-white">
                    <h2 className="text-3xl font-extrabold leading-tight mb-1">
                      {getProviderOverrides(previewProvider).cardName}
                    </h2>
                    <p className="text-teal-400 font-bold uppercase text-xs mb-1">
                      {getProviderOverrides(previewProvider).credentials}
                    </p>
                    <p className="text-lg font-medium">
                      {getProviderOverrides(previewProvider).cardTitle}
                    </p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
                  {(() => {
                    const d = getProviderOverrides(previewProvider);
                    const bio = d.bio || "No biography available.";
                    const education = Array.isArray(d.education)
                      ? d.education
                      : [];
                    const interests = Array.isArray(d.interests)
                      ? d.interests
                      : [];

                    return (
                      <>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900 mb-3 border-b pb-2">
                          <BookOpen size={20} className="text-teal-600" />
                          Biography
                        </h3>
                        <p className="text-slate-700 text-sm leading-relaxed mb-8">
                          {bio}
                        </p>

                        <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900 mb-3 border-b pb-2">
                          <GraduationCap size={20} className="text-teal-600" />
                          Education &amp; Training
                        </h3>
                        {education.length ? (
                          <ul className="space-y-3 mb-8">
                            {education.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-slate-700 text-sm group"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-500 text-sm mb-8">
                            No education information available.
                          </p>
                        )}

                        <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900 mb-3 border-b pb-2">
                          <Heart size={20} className="text-teal-600" />
                          Interests &amp; Hobbies
                        </h3>
                        {interests.length ? (
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
                        ) : (
                          <p className="text-slate-500 text-sm">
                            No interests listed.
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="h-[650px] w-full flex flex-col items-center justify-center text-center p-8 bg-white/30 rounded-3xl border-2 border-dashed border-blue-900/20">
                <MousePointerClick
                  size={48}
                  className="text-teal-600 mb-4 animate-bounce"
                />
                <h3 className="text-2xl font-bold text-blue-900">
                  Meet Our Experts
                </h3>
                <p className="text-slate-600">
                  Select a provider to view their profile.
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
                : provider.name.includes("Mhaskar")
                ? "center 50%"
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

  const education = details.education || [];
  const interests = details.interests || [];
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
        className="bg-white/95 w-[90%] md:w-[80%] lg:w-full max-w-5xl h-auto max-h-[90vh] lg:h-[700px] rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden relative border border-white/50"
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
