import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sheets/$sheetId/logs")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Table logs</div>;
}
