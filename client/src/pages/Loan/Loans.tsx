import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { usePayLoan } from "../../hooks/card/mutations/usePayLoan";
import { useCards } from "../../hooks/card/useCards";
import { useLoans } from "../../hooks/card/useLoans";
import type { ICard } from "../../types/card.interface";
export const Loans = () => {
	const { data: cardsData, isLoading: cardsIsLoading } = useCards();
	const { payLoanMutation } = usePayLoan();
	const [selectedCardNumber, setSelectedCardNumber] = useState("");
	const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
	const [statusFilter, setStatusFilter] = useState<
		"ALL" | "ACTIVE" | "PAID_OFF" | "DEFAULTED"
	>("ALL");

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [paymentAmount, setPaymentAmount] = useState(0);
	const [cvvCode, setCvvCode] = useState<string>("");
	const [selectedLoan, setSelectedLoan] = useState<any>(null);

	const openModal = (loan: any) => {
		setSelectedLoan(loan);
		setPaymentAmount(Number(Number(loan.monthlyPayment).toFixed(2)));
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedLoan(null);
	};

	useEffect(() => {
		if (cardsData && cardsData.length > 0 && !selectedCardNumber) {
			setSelectedCardNumber(cardsData[0].cardNumber);
		}
	}, [cardsData]);

	useEffect(() => {
		if (cardsData) {
			const found = cardsData.find(
				(c: ICard) => c.cardNumber === selectedCardNumber
			);
			setSelectedCard(found ?? null);
		}
	}, [cardsData, selectedCardNumber]);

	const { data: loansData, isLoading: loansIsLoading } =
		useLoans(selectedCardNumber);

	const isLoading = cardsIsLoading || loansIsLoading || !selectedCardNumber;

	const filteredLoans = loansData?.filter((loan: any) =>
		statusFilter === "ALL" ? true : loan.status === statusFilter
	);

	const onSubmit = () => {
		if (!selectedLoan || !selectedCard || !cvvCode || !paymentAmount) return;

		const payload = {
			loanId: Number(selectedLoan.id),
			amount: Number(paymentAmount),
			cardNumber: selectedCard.cardNumber,
			cvvCode: Number(cvvCode),
		};
		payLoanMutation.mutate(payload);
	};

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
				<h2 className="text-2xl font-semibold mb-6">Loans</h2>

				<div className="mb-4">
					<label className="text-sm text-gray-400 mb-2 block">
						Select Card:
					</label>
					<select
						value={selectedCardNumber}
						onChange={e => setSelectedCardNumber(e.target.value)}
						className="bg-[#1f1f1f] border border-white/10 text-white rounded px-4 py-2"
					>
						{cardsData?.map((card: ICard) => (
							<option key={card.cardNumber} value={card.cardNumber}>
								{card.cardNumber}
							</option>
						))}
					</select>
				</div>

				<div className="flex gap-2 mb-6 flex-wrap">
					{(["ALL", "ACTIVE", "PAID_OFF", "DEFAULTED"] as const).map(status => {
						const labelMap: Record<typeof status, string> = {
							ALL: "Усі",
							ACTIVE: "Активні",
							PAID_OFF: "Погашені",
							DEFAULTED: "Прострочені",
						};
						return (
							<button
								key={status}
								onClick={() => setStatusFilter(status)}
								className={`px-4 py-1 rounded-full text-sm font-medium border transition ${
									statusFilter === status
										? "bg-indigo-600 text-white border-indigo-500"
										: "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
								}`}
							>
								{labelMap[status]}
							</button>
						);
					})}
				</div>

				<div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 w-full max-h-[500px] overflow-y-auto border border-white/10 shadow-inner">
					{filteredLoans?.length ? (
						<ul>
							{filteredLoans.map((loan: any, idx: number) => (
								<li
									key={idx}
									className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 py-4 hover:bg-white/5 px-2 rounded transition"
								>
									<div>
										<p className="font-medium text-sm">
											💵{" "}
											{Number(loan.amount).toLocaleString("en-US", {
												style: "currency",
												currency: selectedCard?.valuta || "USD",
											})}
										</p>
										<p className="text-xs text-gray-400">
											Interest: {loan.interestRate}% • Term: {loan.termMonths}{" "}
											months
										</p>
									</div>

									<div className="text-right">
										<p className="text-indigo-400 text-sm">
											Monthly:{" "}
											{Number(loan.monthlyPayment).toLocaleString("en-US", {
												style: "currency",
												currency: selectedCard?.valuta || "USD",
											})}
										</p>
										<p className="text-red-400 text-sm">
											Total:{" "}
											{Number(loan.totalRepayment).toLocaleString("en-US", {
												style: "currency",
												currency: selectedCard?.valuta || "USD",
											})}
										</p>
									</div>

									<div className="flex flex-col items-end sm:items-center gap-1 sm:gap-0 sm:ml-4 text-right">
										<p
											className={`px-2 py-1 rounded text-sm font-medium ${
												loan.status === "ACTIVE"
													? "bg-yellow-900 text-yellow-400 border border-yellow-500"
													: loan.status === "PAID_OFF"
													? "bg-green-900 text-green-400 border border-green-500"
													: "bg-red-900 text-red-400 border border-red-500"
											}`}
										>
											{loan.status}
										</p>
										<p className="text-xs text-gray-400">
											{new Date(loan.issueDate).toLocaleDateString("en-GB", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</p>
										{loan.status === "ACTIVE" && (
											<button
												onClick={() => openModal(loan)}
												className="mt-2 px-4 py-1 text-sm font-semibold rounded bg-green-700 hover:bg-green-800 transition border border-green-500 text-white"
											>
												Pay Off
											</button>
										)}
									</div>
								</li>
							))}
						</ul>
					) : (
						<p className="text-center text-gray-400 py-6">
							No loans for this filter
						</p>
					)}
				</div>
			</div>

			<Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm"
					aria-hidden="true"
				/>
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Dialog.Panel className="bg-[#1f2937] text-white rounded-xl w-full max-w-md p-6 border border-white/10 shadow-xl">
						<Dialog.Title className="text-lg font-semibold mb-4">
							Погашення кредиту
						</Dialog.Title>
						<p className="text-sm text-gray-400 mb-4">
							Кредит на {selectedLoan?.termMonths} міс. — Залишок:{" "}
							{Number(selectedLoan?.totalRepayment).toLocaleString("en-US", {
								style: "currency",
								currency: selectedCard?.valuta || "USD",
							})}
						</p>
						<label className="block text-sm mb-1">Сума оплати</label>
						<input
							type="number"
							value={paymentAmount}
							onChange={e => setPaymentAmount(Number(e.target.value))}
							className="w-full rounded px-4 py-2 bg-[#111827] border border-white/10 text-white focus:outline-none focus:ring focus:border-blue-500 mb-4"
						/>
						<label className="block text-sm mb-1">CVV Code</label>
						<input
							type="password"
							value={cvvCode}
							onChange={e => setCvvCode(e.target.value)}
							className="w-full rounded px-4 py-2 bg-[#111827] border border-white/10 text-white focus:outline-none focus:ring focus:border-blue-500 mb-4"
						/>
						<button
							onClick={() =>
								setPaymentAmount(
									Number(Number(selectedLoan?.monthlyPayment).toFixed(2))
								)
							}
							className="mb-4 text-blue-400 hover:underline text-sm"
						>
							Авто: Місячний платіж
						</button>
						<div className="flex justify-end gap-2">
							<button
								onClick={closeModal}
								className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
							>
								Скасувати
							</button>
							<button
								onClick={() => {
									onSubmit();
									closeModal();
								}}
								className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-sm text-white"
							>
								Погасити
							</button>
						</div>
					</Dialog.Panel>
				</div>
			</Dialog>
		</div>
	);
};
