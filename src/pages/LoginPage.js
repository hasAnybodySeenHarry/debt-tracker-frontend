import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-extrabold mb-4 text-white">Login</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-300">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="bg-gray-700 shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-300">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="bg-gray-700 shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-200"
              required
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
