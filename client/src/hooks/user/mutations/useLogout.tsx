import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
	const navigation = useNavigate();

	const logoutMutation = useMutation({
		mutationFn: async () => {
			return await axios.post(
				`${import.meta.env.VITE_API_GATEWAY_URL}/auth/logout`,
				{},
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			navigation("/auth/login");
		},
		onError: error => {
			console.error("Error logout", error);
		},
	});

	return { logoutMutation };
};
