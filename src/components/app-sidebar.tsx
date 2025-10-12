import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "./ui/sidebar";

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>Studio</SidebarHeader>
			<SidebarContent></SidebarContent>
			<SidebarFooter>
				<Button asChild>
					<Link to="/auth/login">Войти</Link>
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
