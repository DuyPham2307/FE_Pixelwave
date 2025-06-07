// src/main.tsx
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "@/contexts/AuthContext"; // đường dẫn alias

ReactDOM.createRoot(document.getElementById("root")!).render(
	<AuthProvider>
		<App />
	</AuthProvider>
);
