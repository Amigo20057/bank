import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useLoans = (cardNumber: string) => {
	return useQuery({
		queryKey: ["loans", cardNumber],
		enabled: !!cardNumber,
		queryFn: async () => {
			const res = await axios.get(
				`${import.meta.env.VITE_API_GATEWAY_URL}/card/loans/${cardNumber}`,
				{ withCredentials: true }
			);
			return res.data;
		},
	});
};
