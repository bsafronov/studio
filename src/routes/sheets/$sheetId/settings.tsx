import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sheets/$sheetId/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Table settings</div>;
}
