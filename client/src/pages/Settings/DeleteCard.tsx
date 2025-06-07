import { CheckCircle, HelpCircle } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { MyButton } from "../../components/MyButton";
import { MyInput } from "../../components/MyInput";
import { useDeleteCard } from "../../hooks/card/mutations/useDeleteCard";
import { useCards } from "../../hooks/card/useCards";
import { useProfile } from "../../hooks/user/useProfile";
import type { ICard } from "../../types/card.interface";

export const DeleteCard = () => {
	const navigation = useNavigate();
	const { data: user, isLoading } = useProfile();
	const { data: cardsData, isLoading: cardsIsLoading } = useCards();
	const { deleteCardMutation } = useDeleteCard();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{
		cardId: number;
		cvvCode: number;
	}>();

	const submit: SubmitHandler<{
		cardId: number;
		cvvCode: number;
	}> = data => {
		deleteCardMutation.mutate(data);
	};

	if (cardsIsLoading || isLoading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		navigation("/auth/login");
		return null;
	}

	return (
		<div className="w-full h-screen p-6 bg-gradient-to-br from-[#1f2937] via-[#111827] to-black text-white flex justify-center items-center relative overflow-hidden">
			<div className="absolute w-[300px] h-[300px] bg-indigo-700/20 rounded-full top-[-50px] left-[-100px] blur-3xl" />
			<div className="absolute w-[250px] h-[250px] bg-pink-700/20 rounded-full bottom-[-40px] right-[-80px] blur-2xl" />

			<div className="z-10 bg-[#121212] border border-gray-800 rounded-2xl p-10 shadow-2xl w-[900px] flex gap-10">
				<div className="w-1/2">
					<h1 className="text-3xl font-bold mb-6">Delete a Card</h1>

					<form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
						{/* Card Selector */}
						<label className="text-sm font-medium text-gray-300">
							Select Card
						</label>
						<select
							className="bg-[#1f2937] border border-gray-700 rounded-lg p-3 text-white"
							{...register("cardId", { required: "Please select a card" })}
						>
							<option value="">-- Choose card --</option>
							{cardsData?.map((card: ICard) => (
								<option key={card.id} value={card.id}>
									{card.cardNumber}
								</option>
							))}
						</select>
						{errors.cardId && (
							<p className="text-red-500 text-xs">{errors.cardId.message}</p>
						)}

						{/* CVV */}
						<MyInput
							type="password"
							placeholder="CVV"
							maxLength={4}
							{...register("cvvCode", {
								required: "CVV is required",
								minLength: {
									value: 3,
									message: "CVV must be at least 3 digits",
								},
							})}
						/>
						{errors.cvvCode && (
							<p className="text-red-500 text-xs">{errors.cvvCode.message}</p>
						)}

						<MyButton
							text="Delete"
							type="submit"
							margin="mt-4"
							height="h-[60px]"
						/>

						<p className="text-[12px] text-gray-500 mt-2">
							<Link to="/security">
								<span className="text-indigo-400 hover:underline">Back</span>
							</Link>
						</p>

						{deleteCardMutation.isSuccess && (
							<div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
								<CheckCircle className="w-4 h-4" />
								Card successfully deleted!
							</div>
						)}
					</form>
				</div>

				<div className="w-1/2 bg-black/30 border border-gray-700 rounded-xl p-5 text-sm text-gray-300 flex flex-col gap-4 justify-center">
					<div className="flex items-start gap-3">
						<HelpCircle className="w-5 h-5 text-indigo-400 mt-1" />
						<div>
							<h4 className="text-base font-semibold mb-1 text-white">
								You can't delete a card if you have a balance on it.
							</h4>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
