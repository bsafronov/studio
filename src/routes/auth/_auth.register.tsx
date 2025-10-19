import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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

export const Route = createFileRoute("/auth/_auth/register")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { mutateAsync: handleRegister } = useMutation(
		orpc.auth.register.mutationOptions({
			onSuccess: () => {
				navigate({
					to: "/auth/login",
				});
			},
		}),
	);

	const form = useAppForm({
		defaultValues: {
			username: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await handleRegister(value);
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
								Есть аккаунт? <Link to="/auth/login">Войти</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</Form>
			</CardContent>
		</Card>
	);
}
