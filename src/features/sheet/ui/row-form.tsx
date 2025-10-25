import z from "zod";
import { type FieldProps, Form, useAppForm } from "@/components/app-form";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import type { SheetColumn } from "@/db/schema";

type RowFormProps = {
	columns: SheetColumn[];
	defaultValues?: Record<string, unknown>;
	onSubmit: (data: Record<string, unknown>) => Promise<void>;
};

export function RowForm({ columns, defaultValues, onSubmit }: RowFormProps) {
	const form = useAppForm({
		defaultValues,
		onSubmit: async ({ value }) => {
			const data = Object.fromEntries(
				Object.entries(value).map(([key, value]) => {
					if (typeof value === "string") {
						return [key, value.trim()];
					}
					return [key, value];
				}),
			);

			await onSubmit(data);
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
							<form.SubscribeButton label="Сохранить" />
						</form.AppForm>
					</FieldGroup>
				</Form>
			</CardContent>
		</Card>
	);
}
