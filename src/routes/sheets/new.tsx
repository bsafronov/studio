import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { Form, useAppForm } from "@/components/app-form";
import { FieldGroup } from "@/components/ui/field";
import { orpc } from "@/orpc/client";

export const Route = createFileRoute("/sheets/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { mutateAsync: createSheet } = useMutation(
		orpc.sheet.createSheet.mutationOptions({
			onSuccess: ({ id }) => {
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
		<>
			<AppBreadcrumb />
			<Form className="p-4">
				<FieldGroup>
					<form.AppField name="name">
						{(field) => <field.TextField label="Название" />}
					</form.AppField>
					<form.AppForm>
						<form.SubscribeButton label="Создать" />
					</form.AppForm>
				</FieldGroup>
			</Form>
		</>
	);
}
