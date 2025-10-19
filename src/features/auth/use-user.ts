import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";

export const useUser = () => {
	const { data: user } = useQuery(orpc.auth.currentUser.queryOptions());
	return user;
};
