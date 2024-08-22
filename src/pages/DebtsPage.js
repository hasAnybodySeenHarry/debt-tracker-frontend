import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddDebtModal from '../components/AddDebt';
import api from '../axiosSetup';
import { useLottie } from 'lottie-react';
import animationData from '../animations/empty.json';
import { useAuth } from '../hooks/useAuth';

function DebtsPage() {
  const [debts, setDebts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lenders, setLenders] = useState([]);
  const getToken = useAuth();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchLenders = async () => {
      try {
        const response = await api.get('v1/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLenders(response.data.users);
      } catch (error) {
        if (error.response && error.response.status === 401) {

        } else {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchLenders();
  }, [getToken]);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchDebts = async () => {
      try {
        const response = await api.get('/v1/debts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDebts(response.data.debts);
      } catch (error) {
        if (error.response && error.response.status === 401) {

        } else {
          console.error('Error fetching debts:', error);
        }
      }
    };

    fetchDebts();
  }, [getToken]);

  const handleAddDebt = async (debt, lenderName) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await api.post('/v1/debts', debt, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const newDebt = { ...response.data.debt, lender: { name: lenderName } };
      setDebts(prev => [newDebt, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {

      } else {
        throw new Error(error.response?.data?.message || 'Error adding debt');
      }
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const { View } = useLottie(defaultOptions);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <div className="flex justify-between items-center w-full max-w-screen-xl mb-6">
        <h1 className="text-3xl font-bold">Debts</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        >
          Add Debt
        </button>
      </div>

      {debts.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="flex items-center justify-center" style={{ height: 200, width: 200 }}>
            {View}
          </div>
          <p className="text-gray-400 mt-4">No debts available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-screen-xl">
          {debts.map(debt => (
            <div
              key={debt.id}
              className="relative group"
            >
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
                <h2 className="text-xl font-semibold mb-2 text-white">{debt.category}</h2>
                <p className="text-gray-400 text-lg mb-4">Total: ${debt.total}</p>
                <p className="text-white">Lender: {debt.lender.name}</p>
                <Link
                  to={`/transactions/${debt.id}`}
                  className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                >
                  View Transactions
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddDebtModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddDebt} 
        lenders={lenders}
      />
    </div>
  );
}

export default DebtsPage;
