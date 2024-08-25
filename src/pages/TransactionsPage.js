import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddTransactionModal from '../components/AddTransaction';
import { format } from 'date-fns';
import api from '../axiosSetup';
import { useLottie } from 'lottie-react';
import animationData from '../animations/empty.json';
import { useAuth } from '../hooks/useAuth';

function TransactionsPage() {
  const { debtId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getToken = useAuth();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/expenses/v1/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            debt_id: parseInt(debtId, 10)
          }
        });
        setTransactions(response.data.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {

        } else {
          console.error('Error fetching transactions:', error);
        }
      }
    };

    fetchTransactions();
  }, [debtId, getToken]);

  const handleAddTransaction = async (transaction) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await api.post(`/expenses/v1/transactions`, transaction, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTransactions(prev => [...prev, response.data.transaction]);
      setIsModalOpen(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {

      } else {
        console.error('Error adding transaction:', error);
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
    <div className="bg-gray-900 text-white min-h-screen p-4 flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-screen-xl mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        >
          Add Transaction
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="flex items-center justify-center" style={{ height: 200, width: 200 }}>
            {View}
          </div>
          <p className="text-gray-400 mt-4">No transactions available</p>
        </div>
      ) : (
        <ul className="space-y-4 w-full max-w-screen-xl">
          {transactions.map(transaction => (
            <li key={transaction.id} className="p-4 border border-gray-700 rounded-lg shadow-sm flex items-center justify-between bg-gray-800">
              <div className="flex-1">
                <div className="text-lg font-semibold">{transaction.description}</div>
                <div className="text-gray-300">${transaction.amount}</div>
              </div>
              <div className="text-gray-500 text-sm">
                {format(new Date(transaction.created_at), 'MMM d, yyyy h:mm a')}
              </div>
            </li>
          ))}
        </ul>
      )}

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddTransaction} 
        debtId={parseInt(debtId, 10)}
      />
    </div>
  );
}

export default TransactionsPage;
