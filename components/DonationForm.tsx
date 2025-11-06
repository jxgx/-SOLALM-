import React, { useState } from 'react';

interface DonationFormProps {
  isLoading: boolean;
  onDonate: (amount: number) => void;
}

const PRESET_AMOUNTS = [0.1, 0.5, 1, 2.5];

export const DonationForm: React.FC<DonationFormProps> = ({ isLoading, onDonate }) => {
  const [amount, setAmount] = useState<string>('');

  const handleDonateClick = () => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      onDonate(numericAmount);
    }
  };

  const handlePresetClick = (presetAmount: number) => {
    setAmount(presetAmount.toString());
    onDonate(presetAmount);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4">
      <div className="relative w-full">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter SOL alms amount"
          disabled={isLoading}
          className="no-spinner w-full px-4 py-3 text-center bg-transparent border border-gray-800 focus:ring-2 focus:ring-gray-600 focus:outline-none transition-all duration-300 placeholder-gray-500 text-lg"
        />
         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">$SOL</span>
      </div>
      <div className="flex w-full items-center justify-center gap-2">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            disabled={isLoading}
            className="px-4 py-2 text-sm border border-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {preset} SOL
          </button>
        ))}
      </div>
      <button
        onClick={handleDonateClick}
        disabled={isLoading || !amount || parseFloat(amount) <= 0}
        className="w-full px-6 py-3 bg-gray-900 text-white font-bold hover:bg-gray-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Donate & Receive Blessing'}
      </button>
    </div>
  );
};