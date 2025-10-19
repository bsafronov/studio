import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { orpc } from "@/orpc/client";

export const Route = createFileRoute("/sheets/")({
	component: RouteComponent,
	loader: ({ context }) => {
		context.queryClient.prefetchQuery(orpc.sheet.getSheets.queryOptions());
	},
});

function RouteComponent() {
	const { data: sheets } = useSuspenseQuery(
		orpc.sheet.getSheets.queryOptions(),
	);

	return (
		<ul>
			{sheets.map((item) => (
				<li key={item.id}>
					<Link to="/sheets/$sheetId" params={{ sheetId: item.id }}>
						{item.name}
					</Link>
				</li>
			))}
		</ul>
	);
}
