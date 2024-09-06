import Navbar from "@/presentation/components/navbar";
import Sidebar from "@/presentation/components/sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const DashboardLayout = () => {
    return (
        <div className="w-screen h-screen relative overflow-hidden bg-bg-pattern bg-cover flex flex-row p-1 gap-2">
            <Sidebar />
            <div className="py-2 h-screen w-full flex flex-col  relative gap-1 overflow-auto">
                <Navbar />
                <div className="w-full h-full relative border-2 border-white bg-white/30 backdrop-blur-sm p-3 overflow-auto rounded-md">
                    <Outlet />
                </div>
            </div>
            <Toaster position="top-right" closeButton richColors />
        </div>
    );
};

export default DashboardLayout;
