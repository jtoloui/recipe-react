import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useLocation } from 'react-router-dom';
import { useWindowSize } from "usehooks-ts";

import Logo from '@/assets/Logo';
import { BurgerMenu } from './BurgerMenu';
import { MenuLink } from './MenuLink';


export const Menu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const size = useWindowSize();


	const { user } = useAuth0();
	const location = useLocation();


	const initials = user?.name?.split(' ').map((n) => n[0]).join('');


	useEffect(() => {
		if (size.width >= 768 && isOpen) {
			setIsOpen(false);
		}
	}, [size.width, isOpen]);

	if (location.pathname === '/login') return null;

	return (
		<nav className="bg-white shadow">
			<div className="px-6 py-4 mx-auto">
				<div className="md:flex md:items-center">

					{/* // logo and burger menu */}
					<div className="flex items-center justify-between">
						<Link to="/">
							<Logo />
						</Link>
						<div className="flex md:hidden">
							<button onClick={() => setIsOpen(!isOpen)} type="button" className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600" aria-label="toggle menu">
								<BurgerMenu isOpen={isOpen} />
							</button>
						</div>
					</div>

					{/* // menu items */}
					<div className={`absolute inset-x-0 z-20 flex-1 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white  md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto ${isOpen ? 'shadow translate-x-0 opacity-100 ' : 'opacity-0 -translate-x-full'} md:opacity-100 md:translate-x-0 md:flex md:items-center md:justify-between`}>
						<div className="flex flex-col text-gray-600 capitalize md:flex md:px-16 md:-mx-4 md:flex-row md:items-center w-full">
							<MenuLink to="/" >Home</MenuLink>
							<MenuLink to="/recipes">My Recipes</MenuLink>

							<div className="relative mt-4 md:mt-0 md:mx-4 w-full md:max-w-[16rem] lg:max-w-xs">
								<span className="absolute inset-y-0 left-0 flex items-center pl-3">
									<svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none">
										<path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
								</span>

								{/* // Search bar */}
								<input type="text" className=" text-ellipsis w-full py-1 pl-10 pr-4 text-black placeholder-black-600 bg-white border-b border-brownGrey focus:outline-none focus:border-gray-600" placeholder="Search Recipe, Profile, or Ingredients" />
							</div>
						</div>

						{/* // profile circle icon */}
						<div className="flex justify-center mt-6 md:flex md:mt-0 md:-mx-2">
							<button type="button" className="flex items-center focus:outline-none" aria-label="toggle profile dropdown">
								<div className="w-10 h-10 overflow-hidden border-2 border-white rounded-full bg-green max-w-xs">
									<p className="flex justify-center items-center h-full text-white font-bold uppercase">{initials}</p>
								</div>

								<h3 className="mx-2 text-gray-700 md:hidden">{user?.nickname}</h3>
							</button>
						</div>
					</div>
				</div>
			</div>
		</nav >
	);
}
