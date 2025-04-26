import { Outlet } from "react-router-dom";
import Header from "../components/user/Header";
import Footer from "../components/user/Footer";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20"> {/* Thêm padding-top để tránh bị navbar che */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
