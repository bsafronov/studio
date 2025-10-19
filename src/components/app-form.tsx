import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, useId, useState } from "react";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "./ui/input-group";
import { Spinner } from "./ui/spinner";

const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		NumberField,
		PasswordField,
	},
	formComponents: {
		SubscribeButton,
	},
});

type FieldProps = {
	label: string;
	description?: string;
};

export function Form({ onSubmit, ...props }: ComponentProps<"form">) {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit?.(e);
			}}
			{...props}
		/>
	);
}

function TextField({ label, description }: FieldProps) {
	const field = useFieldContext<string>();
	const id = useId();

	return (
		<Field>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Input
				name={field.name}
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
				onBlur={field.handleBlur}
				autoComplete={field.name}
			/>
			<FieldDescription>{description}</FieldDescription>
			<FieldError errors={field.state.meta.errors} />
		</Field>
	);
}

function PasswordField({ label, description }: FieldProps) {
	const field = useFieldContext<string>();
	const id = useId();
	const [isVisible, setIsVisible] = useState(false);

	return (
		<Field>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<InputGroup>
				<InputGroupInput
					type={isVisible ? "text" : "password"}
					name={field.name}
					value={field.state.value}
					onChange={(e) => field.handleChange(e.target.value)}
					onBlur={field.handleBlur}
					autoComplete={field.name}
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						size="icon-xs"
						onClick={() => setIsVisible((prev) => !prev)}
					>
						{isVisible ? <Eye /> : <EyeOff />}
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
			<FieldDescription>{description}</FieldDescription>
			<FieldError errors={field.state.meta.errors} />
		</Field>
	);
}

function NumberField({ label, description }: FieldProps) {
	const field = useFieldContext<number>();
	const id = useId();

	return (
		<Field>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Input
				type="number"
				name={field.name}
				value={field.state.value}
				onChange={(e) => field.handleChange(parseInt(e.target.value, 10))}
				onBlur={field.handleBlur}
			/>
			<FieldDescription>{description}</FieldDescription>
			<FieldError errors={field.state.meta.errors} />
		</Field>
	);
}

function SubscribeButton({ label }: { label: string }) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button type="submit" disabled={isSubmitting} className="ml-auto">
					{isSubmitting && <Spinner />}
					{label}
				</Button>
			)}
		</form.Subscribe>
	);
}
