import "@fontsource-variable/dm-sans";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { ThemeProvider } from "./context/theme-provider.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
					<App />
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	</StrictMode>
);
