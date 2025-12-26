import {
  Stethoscope,
  MapPin,
  Users,
  FileText,
  Phone,
  Calendar,
} from "lucide-react";
import {
  SatelliteItem,
  Provider,
  FAQItem,
  PodcastItem,
  FormItem,
  LocationItem,
} from "./types";

// ==============================
// API CONFIGURATION (Frontend)
// ==============================

export const NEPHRO_AI_API_URL =
  "https://nephro-chat-server.onrender.com/api/nephro-chat";

// Z-Axis positions for our journey elements
export const SCROLL_HEIGHT = 12000; // Total scrollable height in px
export const DEPTH_SCALE = 1; // Multiplier for scroll-to-z mapping

export const POSITIONS = {
  START_TEXT: -500,
  SIGN_1: -2500, // Renal Physicians
  SIGN_2: -4500, // Nephrology Associates
  FINALE: -6500, // Skyline
};

export const VIEWPORT_SETTINGS = {
  perspective: 1000,
  fogDensity: 0.0005,
};

export const RADIUS_DESKTOP = 220;
export const RADIUS_MOBILE = 140;

export const SATELLITES: SatelliteItem[] = [
  { id: "1", label: "Physicians", angle: 270, icon: Stethoscope },
  { id: "2", label: "Locations", angle: 330, icon: MapPin },
  { id: "3", label: "Services", angle: 30, icon: Users },
  { id: "4", label: "Portal", angle: 90, icon: FileText },
  { id: "5", label: "Contact", angle: 150, icon: Phone },
  { id: "6", label: "Appointments", angle: 210, icon: Calendar },
];

export const ASSETS = {
  // High-Res Skyline
  skyline: "/images/dayton-skyline.jpg",
  // New logo URL from request
  logo: "/images/DK-Logo.png",
  // Updated Renal Physicians logo
  renalLogo: "/images/RPI-Logo.png",
  nephrologyLogo: "NAOD Logo.jpg",
};

// --- NEW DATA ---

export const PROVIDERS_DATA: Provider[] = [
  // --- PHYSICIANS (Sorted Alphabetically by Last Name) ---
  {
    id: "md-ammula",
    name: "Dr. Ashok Ammula",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology", "Hypertension"],
    imageUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-eduafo",
    name: "Dr. Augustus Eduafo",
    title: "MD",
    role: "MD",
    specialties: ["Transplant Nephrology", "CKD Management"],
    imageUrl:
      "https://images.unsplash.com/photo-1537368910025-bc005fbed16a?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-eze",
    name: "Dr. Chukwuma Eze",
    title: "MD",
    role: "MD",
    specialties: ["Interventional Nephrology", "Vascular Access"],
    imageUrl:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-jackson",
    name: "Dr. Jennifer Jackson",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-kaufhold",
    name: "Dr. Jeffrey Kaufhold",
    title: "DO",
    role: "MD",
    specialties: ["General Nephrology", "Hypertension"],
    imageUrl:
      "https://images.unsplash.com/photo-1582750433449-d22b1c74cafb?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-lane",
    name: "Dr. Jacob Lane",
    title: "DO",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl:
      "https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-maroz",
    name: "Dr. Natallia Maroz",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology", "Dialysis"],
    imageUrl:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-mhaskar",
    name: "Dr. Nilesh Mhaskar",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl:
      "https://i.ibb.co/GYXKDCb/Gemini-Generated-Image-al4uehal4uehal4u.png",
    imagePosition: "center 60%",
  },
  {
    id: "md-mirza",
    name: "Dr. Khurram Mirza",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-odunsi",
    name: "Dr. Adedayo Odunsi",
    title: "MD",
    role: "MD",
    specialties: ["Interventional Nephrology", "Access Care"],
    imageUrl:
      "https://images.unsplash.com/photo-1576670158645-bcc5a5675aca?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-oo",
    name: "Dr. Swe Win Hut Oo",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl:
      "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-oxman",
    name: "Dr. Mark Oxman",
    title: "DO",
    role: "MD",
    specialties: ["General Nephrology", "Senior Partner"],
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-patel",
    name: "Dr. Shashikant Patel",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl:
      "https://images.unsplash.com/photo-1537368910025-bc005fbed16a?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-rohlfs",
    name: "Dr. Katrina Rohlfs",
    title: "DO",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl:
      "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-salupo",
    name: "Dr. Nicholas Salupo",
    title: "DO",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl:
      "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-schnell",
    name: "Dr. Melissa Schnell",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "md-thiruveedi",
    name: "Dr. Sampath Thiruveedi",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
  },

  // --- APPs ---
  {
    id: "app-bassaw",
    name: "Esther Bassaw",
    title: "CNP",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl:
      "https://images.unsplash.com/photo-1608151970635-f09c7379204c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "app-bindu",
    name: "Sajay Bindu",
    title: "CNP",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl:
      "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "app-langley",
    name: "Stephen Langley",
    title: "CNP",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "app-pavlica",
    name: "Elizabeth Pavlica",
    title: "PA",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "app-simpson",
    name: "Kathrine Simpson",
    title: "PA",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "app-treadwell",
    name: "Jayla Treadwell",
    title: "PA",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "app-vincent",
    name: "Christen Vincent",
    title: "CNP",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl:
      "https://images.unsplash.com/photo-1590611936737-832450ed8122?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "app-wenzke",
    name: "Gillian Wenzke",
    title: "CNP",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl:
      "https://images.unsplash.com/photo-1582750433449-d22b1c74cafb?auto=format&fit=crop&q=80&w=400",
  },

  // --- MANAGEMENT ---
  {
    id: "mgmt-pouliot",
    name: "Lisa Pouliot",
    title: "Practice Administrator",
    role: "MGMT",
    specialties: ["Administration"],
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "mgmt-ary",
    name: "Rachel Ary",
    title: "Practice Manager",
    role: "MGMT",
    specialties: ["Operations"],
    imageUrl: "/images/rachel-ary.png",
    imagePosition: "center 40%",
  },
  {
    id: "mgmt-combs",
    name: "Jill Combs",
    title: "Practice Manager",
    role: "MGMT",
    specialties: ["Operations"],
    imageUrl: "/images/jill-combs.png",
    imagePosition: "center 40%",
  },
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: "What is a Nephrologist?",
    answer:
      "A nephrologist is a medical doctor who specializes in the diagnosis and treatment of kidney conditions. They are experts in how the kidneys function and how kidney disease affects the rest of the body.",
  },
  {
    question: "Nephrology vs. Urology: What's the difference?",
    answer:
      "Nephrologists focus on the function of the kidneys and treating diseases like CKD, hypertension, and electrolyte imbalances using medicine and dialysis. Urologists are surgeons who treat structural issues of the urinary tract, such as kidney stones, bladder issues, and prostate problems.",
  },
  {
    question: "What do the kidneys do?",
    answer:
      "Your kidneys are powerful chemical factories that perform the following functions: remove waste products from the body, remove drugs from the body, balance the body's fluids, release hormones that regulate blood pressure, produce an active form of vitamin D that promotes strong, healthy bones, and control the production of red blood cells.",
  },
];

export const PODCAST_DATA: PodcastItem[] = [
  {
    title: "An Overview of Chronic Kidney Disease",
    duration: "14:43",
    description:
      "A general overview of what kidneys do and what chronic kidney disease is.",
    url: "/podcasts/Chronic_Kidney_Disease_Overview.mp3",
  },
  {
    title: "Demystifying Diets for CKD",
    duration: "6:09", // Set actual duration
    description:
      "A general overview of food and diets for people with chronic kidney disease not on dialysis",
    url: "https://youtu.be/-0Ibyw2PcE8", // Paste your Unlisted YouTube link
  },
  {
    title: "Hemodialysis and Peritoneal Dialysis",
    duration: "6:09",
    description: "A general overview of hemodialysis vs peritoneal dialysis",
    url: "https://tinyurl.com/dialysiseducation",
  },
  {
    title: "What Should I Eat?",
    duration: "18:45",
    description:
      "A discussion about diet in chronic kidney disease not on dialysis.",
    url: "https://res.cloudinary.com/dsajzdzge/video/upload/v1766196118/CKD_Nutrition_Protein_Sodium_and_Phosphorus_1_bihoru.mp3",
  },
  {
    title: "The Science of Kidney Stones",
    duration: "12:10",
    description: "Understanding Kidney Stones",
    url: "https://res.cloudinary.com/dsajzdzge/video/upload/v1766196797/The_Science_of_Stopping_Kidney_Stones_ao6jj4.mp4",
  },
];

export const FORMS_DATA: FormItem[] = [
  { title: "New Patient Packet", fileSize: "2.4 MB", type: "PDF" },
  { title: "Medical History Form", fileSize: "1.1 MB", type: "PDF" },
  {
    title: "Authorization for Release of Records",
    fileSize: "0.5 MB",
    type: "PDF",
  },
  { title: "Privacy Policy (HIPAA)", fileSize: "0.8 MB", type: "PDF" },
  { title: "Financial Policy", fileSize: "0.4 MB", type: "PDF" },
];

export const OFFICES_DATA: LocationItem[] = [
  {
    id: "off-1",
    name: "Kettering",
    address: "500 Lincoln Park Blvd, Suite 100",
    city: "Kettering, OH",
    zip: "45429",
    phone: "(937) 555-0100",
    type: "OFFICE",
    lat: 39.6923,
    lng: -84.1706,
  },
  {
    id: "off-2",
    name: "Centerville",
    address: "7700 Washington Village Dr, Suite 230",
    city: "Centerville, OH",
    zip: "45459",
    phone: "(937) 555-0102",
    type: "OFFICE",
    lat: 39.6285,
    lng: -84.1593,
  },
  {
    id: "off-3",
    name: "Huber Heights",
    address: "7231 Shull Road",
    city: "Huber Heights, OH",
    zip: "45424",
    phone: "(937) 555-0103",
    type: "OFFICE",
    lat: 39.8596,
    lng: -84.1163,
  },
  {
    id: "off-4",
    name: "Dayton",
    address: "455 Turner Road",
    city: "Dayton, OH",
    zip: "45415",
    phone: "(937) 555-0104",
    type: "OFFICE",
    lat: 39.8166,
    lng: -84.2259,
  },
  {
    id: "off-5",
    name: "Eaton",
    address: "450 Washington Jackson Rd",
    city: "Eaton, OH",
    zip: "45420",
    phone: "(937) 555-0105",
    type: "OFFICE",
    lat: 39.7366,
    lng: -84.6226,
  },
  {
    id: "off-6",
    name: "Greenville",
    address: "742 Sweitzer Street, Suite A",
    city: "Greenville, OH",
    zip: "45331",
    phone: "(937) 555-0106",
    type: "OFFICE",
    lat: 40.0984,
    lng: -84.6369,
  },
];

export const DIALYSIS_LOCATIONS: LocationItem[] = [
  // Sorted Alphabetically by City, then Name to prevent preference

  // Centerville / South Dayton
  {
    id: "dia-fkc-centerville",
    name: "Fresenius Kidney Care Centerville Home",
    address: "7700 Washington Village Dr STE 110",
    city: "Dayton",
    zip: "45459",
    phone: "(937) 438-3000",
    type: "DIALYSIS",
    lat: 39.628,
    lng: -84.16,
  },
  {
    id: "dia-fkc-south",
    name: "Fresenius Kidney Care Dayton Regional Dialysis South",
    address: "7700 Washington Village Dr STE 100",
    city: "Dayton",
    zip: "45459",
    phone: "(937) 433-2555",
    type: "DIALYSIS",
    lat: 39.629,
    lng: -84.159,
  },

  // Dayton (Proper)
  {
    id: "dia-davita-north",
    name: "DaVita Dayton North Dialysis",
    address: "455 Turner Rd",
    city: "Dayton",
    zip: "45415",
    phone: "(937) 276-2300",
    type: "DIALYSIS",
    lat: 39.8166,
    lng: -84.2259,
  },
  {
    id: "dia-davita-fiverivers",
    name: "DaVita Five Rivers Dialysis",
    address: "4750 N Main St",
    city: "Dayton",
    zip: "45405",
    phone: "(937) 279-0522",
    type: "DIALYSIS",
    lat: 39.805,
    lng: -84.205,
  },
  {
    id: "dia-davita-mallory",
    name: "DaVita Mallory Park Dialysis",
    address: "2808 Germantown St",
    city: "Dayton",
    zip: "45417",
    phone: "(937) 263-2200",
    type: "DIALYSIS",
    lat: 39.742,
    lng: -84.235,
  },
  {
    id: "dia-davita-wright",
    name: "DaVita Wright Field Dialysis",
    address: "1431 Business Center Ct",
    city: "Dayton",
    zip: "45410",
    phone: "(937) 256-1100",
    type: "DIALYSIS",
    lat: 39.735,
    lng: -84.145,
  },
  {
    id: "dia-fkc-east",
    name: "Fresenius Kidney Care Dayton East",
    address: "821 S Edwin C Moses Blvd",
    city: "Dayton",
    zip: "45417",
    phone: "(937) 222-3800",
    type: "DIALYSIS",
    lat: 39.748,
    lng: -84.195,
  },

  // Eaton
  {
    id: "dia-davita-eaton",
    name: "DaVita Eaton Dialysis",
    address: "105 E Washington Jackson Rd",
    city: "Eaton",
    zip: "45320",
    phone: "(937) 456-1122",
    type: "DIALYSIS",
    lat: 39.745,
    lng: -84.63,
  },
  {
    id: "dia-fkc-preble",
    name: "Fresenius Kidney Care Preble County",
    address: "450D Washington Jackson Rd",
    city: "Eaton",
    zip: "45320",
    phone: "(937) 456-2500",
    type: "DIALYSIS",
    lat: 39.736,
    lng: -84.622,
  },

  // Fairborn
  {
    id: "dia-davita-fairborn",
    name: "DaVita Fairborn Dialysis",
    address: "3070 Presidential Dr Ste A",
    city: "Fairborn",
    zip: "45324",
    phone: "(937) 429-5000",
    type: "DIALYSIS",
    lat: 39.79,
    lng: -84.055,
  },

  // Greenville
  {
    id: "dia-davita-greenville",
    name: "DaVita Darke County Dialysis",
    address: "1111 Sweitzer St APT B",
    city: "Greenville",
    zip: "45331",
    phone: "(937) 548-1155",
    type: "DIALYSIS",
    lat: 40.098,
    lng: -84.64,
  },

  // Huber Heights
  {
    id: "dia-davita-huber",
    name: "DaVita Huber Heights Dialysis",
    address: "7769 Old Country Court",
    city: "Huber Heights",
    zip: "45424",
    phone: "(937) 233-1100",
    type: "DIALYSIS",
    lat: 39.865,
    lng: -84.11,
  },
  {
    id: "dia-fkc-north",
    name: "Fresenius Kidney Care Dayton Regional Dialysis North",
    address: "7211 Shull Rd",
    city: "Huber Heights",
    zip: "45424",
    phone: "(937) 235-5550",
    type: "DIALYSIS",
    lat: 39.86,
    lng: -84.12,
  },

  // Kettering
  {
    id: "dia-davita-buckeye",
    name: "DaVita Buckeye Dialysis",
    address: "3050 S Dixie Dr",
    city: "Kettering",
    zip: "45409",
    phone: "(937) 293-1100",
    type: "DIALYSIS",
    lat: 39.705,
    lng: -84.195,
  },
  {
    id: "dia-davita-home-south",
    name: "DaVita Home Dialysis Of Dayton-south",
    address: "3030 S Dixie Dr",
    city: "Kettering",
    zip: "45409",
    phone: "(937) 293-2200",
    type: "DIALYSIS",
    lat: 39.706,
    lng: -84.195,
  },
  {
    id: "dia-davita-kettering",
    name: "DaVita Kettering Dialysis",
    address: "5721 Bigger Rd",
    city: "Kettering",
    zip: "45440",
    phone: "(937) 434-1100",
    type: "DIALYSIS",
    lat: 39.66,
    lng: -84.125,
  },

  // Miamisburg
  {
    id: "dia-davita-miamisburg",
    name: "DaVita Miamisburg Dialysis",
    address: "290 Miamisburg-Alexandersville Rd",
    city: "Miamisburg",
    zip: "45342",
    phone: "(937) 866-5000",
    type: "DIALYSIS",
    lat: 39.635,
    lng: -84.235,
  },

  // Trotwood
  {
    id: "dia-davita-trotwood",
    name: "DaVita Trotwood Dialysis",
    address: "5680 Salem Bend Dr",
    city: "Trotwood",
    zip: "45426",
    phone: "(937) 837-5500",
    type: "DIALYSIS",
    lat: 39.825,
    lng: -84.28,
  },
  {
    id: "dia-fkc-west",
    name: "Fresenius Kidney Care West Dayton",
    address: "4100 Salem Ave",
    city: "Trotwood",
    zip: "45416",
    phone: "(937) 275-8000",
    type: "DIALYSIS",
    lat: 39.805,
    lng: -84.255,
  },
];

export const ACCESS_CENTER_DATA: LocationItem = {
  id: "acc-1",
  name: "Azura Vascular Care Greater Dayton",
  address: "3020 Governor's Place Blvd",
  city: "Dayton",
  zip: "45409",
  phone: "(937) 293-7070",
  type: "ACCESS",
  lat: 39.7224,
  lng: -84.195,
};
