import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { orpc } from "@/orpc/client";
import { Button } from "./ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "./ui/sidebar";

export function AppSidebar() {
	const { data: currentUser } = useQuery(orpc.auth.currentUser.queryOptions());
	return (
		<Sidebar>
			<SidebarHeader>Studio</SidebarHeader>
			<SidebarContent></SidebarContent>
			<SidebarFooter>
				{JSON.stringify(currentUser)}
				<Button asChild>
					<Link to="/auth/login">Войти</Link>
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
