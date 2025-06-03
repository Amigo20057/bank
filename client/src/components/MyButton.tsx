import { ArrowRight } from "lucide-react";

type Props = {
	text: string;
	width?: string;
	height?: string;
	margin?: string;
	padding?: string;
	event?: () => void;
	type: "button" | "submit";
};

export const MyButton = ({
	text,
	width,
	height,
	margin,
	padding,
	type = "button",
	event,
}: Props) => {
	const customWidth = width ?? "min-w-[400px]";
	const customMargin = margin ?? "mb-5";
	const customHeight = height ?? "h-[70px]";
	const customPadding = padding ?? "px-6 py-4";

	return (
		<button
			onClick={event}
			type={type}
			className={`
				flex items-center justify-between 
				${customPadding} ${customWidth} ${customMargin} ${customHeight}
				rounded-2xl font-semibold text-white text-lg
				bg-[#121212] border border-gray-700 hover:border-gray-500
				hover:bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-800
				transition-all duration-200 ease-in-out hover:opacity-90
			`}
		>
			<span>{text}</span>
			<ArrowRight className="w-5 h-5" />
		</button>
	);
};
