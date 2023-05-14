import { FC } from "react";
import "./button.scss";

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
	return (
		<button className={`button button_${variant}`} onClick={onClick}>
			<span className={`button button_${variant}_text`}>{text}</span>
		</button>
	);
};
