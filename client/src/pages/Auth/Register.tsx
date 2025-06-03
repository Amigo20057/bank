import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { MyButton } from "../../components/MyButton";
import { MyInput } from "../../components/MyInput";
import { MessageBox } from "../../components/UI/MessageBox";
import { useRegister } from "../../hooks/user/mutations/useRegister";
import type { IUserRegister } from "../../types/user.interface";
import logoGoogle from "./assets/logoGoogle.png";

type Message = { id: string; text: string; status: "SUCCESS" | "ERROR" };

export const Register = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IUserRegister>();

	const [messages, setMessages] = useState<Message[]>([]);

	const addMessage = (text: string, status: "SUCCESS" | "ERROR") => {
		const newMessage = { id: Date.now().toString(), text, status };
		setMessages(prev => [...prev, newMessage]);

		setTimeout(() => {
			setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
		}, 3000);
	};

	const { registerMutation } = useRegister((err: any) => {
		console.log(err);
		if (err === "User with this email already exists") {
			addMessage("User with such email or phone already exists", "ERROR");
		} else {
			addMessage("Something went wrong", "ERROR");
		}
	});

	const submit: SubmitHandler<IUserRegister> = data => {
		registerMutation.mutate(data);
	};

	return (
		<div className="w-full h-screen p-6 bg-gradient-to-br from-[#1f2937] via-[#111827] to-black text-white flex justify-center items-center overflow-hidden">
			{registerMutation.status === "pending" && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center">
					<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
				</div>
			)}

			<div className="w-[880px] bg-[#121212] border border-gray-800 rounded-2xl p-10 shadow-2xl">
				<div className="text-center mb-10">
					<h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
					<p className="text-gray-400 text-sm">
						Please fill in the form to register a new account.
					</p>
				</div>

				<div className="flex justify-between gap-8">
					<form
						onSubmit={handleSubmit(submit)}
						className="grid grid-cols-2 gap-4 w-full"
					>
						<MyInput
							type="text"
							placeholder="First Name"
							{...register("firstName", { required: "First name is required" })}
						/>
						<MyInput
							type="text"
							placeholder="Last Name"
							{...register("lastName", { required: "Last name is required" })}
						/>
						<MyInput
							type="text"
							placeholder="Email"
							{...register("email", { required: "Email is required" })}
						/>
						<MyInput
							type="text"
							placeholder="Phone Number"
							{...register("telephoneNumber", {
								required: "Phone number is required",
							})}
						/>
						<MyInput
							type="text"
							placeholder="Passport Number"
							{...register("passportNumber", {
								required: "Passport number is required",
							})}
						/>
						<MyInput
							type="password"
							placeholder="Password"
							{...register("password", { required: "Password is required" })}
						/>
						<MyInput
							type="text"
							placeholder="Address"
							{...register("address", { required: "Address is required" })}
						/>
						<MyInput
							type="date"
							placeholder="Date of Birth"
							{...register("dateOfBirth", {
								required: "Date of birth is required",
							})}
						/>

						<div className="col-span-2">
							<MyButton
								text="Register Account"
								type="submit"
								height="h-[60px]"
							/>
							<p className="text-[12px] text-gray-500 mt-2">
								Already have an account?{" "}
								<Link to="/auth/login">
									<span className="text-indigo-400 hover:underline">Login</span>
								</Link>
							</p>
						</div>
					</form>
				</div>

				<div className="mt-6">
					<p className="text-center mb-4">OR</p>
					<div className="w-full p-[1px] rounded-xl bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-800 transition hover:scale-[1.02]">
						<button className="flex items-center justify-center gap-3 w-full h-[60px] rounded-xl bg-[#1a1a1a] text-white text-sm">
							<img src={logoGoogle} className="w-5 h-5" alt="Google" />
							Sign up with Google
						</button>
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
