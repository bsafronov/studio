import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Form, useAppForm } from "@/components/app-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { orpc } from "@/orpc/client";

export const Route = createFileRoute("/auth/_auth/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const { mutateAsync: handleLogin } = useMutation(
		orpc.auth.login.mutationOptions(),
	);
	const form = useAppForm({
		defaultValues: {
			username: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await handleLogin(value);
		},
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
						<Field>
							<form.AppForm>
								<form.SubscribeButton label="Войти" />
							</form.AppForm>
							<FieldDescription className="text-center">
								Впервые здесь? <Link to="/auth/register">Регистрация</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</Form>
			</CardContent>
		</Card>
	);
}
