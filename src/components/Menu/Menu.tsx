import Logo from '@/assets/Logo';
import { useAuth0 } from '@auth0/auth0-react';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Menu = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { logout, user } = useAuth0();
	const [dropdown, setDropdown] = useState(false);
	const dropdownRef = useRef<null | HTMLButtonElement>(null);


	const handleDropdown = () => setDropdown(!dropdown);

	const handleSearch = (event: MouseEvent<HTMLElement>) => {

		event.preventDefault();
		console.log('Search');
	}


	const handleClickOutside = (event: WindowEventMap['click']) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setDropdown(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	if (location.pathname === '/login') return null;


	const initials = user?.name?.split(' ').map((n: string) => n[0]).join('');


	return (
		<nav className="sticky top-0 z-10 h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
			{/* logo */}
			<div className="flex items-center hover:cursor-pointer" onClick={() => navigate("/")}>
				<Logo />
			</div>
			<div className="flex items-center justify-center flex-grow">
				{/* search bar */}
				<div className="relative flex items-center w-full max-w-md mx-auto border-b-2 border-brownGrey">
					<span className="absolute inset-y-0 left-0 pl-3 flex items-center hover:cursor-pointer" onClick={handleSearch}>
						<svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
						</svg>
					</span>
					<input onClick={handleSearch} className="block w-full border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none   py-2 pl-10 pr-4 text-sm" placeholder="Search Recipe, Profile, or Ingredients" />
				</div>
			</div>
			{/* profile dropdown */}
			<div className="relative">
				<button onClick={handleDropdown} className="p-1 rounded-full w-10 h-10 bg-green max-w-xs" ref={dropdownRef}>
					{/* Profile Circle Icon Here */}
					<span className="sr-only">Open user menu</span>
					<span className="text-white font-bold uppercase">{initials}</span>
				</button>
				{dropdown && (
					<div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
						<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
						<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
						<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => logout()}>Logout</a>
					</div>
				)}
			</div>
		</nav>
	);
}
