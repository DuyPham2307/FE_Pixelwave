import AdminSideBar from "@/components/Sidebar/AdminSideBar";
import Navbar from "../components/MainComponent/Navbar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<div className="flex flex-1 bg-[#F3F5F7] pt-4 relative gap-4">
				<AdminSideBar />
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
};

export default AdminLayout;
