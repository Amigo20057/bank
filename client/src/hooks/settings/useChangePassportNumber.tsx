import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useChangePassportNumber = () => {
	const navigation = useNavigate();
	const queryClient = useQueryClient();

	const changePassportNumberMutation = useMutation({
		mutationFn: async (data: {
			newPassportNumber: string;
			password: string;
		}) => {
			return await axios.patch(
				`${import.meta.env.VITE_API_GATEWAY_URL}/user/changePassportNumber`,
				data,
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			navigation("/");
		},
		onError: (error: any) => {
			console.error("Change Email error:", error);
		},
	});

	return { changePassportNumberMutation };
};
