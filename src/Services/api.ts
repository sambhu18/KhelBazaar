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

// Product APIs
export const getProducts = async () => {
  const response = await axiosInstance.get("/api/products");
  return response;
};

export const getProductById = async (id: string) => {
  const response = await axiosInstance.get(`/api/products/${id}`);
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

// Cart APIs
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

// Wishlist APIs
export const getWishlist = async () => {
  const response = await axiosInstance.get("/api/users/wishlist");
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

// Loyalty APIs
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

export default axiosInstance;