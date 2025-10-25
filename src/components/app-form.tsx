import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, useId, useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "./ui/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";

const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		NumberField,
		PasswordField,
		SelectField,
		CheckboxField,
		DateField,
	},
	formComponents: {
		SubscribeButton,
	},
});

export type FieldProps = {
	label: string;
	description?: string;
	required?: boolean;
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

function TextField({ label, description, required }: FieldProps) {
	const field = useFieldContext<string>();
	const id = useId();

	return (
		<Field>
			<FieldLabel htmlFor={id} required={required}>
				{label}
			</FieldLabel>
			<Textarea
				id={id}
				name={field.name}
				value={field.state.value ?? ""}
				onChange={(e) => field.handleChange(e.target.value)}
				onBlur={field.handleBlur}
				autoComplete={field.name}
			/>
			<FieldDescription>{description}</FieldDescription>
			<FieldError errors={field.state.meta.errors} />
		</Field>
	);
}

function PasswordField({ label, description, required }: FieldProps) {
	const field = useFieldContext<string>();
	const id = useId();
	const [isVisible, setIsVisible] = useState(false);

	return (
		<Field>
			<FieldLabel htmlFor={id} required={required}>
				{label}
			</FieldLabel>
			<InputGroup>
				<InputGroupInput
					id={id}
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

function NumberField({ label, description, required }: FieldProps) {
	const field = useFieldContext<number>();
	const id = useId();
	return (
		<Field>
			<FieldLabel htmlFor={id} required={required}>
				{label}
			</FieldLabel>
			<Input
				id={id}
				type="number"
				name={field.name}
				value={field.state.value || ""}
				onChange={(e) => field.handleChange(parseInt(e.target.value, 10))}
				onBlur={field.handleBlur}
			/>
			<FieldDescription>{description}</FieldDescription>
			<FieldError errors={field.state.meta.errors} />
		</Field>
	);
}

type SelectOption = {
	value: string;
	label: React.ReactNode;
};

type SelectFieldProps = FieldProps & {
	options: SelectOption[];
};

function SelectField({
	label,
	description,
	required,
	options,
}: SelectFieldProps) {
	const field = useFieldContext<string>();
	const id = useId();
	return (
		<Field>
			<FieldLabel htmlFor={id} required={required}>
				{label}
			</FieldLabel>
			<Select
				value={field.state.value}
				name={field.name}
				onValueChange={field.handleChange}
			>
				<SelectTrigger>
					<SelectValue id={id} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option, idx) => (
						<SelectItem value={option.value} key={idx.toString()}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FieldDescription>{description}</FieldDescription>
			<FieldError errors={field.state.meta.errors} />
		</Field>
	);
}

function CheckboxField({ label, description, required }: FieldProps) {
	const field = useFieldContext<boolean>();
	const id = useId();

	return (
		<Field orientation="horizontal">
			<Checkbox
				id={id}
				name={field.name}
				onBlur={field.handleBlur}
				checked={field.state.value}
				onCheckedChange={(value) => field.handleChange(!!value)}
			/>
			<FieldLabel htmlFor={id} required={required}>
				{label}
			</FieldLabel>
			<FieldDescription>{description}</FieldDescription>
			<FieldError errors={field.state.meta.errors} />
		</Field>
	);
}

function DateField({ label, description, required }: FieldProps) {
	const field = useFieldContext<number>();
	const id = useId();
	return (
		<Field>
			<FieldLabel htmlFor={id} required={required}>
				{label}
			</FieldLabel>
			<Input
				id={id}
				type="date"
				name={field.name}
				value={field.state.value ?? ""}
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
