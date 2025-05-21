// src/layouts/MainLayout.tsx
import Navbar from "../components/MainComponent/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import SuggestionBar from '../components/Sidebar/SuggestionBar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<div className="flex flex-1 bg-[#F3F5F7] pt-4 relative gap-4">
				<Sidebar />
				<main className="flex-1">{children}</main>
				<SuggestionBar />
			</div>
		</div>
	);
};

export default MainLayout;
