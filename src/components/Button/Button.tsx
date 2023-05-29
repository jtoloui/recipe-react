import { FC } from "react";
// import "./_button.scss";

type ButtonProps = {
	text: string;
	variant?: "primary" | "secondary";
	onClick: () => void;
};

export const Button: FC<ButtonProps> = ({
	text,
	variant = "primary",
	onClick,
}) => {
	const commonClasses = "w-full sm:w-auto h-12 px-4 py-2 rounded-lg shadow-md flex items-center justify-center";
	const variantClasses = variant === 'primary'
		? "bg-green text-white hover:bg-white hover:text-green"
		: "bg-white border-2 border-green text-green hover:bg-green hover:text-white";

	return (
		<button
			className={`${commonClasses} ${variantClasses}`}
			onClick={onClick}
		>
			<p className="px-20 leading-custom font-nunito text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-center">
				{text}
			</p>
		</button>
	);
};
