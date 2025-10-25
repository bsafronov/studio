import { useStore } from "@tanstack/react-store";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { alertDialogStore, closeAlertDialog } from "./lib";

export function AlertDialogProvider() {
	const {
		open,
		description = "Это действие нельзя будет отменить",
		title = "Вы уверены?",
		onConfirm,
	} = useStore(alertDialogStore);

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={closeAlertDialog}>
						Отменить
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							onConfirm?.();
							closeAlertDialog();
						}}
					>
						Подтвердить
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
