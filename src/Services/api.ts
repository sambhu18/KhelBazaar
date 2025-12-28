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

export default axiosInstance;