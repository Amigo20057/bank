import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCards = () => {
	return useQuery({
		queryKey: ["cards"],
		queryFn: async () => {
			return await axios.get(
				`${import.meta.env.VITE_API_GATEWAY_URL}/card/cards`,
				{ withCredentials: true }
			);
		},
		select: data => data.data,
	});
};
