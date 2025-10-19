import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { LucidePlus, LucideTable2 } from "lucide-react";
import { useUser } from "@/features/auth/use-user";
import { orpc } from "@/orpc/client";
import { Button } from "./ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";

export function AppSidebar() {
	const user = useUser();
	return (
		<Sidebar>
			<SidebarHeader>Studio</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Таблицы</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link to="/sheets">
									<LucideTable2 />
									Все таблицы
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link to="/sheets/new">
									<LucidePlus />
									Новая таблица
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				{user?.username}
				<LoginLink />
			</SidebarFooter>
		</Sidebar>
	);
}

function LoginLink() {
	const { href } = useLocation();
	const user = useUser();
	const qc = useQueryClient();
	const { mutate: handleLogout } = useMutation(
		orpc.auth.logout.mutationOptions({
			onSuccess: () => {
				qc.setQueryData(orpc.auth.currentUser.queryKey(), null);
			},
		}),
	);

	if (user === null) {
		return (
			<Button asChild>
				<Link to="/auth/login" search={{ redirectUrl: href }}>
					Войти
				</Link>
			</Button>
		);
	}

	return (
		<Button variant="destructive" onClick={() => handleLogout({})}>
			Выйти
		</Button>
	);
}
