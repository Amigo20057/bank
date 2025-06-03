import { CopyCheck, EyeOff } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
	cardNumber: string;
	cardValidatePeriod: Date;
	cvvCode: number;
	balance: number;
	status: "ACTIVE" | "BLOCKED" | "EXPIRED";
	valuta: string;
};

export const Card = ({
	balance,
	cardNumber,
	cardValidatePeriod,
	cvvCode,
	status,
	valuta,
}: Props) => {
	const [isFlipped, setIsFlipped] = useState(false);
	const [cvvVisible, setCvvVisible] = useState(false);
	const [cardCopied, setCardCopied] = useState(false);
	const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });

	const cardRef = useRef<HTMLDivElement | null>(null);

	const formattedDate = new Date(cardValidatePeriod).toLocaleDateString(
		"en-GB",
		{
			month: "2-digit",
			year: "2-digit",
		}
	);

	const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		const rect = cardRef.current?.getBoundingClientRect();
		if (!rect) return;
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		setGradientPos({ x, y });
	};

	const gradientStyle = {
		backgroundImage: `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, #8b5cf6, #4f46e5)`,
		transition: "background-position 0.2s ease",
	};

	return (
		<div
			ref={cardRef}
			onMouseMove={handleMouseMove}
			onClick={() => setIsFlipped(!isFlipped)}
			className="w-80 h-48 perspective mr-4 cursor-pointer"
		>
			<div
				className={`relative w-full h-full transition-transform duration-700 transform-style preserve-3d ${
					isFlipped ? "rotate-y-180" : ""
				}`}
			>
				{/* Front Side */}
				<div
					className="absolute w-full h-full text-white rounded-2xl shadow-2xl p-5 backface-hidden flex flex-col justify-between"
					style={gradientStyle}
				>
					<div className="flex justify-between items-center text-sm">
						<span className="uppercase tracking-wider font-semibold">
							{status}
						</span>
						<span className="text-xs font-mono">{valuta}</span>
					</div>

					<button
						onClick={e => {
							e.stopPropagation();
							handleCopy(cardNumber, setCardCopied);
						}}
						className="text-lg tracking-widest font-mono hover:underline text-left mt-2"
					>
						{cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
						{cardCopied && (
							<CopyCheck className="inline w-4 h-4 ml-2 text-green-400" />
						)}
					</button>

					<div className="text-right font-bold text-2xl mt-2">
						{balance} {valuta}
					</div>
				</div>

				{/* Back Side */}
				<div className="absolute w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white rounded-2xl shadow-2xl p-5 rotate-y-180 backface-hidden flex flex-col justify-between">
					<div className="text-sm">
						<p className="opacity-70 mb-1">VALID THRU</p>
						<p className="text-lg font-mono">{formattedDate}</p>
					</div>

					<div className="text-sm">
						<p className="opacity-70 mb-1">CVV</p>
						<button
							onClick={e => {
								e.stopPropagation();
								handleCopy(cvvCode.toString(), setCvvVisible);
							}}
							className="bg-gray-900 hover:bg-gray-700 px-4 py-1 rounded transition flex items-center gap-2"
						>
							{cvvVisible ? (
								<>
									{cvvCode}
									<CopyCheck className="w-4 h-4 text-green-400" />
								</>
							) : (
								<>
									•••
									<EyeOff className="w-4 h-4" />
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
