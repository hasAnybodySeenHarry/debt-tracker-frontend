import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TransactionsPage from './pages/TransactionsPage';
import DebtsPage from './pages/DebtsPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import LenderDebtsPage from './pages/LenderDebtsPage';
import './axiosSetup';
import AuthRoute from './components/AuthRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/debts" element={<AuthRoute element={<DebtsPage />} />} />
          <Route path="/transactions/:debtId" element={<AuthRoute element={<TransactionsPage />} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/debts/lender' element={<AuthRoute element={<LenderDebtsPage />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
