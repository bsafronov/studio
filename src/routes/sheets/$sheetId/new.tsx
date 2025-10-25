import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "@/orpc/client";

export const Route = createFileRoute("/sheets/$sheetId/new")({
	component: RouteComponent,
	loader: ({ context: { queryClient }, params: { sheetId } }) => {
		queryClient.prefetchQuery(
			orpc.sheet.getColumns.queryOptions({ input: { sheetId } }),
		);
	},
});

function RouteComponent() {
	const { sheetId } = Route.useParams();
	const { data: columns } = useSuspenseQuery(
		orpc.sheet.getColumns.queryOptions({ input: { sheetId } }),
	);

	return "New record form";
}
