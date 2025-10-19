import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";

export const Route = createFileRoute("/auth/_auth")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10 grow">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					to="/"
					className="flex items-center gap-2 self-center font-medium"
				>
					<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
						<GalleryVerticalEnd className="size-4" />
					</div>
					Studio
				</Link>
				<Outlet />
			</div>
		</div>
	);
}
