// src/components/V1RevealOverlay.tsx
import React, { useEffect, useState } from "react";
import { ViewState } from "../types";
import { ASSETS } from "../constants";
import { Phone, Menu, X, Download } from "lucide-react";

import HomeView from "./views/HomeView";
import AboutView from "./views/AboutView";
import ProvidersView from "./views/ProvidersView";
import EducationView from "./views/EducationView";
import LocationsView from "./views/LocationsView";
import FormsView from "./views/FormsView";
import ServicesView from "./views/ServicesView";
import ContactView from "./views/ContactView";

interface V1RevealOverlayProps {
  setView: (view: ViewState) => void; // kept for compatibility (even if not used)
  opacity: number;
  pointerEvents: "none" | "auto";
  isActive: boolean;
}

const V1RevealOverlay: React.FC<V1RevealOverlayProps> = ({
  // setView, // (optional) not used in your current design; keep if you wire it later
  opacity,
  pointerEvents,
  isActive,
}) => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- PRELOAD/DECODE BIG IMAGES USED AT REVEAL TIME (reduces transition stutter) ---
  useEffect(() => {
    const urls = [ASSETS.skyline, ASSETS.logo].filter(Boolean) as string[];
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      // decode hint (supported in many browsers; harmless if not)
      // @ts-ignore
      img.decode?.().catch(() => {});
    });
  }, []);

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col bg-blue-50 overflow-hidden"
      // IMPORTANT: remove the opacity transition here (you drive fade timing from JourneyScene)
      style={{
        opacity,
        pointerEvents,
        willChange: "opacity",
        transform: "translateZ(0)",
      }}
    >
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div
          className={`w-full h-full bg-no-repeat transition-transform duration-[20s] ease-linear
            bg-[length:auto_175vh] bg-[position:center_top]
            md:bg-cover md:bg-[position:80%_top]
            ${isActive ? "scale-105" : "scale-100"}`}
          style={{
            backgroundImage: `url('${ASSETS.skyline}')`,
            willChange: "transform",
            transform: isActive
              ? "scale(1.05) translateZ(0)"
              : "scale(1) translateZ(0)",
          }}
        />
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            currentView === ViewState.HOME
              ? "bg-gradient-to-r from-white/20 via-transparent to-transparent"
              : "bg-white/40 backdrop-blur-[1px]"
          }`}
        />
      </div>

      {/* --- NAVBAR --- */}
      <nav
        className={`fixed w-full z-50 top-0 left-0 h-24 transition-all duration-300 ${
          currentView === ViewState.HOME
            ? "bg-transparent"
            : "bg-white/5 backdrop-blur-md border-b border-white/10 shadow-sm"
        }`}
      >
        <div className="w-full px-4 md:px-8 lg:px-12 h-full relative">
          <div className="flex items-center h-full pt-4 gap-3">
            {/* 1. LOGO (Far Left) */}
            <div
              className={`z-50 flex-shrink-0 mr-4 ${
                currentView === ViewState.HOME
                  ? "cursor-default"
                  : "cursor-pointer transition-transform duration-300 hover:scale-105"
              }`}
              onClick={
                currentView === ViewState.HOME
                  ? undefined
                  : () => navigateTo(ViewState.HOME)
              }
            >
              <img
                src={ASSETS.logo}
                alt="Dayton Kidney"
                className="h-20 md:h-28 lg:h-32 w-auto object-contain drop-shadow-[0_2px_6px_rgba(255,255,255,0.8)] filter brightness-105"
                style={{ transform: "translateZ(0)", willChange: "transform" }}
              />
            </div>

            {/* 2. MAIN NAV LINKS */}
            <div className="hidden md:flex flex-1 min-w-0">
              <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
                <div className="flex items-center space-x-1 lg:space-x-2 whitespace-nowrap">
                  <NavButton
                    label="About Us"
                    active={currentView === ViewState.ABOUT}
                    onClick={() => navigateTo(ViewState.ABOUT)}
                  />
                  <NavButton
                    label="Our Services"
                    active={currentView === ViewState.SERVICES}
                    onClick={() => navigateTo(ViewState.SERVICES)}
                  />
                  <NavButton
                    label="Our Providers"
                    active={currentView === ViewState.PROVIDERS}
                    onClick={() => navigateTo(ViewState.PROVIDERS)}
                  />
                  <NavButton
                    label="Locations"
                    active={currentView === ViewState.LOCATIONS}
                    onClick={() => navigateTo(ViewState.LOCATIONS)}
                  />
                  <NavButton
                    label="Education & AI"
                    active={currentView === ViewState.EDUCATION}
                    onClick={() => navigateTo(ViewState.EDUCATION)}
                  />
                </div>
              </div>
            </div>

            {/* 3. ACTION BUTTONS */}
            <div className="hidden md:flex flex-shrink-0 items-center gap-2 ml-auto mr-4 origin-right md:scale-90 lg:scale-100 transition-transform">
              <button
                onClick={() => navigateTo(ViewState.FORMS)}
                className={`px-4 py-2 text-sm font-bold rounded-full transition-all flex items-center gap-2 ${
                  currentView === ViewState.FORMS
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-white/40 text-teal-800 hover:bg-white/80"
                }`}
              >
                <Download size={14} /> Forms
              </button>

              <button
                onClick={() => navigateTo(ViewState.CONTACT)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-lg transform hover:-translate-y-0.5 ${
                  currentView === ViewState.CONTACT
                    ? "bg-blue-800 text-white shadow-inner ring-2 ring-white/50"
                    : "bg-blue-900 text-white hover:bg-blue-800"
                }`}
              >
                <Phone size={14} />
                <span className="hidden xl:inline">Contact Us</span>
                <span className="xl:hidden">Contact</span>
              </button>
            </div>

            {/* Mobile Menu Icon */}
            <div className="flex items-center md:hidden ml-auto">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-blue-900 bg-white/50 rounded-full p-2 hover:text-teal-600 focus:outline-none transition-colors"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div
          className={`md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl absolute w-full top-full left-0 z-40 transition-all duration-300 origin-top ${
            isMobileMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-4 pb-8 space-y-2 mt-2">
            <MobileNavLink
              label="Home"
              onClick={() => navigateTo(ViewState.HOME)}
            />
            <MobileNavLink
              label="About Us"
              onClick={() => navigateTo(ViewState.ABOUT)}
            />
            <MobileNavLink
              label="Our Services"
              onClick={() => navigateTo(ViewState.SERVICES)}
            />
            <MobileNavLink
              label="Our Providers"
              onClick={() => navigateTo(ViewState.PROVIDERS)}
            />
            <MobileNavLink
              label="Locations"
              onClick={() => navigateTo(ViewState.LOCATIONS)}
            />
            <MobileNavLink
              label="Education & AI"
              onClick={() => navigateTo(ViewState.EDUCATION)}
            />
            <MobileNavLink
              label="Patient Forms"
              onClick={() => navigateTo(ViewState.FORMS)}
            />
            <MobileNavLink
              label="Contact Us"
              onClick={() => navigateTo(ViewState.CONTACT)}
            />
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="relative z-10 w-full h-full">
        {currentView === ViewState.HOME && (
          <HomeView
            setView={navigateTo}
            isActive={isActive && currentView === ViewState.HOME}
          />
        )}
        {currentView === ViewState.ABOUT && <AboutView />}
        {currentView === ViewState.SERVICES && <ServicesView />}
        {currentView === ViewState.PROVIDERS && <ProvidersView />}
        {currentView === ViewState.EDUCATION && <EducationView />}
        {currentView === ViewState.LOCATIONS && <LocationsView />}
        {currentView === ViewState.FORMS && <FormsView />}
        {currentView === ViewState.CONTACT && <ContactView />}
      </div>
    </div>
  );
};

const NavButton: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => {
  const baseClasses =
    "px-2 lg:px-3 py-1 text-xs lg:text-sm font-bold rounded-full transition-colors whitespace-nowrap";
  const activeClasses = "bg-blue-900 text-white shadow-md";
  const inactiveClasses = "text-blue-900 bg-white/40 hover:bg-white/80";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      {label}
    </button>
  );
};

const MobileNavLink: React.FC<{ label: string; onClick: () => void }> = ({
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="block w-full text-left px-4 py-3 rounded-lg text-lg font-medium text-gray-800 hover:text-teal-600 hover:bg-gray-50 transition-colors"
  >
    {label}
  </button>
);

export default V1RevealOverlay;
