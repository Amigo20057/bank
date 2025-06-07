import { CheckCircle, HelpCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { MyButton } from "../../components/MyButton";
import { MyInput } from "../../components/MyInput";
import { userVerification } from "../../hooks/user/mutations/useVerification";
import { useProfile } from "../../hooks/user/useProfile";

export const RequestVerification = () => {
	const navigation = useNavigate();
	const { data, isLoading } = useProfile();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<{
		email: string;
	}>({
		defaultValues: {
			email: data?.email,
		},
	});

	const { requestVerificationMutation } = userVerification();

	useEffect(() => {
		if (data?.email) {
			setValue("email", data.email);
		}
	}, [data?.email, setValue]);

	const submit: SubmitHandler<{ email: string }> = data => {
		requestVerificationMutation.mutate(data);
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
						<h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
					</div>

					<form onSubmit={handleSubmit(submit)} className="flex flex-col gap-3">
						{errors.email && (
							<p className="text-red-500 text-xs">{errors.email.message}</p>
						)}
						<MyInput
							disabled
							type="text"
							placeholder="Email Address"
							{...register("email", {
								required: "This field is required",
							})}
						/>

						<MyButton
							text="Send Verification Code"
							type="submit"
							margin="mt-2"
							height="h-[60px]"
						/>

						<p className="text-[12px] text-gray-500 mt-2">
							<Link to="/security">
								<span className="text-indigo-400 hover:underline">Back</span>
							</Link>
						</p>

						{requestVerificationMutation.isSuccess && (
							<div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
								<CheckCircle className="w-4 h-4" />
								Verification email has been sent!
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
							If you don’t have access to your email, please contact our support
							team for assistance.
						</div>
					</div>
					<p className="text-xs text-gray-500 mt-4">
						⚠️ The code will be sent to your email that you specified during
						registration, if you do not have access to it, you can change it in
						the settings
					</p>
				</div>
			</div>
		</div>
	);
};
