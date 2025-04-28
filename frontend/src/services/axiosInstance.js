import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://danew.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🛡️ Tự động thêm token vào request nếu có
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
