
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:4000";

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

type ProductsResponse = {
  items: Product[];
  total?: number;
  page?: number;
  limit?: number;
};

/**
 * Fetch popular products
 * @param limit - Number of products to fetch (default: 5)
 */
export async function fetchPopularProducts(
  limit: number = 5,
  signal?: AbortSignal
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE}/api/products/popular?limit=${limit}`,
      { signal }
    );

    if (!response.ok) {
      throw new Error(`Popular products fetch failed: ${response.status}`);
    }

    const json: ProductsResponse = await response.json();
    return Array.isArray(json.items) ? json.items : [];
  } catch (error) {
    console.error("Error fetching popular products:", error);
    throw error;
  }
}

/**
 * Fetch all products with optional filters
 * @param options - Query options
 */
export async function fetchProducts(
  options: {
    limit?: number;
    page?: number;
    category?: string;
    search?: string;
  } = {},
  signal?: AbortSignal
): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.page) params.append("page", options.page.toString());
    if (options.category) params.append("category", options.category);
    if (options.search) params.append("search", options.search);

    const url = `${API_BASE}/api/products${params.toString() ? `?${params}` : ""}`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Products fetch failed: ${response.status}`);
    }

    const json: ProductsResponse = await response.json();
    return Array.isArray(json.items) ? json.items : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Fetch a single product by ID
 * @param id - Product ID
 */
export async function fetchProductById(
  id: string,
  signal?: AbortSignal
): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE}/api/products/${id}`, { signal });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Product fetch failed: ${response.status}`);
    }

    const product: Product = await response.json();
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

/**
 * Generate WhatsApp inquiry link for a product
 * @param product - Product to inquire about
 * @param phoneNumber - WhatsApp number (default: +447936761983)
 */
export function generateWhatsAppLink(
  product: Product,
  phoneNumber: string = "+447936761983"
): string {
  const message =
    `Hi! I'm interested in:\n${product.name}` +
    (product.price != null ? `\nPrice: £${product.price.toFixed(2)}` : "");
  
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Open WhatsApp inquiry for a product
 * @param product - Product to inquire about
 * @param phoneNumber - WhatsApp number (default: +447936761983)
 */
export function openWhatsAppInquiry(
  product: Product,
  phoneNumber: string = "+447936761983"
): void {
  const url = generateWhatsAppLink(product, phoneNumber);
  window.open(url, "_blank");
}