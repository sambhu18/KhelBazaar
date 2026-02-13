import axiosInstance from "./axiosinstance";

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface GoogleSignInData {
  idToken: string;
}

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  brand?: string;
  color?: string;
  rating?: number;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  status?: string;
}

interface ReviewData {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  pros?: string[];
  cons?: string[];
  size?: string;
  color?: string;
}

interface RentalData {
  productId: string;
  startDate: string;
  endDate: string;
  deliveryAddress: any;
}

// Auth APIs
export const register = async (data: SignupData) => {
  const response = await axiosInstance.post("/api/auth/register", data);
  return response;
};

export const login = async (data: LoginData) => {
  const response = await axiosInstance.post("/api/auth/login", data);
  return response;
};

export const googleSignIn = async (data: GoogleSignInData) => {
  const response = await axiosInstance.post("/api/auth/google", data);
  return response;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await axiosInstance.post("/api/auth/forgot-password", data);
  return response;
};

export const resetPassword = async (token: string, data: { email: string }) => {
  const response = await axiosInstance.post(`/api/auth/reset-password/${token}`, data);
  return response;
};

// Enhanced Product APIs
export const getProducts = async (filters?: ProductFilters) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  const response = await axiosInstance.get(`/api/products?${params.toString()}`);
  return response;
};

export const getProductDiscovery = async () => {
  const response = await axiosInstance.get("/api/products/discovery");
  return response;
};

export const searchProducts = async (query: string, limit?: number) => {
  const response = await axiosInstance.get(`/api/products/search?q=${encodeURIComponent(query)}&limit=${limit || 10}`);
  return response;
};

export const getProductById = async (id: string) => {
  const response = await axiosInstance.get(`/api/products/${id}`);
  return response;
};

export const getProductVariants = async (id: string) => {
  const response = await axiosInstance.get(`/api/products/${id}/variants`);
  return response;
};

export const getProductsByCategory = async (category: string, filters?: Omit<ProductFilters, 'category'>) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  const response = await axiosInstance.get(`/api/products/category/${category}?${params.toString()}`);
  return response;
};

export const addProduct = async (data: FormData) => {
  const response = await axiosInstance.post("/api/products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const updateProduct = async (id: string, data: FormData) => {
  const response = await axiosInstance.put(`/api/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const deleteProduct = async (id: string) => {
  const response = await axiosInstance.delete(`/api/products/${id}`);
  return response;
};

export const moderateProduct = async (id: string, status: 'approved' | 'rejected', reason?: string) => {
  const response = await axiosInstance.put(`/api/products/${id}/moderate`, { status, reason });
  return response;
};

// Review APIs
export const getProductReviews = async (productId: string, page?: number, sort?: string, rating?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (sort) params.append('sort', sort);
  if (rating) params.append('rating', rating.toString());

  const response = await axiosInstance.get(`/api/reviews/product/${productId}?${params.toString()}`);
  return response;
};

export const getUserReviews = async (page?: number) => {
  const response = await axiosInstance.get(`/api/reviews/my-reviews?page=${page || 1}`);
  return response;
};

export const createReview = async (data: FormData) => {
  const response = await axiosInstance.post("/api/reviews", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const updateReview = async (id: string, data: FormData) => {
  const response = await axiosInstance.put(`/api/reviews/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const deleteReview = async (id: string) => {
  const response = await axiosInstance.delete(`/api/reviews/${id}`);
  return response;
};

export const markReviewHelpful = async (id: string) => {
  const response = await axiosInstance.post(`/api/reviews/${id}/helpful`);
  return response;
};

// Admin Review APIs
export const getAllReviews = async (page?: number, status?: string, rating?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (status) params.append('status', status);
  if (rating) params.append('rating', rating.toString());

  const response = await axiosInstance.get(`/api/reviews/admin/all?${params.toString()}`);
  return response;
};

export const moderateReview = async (id: string, status: 'approved' | 'rejected' | 'flagged', reason?: string) => {
  const response = await axiosInstance.put(`/api/reviews/admin/${id}/moderate`, { status, reason });
  return response;
};

// Rental APIs
export const checkRentalAvailability = async (productId: string, startDate: string, endDate: string) => {
  const response = await axiosInstance.get(`/api/rentals/availability/${productId}?startDate=${startDate}&endDate=${endDate}`);
  return response;
};

export const createRental = async (data: RentalData) => {
  const response = await axiosInstance.post("/api/rentals", data);
  return response;
};

export const getUserRentals = async (page?: number, status?: string) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (status) params.append('status', status);

  const response = await axiosInstance.get(`/api/rentals/my-rentals?${params.toString()}`);
  return response;
};

export const getRentalById = async (id: string) => {
  const response = await axiosInstance.get(`/api/rentals/${id}`);
  return response;
};

export const returnRental = async (id: string, data: FormData) => {
  const response = await axiosInstance.put(`/api/rentals/${id}/return`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const cancelRental = async (id: string, reason: string) => {
  const response = await axiosInstance.put(`/api/rentals/${id}/cancel`, { reason });
  return response;
};

// Admin Rental APIs
export const getAllRentals = async (page?: number, status?: string, overdue?: boolean) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (status) params.append('status', status);
  if (overdue) params.append('overdue', 'true');

  const response = await axiosInstance.get(`/api/rentals/admin/all?${params.toString()}`);
  return response;
};

export const updateRentalStatus = async (id: string, status: string, notes?: string) => {
  const response = await axiosInstance.put(`/api/rentals/admin/${id}/status`, { status, notes });
  return response;
};

// Recommendation APIs
export const generateRecommendations = async () => {
  const response = await axiosInstance.post("/api/recommendations/generate");
  return response;
};

export const getUserRecommendations = async (type?: string, limit?: number) => {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (limit) params.append('limit', limit.toString());

  const response = await axiosInstance.get(`/api/recommendations/my-recommendations?${params.toString()}`);
  return response;
};

export const trackRecommendation = async (id: string, action: 'shown' | 'clicked' | 'purchased') => {
  const response = await axiosInstance.post(`/api/recommendations/${id}/track`, { action });
  return response;
};

// Admin Recommendation APIs
export const getRecommendationAnalytics = async () => {
  const response = await axiosInstance.get("/api/recommendations/admin/analytics");
  return response;
};

export const generateBulkRecommendations = async () => {
  const response = await axiosInstance.post("/api/recommendations/admin/generate-bulk");
  return response;
};

// Order APIs
export const getOrders = async () => {
  const response = await axiosInstance.get("/api/orders/user/my-orders");
  return response;
};

export const getOrderById = async (id: string) => {
  const response = await axiosInstance.get(`/api/orders/${id}`);
  return response;
};

export const createOrder = async (data: any) => {
  const response = await axiosInstance.post("/api/orders", data);
  return response;
};

// Enhanced Cart APIs
export const getCart = async () => {
  const response = await axiosInstance.get("/api/users/cart");
  return response;
};

export const addToCart = async (data: any) => {
  const response = await axiosInstance.post("/api/users/cart/add", data);
  return response;
};

export const removeFromCart = async (data: any) => {
  const response = await axiosInstance.post("/api/users/cart/remove", data);
  return response;
};

export const updateCartQuantity = async (data: any) => {
  const response = await axiosInstance.put("/api/users/cart/update", data);
  return response;
};

export const clearCart = async () => {
  const response = await axiosInstance.delete("/api/users/cart/clear");
  return response;
};

// Enhanced Wishlist APIs
export const getWishlist = async (page?: number) => {
  const response = await axiosInstance.get(`/api/users/wishlist?page=${page || 1}`);
  return response;
};

export const addToWishlist = async (data: any) => {
  const response = await axiosInstance.post("/api/users/wishlist/add", data);
  return response;
};

export const removeFromWishlist = async (data: any) => {
  const response = await axiosInstance.post("/api/users/wishlist/remove", data);
  return response;
};

export const moveWishlistToCart = async (data: any) => {
  const response = await axiosInstance.post("/api/users/wishlist/move-to-cart", data);
  return response;
};

// Enhanced User Profile APIs
export const getUserProfile = async () => {
  const response = await axiosInstance.get("/api/users/profile");
  return response;
};

export const updateUserProfile = async (data: any) => {
  const response = await axiosInstance.put("/api/users/profile", data);
  return response;
};

// Address APIs
export const getAddresses = async () => {
  const response = await axiosInstance.get("/api/users/addresses");
  return response;
};

export const addAddress = async (data: any) => {
  const response = await axiosInstance.post("/api/users/addresses", data);
  return response;
};

export const updateAddress = async (addressId: string, data: any) => {
  const response = await axiosInstance.put(`/api/users/addresses/${addressId}`, data);
  return response;
};

export const deleteAddress = async (addressId: string) => {
  const response = await axiosInstance.delete(`/api/users/addresses/${addressId}`);
  return response;
};

// Enhanced Loyalty APIs
export const getLoyaltyPoints = async () => {
  const response = await axiosInstance.get("/api/users/loyalty/points");
  return response;
};

// Club Post APIs
export const getClubPosts = async (query?: string) => {
  const response = await axiosInstance.get(`/api/club-posts${query || ""}`);
  return response;
};

export const getClubPost = async (id: string) => {
  const response = await axiosInstance.get(`/api/club-posts/${id}`);
  return response;
};

export const createClubPost = async (data: FormData) => {
  const response = await axiosInstance.post("/api/club-posts", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const updateClubPost = async (id: string, data: FormData) => {
  const response = await axiosInstance.put(`/api/club-posts/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const deleteClubPost = async (id: string) => {
  const response = await axiosInstance.delete(`/api/club-posts/${id}`);
  return response;
};

export const likeClubPost = async (id: string) => {
  const response = await axiosInstance.post(`/api/club-posts/${id}/like`, {});
  return response;
};

export const commentOnPost = async (id: string, data: any) => {
  const response = await axiosInstance.post(`/api/club-posts/${id}/comment`, data);
  return response;
};

// Club APIs
export const getClubs = async () => {
  const response = await axiosInstance.get("/api/clubs");
  return response;
};

export const createClub = async (data: any) => {
  const response = await axiosInstance.post("/api/clubs", data);
  return response;
};

export const updateClub = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/api/clubs/${id}`, data);
  return response;
};

export const deleteClub = async (id: string) => {
  const response = await axiosInstance.delete(`/api/clubs/${id}`);
  return response;
};

// Admin APIs
export const getAllUsers = async (page?: number, role?: string, verified?: boolean, search?: string) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (role) params.append('role', role);
  if (verified !== undefined) params.append('verified', verified.toString());
  if (search) params.append('search', search);

  const response = await axiosInstance.get(`/api/users?${params.toString()}`);
  return response;
};

export const updateUserRole = async (id: string, role: string) => {
  const response = await axiosInstance.put(`/api/users/${id}/role`, { role });
  return response;
};

export const deleteUser = async (id: string) => {
  const response = await axiosInstance.delete(`/api/users/${id}`);
  return response;
};

export const getUserAnalytics = async () => {
  const response = await axiosInstance.get("/api/users/admin/analytics");
  return response;
};

export const getAllOrdersAdmin = async (page?: number, status?: string) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (status) params.append('status', status);

  const response = await axiosInstance.get(`/api/orders?${params.toString()}`);
  return response;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const response = await axiosInstance.put(`/api/orders/${id}/status`, { status });
  return response;
};

export const updateOrderPayment = async (id: string, paymentStatus: string) => {
  const response = await axiosInstance.put(`/api/orders/${id}/payment`, { paymentStatus });
  return response;
};

export default axiosInstance;