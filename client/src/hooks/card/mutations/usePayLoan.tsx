import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const usePayLoan = () => {
	const navigation = useNavigate();
	const queryClient = useQueryClient();

	const payLoanMutation = useMutation({
		mutationFn: async (data: Record<string, any>) => {
			return await axios.patch(
				`${import.meta.env.VITE_API_GATEWAY_URL}/card/pay-loan`,
				data,
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["loans"] });
			navigation("/loan/loans");
		},
		onError: error => {
			console.log("Error pay loan ", error);
		},
	});

	return { payLoanMutation };
};
