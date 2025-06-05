import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useCards } from "../hooks/card/useCards";
import { useTransactions } from "../hooks/transactions/useTransactions";
import { useProfile } from "../hooks/user/useProfile";
import type { ICard } from "../types/card.interface";

import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import dayjs from "dayjs";

export const Transactions = () => {
	const navigate = useNavigate();
	const { data: userProfileData, isLoading: userIsLoading } = useProfile();
	const { data: cardsData, isLoading: cardsIsLoading } = useCards();

	const numbersCards = cardsData?.map((card: ICard) => card.cardNumber) ?? [];

	const { data: transactionsData, isLoading: transactionsIsLoading } =
		useTransactions({ numbersCards });

	const isLoading = userIsLoading || cardsIsLoading || transactionsIsLoading;

	if (!userProfileData && !userIsLoading) {
		navigate("/auth/login");
	}

	// Групування по датах
	const groupedData = transactionsData?.reduce((acc: any, tx: any) => {
		const date = dayjs(tx.createdAt).format("DD/MM");
		if (!acc[date]) acc[date] = { date, income: 0, outcome: 0 };

		if (numbersCards.includes(tx.recipientCardNumber)) {
			acc[date].income += Number(tx.amount);
		} else if (numbersCards.includes(tx.senderCardNumber)) {
			acc[date].outcome += Number(tx.amount);
		}

		return acc;
	}, {});

	const barChartData = Object.values(groupedData || {}).slice(-7);

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
				<h2 className="text-2xl font-semibold mb-6">Transactions</h2>

				<div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 w-full max-h-[450px] overflow-y-auto border border-white/10 shadow-inner">
					{transactionsData?.length ? (
						<ul>
							{transactionsData.map((tx: any, idx: number) => {
								const isIncoming = numbersCards.includes(
									tx.recipientCardNumber
								);
								const isOutgoing = numbersCards.includes(tx.senderCardNumber);

								const amountClass = isIncoming
									? "text-green-400"
									: isOutgoing
									? "text-red-400"
									: "text-white";

								const amountSign = isIncoming ? "+" : isOutgoing ? "−" : "";

								return (
									<li
										key={idx}
										className="flex justify-between border-b border-gray-800 py-3 hover:bg-white/5 px-2 rounded transition"
									>
										<div>
											<p className="font-medium uppercase text-sm">{tx.type}</p>
											<p className="text-xs text-gray-400">
												{tx.senderCardNumber} ➜ {tx.recipientCardNumber}
											</p>
										</div>
										<div className="text-right mr-[200px]">
											<p className={`${amountClass} font-semibold`}>
												{amountSign}
												{Math.abs(tx.amount)} {tx.valuta}
											</p>
											<p className="text-xs text-gray-400">
												{new Date(tx.createdAt).toLocaleDateString("en-GB", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})}
											</p>
										</div>
										<div>
											<p className="ml-[200px]">
												<span
													className={`px-2 py-1 rounded text-sm font-medium ${
														tx?.status === "PROCESSED"
															? "bg-green-900 text-green-400 border border-green-500"
															: "bg-red-900 text-red-400 border border-red-500"
													}`}
												>
													{tx?.status === "PROCESSED" ? "Success" : "Error"}
												</span>
											</p>
										</div>
									</li>
								);
							})}
						</ul>
					) : (
						<p className="text-center text-gray-400 py-6">Транзакцій немає</p>
					)}
				</div>

				{barChartData.length > 0 && (
					<div className="mt-8 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-inner h-[350px]">
						<h3 className="text-white text-lg mb-4">
							Доходи / Витрати за останні дні
						</h3>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={barChartData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
								<XAxis
									dataKey="date"
									stroke="#9CA3AF"
									tick={{ fontSize: 12 }}
								/>
								<YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
								<Tooltip
									cursor={{ fill: "transparent" }}
									contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
									labelStyle={{ color: "#fff" }}
								/>
								<Legend />
								<Bar
									dataKey="income"
									fill="#22c55e"
									name="Доходи"
									barSize={20}
									radius={[4, 4, 0, 0]}
									activeBar={false}
								/>
								<Bar
									dataKey="outcome"
									fill="#ef4444"
									name="Витрати"
									barSize={20}
									radius={[4, 4, 0, 0]}
									activeBar={false}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}
			</div>
		</div>
	);
};
