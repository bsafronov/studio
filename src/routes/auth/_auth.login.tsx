import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
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
	validateSearch: z.object({
		redirectUrl: z.string().optional(),
	}),
});

function RouteComponent() {
	const qc = useQueryClient();
	const { redirectUrl } = Route.useSearch();
	const navigate = useNavigate();

	const { mutateAsync: handleLogin } = useMutation(
		orpc.auth.login.mutationOptions({
			onSuccess: () => {
				qc.invalidateQueries({
					queryKey: orpc.auth.currentUser.queryKey(),
				});
				console.log({ redirectUrl });

				navigate({
					to: redirectUrl ?? "/",
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
