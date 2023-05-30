import Logo from '@/assets/Logo';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export const Menu = () => {
	const location = useLocation();
	const [dropdown, setDropdown] = useState(false);

	const handleDropdown = () => setDropdown(!dropdown);

	const handleSearch = () => {
		console.log('Search');
	}

	if (location.pathname === '/login') return null;

	return (
		<nav className="sticky top-0 z-10 flex items-center justify-between px-20 h-20 bg-white border-b-2 shadow-lg">
			<div className="flex-1">
				<Logo />
			</div>
			<div className="relative w-full max-w-md mx-auto lg:mx-0">
				<span className="absolute inset-y-0 left-0 flex items-center pl-3">
					<svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
					</svg>
				</span>
				<input className="block w-full border-b border-gray-300 border-0 py-2 pl-10 pr-4 text-sm placeholder-gray-500 focus:bg-white focus:placeholder-gray-600 focus:text-gray-900 focus:outline-none" placeholder="Search" />
			</div>
			<div className="relative flex-1 text-right">
				<div className="ml-auto mr-5">
					<button onClick={handleDropdown} className="bg-green rounded-full w-10 h-10 flex items-center justify-center">
						{/* Profile Circle Icon Here */}
						{/* Example: */}
						{/* If user's profile picture exists: */}
						{/* <img className="h-8 w-8 rounded-full" src="user-profile-picture-url" alt="User's Initials"/> */}
						{/* Else, display user's initials: */}
						<span className="text-sm font-medium text-white">JT</span>
					</button>
					{dropdown && (
						<div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
							<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
							<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
							<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
