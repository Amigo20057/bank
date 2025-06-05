import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export const useTransactions = (
	data?: { numbersCards: string[] },
	limit?: number
) => {
	return useQuery({
		queryKey: ["transactions", data],
		queryFn: async () => {
			return await axios.post(
				`${import.meta.env.VITE_API_GATEWAY_URL}/transactions/`,
				data,
				{ params: { limit }, withCredentials: true }
			);
		},
		select: res => res.data,
		enabled: !!data?.numbersCards?.length,
	});
};
