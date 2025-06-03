import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useProfile = () => {
	return useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			return await axios.get(
				`${import.meta.env.VITE_API_GATEWAY_URL}/user/profile`,
				{ withCredentials: true }
			);
		},
		select: data => data.data,
		retry: false,
	});
};
