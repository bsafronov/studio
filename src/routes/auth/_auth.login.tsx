import { createFileRoute } from "@tanstack/react-router";
import { Form, useAppForm } from "@/components/app-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

export const Route = createFileRoute("/auth/_auth/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useAppForm({
		defaultValues: {
			username: "",
			password: "",
		},
		onSubmit: (data) => console.log(data),
	});

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Добро пожаловать</CardTitle>
				<CardDescription>
					Войди, чтобы получить больше возможностей
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form onSubmit={form.handleSubmit}>
					<FieldGroup>
						<form.AppField name="username">
							{(field) => <field.TextField label="Логин" />}
						</form.AppField>
						<form.AppField name="password">
							{(field) => <field.PasswordField label="Пароль" />}
						</form.AppField>
						<form.AppForm>
							<form.SubscribeButton label="Войти" />
						</form.AppForm>
					</FieldGroup>
				</Form>
			</CardContent>
		</Card>
	);
}
