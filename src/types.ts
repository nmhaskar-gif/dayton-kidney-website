import { LucideIcon } from "lucide-react";

export enum ViewState {
  HOME,
  LOCATIONS,
  PROVIDERS,
  ABOUT,
  SERVICES,
  EDUCATION,
  FORMS,
  CONTACT,
}

export interface SceneElement {
  id: string;
  z: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface SatelliteItem {
  id: string;
  label: string;
  angle: number;
  icon: LucideIcon;
}

export interface Provider {
  id: string;
  name: string;
  title: string;
  role: "MD" | "APP" | "MGMT";
  specialties: string[];
  imageUrl: string;
  imagePosition?: string;

  // New detailed fields
  education?: string[];
  bio?: string;
  interests?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PodcastItem {
  title: string;
  duration: string;
  description: string;
  url?: string;
}

export interface FormItem {
  title: string;
  fileSize: string;
  type: string;
}

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  type: "OFFICE" | "DIALYSIS" | "ACCESS";
  // Coordinates for clean map
  lat?: number;
  lng?: number;
}
