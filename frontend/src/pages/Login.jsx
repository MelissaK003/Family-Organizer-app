import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';


export default function Login() {
  const { login } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); 
    login(email, password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-2xl rounded-xl px-10 py-8 w-full max-w-md transform transition-all hover:scale-105 duration-300"
      >
        <h3 className="text-3xl text-center mb-6 font-bold text-gray-800">Welcome Back</h3>
        
        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email</label>
          <input 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" 
            id="email" 
            type="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label 
            className="block text-gray-700 text-sm font-semibold mb-2" 
            htmlFor="password"
          >
            Password
          </label>
          <input 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" 
            id="password" 
            type="password" 
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200" 
            type="submit"
          >
            Log In
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mt-4">
            Don't have an account? {' '}
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
        
        <p className="text-center text-gray-500 text-xs mt-6">&copy;2025 Melissa&Co. All Rights Reserved.</p>
      </form>
    </div>
  );
}
