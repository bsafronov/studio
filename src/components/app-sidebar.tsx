import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
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
				{currentUser?.username}
				<LoginLink />
			</SidebarFooter>
		</Sidebar>
	);
}

const LoginLink = () => {
	const { href } = useLocation();
	const { data } = useQuery(orpc.auth.currentUser.queryOptions());
	const qc = useQueryClient();
	const { mutate: handleLogout } = useMutation(
		orpc.auth.logout.mutationOptions({
			onSuccess: () => {
				qc.setQueryData(orpc.auth.currentUser.queryKey(), null);
			},
		}),
	);

	if (data === null) {
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
};
