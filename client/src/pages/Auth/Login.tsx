import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { MyButton } from "../../components/MyButton";
import { MyInput } from "../../components/MyInput";
import { MessageBox } from "../../components/UI/MessageBox";
import { useLogin } from "../../hooks/user/mutations/useLogin";
import type { IUserLogin } from "../../types/user.interface";
import logoGoogle from "./assets/logoGoogle.png";

type Message = { id: string; text: string; status: "SUCCESS" | "ERROR" };

export const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IUserLogin>();

	const [messages, setMessages] = useState<Message[]>([]);

	const addMessage = (text: string, status: "SUCCESS" | "ERROR") => {
		const newMessage = { id: Date.now().toString(), text, status };
		setMessages(prev => [...prev, newMessage]);

		setTimeout(() => {
			setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
		}, 3000);
	};

	const { loginMutation } = useLogin((err: any) => {
		if (
			err?.response?.data?.message === "gRPC error: 5 NOT_FOUND: User not found"
		) {
			addMessage("Incorrect login credentials", "ERROR");
		} else {
			addMessage("Something went wrong", "ERROR");
		}
	});

	const submit: SubmitHandler<IUserLogin> = data => {
		const payload = {
			...data,
			telephoneNumber: data.email,
		};
		loginMutation.mutate(payload);
	};

	return (
		<div className="w-full h-screen p-6 bg-gradient-to-br from-[#1f2937] via-[#111827] to-black text-white flex justify-center items-center relative overflow-hidden">
			{/* Spinner */}
			{loginMutation.status === "pending" && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center">
					<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
				</div>
			)}

			<div className="w-[880px] bg-[#121212] border border-gray-800 rounded-2xl p-10 shadow-2xl">
				<div className="text-center mb-10">
					<h1 className="text-3xl font-bold mb-2">Login to Your Account</h1>
					<p className="text-gray-400 text-sm">
						Welcome back! Please enter your credentials to continue.
					</p>
				</div>

				<div className="flex justify-between gap-8">
					{/* Form */}
					<form
						onSubmit={handleSubmit(submit)}
						className="flex flex-col justify-center w-1/2"
					>
						{errors.email && (
							<p className="text-red-500 text-xs mb-1">
								{errors.email.message}
							</p>
						)}
						<MyInput
							type="text"
							placeholder="Email / Phone number"
							{...register("email", { required: "This field is required" })}
						/>

						{errors.password && (
							<p className="text-red-500 text-xs mb-1">
								{errors.password.message}
							</p>
						)}
						<MyInput
							type="password"
							placeholder="Password"
							{...register("password", { required: "Password is required" })}
						/>

						<MyButton
							text="Login to Your Account"
							type="submit"
							margin="mt-2"
							height="h-[60px]"
						/>

						<p className="text-[12px] text-gray-500 mt-2">
							Don’t have an account yet?{" "}
							<Link to="/auth/register">
								<span className="text-indigo-400 hover:underline">
									Register now!
								</span>
							</Link>
						</p>
					</form>

					{/* Google Auth Buttons */}
					<div className="w-1/2 flex flex-col  items-center gap-4">
						{["Google", "Telegram", "Discord"].map((provider, idx) => (
							<div
								key={idx}
								className="w-full p-[1px] rounded-xl bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-800 transition hover:scale-[1.02]"
							>
								<button
									className="flex items-center justify-start gap-3 w-full h-[60px] rounded-xl bg-[#1a1a1a] text-white text-sm pl-5"
									onClick={() =>
										(window.location.href = `http://localhost:5000/auth/${provider.toLowerCase()}`)
									}
								>
									<img src={logoGoogle} className="w-5 h-5" alt={provider} />
									Sign in with {provider}
								</button>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Messages */}
			{messages.map(msg => (
				<MessageBox key={msg.id} text={msg.text} status={msg.status} />
			))}
		</div>
	);
};
