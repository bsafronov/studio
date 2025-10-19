import { Link, useLocation } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";

const PATH_DICTIONARY: Record<string, string> = {
	sheets: "Таблицы",
	columns: "Столбцы",
	rows: "Строки",
	new: "Новая запись",
	auth: "Авторизация",
	login: "Вход",
	register: "Регистрация",
};

export function AppBreadcrumb() {
	const location = useLocation();
	const paths = location.pathname.split("/").slice(1);

	return (
		<div className="p-2 border-b flex items-center gap-2">
			<SidebarTrigger />
			<Breadcrumb>
				<BreadcrumbList>
					{paths.map((item, idx) => {
						const path = `/${paths.slice(0, idx + 1).join("/")}`;

						return (
							<Fragment key={idx.toString()}>
								<BreadcrumbItem>
									<BreadcrumbLink asChild>
										<Link
											to={path}
											className="data-[status='active']:text-blue-500 data-[status='active']:hover:text-blue-400"
											activeOptions={{ exact: true }}
										>
											{PATH_DICTIONARY[item] ?? item}
										</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
								{idx !== paths.length - 1 && <BreadcrumbSeparator />}
							</Fragment>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}
