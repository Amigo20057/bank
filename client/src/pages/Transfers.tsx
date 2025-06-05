import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Sidebar } from "../components/Sidebar";
import { useTransfer } from "../hooks/card/mutations/useTransfer";
import { useCards } from "../hooks/card/useCards";
import { useProfile } from "../hooks/user/useProfile";
import type { ICard } from "../types/card.interface";
import type { ITransfer } from "../types/transfers.interface";

export const Transfers = () => {
	const navigate = useNavigate();
	const { data: userProfileData, isLoading: userIsLoading } = useProfile();
	const { data: cardsData, isLoading: cardsIsLoading } = useCards();
	const { transferMutation } = useTransfer();
	const [selectedCard, setSelectedCard] = useState<ICard | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<ITransfer>();

	const isLoading = userIsLoading || cardsIsLoading;

	if (!userProfileData && !userIsLoading) {
		navigate("/auth/login");
	}

	const onSubmit: SubmitHandler<ITransfer> = data => {
		const payload = {
			...data,
			cvvCode: +data.cvvCode,
			valuta: !data.valuta ? "USD" : data.valuta,
		};
		console.log(payload);
		transferMutation.mutate(payload);
	};

	const watchedCardNumber = watch("senderCardNumber");
	const currentCard = cardsData?.find(
		(c: ICard) => c.cardNumber === watchedCardNumber
	);
	if (currentCard && selectedCard?.cardNumber !== currentCard.cardNumber) {
		setSelectedCard(currentCard);
	}

	return (
		<div className="flex relative">
			{isLoading && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center">
					<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
				</div>
			)}

			<div className="fixed left-0 top-0 h-screen w-[250px] z-50">
				<Sidebar />
			</div>

			<div className="p-6 w-full ml-[250px] bg-gradient-to-br from-[#1f2937] via-[#111827] to-black text-white min-h-screen">
				<h2 className="text-2xl font-semibold mb-6">Transfer Money</h2>

				<div className="max-w-5xl flex flex-col lg:flex-row gap-10 items-start">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="bg-black/30 backdrop-blur-sm p-6 rounded-xl w-full max-w-lg border border-white/10 shadow-inner"
					>
						<label className="block mb-3">
							<span className="text-sm text-gray-400">Select Your Card</span>
							<select
								className="w-full mt-1 bg-[#1f1f1f] border border-white/10 rounded px-4 py-2 text-white"
								{...register("senderCardNumber", { required: true })}
								onChange={e => setValue("senderCardNumber", e.target.value)}
								defaultValue=""
							>
								<option value="" disabled>
									Select card
								</option>
								{cardsData?.map((card: ICard) => (
									<option key={card.cardNumber} value={card.cardNumber}>
										{card.cardNumber}
									</option>
								))}
							</select>
							{errors.senderCardNumber && (
								<p className="text-red-500 text-sm mt-1">Card is required</p>
							)}
						</label>

						<label className="block mb-3">
							<span className="text-sm text-gray-400">CVV Code</span>
							<input
								type="password"
								{...register("cvvCode", {
									required: true,
									minLength: 3,
									maxLength: 4,
								})}
								className="w-full mt-1 bg-[#1f1f1f] border border-white/10 rounded px-4 py-2 text-white"
							/>
							{errors.cvvCode && (
								<p className="text-red-500 text-sm mt-1">Valid CVV required</p>
							)}
						</label>

						<label className="block mb-3">
							<span className="text-sm text-gray-400">Available Balance</span>
							<input
								type="text"
								disabled
								value={
									selectedCard
										? `${selectedCard.balance} ${selectedCard.valuta}`
										: "__"
								}
								className="w-full mt-1 bg-[#1f1f1f] border border-white/10 rounded px-4 py-2 text-white cursor-not-allowed"
							/>
						</label>

						<label className="block mb-3">
							<span className="text-sm text-gray-400">
								Recipient Card Number
							</span>
							<input
								type="text"
								{...register("recipientCardNumber", {
									required: true,
									minLength: 16,
									maxLength: 16,
								})}
								className="w-full mt-1 bg-[#1f1f1f] border border-white/10 rounded px-4 py-2 text-white"
							/>
							{errors.recipientCardNumber && (
								<p className="text-red-500 text-sm mt-1">
									Enter valid card number
								</p>
							)}
						</label>

						<label className="block mb-4">
							<span className="text-sm text-gray-400">Amount to Transfer</span>
							<input
								type="number"
								step="0.01"
								{...register("amount", {
									required: true,
									min: 0.01,
									max: selectedCard ? selectedCard.balance : undefined,
								})}
								className="w-full mt-1 bg-[#1f1f1f] border border-white/10 rounded px-4 py-2 text-white"
							/>
							{errors.amount && (
								<p className="text-red-500 text-sm mt-1">
									Amount must be valid and not exceed balance
								</p>
							)}
						</label>

						<button
							type="submit"
							className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition"
						>
							Send Transfer
						</button>
					</form>

					{selectedCard && (
						<div className="flex-shrink-0">
							<Card
								key={selectedCard.id}
								balance={selectedCard.balance}
								cardNumber={selectedCard.cardNumber}
								cardValidatePeriod={selectedCard.cardValidatePeriod}
								cvvCode={selectedCard.cvvCode}
								status={selectedCard.status}
								valuta={selectedCard.valuta}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
