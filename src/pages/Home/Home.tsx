import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../../components/Button";

export const Home = () => {
	const { logout, getAccessTokenSilently } = useAuth0();
	return (
		<div>
			Home
			<Button
				text="Logout"
				onClick={() =>
					logout({
						logoutParams: {
							returnTo: `${window.location.origin}`,
						},
					})
				}
			/>
		</div>
	);
};
