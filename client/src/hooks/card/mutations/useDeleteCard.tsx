import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useDeleteCard = () => {
	const navigation = useNavigate();
	const queryClient = useQueryClient();

	const deleteCardMutation = useMutation({
		mutationFn: async (data: { cardId: number; cvvCode: number }) => {
			return await axios.delete(
				`${import.meta.env.VITE_API_GATEWAY_URL}/card/delete`,
				{ withCredentials: true, data: data }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cards"] });
			navigation("/");
		},
		onError: error => {
			console.error("Delete Card Error:", error);
		},
	});

	return { deleteCardMutation };
};
