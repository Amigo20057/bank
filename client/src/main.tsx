import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";
import "./index.css";

const queryClint = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClint}>
		<BrowserRouter>
			<NotificationProvider>
				<App />
			</NotificationProvider>
		</BrowserRouter>
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
);
