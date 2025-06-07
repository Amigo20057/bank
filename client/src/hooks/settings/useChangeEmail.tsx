import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useChangeEmail = () => {
	const navigation = useNavigate();
	const queryClient = useQueryClient();

	const changeEmailMutation = useMutation({
		mutationFn: async (data: { newEmail: string; password: string }) => {
			return await axios.patch(
				`${import.meta.env.VITE_API_GATEWAY_URL}/user/change-email`,
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

	return { changeEmailMutation };
};
