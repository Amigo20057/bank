import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useChangePassword = () => {
	const navigation = useNavigate();
	const queryClient = useQueryClient();

	const changePasswordMutation = useMutation({
		mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
			return await axios.patch(
				`${import.meta.env.VITE_API_GATEWAY_URL}/user/change-password`,
				data,
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			navigation("/");
		},
		onError: (error: any) => {
			console.error("Change password error:", error);
		},
	});

	return { changePasswordMutation };
};
