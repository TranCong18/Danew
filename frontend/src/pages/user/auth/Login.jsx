import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/users/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("storage"));
      alert("✅ Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "❌ Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded shadow">
      <h2 className="mb-4 text-xl font-bold">Đăng Nhập</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full p-2 mb-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
      <p className="mt-3 text-center">
        Chưa có tài khoản?{" "}
        <a href="/register" className="text-blue-500">
          Đăng ký ngay
        </a>
      </p>
    </div>
  );
};

export default Login;
