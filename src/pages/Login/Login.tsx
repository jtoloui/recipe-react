import { useAuth0 } from "@auth0/auth0-react";

import Logo from "../../assets/Logo";
import { Button } from "../../components/Button";

export const Login = () => {
	const { loginWithRedirect, logout } = useAuth0();
	return (
		<div className="container mx-auto p-5">
			<div className="Logo">
				<Logo />
			</div>
			<div className="login_heading">
				Join over 50 millions people sharing recipes everyday
			</div>
			<div className="login_subheading">
				Never run out of ideas again. Try new foods, ingredients, cooking style,
				and more
			</div>


			<div className="flex gap-5 flex-wrap">
				<Button text="Login" variant="primary" onClick={() => loginWithRedirect()} />
				<Button text="Sign Up" variant="secondary" onClick={() => loginWithRedirect()} />
			</div>
		</div>
	);
};
