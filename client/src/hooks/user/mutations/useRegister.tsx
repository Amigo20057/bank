import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { IUserRegister } from "../../../types/user.interface";

export const useRegister = (onCustomError?: (message: string) => void) => {
	const navigation = useNavigate();

	const registerMutation = useMutation({
		mutationFn: async (data: IUserRegister) => {
			return await axios.post(
				`${import.meta.env.VITE_API_GATEWAY_URL}/auth/register`,
				data,
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			navigation("/");
		},
		onError: (error: any) => {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				"Unknown error occurred";

			if (typeof message === "string") {
				onCustomError?.(message);
			} else {
				onCustomError?.("Something went wrong");
			}
		},
	});

	return { registerMutation };
};
