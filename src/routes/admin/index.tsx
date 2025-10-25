import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { orpc } from "@/orpc/client";

export const Route = createFileRoute("/admin/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { mutate: createMockTable, isPending } = useMutation(
		orpc.sheet.createMockSheet.mutationOptions(),
	);

	return (
		<Button onClick={() => createMockTable({})} disabled={isPending}>
			Создать таблицу
		</Button>
	);
}
