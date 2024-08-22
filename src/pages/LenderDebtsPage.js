import React, { useState, useEffect } from 'react';
import api from '../axiosSetup';
import { Link } from 'react-router-dom';
import { useLottie } from 'lottie-react';
import animationData from '../animations/empty.json';
import { useAuth } from '../hooks/useAuth';

function LenderDebtsPage() {
  const [debts, setDebts] = useState([]);
  const [draggingDebt, setDraggingDebt] = useState(null);
  const [showDustbin, setShowDustbin] = useState(false);
  const getToken = useAuth();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchDebts = async () => {
      try {
        const response = await api.get(`/v1/debts/lender`, {
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

  const handleDragStart = (debt) => {
    setDraggingDebt(debt);
    setShowDustbin(true);
  };

  const handleDragEnd = () => {
    setDraggingDebt(null);
    setShowDustbin(false);
  };

  const handleDrop = async () => {
    if (draggingDebt) {
      const confirmed = window.confirm('Are you sure you want to delete this debt?');
      if (confirmed) {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No token found');
          return;
        }

        try {
          await api.delete(`/v1/debts/${draggingDebt.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Expected-Version': draggingDebt.version
            }
          });
          setDebts(prev => prev.filter(debt => debt.id !== draggingDebt.id));
        } catch (error) {
          window.alert('Error deleting debt:', error.response);
        }
      }
    }
    setDraggingDebt(null);
    setShowDustbin(false);
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
        <h1 className="text-3xl font-bold">Lender Debts</h1>
      </div>

      {showDustbin && (
        <div
          className="fixed top-4 right-4 p-4 shadow-lg transition-transform duration-300 ease-in-out"
          style={{ 
            background: 'rgba(255, 0, 0, 0.25)', 
            color: 'white', 
            transform: showDustbin ? 'scale(1.1)' : 'scale(1)',
            width: '60px',
            height: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%'
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          🗑️
        </div>
      )}

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
                draggable
                onDragStart={() => handleDragStart(debt)}
                onDragEnd={handleDragEnd}
            >
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
                <h2 className="text-xl font-semibold mb-2 text-white">{debt.category}</h2>
                <p className="text-gray-400 text-lg mb-4">Total: ${debt.total}</p>
                <p className="text-white">Borrower: {debt.borrower.name}</p>
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
    </div>
  );
}

export default LenderDebtsPage;
