import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Sidebar } from "../components/Sidebar";
import { useCreateCard } from "../hooks/card/mutations/useCreateCard";
import { useCards } from "../hooks/card/useCards";
import { useTransactions } from "../hooks/transactions/useTransactions";
import { useProfile } from "../hooks/user/useProfile";
import type { ICard } from "../types/card.interface";

import {
	ArrowTrendingDownIcon,
	ArrowTrendingUpIcon,
} from "@heroicons/react/16/solid";
import { CreditCardIcon, PlusIcon } from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

export const Home = () => {
	const navigate = useNavigate();
	const { data: userProfileData, isLoading: userIsLoading } = useProfile();
	const { data: cardsData, isLoading: cardsIsLoading } = useCards();
	const { createCardMutation } = useCreateCard();

	const numbersCards = cardsData?.map((card: ICard) => card.cardNumber) ?? [];

	const { data: transactionsData, isLoading: transactionsIsLoading } =
		useTransactions({ numbersCards });

	const isLoading = userIsLoading || cardsIsLoading || transactionsIsLoading;

	const income =
		transactionsData
			?.filter((tx: any) => numbersCards.includes(tx.receivedCardNumber))
			.reduce((sum: any, tx: any) => sum + Number(tx.amount), 0) || 0;

	const outcome =
		transactionsData
			?.filter((tx: any) => numbersCards.includes(tx.senderCardNumber))
			.reduce((sum: any, tx: any) => sum + Number(tx.amount), 0) || 0;

	const chartData = [
		{ name: "Дохід", value: income },
		{ name: "Витрати", value: outcome },
	];

	const chartColors = ["#22c55e", "#ef4444"];

	if (!userProfileData && !userIsLoading) {
		navigate("/auth/login");
	}

	return (
		<div className="flex relative">
			{isLoading && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center">
					<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
				</div>
			)}

			<Sidebar />
			<div className="p-6 w-full min-h-screen bg-gradient-to-br from-[#1f2937] via-[#111827] to-black text-white">
				<h2 className="text-xl font-semibold mb-4">Cards</h2>

				<div className="w-full h-[250px] flex items-center overflow-x-auto">
					{cardsData?.map((card: ICard, index: number) => (
						<Card
							key={index}
							balance={card.balance}
							cardNumber={card.cardNumber}
							cardValidatePeriod={card.cardValidatePeriod}
							cvvCode={card.cvvCode}
							status={card.status}
							valuta={card.valuta}
						/>
					))}
					{cardsData?.length < 3 && (
						<div
							onClick={() => createCardMutation.mutate()}
							className="w-80 h-48 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 shadow-inner hover:shadow-lg cursor-pointer flex flex-col items-center justify-center ml-4 transition-transform hover:scale-105"
						>
							<PlusIcon className="w-12 h-12 mb-2" />
							<span className="text-lg font-semibold">Створити картку</span>
						</div>
					)}
				</div>

				<div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-inner hover:shadow-lg transition flex items-center gap-4">
						<CreditCardIcon className="w-8 h-8 text-blue-400" />
						<div>
							<p className="text-sm text-gray-400">Карток у вас</p>
							<p className="text-2xl font-bold">{cardsData?.length}</p>
						</div>
					</div>

					<div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-inner hover:shadow-lg transition flex items-center gap-4">
						<ArrowTrendingUpIcon className="w-8 h-8 text-green-400" />
						<div>
							<p className="text-sm text-gray-400">Всього доходів</p>
							<p className="text-2xl font-bold text-green-400">
								+
								{transactionsData?.reduce(
									(sum: any, tx: any) =>
										numbersCards.includes(tx.receivedCardNumber)
											? sum + Number(tx.amount)
											: sum,
									0
								)}{" "}
								USD
							</p>
						</div>
					</div>

					<div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-inner hover:shadow-lg transition flex items-center gap-4">
						<ArrowTrendingDownIcon className="w-8 h-8 text-red-400" />
						<div>
							<p className="text-sm text-gray-400">Всього витрат</p>
							<p className="text-2xl font-bold text-red-400">
								−
								{transactionsData?.reduce(
									(sum: any, tx: any) =>
										numbersCards.includes(tx.senderCardNumber)
											? sum + Number(tx.amount)
											: sum,
									0
								)}{" "}
								USD
							</p>
						</div>
					</div>
				</div>

				<h2 className="text-xl font-semibold mt-10 mb-2">
					Recent Transactions
				</h2>

				<div className="flex flex-col lg:flex-row gap-6">
					<div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 w-full lg:w-[1100px] min-h-[300px] border border-white/10 shadow-inner">
						{transactionsData?.length ? (
							<ul>
								{transactionsData.map((tx: any, idx: number) => {
									const isIncoming = numbersCards.includes(
										tx.receivedCardNumber
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
												<p className="font-medium uppercase text-sm">
													{tx.type}
												</p>
												<p className="text-xs text-gray-400">
													{tx.senderCardNumber} ➜ {tx.receivedCardNumber}
												</p>
											</div>
											<div className="text-right">
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
										</li>
									);
								})}
							</ul>
						) : (
							<p className="text-center text-gray-400 py-6">Транзакцій немає</p>
						)}
					</div>

					{transactionsData?.length > 0 && (
						<div className="bg-black/40 backdrop-blur-sm w-full lg:w-[500px] h-[400px] rounded-xl p-4 border border-white/10 shadow-inner">
							<h3 className="text-white text-lg mb-2">Фінансовий огляд</h3>
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={chartData}
										dataKey="value"
										nameKey="name"
										cx="70%"
										cy="50%"
										outerRadius={80}
										label
									>
										{chartData.map((_, index) => (
											<Cell key={index} fill={chartColors[index]} />
										))}
									</Pie>
									<Legend
										layout="vertical"
										align="left"
										verticalAlign="middle"
										iconType="circle"
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
