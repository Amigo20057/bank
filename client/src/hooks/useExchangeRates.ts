// hooks/useExchangeRates.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ExchangeRateResponse {
	rates: Record<string, number>;
	base: string;
	date: string;
	success?: boolean;
}

const fetchRates = async (): Promise<Record<string, number>> => {
	try {
		// Спробуємо кілька API як fallback
		const apis = [
			"https://api.exchangerate.host/latest?base=USD",
			"https://api.fxratesapi.com/latest?base=USD",
			"https://api.exchangerate-api.com/v4/latest/USD",
		];

		for (const apiUrl of apis) {
			try {
				const res = await axios.get<ExchangeRateResponse>(apiUrl, {
					timeout: 5000, // 5 секунд timeout
				});

				if (res.data && res.data.rates) {
					return res.data.rates;
				}
			} catch (error) {
				console.warn(`Failed to fetch from ${apiUrl}:`, error);
				continue;
			}
		}

		throw new Error("All exchange rate APIs failed");
	} catch (error) {
		console.error("Error fetching exchange rates:", error);
		throw error;
	}
};

export const useExchangeRates = () => {
	return useQuery({
		queryKey: ["exchangeRates"],
		queryFn: fetchRates,
		staleTime: 1000 * 60 * 10, // 10 хвилин
		retry: 3,
		retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
		// Використовуємо onError через meta для новіших версій React Query
		meta: {
			onError: (error: any) => {
				console.error("Помилка при отриманні курсів валют:", error);
			},
		},
	});
};
