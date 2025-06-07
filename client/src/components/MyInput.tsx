import { forwardRef } from "react";

type Props = {
	type: "number" | "text" | "password" | "date";
	placeholder: string;
	width?: string;
	margin?: string;
	placeholderColor?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const MyInput = forwardRef<HTMLInputElement, Props>(
	({ type, placeholder, width, margin, placeholderColor, ...rest }, ref) => {
		const customWidth = width ?? "min-w-[400px]";
		const customMargin = margin ?? "mb-4";

		return (
			<input
				type={type}
				placeholder={placeholder}
				ref={ref}
				className={`
					bg-[#121212] border border-gray-700 
					hover:border-gray-500 focus:border-indigo-500 
					placeholder-[#6b7280] text-white text-base
					rounded-2xl px-5 py-4 outline-none
					${customWidth} ${customMargin}
					transition-all duration-300 ease-in-out
				`}
				{...rest}
			/>
		);
	}
);
