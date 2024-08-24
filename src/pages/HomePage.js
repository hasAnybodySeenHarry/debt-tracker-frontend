import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function HomePage() {
  const { token, user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black flex flex-col items-center text-white">
      <header className="w-full py-5 px-8 flex justify-between items-center bg-gray-900 shadow-lg">
        <div className="text-3xl font-bold">Debt Tracker</div>
        {/* <nav className="flex space-x-6">
          <Link to="/" className="text-white text-lg font-semibold hover:text-gray-400 transition">Home</Link>
          <Link to="/debts" className="text-white text-lg font-semibold hover:text-gray-400 transition">Debts</Link>
        </nav> */}
        <div className="flex items-center space-x-4">
          <Link to="/notifications" className="text-white text-lg font-semibold hover:text-gray-400 transition">Notifications</Link>
          {token ? (
            <>
              <span className="text-white font-semibold">{user ? user.name : 'User'}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition">
              Login
            </Link>
          )}
        </div>
      </header>

      <div className="bg-cover bg-center w-full px-7 h-64 flex items-center justify-center" style={{ backgroundImage: "url('https://source.unsplash.com/random/1600x900?finance')" }}>
        <h1 className="text-5xl font-extrabold bg-black bg-opacity-50 p-4 rounded-lg">Welcome to Debt Tracker</h1>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
        <div className="bg-gray-800 bg-opacity-80 text-white rounded-lg shadow-lg p-8 max-w-2xl border border-gray-700">
          <h2 className="text-4xl font-extrabold mb-4">Debt Tracker Dashboard</h2>
          <p className="text-lg mb-6">
            Manage your debts and track transactions efficiently. Keep an eye on your financial health with our intuitive dashboard.
          </p>
          <div className="space-y-4">
            <Link to="/debts">
              <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition w-full mb-4">
                Debts
              </button>
            </Link>
            <Link to="/debts/lender">
              <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition w-full">
                Lends
              </button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full p-4 bg-gray-900 text-gray-300 text-center">
        <p>&copy; {new Date().getFullYear()} Debt Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
