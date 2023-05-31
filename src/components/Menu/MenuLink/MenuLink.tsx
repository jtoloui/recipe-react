import { NavLinkProps, NavLink } from "react-router-dom";

export const MenuLink = ({ to, children, className, ...props }: NavLinkProps) => {
	return (
		<NavLink to={to} className={({ isActive }) => ` py-2 mt-2 transition-colors duration-300 transform md:mt-0 md:mx-4 text-black  ${isActive ? 'border-b-2 border-green' : 'hover:border-b hover:border-green'} ${className}`} {...props}>{children}</NavLink>
	);
};