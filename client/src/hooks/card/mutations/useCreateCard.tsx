import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCreateCard = () => {
	const queryClient = useQueryClient();

	const createCardMutation = useMutation({
		mutationFn: async () => {
			return await axios.post(
				`${import.meta.env.VITE_API_GATEWAY_URL}/card/create`,
				{},
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cards"] });
		},
		onError: error => {
			console.error("Login create card:", error);
		},
	});

	return { createCardMutation };
};
