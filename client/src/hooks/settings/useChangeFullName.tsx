import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useChangeFullName = () => {
	const navigation = useNavigate();
	const queryClient = useQueryClient();

	const changeFullNameMutation = useMutation({
		mutationFn: async (data: {
			firstName: string;
			lastName: string;
			password: string;
		}) => {
			return await axios.patch(
				`${import.meta.env.VITE_API_GATEWAY_URL}/user/change-full-name`,
				data,
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			navigation("/");
		},
		onError: (error: any) => {
			console.error("Change Full Name error:", error);
		},
	});

	return { changeFullNameMutation };
};
