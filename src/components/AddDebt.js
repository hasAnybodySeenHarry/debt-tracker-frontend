import React, { useState } from 'react';

const AddDebtModal = ({ isOpen, onClose, onSubmit, lenders }) => {
  const [category, setCategory] = useState('');
  const [total, setTotal] = useState('0');
  const [lenderId, setLenderId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const lender = lenders.find(l => l.id === parseInt(lenderId));
      if (!lender) throw new Error('Invalid lender selected');

      await onSubmit({
        category,
        total: parseFloat(total),
        lender_id: parseInt(lenderId),
      }, lender.name);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Add Debt</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Category</label>
                <input 
                type="text"
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Total</label>
                <input 
                type="number" 
                value={total} 
                onChange={(e) => setTotal(e.target.value)} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Lender</label>
                <select 
                value={lenderId} 
                onChange={(e) => setLenderId(e.target.value)} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700"
                required
                >
                <option value="">Select Lender</option>
                {lenders.map((lender) => (
                    <option key={lender.id} value={lender.id}>
                    {lender.name}
                    </option>
                ))}
                </select>
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                Add Debt
                </button>
            </div>
        </form>

      </div>
    </div>
  );
};

export default AddDebtModal;
