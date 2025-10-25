import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import z from "zod";
import { type FieldProps, Form, useAppForm } from "@/components/app-form";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
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
	const navigate = useNavigate();
	const { data: columns } = useSuspenseQuery(
		orpc.sheet.getColumns.queryOptions({ input: { sheetId } }),
	);
	const { mutateAsync: createRow } = useMutation(
		orpc.sheet.createRow.mutationOptions({
			onSuccess: () => {
				navigate({
					to: "/sheets/$sheetId",
					params: { sheetId },
				});
			},
		}),
	);

	const form = useAppForm({
		defaultValues: {} as Record<string, unknown>,
		onSubmit: async ({ value }) => {
			const data = Object.fromEntries(
				Object.entries(value).map(([key, value]) => {
					if (typeof value === "string") {
						return [key, value.trim()];
					}
					return [key, value];
				}),
			);

			await createRow({
				sheetId,
				data,
			});
		},
	});

	return (
		<Card>
			<CardContent>
				<Form onSubmit={form.handleSubmit}>
					<FieldGroup>
						{columns.map(({ type, id, name, required }) => {
							const getSchema = () => {
								if (!required) return;

								if (type === "string") {
									return z
										.string({ error: "Обязательное поле" })
										.trim()
										.min(1, "Обязательное поле");
								}

								if (type === "number") {
									return z.number({ error: "Обязательное поле" });
								}
							};
							const schema = getSchema();
							return (
								<form.AppField
									key={id}
									name={id}
									validators={{
										onBlur: schema,
									}}
								>
									{(field) => {
										const fieldProps = {
											label: name,
											required,
										} satisfies FieldProps;

										switch (type) {
											case "string":
												return <field.TextField {...fieldProps} />;
											case "number":
												return <field.NumberField {...fieldProps} />;
											case "boolean":
												return <field.CheckboxField {...fieldProps} />;
											case "date":
												return <field.DateField {...fieldProps} />;
										}
									}}
								</form.AppField>
							);
						})}
						<form.AppForm>
							<form.SubscribeButton label="Создать" />
						</form.AppForm>
					</FieldGroup>
				</Form>
			</CardContent>
		</Card>
	);
}
