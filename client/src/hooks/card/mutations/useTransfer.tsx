import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { ITransfer } from "../../../types/transfers.interface";

export const useTransfer = () => {
	const queryClient = useQueryClient();
	const navigation = useNavigate();
	const transferMutation = useMutation({
		mutationFn: async (data: ITransfer) => {
			return await axios.post(
				`${import.meta.env.VITE_API_GATEWAY_URL}/card/transfer`,
				data,
				{
					withCredentials: true,
				}
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cards"] });
			navigation("/");
		},
		onError: error => {
			console.error("Error transfer:", error);
		},
	});
	return { transferMutation };
};
