// src/types.ts

export type Review = {
  _id: string;
  rating: number; // 1..5
  comment?: string;
  customerName?: string;
  createdAt: string;
};

export type ReviewsResponse = {
  page: number;
  limit: number;
  total: number;
  averageRating: number;
  ratingsCount: number;
  items: Review[];
};

export type Product = {
  _id: string;
  name: string;
  category?: string;
  price?: number;

  imageUrl?: string;
  images?: string[];
  imageUrls?: string[];

  isPopular?: boolean;
  isActive?: boolean;
  description?: string;
  features?: string[];

  // reviews summary (from backend)
  averageRating?: number;
  ratingsCount?: number;
};

export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

export const WHATSAPP_NUMBER = "447936761983";
