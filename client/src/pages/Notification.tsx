import { useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { useNotifications } from "../context/NotificationContext";

export const Notification = () => {
	const { notifications, clearUnread } = useNotifications();

	useEffect(() => {
		clearUnread();
	}, []);

	return (
		<div className="flex relative">
			<div className="fixed left-0 top-0 h-screen w-[250px] z-50">
				<Sidebar />
			</div>

			<div className="p-6 w-full ml-[250px] bg-gradient-to-br from-[#1f2937] via-[#111827] to-black text-white min-h-screen">
				<h2 className="text-2xl font-semibold mb-6">Сповіщення</h2>

				<div className="grid grid-cols-1 gap-4">
					{notifications.length ? (
						notifications.map((n, idx) => (
							<div
								key={idx}
								className="bg-[#111111] border border-white/10 rounded-xl p-5 shadow hover:shadow-lg transition"
							>
								<p className="text-indigo-400 text-sm font-semibold mb-2 uppercase tracking-wide">
									Тип події: {n.type || "TRANSACTION"}
								</p>

								<div className="mb-3">
									<p className="text-lg font-bold text-green-400">
										+{n.amount} {n.valuta}
									</p>
								</div>

								<div className="text-sm space-y-1 text-gray-300">
									<p>
										<b className="text-white">Відправник:</b>{" "}
										{n.senderCardNumber}
									</p>
									<p>
										<b className="text-white">Отримувач:</b>{" "}
										{n.recipientCardNumber}
									</p>
									{n.transactionId && (
										<p>
											<b className="text-white">ID транзакції:</b>{" "}
											{n.transactionId}
										</p>
									)}
									<p>
										<b className="text-white">Час:</b>{" "}
										{new Date(n.timestamp).toLocaleString("uk-UA", {
											day: "2-digit",
											month: "long",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
								</div>
							</div>
						))
					) : (
						<p className="text-center text-gray-400 py-6">
							Нотифікацій ще немає
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
