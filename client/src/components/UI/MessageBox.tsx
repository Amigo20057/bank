import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
	text: string;
	status: "SUCCESS" | "ERROR";
};

export const MessageBox = ({ text, status }: Props) => {
	const [visible, setVisible] = useState(true);
	const [fadeOut, setFadeOut] = useState(false);

	useEffect(() => {
		// Показати повідомлення заново при кожній зміні text/status
		setVisible(true);
		setFadeOut(false);

		const fadeTimer = setTimeout(() => setFadeOut(true), 2500);
		const removeTimer = setTimeout(() => setVisible(false), 3000);

		return () => {
			clearTimeout(fadeTimer);
			clearTimeout(removeTimer);
		};
	}, [text, status]);

	if (!visible) return null;

	return (
		<div
			className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ease-in-out ${
				fadeOut ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
			}`}
		>
			<div
				className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white
				${status === "SUCCESS" ? "bg-green-600" : "bg-red-600"}`}
			>
				{status === "SUCCESS" ? (
					<CheckCircle className="w-5 h-5" />
				) : (
					<XCircle className="w-5 h-5" />
				)}
				<span>{text}</span>
			</div>
		</div>
	);
};
