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
import {
	CreditCardIcon,
	GlobeIcon,
	MenuIcon,
	PlusIcon,
	XIcon,
} from "lucide-react";
import { useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useExchangeRates } from "../hooks/useExchangeRates";

window.localStorage.setItem("language", "EN");

export const Home = () => {
	const navigate = useNavigate();
	const { data: userProfileData, isLoading: userIsLoading } = useProfile();
	const { data: cardsData, isLoading: cardsIsLoading } = useCards();
	const { createCardMutation } = useCreateCard();
	const {
		data: exchangeRates,
		isLoading: isRatesLoading,
		error: ratesError,
		isError: isRatesError,
	} = useExchangeRates();
	const [menuOpen, setMenuOpen] = useState(false);
	const popularCurrencies = ["USD", "EUR", "GBP", "UAH", "PLN", "JPY", "CNY"];
	const numbersCards = cardsData?.map((card: ICard) => card.cardNumber) ?? [];

	const { data: transactionsData, isLoading: transactionsIsLoading } =
		useTransactions({ numbersCards }, 5);

	const isLoading = userIsLoading || cardsIsLoading || transactionsIsLoading;

	const income =
		transactionsData
			?.filter((tx: any) => numbersCards.includes(tx.recipientCardNumber))
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
		<div className="flex flex-col lg:flex-row relative">
			{isLoading && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center">
					<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
				</div>
			)}

			<div className="lg:hidden p-4">
				<button
					onClick={() => setMenuOpen(true)}
					className="text-white focus:outline-none"
				>
					<MenuIcon className="w-6 h-6" />
				</button>
			</div>

			<div className="hidden lg:block fixed left-0 top-0 h-screen w-[250px] z-50">
				<Sidebar />
			</div>

			{menuOpen && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex">
					<div className="relative bg-[#111827] w-[250px] h-full shadow-lg z-10 p-4">
						<div className="flex justify-end mb-4">
							<button onClick={() => setMenuOpen(false)} className="text-white">
								<XIcon className="w-6 h-6" />
							</button>
						</div>
						<Sidebar />
					</div>
					<div className="flex-1" onClick={() => setMenuOpen(false)} />
				</div>
			)}

			<div className="p-4 sm:p-6 w-full min-h-screen lg:ml-[250px] bg-gradient-to-br from-[#1f2937] via-[#111827] to-black text-white">
				<h2 className="text-xl font-semibold mb-4">Cards</h2>

				<div className="w-full flex flex-col sm:h-[250px] sm:flex-row items-start overflow-x-auto gap-4 relative justify-between">
					<div className="flex sm:flex-row flex-col gap-4">
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
								className="min-w-[280px] w-full sm:w-80 h-48 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 shadow-inner hover:shadow-lg cursor-pointer flex flex-col items-center justify-center transition-transform hover:scale-105"
							>
								<PlusIcon className="w-12 h-12 mb-2" />
								<span className="text-lg font-semibold">Створити картку</span>
							</div>
						)}
					</div>

					<div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-inner transition flex flex-col gap-3 w-full sm:w-[500px] h-auto sm:h-[250px] mt-4 sm:mt-0">
						<div className="flex items-center gap-2 mb-2">
							<GlobeIcon className="text-cyan-400 w-5 h-5" />
							<h3 className="text-lg font-semibold text-white">
								Курс валют (від USD)
							</h3>
						</div>

						{isRatesLoading ? (
							<div className="flex items-center justify-center py-8">
								<div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
								<span className="ml-2 text-gray-400">
									Завантаження курсів...
								</span>
							</div>
						) : isRatesError ? (
							<div className="text-center py-4">
								<p className="text-red-400 text-sm mb-2">
									❌ Помилка завантаження курсів
								</p>
								<p className="text-gray-500 text-xs">
									{ratesError?.message || "Спробуйте оновити сторінку"}
								</p>
							</div>
						) : (
							<ul className="space-y-1 text-sm text-gray-200 overflow-y-auto max-h-[200px] pr-1">
								{popularCurrencies.map((currency, index) => {
									const rate = exchangeRates?.[currency];

									return (
										<li
											key={currency}
											className="flex justify-between items-center px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition"
										>
											<span className="flex items-center gap-2 font-medium">
												<div
													className="w-2.5 h-2.5 rounded-full"
													style={{
														backgroundColor: [
															"#22c55e",
															"#3b82f6",
															"#facc15",
															"#ec4899",
															"#8b5cf6",
															"#ef4444",
															"#06b6d4",
														][index % 7],
													}}
												></div>
												{currency}
											</span>
											<span className="tabular-nums font-mono text-xs">
												{rate !== undefined ? (
													currency === "USD" ? (
														<span className="text-gray-400">Base</span>
													) : (
														<>1 USD = {rate.toFixed(4)}</>
													)
												) : (
													<span className="text-gray-500">—</span>
												)}
											</span>
										</li>
									);
								})}
							</ul>
						)}
					</div>
				</div>

				<div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-black/40 p-4 rounded-xl border border-white/10 shadow-inner flex items-center gap-4">
						<CreditCardIcon className="w-8 h-8 text-blue-400" />
						<div>
							<p className="text-sm text-gray-400">Карток у вас</p>
							<p className="text-2xl font-bold">{cardsData?.length}</p>
						</div>
					</div>
					<div className="bg-black/40 p-4 rounded-xl border border-white/10 shadow-inner flex items-center gap-4">
						<ArrowTrendingUpIcon className="w-8 h-8 text-green-400" />
						<div>
							<p className="text-sm text-gray-400">Всього доходів</p>
							<p className="text-2xl font-bold text-green-400">+{income} USD</p>
						</div>
					</div>
					<div className="bg-black/40 p-4 rounded-xl border border-white/10 shadow-inner flex items-center gap-4">
						<ArrowTrendingDownIcon className="w-8 h-8 text-red-400" />
						<div>
							<p className="text-sm text-gray-400">Всього витрат</p>
							<p className="text-2xl font-bold text-red-400">−{outcome} USD</p>
						</div>
					</div>
				</div>

				<h2 className="text-xl font-semibold mt-10 mb-2">
					Recent Transactions
				</h2>

				<div className="flex flex-col lg:flex-row gap-6 relative">
					<div className="bg-black/40 rounded-xl p-4 w-full min-h-[300px] border border-white/10 shadow-inner">
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
												<p className="font-medium uppercase text-sm">
													{tx.type}
												</p>
												<p className="text-xs text-gray-400">
													{tx.senderCardNumber} ➜ {tx.recipientCardNumber}
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
						<div className="bg-black/40 w-full lg:w-[750px] h-[400px] rounded-xl p-4 border border-white/10 shadow-inner">
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
