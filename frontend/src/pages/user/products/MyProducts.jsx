import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy userId từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await axiosInstance.get(`/products?userId=${userId}`);
        setProducts(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm của tôi:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchMyProducts();
  }, [userId]);

  const handleDelete = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) {
      try {
        await axiosInstance.delete(`/products/${productId}`);
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      } catch (error) {
        alert("Xoá sản phẩm thất bại!");
      }
    }
  };

  if (!userId) return <p>Bạn cần đăng nhập để xem sản phẩm của mình.</p>;
  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Sản phẩm bạn đã đăng bán</h2>
        <Link
          to="/products/add"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          + Đăng bán sản phẩm mới
        </Link>
      </div>
      {products.length === 0 ? (
        <p>Bạn chưa đăng bán sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="p-4 border rounded shadow relative group"
            >
              <img
                src={product.images?.[0] || "/default-image.jpg"}
                alt={product.name}
                className="w-full h-40 object-cover mb-2 cursor-pointer"
                onClick={() => navigate(`/products/edit/${product._id}`)}
                title="Nhấn để chỉnh sửa sản phẩm"
              />
              <h3 className="font-bold">{product.name}</h3>
              <p>Giá: {product.basePrice?.toLocaleString()} VNĐ</p>
              <button
                onClick={() => handleDelete(product._id)}
                className="absolute top-2 right-2 px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 opacity-80 group-hover:opacity-100"
                title="Xoá sản phẩm"
              >
                Xoá
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
