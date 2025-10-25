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
	number: "Число",
	date: "Дата",
	boolean: "Да/нет",
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
					queryKey: orpc.sheet.columnList.queryKey({ input: { sheetId } }),
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
			required: true,
		},
		onSubmit: async ({ value: { name, type, required } }) => {
			await createColumn({
				name,
				type,
				sheetId,
				required: type === "boolean" ? false : required,
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
									label="Тип столбца"
									options={columnTypeOptions}
								/>
							)}
						</form.AppField>
						<form.Subscribe selector={(api) => api.values.type === "boolean"}>
							{(isBooleanType) => {
								return isBooleanType ? null : (
									<form.AppField name="required">
										{(field) => (
											<field.CheckboxField label="Обязательное поле" />
										)}
									</form.AppField>
								);
							}}
						</form.Subscribe>
						<form.AppForm>
							<form.SubscribeButton label="Создать" />
						</form.AppForm>
					</FieldGroup>
				</Form>
			</CardContent>
		</Card>
	);
}
