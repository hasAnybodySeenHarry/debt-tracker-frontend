import React from 'react';

const AddTransactionModal = ({ isOpen, onClose, onSubmit, debtId }) => {
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      debt_id: parseInt(debtId, 10),
      amount: parseInt(amount, 10),
      description 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-white">Add Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">Amount</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white" // Ensure text-white is applied here
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">Description</label>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white" // Ensure text-white is applied here
              required
            />
          </div>
          <div className="flex justify-between">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
