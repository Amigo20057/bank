import { CheckCircle, HelpCircle } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { MyButton } from "../../components/MyButton";
import { MyInput } from "../../components/MyInput";
import { useChangeFullName } from "../../hooks/settings/useChangeFullName";
import { useProfile } from "../../hooks/user/useProfile";

export const FullNameChange = () => {
	const navigation = useNavigate();
	const { data, isLoading } = useProfile();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{
		firstName: string;
		lastName: string;
		password: string;
	}>();

	const { changeFullNameMutation } = useChangeFullName();

	const submit: SubmitHandler<{
		firstName: string;
		lastName: string;
		password: string;
	}> = data => {
		changeFullNameMutation.mutate(data);
	};

	if (!data && !isLoading) {
		navigation("/auth/login");
	}

	return (
		<div className="w-full h-screen p-6 bg-gradient-to-br from-[#1f2937] via-[#111827] to-black text-white flex justify-center items-center relative overflow-hidden">
			{isLoading && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center">
					<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
				</div>
			)}

			<div className="absolute w-[300px] h-[300px] bg-indigo-700/20 rounded-full top-[-50px] left-[-100px] blur-3xl" />
			<div className="absolute w-[250px] h-[250px] bg-pink-700/20 rounded-full bottom-[-40px] right-[-80px] blur-2xl" />

			<div className="z-10 bg-[#121212] border border-gray-800 rounded-2xl p-10 shadow-2xl w-[900px] flex gap-10">
				<div className="w-1/2">
					<div className="text-left mb-8">
						<h1 className="text-3xl font-bold mb-2">Change Full Name</h1>
					</div>

					<form onSubmit={handleSubmit(submit)} className="flex flex-col gap-3">
						{errors.firstName && (
							<p className="text-red-500 text-xs">{errors.firstName.message}</p>
						)}
						<MyInput
							type="text"
							placeholder="First Name"
							{...register("firstName", { required: "This field is required" })}
						/>

						{errors.lastName && (
							<p className="text-red-500 text-xs">{errors.lastName.message}</p>
						)}
						<MyInput
							type="text"
							placeholder="Last Name"
							{...register("lastName", { required: "This field is required" })}
						/>

						{!data?.googleId && (
							<>
								{errors.password && (
									<p className="text-red-500 text-xs">
										{errors.password.message}
									</p>
								)}
								<MyInput
									type="password"
									placeholder="Password"
									{...register("password", {
										required: "Password is required",
									})}
								/>
							</>
						)}

						<MyButton
							text="Change"
							type="submit"
							margin="mt-2"
							height="h-[60px]"
						/>

						<p className="text-[12px] text-gray-500 mt-2">
							<Link to="/security">
								<span className="text-indigo-400 hover:underline">Back</span>
							</Link>
						</p>

						{changeFullNameMutation.isSuccess && (
							<div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
								<CheckCircle className="w-4 h-4" />
								Full Name successfully changed!
							</div>
						)}
					</form>
				</div>

				<div className="w-1/2 bg-black/30 border border-gray-700 rounded-xl p-5 text-sm text-gray-300 flex flex-col gap-4 justify-center">
					<div className="flex items-start gap-3">
						<HelpCircle className="w-5 h-5 text-indigo-400 mt-1" />
						<div>
							<h4 className="text-base font-semibold mb-1 text-white">
								Need Help?
							</h4>
							If you don’t have access to your old email, please contact our
							support team for assistance.
						</div>
					</div>

					{/* <p className="text-xs text-gray-500 mt-4">
						⚠️ Make sure you confirm your new email address after updating it.
					</p> */}
				</div>
			</div>
		</div>
	);
};
