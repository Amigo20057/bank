import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const userVerification = () => {
	const navigation = useNavigate();
	const queryClient = useQueryClient();

	const requestVerificationMutation = useMutation({
		mutationFn: async (data: { email: string }) => {
			return await axios.post(
				`${import.meta.env.VITE_API_GATEWAY_URL}/user/request-verification`,
				data,
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			navigation("/settings/verify-account");
		},
		onError: error => {
			console.log("Error request verification", error);
		},
	});

	const verifyAccountMutation = useMutation({
		mutationFn: async (data: { code: string }) => {
			return await axios.post(
				`${import.meta.env.VITE_API_GATEWAY_URL}/user/verify-account`,
				data,
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			navigation("/security");
		},
		onError: error => {
			console.log("Error verify account", error);
		},
	});

	return { requestVerificationMutation, verifyAccountMutation };
};
