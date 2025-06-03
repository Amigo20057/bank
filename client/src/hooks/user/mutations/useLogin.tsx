// useLogin.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { IUserLogin } from "../../../types/user.interface";

export const useLogin = (onCustomError?: (message: string) => void) => {
	const navigation = useNavigate();

	const loginMutation = useMutation({
		mutationFn: async (data: IUserLogin) => {
			return await axios.post(
				`${import.meta.env.VITE_API_GATEWAY_URL}/auth/login`,
				data,
				{ withCredentials: true }
			);
		},
		onSuccess: () => {
			navigation("/");
		},
		onError: (error: any) => {
			const serverMessage = error?.response?.data?.message;

			if (
				typeof serverMessage === "string" &&
				serverMessage.includes("NOT_FOUND: User not found")
			) {
				onCustomError?.("Incorrect credentials. Please try again.");
			} else {
				onCustomError?.("Something went wrong. Try again later.");
			}
			console.error("Login error:", error);
		},
	});

	return { loginMutation };
};
