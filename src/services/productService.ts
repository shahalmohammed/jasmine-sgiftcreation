const API_BASE_URL = "https://jasminesgiftbackend-c9ed.vercel.app//api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};
// Product Service
export const productService = {
  // Fetch all products
  async getAllProducts() {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.items || [];
  },

  // Create a new product
  async createProduct(formData: {
    name: string;
    description: string;
    price: string;
    isPopular: boolean;
    imageFile: File | null;
  }) {
    const formDataToSend = new FormData();
    
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("isPopular", formData.isPopular.toString());
    
    if (formData.imageFile) {
      formDataToSend.append("image", formData.imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formDataToSend,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create product");
    }

    return data;
  },

  // Update an existing product
  async updateProduct(
    productId: string,
    formData: {
      name: string;
      description: string;
      price: string;
      isPopular: boolean;
      imageFile: File | null;
    }
  ) {
    const formDataToSend = new FormData();
    
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("isPopular", formData.isPopular.toString());
    
    if (formData.imageFile) {
      formDataToSend.append("image", formData.imageFile);
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

  // Toggle product popularity
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

  // Delete a product
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

// Auth Service
export const authService = {
  // Admin login
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

    // Save session automatically
    const user = data.user || { email };
    this.saveSession(data.token, user);

    console.log("Session saved:", { token: data.token, user }); // Debug log

    return data;
  },

  // Logout
  logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  },

  // Get current admin user
  getCurrentUser() {
    const user = localStorage.getItem("adminUser");
    return user ? JSON.parse(user) : null;
  },

  // Get auth token
  getToken() {
    return localStorage.getItem("adminToken");
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Save user session
  saveSession(token: string, user: any) {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));
    console.log("Token and user saved to localStorage"); // Debug log
  },
};