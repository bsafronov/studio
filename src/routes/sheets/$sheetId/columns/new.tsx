import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import z from "zod";
import { Form, useAppForm } from "@/components/app-form";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import type { sheetColumnType } from "@/db/schema";
import { orpc } from "@/orpc/client";

type ColumnType = (typeof sheetColumnType.enumValues)[number];
const columnTypeTranslations: Record<ColumnType, string> = {
	string: "Строка",
	boolean: "Да/нет",
	number: "Число",
	date: "Дата",
};

const columnTypeOptions = Object.entries(columnTypeTranslations).map(
	([value, label]) => ({ value, label }),
);

export const Route = createFileRoute("/sheets/$sheetId/columns/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const { sheetId } = Route.useParams();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { mutateAsync: createColumn } = useMutation(
		orpc.sheet.createColumn.mutationOptions({
			onSuccess: () => {
				qc.invalidateQueries({
					queryKey: orpc.sheet.getColumns.queryKey({ input: { sheetId } }),
				});
				navigate({
					to: "/sheets/$sheetId",
					params: { sheetId },
				});
			},
		}),
	);

	const form = useAppForm({
		defaultValues: {
			type: "string" as (typeof sheetColumnType.enumValues)[number],
			name: "",
		},
		onSubmit: async ({ value: { name, type } }) => {
			await createColumn({
				name,
				type,
				sheetId,
			});
		},
	});

	return (
		<Card>
			<CardContent>
				<Form onSubmit={form.handleSubmit}>
					<FieldGroup>
						<form.AppField
							name="name"
							validators={{
								onBlur: z.string().min(1, "Название не может быть пустым"),
							}}
						>
							{(field) => <field.TextField label="Название" />}
						</form.AppField>
						<form.AppField name="type">
							{(field) => (
								<field.SelectField
									label="Название"
									options={columnTypeOptions}
								/>
							)}
						</form.AppField>
						<form.AppForm>
							<form.SubscribeButton label="Создать" />
						</form.AppForm>
					</FieldGroup>
				</Form>
			</CardContent>
		</Card>
	);
}
