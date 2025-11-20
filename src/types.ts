export type Product = {
  _id: string;
  name: string;
  category?: string;
  price?: number;

  // Legacy single image field (old backend / seed data)
  imageUrl?: string;

  // Legacy multi-image field (if you used this earlier)
  images?: string[];

  // New backend field: up to 5 image URLs
  imageUrls?: string[];

  isPopular?: boolean;
  isActive?: boolean;
  description?: string;
  features?: string[];
};

export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

export const WHATSAPP_NUMBER = "+447936761983";
