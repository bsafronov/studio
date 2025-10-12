import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/auth/_auth/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Добро пожаловать</CardTitle>
				<CardDescription>
					Войди, чтобы получить больше возможностей
				</CardDescription>
			</CardHeader>
			<CardContent></CardContent>
		</Card>
	);
}
