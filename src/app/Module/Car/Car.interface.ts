import { Types } from "mongoose";

export interface TCarReturn {
  bookingId: Types.ObjectId;
  endTime: string;
}

type TCarType = "Featured" | "New Arrival";
type TAvailable = "available" | "unavailable";
type TCarCategory = "Luxury" | "Economy" | "SUV" | "Sedan" | "Convertible";
export interface Faq {
  question: string;
  answer: string;
}

export enum TAvailableArea {
  Dhaka = "Dhaka",
  Chittagong = "Chittagong",
  Sylhet = "Sylhet",
  Khulna = "Khulna",
  Rajshahi = "Rajshahi",
  Pabna = "Pabna",
  Barisal = "Barisal",
  Rangpur = "Rangpur",
  Mymensingh = "Mymensingh",
  Comilla = "Comilla",
  Jashore = "Jashore",
  Tangail = "Tangail",
  Narayanganj = "Narayanganj",
  Gazipur = "Gazipur",
  Jamalpur = "Jamalpur",
  Patuakhali = "Patuakhali",
  Brahmanbaria = "Brahmanbaria",
}

export interface TCar {
  name: string;
  category: TCarCategory;
  brand: string;
  description: string;
  type: TCarType;
  model: string;
  VIN: string;
  licensePlate: string;
  color: string;
  mileage: number;
  rentalPricePerDay: number;
  advance: number;
  availability?: TAvailable;
  availableAreas: TAvailableArea[];
  numberOfDoors: number;
  seatingCapacity: number;
  features: string[];
  safetyFeatures: string[];
  images?: string[];
  faqs: Faq[];
  isDelete?: boolean;
}
