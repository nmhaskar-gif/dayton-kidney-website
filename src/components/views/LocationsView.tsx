// src/components/views/LocationsView.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LocationItem } from "../../types";
import { MapPin, Phone, Car, Bus } from "lucide-react";

// --- ✅ OFFICES ---
const OFFICE_LOCATIONS: LocationItem[] = [
  {
    id: "off-ket",
    name: "Kettering",
    address: "500 Lincoln Park Blvd, Suite 100",
    city: "Kettering, OH",
    zip: "45429",
    phone: "(937) 293-4181",
    type: "OFFICE",
    lat: 39.69645,
    lng: -84.16,
  },
  {
    id: "off-cen",
    name: "Centerville",
    address: "7700 Washington Village Dr, Suite 230",
    city: "Centerville, OH",
    zip: "45459",
    phone: "(937) 433-0264",
    type: "OFFICE",
    lat: 39.6335,
    lng: -84.1918,
  },
  {
    id: "off-hub",
    name: "Huber Heights",
    address: "7231 Shull Road",
    city: "Huber Heights, OH",
    zip: "45424",
    phone: "(937) 235-2757",
    type: "OFFICE",
    lat: 39.8769,
    lng: -84.1015,
  },
  {
    id: "off-day",
    name: "Dayton (North)",
    address: "455 Turner Road",
    city: "Dayton, OH",
    zip: "45415",
    phone: "(937) 278-4857",
    type: "OFFICE",
    lat: 39.8136,
    lng: -84.2332,
  },
  {
    id: "off-eat",
    name: "Eaton",
    address: "450 Washington Jackson Rd, Suite 101",
    city: "Eaton, OH",
    zip: "45320",
    phone: "(937) 456-1224",
    type: "OFFICE",
    lat: 39.7667,
    lng: -84.6455,
  },
  {
    id: "off-grn",
    name: "Greenville",
    address: "742 Sweitzer Street, Suite A",
    city: "Greenville, OH",
    zip: "45331",
    phone: "(937) 548-1116",
    type: "OFFICE",
    lat: 40.089,
    lng: -84.6358,
  },
];

// --- ✅ ACCESS CENTER ---
const ACCESS_CENTER_DATA: LocationItem = {
  id: "acc-1",
  name: "Vascular Access Center of Dayton",
  address: "2016 Springboro West",
  city: "Dayton, OH",
  zip: "45439",
  phone: "(937) 298-6777",
  type: "ACCESS",
  lat: 39.7126,
  lng: -84.225,
};

// --- ✅ DIALYSIS ---
const DIALYSIS_LOCATIONS: LocationItem[] = [
  {
    id: "dia-davita-huber",
    name: "DaVita Huber Heights Dialysis",
    address: "7769 Old Country Court",
    city: "Huber Heights",
    zip: "45424",
    phone: "(937) 233-1100",
    type: "DIALYSIS",
    lat: 39.868108,
    lng: -84.141457,
  },
  {
    id: "dia-fkc-north",
    name: "Fresenius Kidney Care Dayton Regional Dialysis North",
    address: "7211 Shull Rd",
    city: "Huber Heights",
    zip: "45424",
    phone: "(937) 235-5550",
    type: "DIALYSIS",
    lat: 39.876738,
    lng: -84.100826,
  },
  {
    id: "dia-fkc-centerville",
    name: "Fresenius Kidney Care Centerville Home",
    address: "7700 Washington Village Dr STE 110",
    city: "Dayton",
    zip: "45459",
    phone: "(937) 438-3000",
    type: "DIALYSIS",
    lat: 39.633038,
    lng: -84.191623,
  },
  {
    id: "dia-davita-north",
    name: "DaVita Dayton North Dialysis",
    address: "455 Turner Rd",
    city: "Dayton",
    zip: "45415",
    phone: "(937) 276-2300",
    type: "DIALYSIS",
    lat: 39.813896,
    lng: -84.23341,
  },
  {
    id: "dia-davita-fiverivers",
    name: "DaVita Five Rivers Dialysis",
    address: "4750 N Main St",
    city: "Dayton",
    zip: "45405",
    phone: "(937) 279-0522",
    type: "DIALYSIS",
    lat: 39.811208,
    lng: -84.225492,
  },
  {
    id: "dia-davita-mallory",
    name: "DaVita Mallory Park Dialysis",
    address: "2808 Germantown St",
    city: "Dayton",
    zip: "45417",
    phone: "(937) 263-2200",
    type: "DIALYSIS",
    lat: 39.738235,
    lng: -84.240274,
  },
  {
    id: "dia-davita-wright",
    name: "DaVita Wright Field Dialysis",
    address: "1431 Business Center Ct",
    city: "Dayton",
    zip: "45410",
    phone: "(937) 256-1100",
    type: "DIALYSIS",
    lat: 39.745925,
    lng: -84.129749,
  },
  {
    id: "dia-fkc-east",
    name: "Fresenius Kidney Care Dayton East",
    address: "821 S Edwin C Moses Blvd",
    city: "Dayton",
    zip: "45417",
    phone: "(937) 222-3800",
    type: "DIALYSIS",
    lat: 39.745708,
    lng: -84.19658,
  },
  {
    id: "dia-davita-eaton",
    name: "DaVita Eaton Dialysis",
    address: "105 E Washington Jackson Rd",
    city: "Eaton",
    zip: "45320",
    phone: "(937) 456-1122",
    type: "DIALYSIS",
    lat: 39.766119,
    lng: -84.634791,
  },
  {
    id: "dia-fkc-preble",
    name: "Fresenius Kidney Care Preble County",
    address: "450D Washington Jackson Rd",
    city: "Eaton",
    zip: "45320",
    phone: "(937) 456-2500",
    type: "DIALYSIS",
    lat: 39.766837,
    lng: -84.646053,
  },
  {
    id: "dia-davita-fairborn",
    name: "DaVita Fairborn Dialysis",
    address: "3070 Presidential Dr Ste A",
    city: "Fairborn",
    zip: "45324",
    phone: "(937) 429-5000",
    type: "DIALYSIS",
    lat: 39.775743,
    lng: -84.0649,
  },
  {
    id: "dia-davita-greenville",
    name: "DaVita Darke County Dialysis",
    address: "1111 Sweitzer St APT B",
    city: "Greenville",
    zip: "45331",
    phone: "(937) 548-1155",
    type: "DIALYSIS",
    lat: 40.084341,
    lng: -84.633549,
  },
  {
    id: "dia-davita-buckeye",
    name: "DaVita Buckeye Dialysis",
    address: "3050 S Dixie Dr",
    city: "Kettering",
    zip: "45409",
    phone: "(937) 293-1100",
    type: "DIALYSIS",
    lat: 39.70705,
    lng: -84.200717,
  },
  {
    id: "dia-davita-home-south",
    name: "DaVita Home Dialysis Of Dayton-south",
    address: "3030 S Dixie Dr",
    city: "Kettering",
    zip: "45409",
    phone: "(937) 293-2200",
    type: "DIALYSIS",
    lat: 39.707177,
    lng: -84.200792,
  },
  {
    id: "dia-davita-kettering",
    name: "DaVita Kettering Dialysis",
    address: "5721 Bigger Rd",
    city: "Kettering",
    zip: "45440",
    phone: "(937) 434-1100",
    type: "DIALYSIS",
    lat: 39.660603,
    lng: -84.12863,
  },
  {
    id: "dia-davita-miamisburg",
    name: "DaVita Miamisburg Dialysis",
    address: "290 Miamisburg-Alexandersville Rd",
    city: "Miamisburg",
    zip: "45342",
    phone: "(937) 866-5000",
    type: "DIALYSIS",
    lat: 39.637671,
    lng: -84.243385,
  },
  {
    id: "dia-davita-trotwood",
    name: "DaVita Trotwood Dialysis",
    address: "5680 Salem Bend Dr",
    city: "Trotwood",
    zip: "45426",
    phone: "(937) 837-5500",
    type: "DIALYSIS",
    lat: 39.827498,
    lng: -84.292104,
  },
  {
    id: "dia-fkc-west",
    name: "Fresenius Kidney Care West Dayton",
    address: "4100 Salem Ave",
    city: "Trotwood",
    zip: "45416",
    phone: "(937) 275-8000",
    type: "DIALYSIS",
    lat: 39.804316,
    lng: -84.256516,
  },
];

type TabType = "OFFICES" | "DIALYSIS" | "ACCESS";
type MobilePane = "LIST" | "MAP";

const sortByZipDesc = (items: LocationItem[]) =>
  [...items].sort((a, b) => {
    const az = parseInt(String(a.zip).replace(/\D/g, ""), 10) || 0;
    const bz = parseInt(String(b.zip).replace(/\D/g, ""), 10) || 0;
    if (az !== bz) return bz - az;
    return a.name.localeCompare(b.name);
  });

const LocationsFinal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("OFFICES");
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(
    OFFICE_LOCATIONS[0]
  );
  const [isMapReady, setIsMapReady] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>("LIST");

  const [mapEl, setMapEl] = useState<HTMLDivElement | null>(null);

  // Leaflet refs
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapHostElRef = useRef<HTMLDivElement | null>(null);

  const listData = useMemo(() => {
    return activeTab === "OFFICES"
      ? OFFICE_LOCATIONS
      : activeTab === "DIALYSIS"
      ? sortByZipDesc(DIALYSIS_LOCATIONS)
      : [ACCESS_CENTER_DATA];
  }, [activeTab]);

  const firstValidLocation = useMemo(() => {
    const first = listData.find(
      (l) =>
        Number.isFinite(Number((l as any).lat)) &&
        Number.isFinite(Number((l as any).lng))
    );
    return first || null;
  }, [listData]);

  // Reset selection on tab change
  useEffect(() => {
    if (firstValidLocation) setSelectedLocation(firstValidLocation);
    else setSelectedLocation(null);
    setMobilePane("LIST");
  }, [firstValidLocation]);

  // Leaflet Load Check
  useEffect(() => {
    const timer = window.setInterval(() => {
      if ((window as any).L) {
        setIsMapReady(true);
        window.clearInterval(timer);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, []);

  // ✅ Build (or rebuild) the map
  useEffect(() => {
    if (!isMapReady) return;
    if (!mapEl) return;

    if (mapInstanceRef.current) {
      // If map is already attached to this element, just resize and return
      if (mapHostElRef.current === mapEl) {
        mapInstanceRef.current.invalidateSize();
        return;
      }
      // If attached to a different element (mobile/desktop switch), destroy it
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    }

    const L = (window as any).L;

    const startLat = Number((firstValidLocation as any)?.lat);
    const startLng = Number((firstValidLocation as any)?.lng);
    const safeLat = Number.isFinite(startLat) ? startLat : 39.75;
    const safeLng = Number.isFinite(startLng) ? startLng : -84.19;

    const map = L.map(mapEl, {
      zoomControl: false,
      attributionControl: false,
    }).setView([safeLat, safeLng], 13);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 20 }
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapInstanceRef.current = map;
    mapHostElRef.current = mapEl;

    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [isMapReady, mapEl, firstValidLocation]);

  // ✅ Handle markers & flyTo
  // ADDED 'mapEl' dependency to ensure this runs after map re-mounts
  useEffect(() => {
    if (!isMapReady) return;
    const map = mapInstanceRef.current;
    if (!map) return;

    const loc = selectedLocation ?? firstValidLocation;
    if (!loc) return;

    const lat = Number((loc as any).lat);
    const lng = Number((loc as any).lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const L = (window as any).L;

    map.invalidateSize();

    try {
      map.flyTo([lat, lng], 15, { duration: 1.2 });
    } catch {
      map.setView([lat, lng], 15);
    }

    const customIcon = L.divIcon({
      className: "custom-pin",
      html: `<div style="
        background-color:#0d9488;width:32px;height:32px;
        border-radius:50% 50% 50% 0;border:3px solid white;
        box-shadow:0 4px 10px rgba(0,0,0,0.4);
        transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;
      "><div style="width:10px;height:10px;background-color:white;border-radius:50%;"></div></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -36],
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.setIcon(customIcon);
      // Ensure marker is on the map
      if (!map.hasLayer(markerRef.current)) {
        markerRef.current.addTo(map);
      }
    } else {
      markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    }

    const popupContent = `
      <div style="font-family:sans-serif;text-align:center;padding:5px;">
        <strong style="color:#1e3a8a;font-size:14px;">${loc.name}</strong><br/>
        <span style="font-size:12px;color:#64748b;">${loc.address}</span>
      </div>
    `;
    markerRef.current.bindPopup(popupContent).openPopup();
  }, [selectedLocation, firstValidLocation, isMapReady, mobilePane, mapEl]); // <--- FIXED: Added mapEl

  const getDirectionsUrl = (mode: "driving" | "transit") => {
    const loc = selectedLocation ?? firstValidLocation;
    const lat = Number((loc as any)?.lat);
    const lng = Number((loc as any)?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "#";
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${mode}`;
  };

  const activeLoc = selectedLocation ?? firstValidLocation;

  return (
    <div className="w-full h-full overflow-hidden flex flex-col pt-32 px-4 md:px-12 lg:px-20 animate-fade-in">
      <style>
        {`
          .leaflet-pane img,
          .leaflet-tile,
          .leaflet-marker-icon,
          .leaflet-marker-shadow {
            max-width: none !important;
            max-height: none !important;
            width: auto;
            height: auto;
          }
        `}
      </style>

      <div className="flex-shrink-0 mb-6">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-6">
          Find Care Near You
        </h2>

        <div className="inline-flex bg-white/50 backdrop-blur-md rounded-full p-1 border border-white/40 shadow-sm">
          {(["OFFICES", "DIALYSIS", "ACCESS"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-blue-900 text-white shadow-md"
                  : "text-blue-900 hover:bg-white/50"
              }`}
            >
              {tab === "OFFICES"
                ? "Office Locations"
                : tab === "DIALYSIS"
                ? "Dialysis Units"
                : "Access Center"}
            </button>
          ))}
        </div>

        {/* Mobile-only List/Map toggle */}
        <div className="lg:hidden mt-4">
          <div className="w-full max-w-md mx-auto bg-white/50 backdrop-blur-md rounded-full p-1 border border-white/40 shadow-sm flex">
            <button
              type="button"
              onClick={() => setMobilePane("LIST")}
              className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                mobilePane === "LIST"
                  ? "bg-blue-900 text-white shadow-md"
                  : "text-blue-900"
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setMobilePane("MAP")}
              className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                mobilePane === "MAP"
                  ? "bg-blue-900 text-white shadow-md"
                  : "text-blue-900"
              }`}
            >
              Map
            </button>
          </div>
        </div>
      </div>

      {/* ====== Layout wrapper ====== */}
      <div className="flex-grow overflow-hidden pb-8 relative">
        {/* MOBILE LAYOUT */}
        <div className="lg:hidden h-full relative">
          {/* List View */}
          {mobilePane === "LIST" && (
            <div className="h-full overflow-y-auto custom-scrollbar pr-2 space-y-4">
              {listData.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setMobilePane("MAP");
                  }}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer group ${
                    activeLoc?.id === loc.id
                      ? "bg-yellow-100 border-teal-500 shadow-lg scale-[1.02]"
                      : "bg-white/80 backdrop-blur-md border-white/50 hover:bg-white/80 hover:border-blue-200"
                  }`}
                >
                  <h3 className="text-lg font-bold mb-2 text-blue-900">
                    {loc.name}
                  </h3>
                  <div className="space-y-2 text-slate-600 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin
                        size={16}
                        className="mt-0.5 flex-shrink-0 text-slate-400"
                      />
                      <span>
                        {loc.address}
                        <br />
                        {loc.city} {loc.zip}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone
                        size={16}
                        className="flex-shrink-0 text-slate-400"
                      />
                      <span>{loc.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Map View */}
          {mobilePane === "MAP" && (
            <div className="h-full bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 relative flex flex-col">
              <div
                ref={setMapEl}
                className="flex-1 min-h-[360px] relative bg-slate-100 z-0"
              >
                {!isMapReady && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                    Loading Map...
                  </div>
                )}
              </div>

              <div className="bg-white/90 backdrop-blur-md p-4 border-t border-gray-100 flex flex-col gap-3 z-10 relative shadow-lg">
                <div>
                  <h4 className="font-bold text-blue-900 text-lg">
                    {activeLoc?.name}
                  </h4>
                  <p className="text-slate-500 text-sm">
                    {activeLoc?.address}, {activeLoc?.city}
                  </p>
                </div>

                <div className="flex gap-3 w-full">
                  <a
                    href={getDirectionsUrl("driving")}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-full font-bold text-sm hover:bg-blue-800 transition-colors shadow-lg"
                  >
                    <Car size={16} /> Directions
                  </a>
                  <a
                    href={getDirectionsUrl("transit")}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-100 text-teal-800 rounded-full font-bold text-sm hover:bg-teal-200 transition-colors shadow-sm"
                  >
                    <Bus size={16} /> Transit
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setMobilePane("LIST")}
                  className="w-full mt-1 text-sm font-bold text-blue-900/80 hover:text-blue-900"
                >
                  Back to list
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP (lg+): split view */}
        <div className="hidden lg:flex flex-row gap-8 h-full overflow-hidden">
          <div className="w-full lg:w-1/3 overflow-y-auto custom-scrollbar pr-2 space-y-4 h-full">
            {listData.map((loc) => (
              <div
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer group ${
                  activeLoc?.id === loc.id
                    ? "bg-yellow-100 border-teal-500 shadow-lg scale-[1.02]"
                    : "bg-white/80 backdrop-blur-md border-white/50 hover:bg-white/80 hover:border-blue-200"
                }`}
              >
                <h3 className="text-lg font-bold mb-2 text-blue-900">
                  {loc.name}
                </h3>
                <div className="space-y-2 text-slate-600 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-slate-400"
                    />
                    <span>
                      {loc.address}
                      <br />
                      {loc.city} {loc.zip}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="flex-shrink-0 text-slate-400" />
                    <span>{loc.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-2/3 bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 relative flex flex-col">
            <div
              ref={setMapEl}
              className="flex-1 min-h-[520px] relative bg-slate-100 z-0"
            >
              {!isMapReady && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                  Loading Map...
                </div>
              )}
            </div>

            <div className="bg-white/90 backdrop-blur-md p-4 md:p-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 z-10 relative shadow-lg">
              <div>
                <h4 className="font-bold text-blue-900 text-lg">
                  {activeLoc?.name}
                </h4>
                <p className="text-slate-500 text-sm">
                  {activeLoc?.address}, {activeLoc?.city}
                </p>
              </div>

              <div className="flex gap-3">
                <a
                  href={getDirectionsUrl("driving")}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-full font-bold text-sm hover:bg-blue-800 transition-colors shadow-lg"
                >
                  <Car size={16} /> Get Directions
                </a>
                <a
                  href={getDirectionsUrl("transit")}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-teal-100 text-teal-800 rounded-full font-bold text-sm hover:bg-teal-200 transition-colors shadow-sm"
                >
                  <Bus size={16} /> Transit
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationsFinal;
