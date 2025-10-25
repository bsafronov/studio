import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RowForm } from "@/features/sheet";
import { orpc } from "@/orpc/client";

export const Route = createFileRoute("/sheets/$sheetId/$rowId")({
	component: RouteComponent,
	loader: ({ context: { queryClient }, params: { sheetId } }) => {
		queryClient.prefetchQuery(
			orpc.sheet.columnList.queryOptions({ input: { sheetId } }),
		);
	},
});

function RouteComponent() {
	const { sheetId, rowId } = Route.useParams();
	const navigate = useNavigate();
	const { data: columns } = useSuspenseQuery(
		orpc.sheet.columnList.queryOptions({ input: { sheetId } }),
	);
	const { data: row } = useSuspenseQuery(
		orpc.sheet.row.queryOptions({
			input: { rowId },
		}),
	);
	const qc = useQueryClient();
	const { mutateAsync: updateRow } = useMutation(
		orpc.sheet.updateRow.mutationOptions({
			onSuccess: () => {
				qc.invalidateQueries({
					queryKey: orpc.sheet.rowList.queryKey({ input: { sheetId } }),
				});
				qc.invalidateQueries({
					queryKey: orpc.sheet.row.queryKey({ input: { rowId } }),
				});

				navigate({
					to: "/sheets/$sheetId",
					params: { sheetId },
				});
			},
		}),
	);

	return (
		<RowForm
			columns={columns}
			onSubmit={async (data) => {
				await updateRow({
					rowId,
					data,
				});
			}}
			defaultValues={row.data}
		/>
	);
}
