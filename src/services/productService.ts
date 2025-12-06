const API_BASE_URL = "https://jasminesgiftbackend.vercel.app/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};
const MAX_IMAGES = 15;

type ProductFormPayload = {
  name: string;
  description: string;
  price: string;
  isPopular: boolean;
  imageFiles?: File[];
};

export const productService = {
  async getAllProducts() {
    const response = await fetch(`${API_BASE_URL}/products?limit=100`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.items || [];
  },

  async createProduct(formData: ProductFormPayload) {
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("isPopular", formData.isPopular.toString());

    if (formData.imageFiles && formData.imageFiles.length > 0) {
      // Enforce max 15 on client (optional, for nicer UX)
      const filesToSend =
        formData.imageFiles.length > MAX_IMAGES
          ? formData.imageFiles.slice(0, MAX_IMAGES)
          : formData.imageFiles;

      filesToSend.forEach((file) => {
        formDataToSend.append("images", file); // field name must be "images"
      });
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(), // do NOT set Content-Type manually
      body: formDataToSend,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create product");
    }

    return data;
  },

  async updateProduct(productId: string, formData: ProductFormPayload) {
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("isPopular", formData.isPopular.toString());

    if (formData.imageFiles && formData.imageFiles.length > 0) {
      const filesToSend =
        formData.imageFiles.length > MAX_IMAGES
          ? formData.imageFiles.slice(0, MAX_IMAGES)
          : formData.imageFiles;

      filesToSend.forEach((file) => {
        formDataToSend.append("images", file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: formDataToSend,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update product");
    }

    return data;
  },

  async togglePopularity(productId: string) {
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/toggle-popular`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to toggle product popularity");
    }

    return await response.json();
  },

  async deleteProduct(productId: string) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return await response.json();
  },
};

export const authService = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid credentials");
    }

    const user = data.user || { email };
    this.saveSession(data.token, user);

    return data;
  },

  logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  },

  getCurrentUser() {
    const user = localStorage.getItem("adminUser");
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem("adminToken");
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  saveSession(token: string, user: any) {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));
  },
};
