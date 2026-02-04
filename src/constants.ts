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
export const SCROLL_HEIGHT = 5000; // Total scrollable height in px
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
  skyline: "/images/dayton-skyline.webp",
  // New logo URL from request
  logo: "/images/DK-Logo.png",
  // Updated Renal Physicians logo
  renalLogo: "/images/RPI-Logo.png",
  nephrologyLogo: "/images/NAOD Logo.jpg",
};

// --- NEW DATA ---

export const PROVIDERS_DATA: Provider[] = [
  // --- PHYSICIANS (Sorted Alphabetically by Last Name) ---
  {
    id: "md-ammula",
    name: "Dr. Ashok Ammula",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl: "/images/ashok-ammula.jpeg",
    bio: "Dr. Ammula joined Nephrology Associates of Dayton in July 2008. He is a founding partner of Dayton Kidney. His clinical interests include Home Dialysis, Glomerulonephritis, Hypertension, and Autosomal Polycystic Kidney Disease.",
    education: [
      "Medical School: Osmania Medical College, Hyderabad, India",
      "Residency: St. Luke’s & Roosevelt Medical Center, New York, NY",
      "Fellowship: Boston University Medical Center, Boston, MA",
    ],
    interests: ["Reading Fiction", "Hiking", "Gardening", "Cooking"],
  },
  {
    id: "md-eduafo",
    name: "Dr. Augustus Eduafo",
    title: "MD",
    role: "MD",
    specialties: ["Transplant Nephrology", "CKD Management"],
    imageUrl: "/images/augustus-eduafo.jpg",
    bio: "Dr. Eduafo joined Renal Physicians in 1997. He is a founding partner of Dayton Kidney. He served as Medical Director of the Miami Valley Transplant Program until its closure in 2013. His clinical interests include General Nephrology and Kidney Transplantation.",
    education: [
      "Medical School: University of Ghana Medical School, Accra, Ghana",
      "Residency: Internal Medicine, State University of New York Science Center, Brooklyn, New York",
      "Fellowship: Nephrology and Kidney Transplantation, New York Hospital/Cornell University, New York",
    ],
    interests: ["Reading Fiction", "Hiking", "Gardening", "Cooking"],
  },
  {
    id: "md-eze",
    name: "Dr. Chukwuma Eze",
    title: "MD",
    role: "MD",
    specialties: ["Interventional Nephrology", "Vascular Access"],
    imageUrl: "/images/chukwuma-eze.png",
    imagePosition: "center 40%",
    bio: "Dr. Eze joined Nephrology Associates in 2008. He is a founding member of Dayton Kidney. His clinical interests include interventional nephrology including the placement of peritoneal dialysis catheters.",
  },
  {
    id: "md-jackson",
    name: "Dr. Jennifer Jackson",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl: "/images/jennifer-jackson.jpeg",
    bio: "Dr. Kaufhold joined Nephrology Associates in 2004. She is a founding member of Dayton Kidney. Her clinical interests include all aspects of nephrology especially Chronic Kidney Disease and Cardiorenal Syndrome.",
    education: [
      "Medical School: Ohio University College of Osteopathic Medicine",
      "Residency: Grandview Hospital, Dayton, OH",
      "Fellowship: Grandview Hospital, Dayton, OH ",
    ],
    interests: ["Traveling", "Boating", "Spending Time With Family"],
  },
  {
    id: "md-kaufhold",
    name: "Dr. Jeffrey Kaufhold",
    title: "DO",
    role: "MD",
    specialties: ["General Nephrology", "Hypertension"],
    imageUrl: "/images/jeffrey-kaufhold.png",
    bio: "Dr. Kaufhold joined Nephrology Associates in 1997. He is a founding member of Dayton Kidney. He continues to actively teach, becoming a Master Faculty at Ohio University in 2010. His clinical interests include ethics which he also teaches at Wright State, Ohio University, and Miami University of Ohio",
    education: [
      "Undergraduate: University of Dayton",
      "Medical School: University of Cincinnati Medical School",
      "Residency: Good Samaritan Hospital of Maryland/Johns Hopkins University , Baltimore,",
      "Fellowship: University of Florida, Gainesville, FL ",
    ],
    interests: ["Deputy Coroner for Butler County", "Brewing Beer"],
  },
  {
    id: "md-lane",
    name: "Dr. Jacob Lane",
    title: "DO",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl: "/images/jake-lane.jpg",
    bio: "Dr. Lane joined the practice in August 2025. Dr. Lane will be joining our Vascular Access team as well as Clinical Nephrology. His clinical interests include Chronic Kidney Disease, Home Dialysis, and Dialysis Vascular Access.",
    education: [
      "Undergraduate: Bachelor of Science, Wright State University ",
      "Medical School: West Virginia School of Osteopathic Medicine",
      "Residency: Grandview Medical Center (Kettering Health Dayton)",
      "Fellowship: Medical University of South Carolina",
    ],
    interests: ["Traveling", "Cooking", "Spending time with family"],
  },
  {
    id: "md-maroz",
    name: "Dr. Natallia Maroz",
    title: "MD",
    suffixes: ["FASN", "FACP"],
    role: "MD",
    specialties: ["General Nephrology", "Plasmapheresis"],
    imageUrl: "/images/natallia-maroz.png",
    imagePosition: "center 40%",
    bio: "Dr. Maroz joined Renal Physicians in 2012. She is a founding partner of Dayton Kidney. She is a Specialist in Clinical Hypertension through the American Society of Hypertension. Her clinical interests include Resistant Hypertension, Nephrolithiasis,Peritoneal Dialysis, and Plasmapheresis.",
    education: [
      "Medical School: Belarusian State Medical University",
      "Residency: Good Samaritan Hospital of Maryland/Johns Hopkins University , Baltimore,",
      "Fellowship: University of Florida, Gainesville, FL ",
    ],
    interests: ["Hiking", "Cooking", "Yoga", "Spending Time With Family"],
  },
  {
    id: "md-mhaskar",
    name: "Dr. Nilesh Mhaskar",
    title: "MD",
    suffixes: ["FASN"],
    role: "MD",
    specialties: ["General Nephrology", "Plasmapheresis"],
    imageUrl: "/images/nilesh-mhaskar2.png",
    imagePosition: "center 95%",
    bio: "Dr Mhaskar joined Renal Physicians in 2007 and is a founding partner of Dayton Kidney. He served as the President of Renal Physicians from 2019-2025 and Chairman of Dayton Kidney from 2026-2027. His interests include General Nephrology, Hypertension, and Chronic Dialysis",
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
      "Traveling with my family",
    ],
  },
  {
    id: "md-mirza",
    name: "Dr. Khurram Mirza",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl: "/images/khurram-mirza.jpg",
    bio: "Dr. Mirza joined the practice in 2024. Before coming to Dayton, he was an Instructor in Medicine at Washington University in St Louis where he also did a fellowship in Geriatrics. He was also an Assistant Professor or Medicine at University of Nebraska, Omaha. His clinical interests include geriatric nephrology and kidney transplantation.",
    education: [
      "Medical School: King Edward Medical College, Lahore, Pakistan",
      "Residency: St Luke's Hospital, St Louis, MO",
      "Fellowship: University of Cincinnati",
    ],
    interests: ["Gardening", "Watching his son play soccer"],
  },
  {
    id: "md-odunsi",
    name: "Dr. Adedayo Odunsi",
    title: "MD",
    role: "MD",
    specialties: ["Interventional Nephrology", "Access Care"],
    imageUrl: "/images/adedayo-odunsi.jpg",
    bio: "Dr. Odunsi joined Renal Physicians in 2011. He is a founding partner of Dayton Kidney.",
    education: [
      "Medical School: University of Ibadan, College of Medicine, Ibadan, Nigeria",
      "Residency: Englewood Hospital and Medical Center Program, Englewood, New Jersey",
      "Fellowship: University of Texas Health Science Center at San Antonio, San Antonio, Texas",
    ],
  },
  {
    id: "md-oo",
    name: "Dr. Swe Win Hut Oo",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl: "/images/swe-oo.jpeg",
    education: [
      "Medical School: University of Medicine (1), Yangon, Myanmar",
      "Residency: Easton Hospital, Easton, PA",
      "Fellowship: University of Iowa Hospital and Clinics, IA",
    ],
    interests: ["Hiking", "Cooking", "Traveling", "Spending Time With Family"],
  },
  {
    id: "md-oxman",
    name: "Dr. Mark Oxman",
    title: "DO",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl: "/images/mark-oxman.jpg",
    bio: "Dr. Oxman was a founding member and President of Nephrology Associates since 1990. He is a founding member of Dayton Kidney. He has been recognized for his dedication to education, receiving the Outstanding Faculty Award from the Ohio University College of Osteopathic Medicine.",
    education: [
      "Undergraduate: Dickerson College, Pennsylvania",
      "Medical School: University of Health Sciences, Kansas City, MO",
      "Residency: Grandview Hospital, Dayton OH",
      "Fellowship: Hahnemann University, Philadelphia PA",
    ],
    interests: [
      "Traveling",
      "Hiking",
      "Running",
      "Spending time with family and friends",
    ],
  },
  {
    id: "md-patel",
    name: "Dr. Shashikant Patel",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl: "/images/shashi-patel.jpeg",
    bio: "Dr. Patel joined Nephrology Associates of Dayton in July 2014 but has lived in Dayton since 2007 when he started his Internal Medicine Residency. He is a founding partner of Dayton Kidney. His clinical interests include Glomerular Diseases, Autosomal Dominant Polycystic Kidney Disease, and Acute Kidney Injury.",
    education: [
      "Medical School: BJ Medical College, Ahmedabad, India",
      "Residency: Wright State University, Dayton, OH",
      "Fellowship: The Ohio State University, Columbus OH where he served as Chief fellow and received the Fellow of the Year award during his second year",
    ],
    interests: [
      "Traveling",
      "Hiking",
      "Running",
      "Spending time with family and friends",
    ],
  },
  {
    id: "md-rohlfs",
    name: "Dr. Katrina Rohlfs",
    title: "DO",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl: "/images/katrina-rohlfs1.png",
    bio: "Dr. Katrina Rohlfs joined the practice in September 2024. Dr. Rohlfs focuses on the clinical care of patients with Chronic Kidney Disease, Glomerulonephritis, and Resistant Hypertension.",
    education: [
      "Medical School: American University of the Caribbean",
      "Residency: Campbell School of Medicine, Lillington, NC",
      "Fellowship: Methodist Dallas Medical Center",
    ],
    interests: ["Hiking", "Photography", "Traveling"],
  },
  {
    id: "md-salupo",
    name: "Dr. Nicholas Salupo",
    title: "DO",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl: "/images/nicholas-salupo.jpg",
    bio: "Dr. Nicholas Salupo joined the practice in August 2025. His clinical interests include Glomerulonephritis, Renal Nutrition, and Bioethics.",
    education: [
      "Medical School: Marian University College of Osteopathic Medicine",
      "Residency: Kettering Grandview Medical Center",
      "Fellowship: Cleveland Clinic",
    ],
    interests: ["Hiking", "Gardening", "Cooking"],
  },
  {
    id: "md-schnell",
    name: "Dr. Melissa Schnell",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology", "Plasmapheresis"],
    imageUrl: "/images/melissa-schnell.jpg",
    bio: "Dr. Melissa Schnell joined Renal Physicians in 2005. She is a founding member of Dayton Kidney.",
    education: [
      "Medical School: Wright State University, Dayton, Ohio",
      "Residency: Internal Medicine, University of Cincinnati, Cincinnati, Ohio",
      "Fellowship: University of Cincinnati",
    ],
  },
  {
    id: "md-thiruveedi",
    name: "Dr. Sampath Thiruveedi",
    title: "MD",
    role: "MD",
    specialties: ["General Nephrology"],
    imageUrl: "/images/sampath-thiruveedi2.JPG",
    imagePosition: "center 60%",
    bio: "Dr. Sampath Thiruveedi joined Renal Physicians August 2014. He is a founding member of Dayton Kidney.",
    education: [
      "Medical School: Kempegowda Institute of Medical Sciences, Bangalore, India",
      "Residency: Lankenau Hospital Wynnewood, Pennsylvania",
      "Fellowship: Lankenau Hospital Wynnewood, Pennsylvania",
    ],
  },

  // --- APPs ---
  {
    id: "app-bassaw",
    name: "Esther Bassaw",
    title: "CNP",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl: "/images/esther-bassaw2.jpeg",
    bio: "Esther Bassaw joined the practice in 2021. Her interests include the care of patients with End Stage Kidney Disease.",
    education: [
      "Masters: Family Practice Nurse Practitioner, Otterbein University",
    ],
  },
  {
    id: "app-bindu",
    name: "Bindu Sajay",
    title: "CNP",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl: "",
  },
  {
    id: "app-langley",
    name: "Stephen Langley",
    title: "CNP",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl: "/images/stephen-langley.jpg",
    bio: "Stephen Langley joined the practice in July 2025. Stephen's clinical interests include Management of End Stage Kidney Disease and Inpatient Nephrology Care.",
    education: [
      "Undergraduate: Bachelor of Science in Nursing, Ohio University",
      "Masters: Adult-Gerontological Acute Care Nurse Practitioner, University of Cincinnati",
    ],
    interests: [
      "Spending time with his wife and two sons",
      "Watching Sports",
      "Participating in Outdoor Activities",
    ],
  },
  {
    id: "app-pavlica",
    name: "Elizabeth Pavlica",
    title: "PA",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl: "/images/elizabeth-pavlica2.jpg",
    bio: "Elizabeth Pavlica joined the practice in January 2022. She focuses on End Stage Kidney Disease and its encompassing lifestyle management.",
    education: [
      "Undergraduate: Bachelor of Science, Univery of Toledo",
      "Masters: Master of Physician Assistant Studies, Kettering College",
    ],
    interests: [
      "Hiking",
      "Reading",
      "Spending time with her husband and two dogs",
    ],
  },
  {
    id: "app-simpson",
    name: "Kathrine Simpson",
    title: "PA",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl: "/images/katie-simpson.jpg",
    bio: "Kathrine Simpson joined the practice in July 2020. She focuses on end stage kidney disease and likes working with patients so that they feel knowledgeable about their condition and motivated to stay consistent with their treatments, medications, and lifestyle.",
    education: [
      "Undergraduate: University of Dayton, Bachelor of Science in Biochemistry. ",
      "Masters: Kettering College, Master of Physician Assistant Studies",
    ],
    interests: ["Running", "Painting", "Spending time with friends and family"],
  },
  {
    id: "app-treadwell",
    name: "Jayla Treadwell",
    title: "PA",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl: "/images/jayla-treadwell.jpg",
    bio: "Jayla Treadwell joined the practice in July 2025. Her clinical interests include Chronic Kidney Disease, End Stage Kidney Disease, and Hypertension.",
    education: [
      "Undergraduate: Bachelor in Health Sciences, The Ohio State University ",
      "Masters: Master of Physcian Assistant Studies, University of Dayton",
    ],
    interests: [
      "Working Out",
      "Shopping",
      "Traveling",
      "Spending time with friends and family",
    ],
    imagePosition: "center 60%",
  },
  {
    id: "app-vincent",
    name: "Christen Vincent",
    title: "CNP",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl: "/images/christen-vincent.jpg",
    bio: "Christen Vincent joined the practice in August 2020 initially as a plasmapheresis nurse. She continues this important work now as part of Southwestern Ohio Apheresis Services as well as a nephrology nurse practitioner. Her clinical interests include improving patient outcomes by educating about healthy diet and lifestyle. ",
    education: [
      "Masters: Masters of Science in Nursing, University of Cincinnati",
    ],
    interests: [
      "Volunteering through her Church",
      "Hiking and Biking",
      "Spending time with her husband, three kids and two cats",
    ],
  },
  {
    id: "app-wenzke",
    name: "Gillian Wenzke",
    title: "CNP",
    role: "APP",
    specialties: ["Advanced Practice"],
    imageUrl: "/images/gillian-wenzke.jpg",
  },

  // --- MANAGEMENT ---
  {
    id: "mgmt-pouliot",
    name: "Lisa Pouliot",
    title: "Practice Administrator",
    role: "MGMT",
    specialties: ["Administration"],
    imageUrl: "/images/lisa-pouliot.png",
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
    type: "audio",
  },
  {
    title: "Demystifying Diets for CKD",
    duration: "6:09", // Set actual duration
    description:
      "A general overview of food and diets for people with chronic kidney disease not on dialysis",
    url: "https://youtu.be/-0Ibyw2PcE8", // Paste your Unlisted YouTube link
    type: "video",
  },
  {
    title: "Hemodialysis and Peritoneal Dialysis",
    duration: "6:09",
    description: "A general overview of hemodialysis vs peritoneal dialysis",
    url: "https://tinyurl.com/dialysiseducation",
    type: "video",
  },
  {
    title: "What Should I Eat?",
    duration: "18:45",
    description:
      "A discussion about diet in chronic kidney disease not on dialysis.",
    url: "https://res.cloudinary.com/dsajzdzge/video/upload/v1766196118/CKD_Nutrition_Protein_Sodium_and_Phosphorus_1_bihoru.mp3",
    type: "audio",
  },
  {
    title: "The Science of Kidney Stones",
    duration: "12:10",
    description: "Understanding Kidney Stones",
    url: "https://res.cloudinary.com/dsajzdzge/video/upload/v1766196797/The_Science_of_Stopping_Kidney_Stones_ao6jj4.mp4",
    type: "audio",
  },
];

export const FORMS_DATA: FormItem[] = [
  {
    title: "Medical History Form",
    fileSize: "1.1 MB",
    type: "PDF",
    href: "/forms/health-questionnaire.pdf",
  },

  {
    title: "Privacy Policy (HIPAA)",
    fileSize: "0.8 MB",
    type: "PDF",
    href: "/forms/privacy-notice.pdf",
  },
  {
    title: "Acknowledgement of Privacy Policy",
    fileSize: "0.4 MB",
    type: "PDF",
    href: "/forms/acknowledgement-of-privacy-notice.pdf",
  },
];
export const OFFICES_DATA: LocationItem[] = [
  {
    id: "off-1",
    name: "Kettering",
    address: "500 Lincoln Park Blvd, Suite 100",
    city: "Kettering, OH",
    zip: "45429",
    phone: "(937) 222-3118",
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
    phone: "(937) 438-3132",
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
    phone: "(937) 235-2757",
    type: "OFFICE",
    lat: 39.8596,
    lng: -84.1163,
  },
  {
    id: "off-4",
    name: "Dayton (North)",
    address: "455 Turner Road",
    city: "Dayton, OH",
    zip: "45415",
    phone: "(937) 496-5162",
    type: "OFFICE",
    lat: 39.8166,
    lng: -84.2259,
  },
  {
    id: "off-5",
    name: "Eaton",
    address: "450 Washington Jackson Rd",
    city: "Eaton, OH",
    zip: "45320",
    phone: "(937) 235-2757",
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
    phone: "(937) 496-5162",
    type: "OFFICE",
    lat: 40.0984,
    lng: -84.6369,
  },
];

export const DIALYSIS_LOCATIONS: LocationItem[] = [
  // Sorted Alphabetically by City, then Name

  // Centerville / South Dayton
  {
    id: "dia-fkc-centerville",
    name: "Fresenius Centerville Home",
    address: "7700 Washington Village Dr STE 110",
    city: "Dayton",
    zip: "45459",
    phone: "(937) 433-0106",
    type: "DIALYSIS",
    lat: 39.628,
    lng: -84.16,
  },
  {
    id: "dia-fkc-south",
    name: "Fresenius Kidney Care Dayton Regional Dialysis South",
    address: "7700 Washington Village Dr. Ste 100",
    city: "Dayton",
    zip: "45459",
    phone: "(937) 438-9595",
    type: "DIALYSIS",
    lat: 39.6335,
    lng: -84.1918,
  },

  // Dayton (Proper)
  {
    id: "dia-davita-north",
    name: "DaVita Dayton North Dialysis",
    address: "455 Turner Rd",
    city: "Dayton",
    zip: "45415",
    phone: "(937) 278-7861",
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
    phone: "(937) 278-5139",
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
    phone: "(937) 262-8427",
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
    phone: "(937) 252-1867",
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
    phone: "(937) 222-5859",
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
    phone: "(937) 456-1174",
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
    phone: "(937) 456-0400",
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
    phone: "(937) 426-6475",
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
    phone: "(937) 548-7019",
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
    phone: "(937) 237-0769",
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
    phone: "(937) 237-2000",
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
    phone: "(937) 643-2337",
    type: "DIALYSIS",
    lat: 39.705,
    lng: -84.195,
  },
  {
    id: "dia-davita-home-south",
    name: "DaVita Home Dialysis of Dayton South",
    address: "3030 S Dixie Dr",
    city: "Kettering",
    zip: "45409",
    phone: "(937) 296-1171",
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
    phone: "(937) 435-4030",
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
    phone: "(937) 865-0633",
    type: "DIALYSIS",
    lat: 39.635,
    lng: -84.235,
  },

  // Middletown
  {
    id: "dia-davita-atrium",
    name: "Davita Atrium Dialysis",
    address: "4421 Roosevelt Blvd Ste D",
    city: "Middletown, OH",
    zip: "45044",
    phone: "(513) 422-6879",
    type: "DIALYSIS",
    lat: 39.5336,
    lng: -84.3475,
  },

  // Trotwood
  {
    id: "dia-davita-trotwood",
    name: "DaVita Trotwood Dialysis",
    address: "5680 Salem Bend Dr",
    city: "Trotwood",
    zip: "45426",
    phone: "(937) 862-8432",
    type: "DIALYSIS",
    lat: 39.825,
    lng: -84.28,
  },
  {
    id: "dia-fkc-west",
    name: "Fresenius Kidney Care Dayton West",
    address: "4100 Salem Ave",
    city: "Trotwood",
    zip: "45416",
    phone: "(937) 279-3120",
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
