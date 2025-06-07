import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { MessageBox } from "../../components/UI/MessageBox";
import { useTakeLoan } from "../../hooks/card/mutations/useTakeLoan";
import { useCards } from "../../hooks/card/useCards";
import { useProfile } from "../../hooks/user/useProfile";
import type { ICard, ILoan } from "../../types/card.interface";

export const Loan = () => {
	const navigate = useNavigate();
	const { data: userProfileData, isLoading: userIsLoading } = useProfile();
	const { data: cardsData, isLoading: cardsIsLoading } = useCards();
	const { takeLoanMutation } = useTakeLoan();

	const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
	const [message, setMessage] = useState<{
		text: string;
		status: "SUCCESS" | "ERROR";
	} | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<ILoan>({
		defaultValues: {
			amount: 1000,
			term: 12,
			percent: 10,
		},
	});

	const watched = watch();
	const amount = Number(watched.amount);
	const term = Number(watched.term);
	const percent = Number(watched.percent);

	const totalRepayment = amount * (1 + percent / 100);
	const monthlyPayment = totalRepayment / term;

	const formattedMonthly = monthlyPayment.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	const formattedTotal = totalRepayment.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	if (!userProfileData && !userIsLoading) navigate("/auth/login");

	const onSubmit: SubmitHandler<ILoan> = data => {
		if (!userProfileData?.isVerified) {
			setMessage({ text: "You must verify your account.", status: "ERROR" });
			return;
		}

		const payload = {
			...data,
			amount: Number(data.amount),
			interestRate: Number(data.percent),
			termMonths: Number(data.term),
			cvvCode: Number(data.cvvCode),
			cardNumber: data.cardNumber,
		};

		takeLoanMutation.mutate(payload, {
			onSuccess: () => {
				setMessage({ text: "Loan successfully taken!", status: "SUCCESS" });
			},
			onError: () => {
				setMessage({ text: "Loan request failed.", status: "ERROR" });
			},
		});
	};

	const isLoading = userIsLoading || cardsIsLoading;
	const selected = cardsData?.find(
		(c: ICard) => c.cardNumber === watch("cardNumber")
	);
	if (selected && selected.cardNumber !== selectedCard?.cardNumber) {
		setSelectedCard(selected);
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

			<div className="p-10 w-full ml-[250px] bg-gradient-to-br from-[#1f2937] via-[#111827] to-black text-white min-h-screen flex justify-center items-start">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full max-w-5xl bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-inner"
				>
					<h2 className="text-3xl font-bold mb-8">💳 Loan</h2>

					<div className="mb-6">
						<label className="text-gray-400 mb-1 block">Your Card</label>
						<select
							{...register("cardNumber", { required: true })}
							onChange={e => setValue("cardNumber", e.target.value)}
							className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg px-4 py-3 text-white"
						>
							<option value="">Select card</option>
							{cardsData?.map((card: ICard) => (
								<option key={card.cardNumber} value={card.cardNumber}>
									{card.cardNumber}
								</option>
							))}
						</select>
					</div>

					{selectedCard && (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
							<div>
								<label className="text-gray-400 mb-1 block">CVV Code</label>
								<input
									type="password"
									{...register("cvvCode", {
										required: true,
										minLength: 3,
										maxLength: 4,
									})}
									className="w-full bg-[#1f1f1f] border border-white/10 rounded px-4 py-2 text-white"
								/>
							</div>
							<div>
								<label className="text-gray-400 mb-1 block">Balance</label>
								<input
									disabled
									value={`${selectedCard.balance.toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})} ${selectedCard.valuta}`}
									className="w-full bg-[#1f1f1f] border border-white/10 rounded px-4 py-2 text-gray-400"
								/>
							</div>
						</div>
					)}

					<div className="mb-6">
						<label className="text-gray-400 block mb-1">
							💵 Amount:
							<span className="text-white ml-2">
								{amount.toLocaleString("en-US", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</span>
						</label>
						<input
							type="range"
							min={100}
							max={20000}
							step={100}
							{...register("amount", { required: true })}
							className="w-full accent-green-500"
						/>
					</div>

					<div className="mb-6">
						<label className="text-gray-400 block mb-1">
							📆 Term: <span className="text-white ml-2">{term} months</span>
						</label>
						<input
							type="range"
							min={1}
							max={60}
							{...register("term", { required: true })}
							className="w-full accent-blue-500"
						/>
					</div>

					<div className="mb-6">
						<label className="text-gray-400 block mb-1">
							📈 Interest Rate:
							<span className="text-white ml-2">{percent}%</span>
						</label>
						<input
							type="range"
							min={1}
							max={30}
							step={0.1}
							{...register("percent", { required: true })}
							className="w-full accent-purple-500"
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
						<div className="bg-white/5 border border-white/10 rounded-xl p-4">
							<p className="text-gray-400">📤 Monthly Payment</p>
							<p className="text-xl font-bold text-indigo-400">
								{formattedMonthly} {selectedCard?.valuta || "USD"}
							</p>
						</div>
						<div className="bg-white/5 border border-white/10 rounded-xl p-4">
							<p className="text-gray-400">💸 Total to Repay</p>
							<p className="text-xl font-bold text-red-400">
								{formattedTotal} {selectedCard?.valuta || "USD"}
							</p>
						</div>
					</div>

					<div className="mb-6">
						<label className="text-gray-400 block mb-1">📝 Purpose</label>
						<textarea
							rows={3}
							{...register("purpose", { required: true })}
							className="w-full bg-[#1f1f1f] border border-white/10 rounded px-4 py-2 text-white resize-none"
							placeholder="E.g. buy laptop, education, trip..."
						/>
					</div>

					<button
						type="button"
						onClick={() => navigate("/loan/loans")}
						className="w-full py-2 mb-6 border border-white/10 hover:bg-white/10 rounded-xl text-white transition flex items-center justify-center gap-2 text-sm"
					>
						📋 Переглянути кредити
					</button>

					<button
						type="submit"
						className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition disabled:bg-gray-600 disabled:cursor-not-allowed"
						disabled={!userProfileData?.isVerified}
					>
						📨 Take Loan
					</button>

					{!userProfileData?.isVerified && (
						<p className="text-red-500 text-sm text-center mt-2">
							You must verify your account to apply for a loan.
						</p>
					)}
				</form>

				{message && <MessageBox text={message.text} status={message.status} />}
			</div>
		</div>
	);
};
