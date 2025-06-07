import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useChangeDateOfBirth = () => {
	const navigation = useNavigate();
	const queryClient = useQueryClient();

	const changeDateOfBirthMutation = useMutation({
		mutationFn: async (data: { newDate: Date; password: string }) => {
			return await axios.patch(
				`${import.meta.env.VITE_API_GATEWAY_URL}/user/change-date-of-birth`,
				data,
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			navigation("/");
		},
		onError: (error: any) => {
			console.error("Change date of birth error:", error);
		},
	});

	return { changeDateOfBirthMutation };
};
