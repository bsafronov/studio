import { Store } from "@tanstack/store";

export type AlertDialogState = {
	open: boolean;
	title?: string;
	description?: string;
	onConfirm?: () => void;
};

export const alertDialogStore = new Store<AlertDialogState>({
	open: false,
});

export function confirmDialog({
	onConfirm,
	description,
	title,
}: Omit<AlertDialogState, "open">) {
	alertDialogStore.setState({
		open: true,
		onConfirm,
		description,
		title,
	});
}

export function closeAlertDialog() {
	alertDialogStore.setState({
		open: false,
		onConfirm: undefined,
		description: undefined,
		title: undefined,
	});
}
