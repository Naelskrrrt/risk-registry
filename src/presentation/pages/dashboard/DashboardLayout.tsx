import Navbar from "@/presentation/components/navbar";
import Sidebar from "@/presentation/components/sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div className="w-full h-[100vh] overflow-hidden bg-bg-pattern bg-cover flex flex-1 justify-center items-center p-3 gap-3">
            <Sidebar />
            <div className="w-full  h-full flex flex-col relative ">
                <Navbar />
                <div className="w-full h-full  relative border-2  border-white bg-white/30 backdrop-blur-sm p-4 rounded-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
