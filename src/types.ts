export type Product = {
  _id: string;
  name: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  isPopular?: boolean;
  isActive?: boolean;
  description?: string;
  features?: string[];
};

export const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";
export const WHATSAPP_NUMBER = "+447936761983";