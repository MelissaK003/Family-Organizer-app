import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Navbar() {
  const { authToken, logout } = useContext(UserContext);

  return (
    <nav className="bg-black fixed w-full z-20 top-0 left-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://img.icons8.com/?size=100&id=3IgraUCmanI0&format=png&color=000000" className="h-8" alt="Little Helper Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Little Helper</span>
        </Link>
        <div className="flex md:order-2 space-x-4 md:space-x-0 rtl:space-x-reverse">
          {authToken ? (
            <button onClick={logout} className="text-black bg-red-500 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-black bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-4">Login</Link>
              <Link to="/register" className="text-black bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 text-center">Register</Link>
            </>
          )}
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-black">
            <li><Link to="/" className="block py-2 px-3 text-white rounded-sm md:bg-transparent md:text-yellow-500 md:p-0 md:hover:text-yellow-300" aria-current="page">Home</Link></li>
            <li><Link to="/Profile" className="block py-2 px-3 text-white rounded-sm md:hover:bg-transparent md:hover:text-yellow-500 md:p-0 md:dark:hover:text-yellow-300">Profile</Link></li>
            <li><Link to="/Tasks" className="block py-2 px-3 text-white rounded-sm md:hover:bg-transparent md:hover:text-yellow-500 md:p-0 md:dark:hover:text-yellow-300">Tasks</Link></li>
            <li><Link to="/Meal_plan" className="block py-2 px-3 text-white rounded-sm md:hover:bg-transparent md:hover:text-yellow-500 md:p-0 md:dark:hover:text-yellow-300">Meal Plan</Link></li>
            <li><Link to="/Events" className="block py-2 px-3 text-white rounded-sm md:hover:bg-transparent md:hover:text-yellow-500 md:p-0 md:dark:hover:text-yellow-300">Events</Link></li>
            <li><Link to="/Shopping_list" className="block py-2 px-3 text-white rounded-sm md:hover:bg-transparent md:hover:text-yellow-500 md:p-0 md:dark:hover:text-yellow-300">Shopping List</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
