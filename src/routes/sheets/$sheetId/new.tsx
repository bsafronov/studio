import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RowForm } from "@/features/sheet/ui/row-form";
import { orpc } from "@/orpc/client";

export const Route = createFileRoute("/sheets/$sheetId/new")({
	component: RouteComponent,
	loader: ({ context: { queryClient }, params: { sheetId } }) => {
		queryClient.prefetchQuery(
			orpc.sheet.columnList.queryOptions({ input: { sheetId } }),
		);
	},
});

function RouteComponent() {
	const { sheetId } = Route.useParams();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { data: columns } = useSuspenseQuery(
		orpc.sheet.columnList.queryOptions({ input: { sheetId } }),
	);
	const { mutateAsync: createRow } = useMutation(
		orpc.sheet.createRow.mutationOptions({
			onSuccess: () => {
				qc.invalidateQueries({
					queryKey: orpc.sheet.rowList.queryKey({ input: { sheetId } }),
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
				await createRow({
					sheetId,
					data,
				});
			}}
		/>
	);
}
