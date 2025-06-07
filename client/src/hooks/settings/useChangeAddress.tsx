import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useChangeAddress = () => {
	const navigation = useNavigate();
	const queryClient = useQueryClient();

	const changeAddressMutation = useMutation({
		mutationFn: async (data: { newAddress: string; password: string }) => {
			return await axios.patch(
				`${import.meta.env.VITE_API_GATEWAY_URL}/user/change-address`,
				data,
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			navigation("/");
		},
		onError: (error: any) => {
			console.error("Change Address error:", error);
		},
	});

	return { changeAddressMutation };
};
