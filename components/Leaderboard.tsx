import React from 'react';
import type { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  const sortedEntries = [...entries].sort((a, b) => b.totalAmount - a.totalAmount);

  return (
    <div className="w-full max-w-md mx-auto mt-12">
      <h2 className="text-xl font-bold text-center mb-4">Top Donors</h2>
      {sortedEntries.length > 0 ? (
        <div className="border border-gray-800">
          <div className="grid grid-cols-3 gap-4 p-2 font-bold bg-gray-100 border-b border-gray-800 text-sm">
            <div className="text-left">Rank</div>
            <div className="text-left">Address</div>
            <div className="text-right">Amount</div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {sortedEntries.map((entry, index) => (
              <div key={entry.address} className="grid grid-cols-3 gap-4 p-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 text-sm items-center">
                <div className="text-left font-bold">#{index + 1}</div>
                <div className="text-left truncate">{entry.address}</div>
                <div className="text-right font-semibold">{entry.totalAmount.toFixed(4)}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Be the first to donate!</p>
      )}
    </div>
  );
};