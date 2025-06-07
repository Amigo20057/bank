import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { ILoan } from "../../../types/card.interface";

export const useTakeLoan = () => {
	const navigation = useNavigate();
	const queryClient = useQueryClient();

	const takeLoanMutation = useMutation({
		mutationFn: async (data: ILoan) => {
			return await axios.post(
				`${import.meta.env.VITE_API_GATEWAY_URL}/card/loan`,
				data,
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cards"] });
			navigation("/");
		},
		onError: error => {
			console.error("Error take loan:", error);
		},
	});

	return { takeLoanMutation };
};
