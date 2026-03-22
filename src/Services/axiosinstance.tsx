import axios from "axios";

console.log("Axios baseURL:", process.env.NEXT_PUBLIC_BASEURL);
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      if (config.headers && typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Automatic logout on 401 Unauthorized or Token expired
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Optionally redirect to login, but let components handle routes if they use router checks.
        // Doing window.location.href = '/auth/Login' can forcefully redirect.
        if (window.location.pathname.includes('/dashboard')) {
          window.location.href = '/auth/Login'; 
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
