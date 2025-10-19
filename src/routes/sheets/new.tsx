import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Form, useAppForm } from "@/components/app-form";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { orpc } from "@/orpc/client";

export const Route = createFileRoute("/sheets/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { mutateAsync: createSheet } = useMutation(
		orpc.sheet.createSheet.mutationOptions({
			onSuccess: ({ id }) => {
				qc.invalidateQueries({
					queryKey: orpc.sheet.getSheets.queryKey(),
				});
				navigate({
					to: "/sheets/$sheetId",
					params: { sheetId: id },
				});
			},
		}),
	);

	const form = useAppForm({
		defaultValues: {
			name: "",
		},
		onSubmit: async ({ value: { name } }) => {
			await createSheet({ name });
		},
	});

	return (
		<Form className="p-4" onSubmit={form.handleSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>Новая таблица</CardTitle>
				</CardHeader>
				<CardContent>
					<FieldGroup>
						<form.AppField name="name">
							{(field) => <field.TextField label="Название" />}
						</form.AppField>
					</FieldGroup>
				</CardContent>
				<CardFooter>
					<form.AppForm>
						<form.SubscribeButton label="Создать" />
					</form.AppForm>
				</CardFooter>
			</Card>
		</Form>
	);
}
