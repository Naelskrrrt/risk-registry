import Navbar from "@/presentation/components/navbar";
import Sidebar from "@/presentation/components/sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
	return (
		<div className="w-screen h-screen relative bg-bg-pattern bg-cover flex flex-1 justify-center items-center p-3 gap-3">
			<Sidebar />
			<div className="w-full  h-full relative">
				<Navbar />
				<div className="w-full  border-2  relative border-white bg-white/30 backdrop-blur-sm p-4 rounded-md">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default DashboardLayout;
