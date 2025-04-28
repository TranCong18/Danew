// src/pages/NewArrivals.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

const NewArrivals = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axiosInstance.get("/products?sort=new");
        setNewProducts(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm mới:", error);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const res = await axiosInstance.get("/products?sort=purchased");
        setFeaturedProducts(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm nổi bật:", error);
      }
    };

    fetchNewArrivals();
    fetchFeaturedProducts();
  }, []);

  const handlePriceClick = (productId) => {
    navigate(`/buy/${productId}`);
  };

  return (
    <div className="py-8 bg-white">
      <h2 className="mb-6 text-2xl font-bold text-center">Sản phẩm mới nhất</h2>
      <div className="grid grid-cols-4 gap-4 px-4">
        {Array.isArray(newProducts) && newProducts.length > 0 ? (
          newProducts.slice(0, 8).map((product) => {
            const imageUrl = product.images?.[0] || "/default-image.jpg";
            const price = product.basePrice || product.variants?.[0]?.price || 0;

            return (
              <div key={product._id} className="p-4 bg-gray-200 rounded-lg shadow-md">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="object-cover w-full h-40 rounded"
                />
                <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
                <p
                  className="font-bold text-red-500 cursor-pointer"
                  onClick={() => handlePriceClick(product._id)}
                >
                  {price ? price.toLocaleString() : "Chưa có giá"}₫
                </p>
              </div>
            );
          })
        ) : (
          <p className="col-span-4 text-center text-gray-500">Không có sản phẩm mới</p>
        )}
      </div>

      <h2 className="mt-8 mb-6 text-2xl font-bold text-center">Sản phẩm nổi bật</h2>
      <div className="grid grid-cols-3 gap-4 px-4">
        {Array.isArray(featuredProducts) && featuredProducts.length > 0 ? (
          featuredProducts.slice(0, 3).map((product) => {
            const imageUrl = product.images?.[0] || "/default-image.jpg";
            const price = product.basePrice || product.variants?.[0]?.price || 0;

            return (
              <div key={product._id} className="p-4 bg-gray-200 rounded-lg shadow-md">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="object-cover w-full h-40 rounded"
                />
                <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
                <p
                  className="font-bold text-red-500 cursor-pointer"
                  onClick={() => handlePriceClick(product._id)}
                >
                  {price ? price.toLocaleString() : "Chưa có giá"}₫
                </p>
              </div>
            );
          })
        ) : (
          <p className="col-span-3 text-center text-gray-500">Không có sản phẩm nổi bật</p>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;
