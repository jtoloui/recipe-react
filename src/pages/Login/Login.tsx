import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../../components/Button";
import "./login.scss";
export const Login = () => {
	const { loginWithRedirect, logout } = useAuth0();
	return (
		<div className="login">
			<div className="login_logo">toloui</div>

			<div className="login_heading">
				Join over 50 millions people sharing recipes everyday
			</div>
			<div className="login_subheading">
				Never run out of ideas again. Try new foods, ingredients, cooking style,
				and more
			</div>

			<div className="login_buttons">
				<Button
					text="Login"
					onClick={() =>
						loginWithRedirect({
							appState: {
								returnTo: "/",
							},
						})
					}
				/>
				<Button variant="secondary" text="Logout" onClick={() => logout()} />
			</div>
		</div>
	);
};
