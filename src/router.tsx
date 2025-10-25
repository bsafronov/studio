import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { toast } from "sonner";
import { orpc } from "./orpc/client";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			mutations: {
				onError(error) {
					toast.error(error.message);
				},
			},
			queries: {
				staleTime: Infinity,
			},
		},
	});

	const router = createRouter({
		routeTree,
		context: { queryClient, orpc },
		defaultPreload: "intent",
		Wrap: (props: { children: React.ReactNode }) => {
			return (
				<QueryClientProvider client={queryClient}>
					{props.children}
				</QueryClientProvider>
			);
		},
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	return router;
};
