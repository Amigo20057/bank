import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useChangePhoneNumber = () => {
	const navigation = useNavigate();
	const queryClient = useQueryClient();

	const changePhoneNumberMutation = useMutation({
		mutationFn: async (data: { newPhoneNumber: string; password: string }) => {
			return await axios.patch(
				`${import.meta.env.VITE_API_GATEWAY_URL}/user/changePhoneNumber`,
				data,
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			navigation("/");
		},
		onError: (error: any) => {
			console.error("Change Phone Number error:", error);
		},
	});

	return { changePhoneNumberMutation };
};
