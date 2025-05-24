import Navbar from "@/components/MainComponent/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<div className="flex flex-1 bg-[#F3F5F7] pt-4 relative gap-4">
				<Sidebar />
				<main className="flex flex-1">{children}</main>
			</div>
		</div>
	)
};

export default ChatLayout;
