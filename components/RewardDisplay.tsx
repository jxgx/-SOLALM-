
import React from 'react';
import type { BibleVerse } from '../types';

interface RewardDisplayProps {
  isLoading: boolean;
  error: string | null;
  reward: { imageUrl: string; verse: BibleVerse } | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gray-800"></div>
    <p className="text-gray-600">Generating your blessing...</p>
  </div>
);

export const RewardDisplay: React.FC<RewardDisplayProps> = ({ isLoading, error, reward }) => {
  if (isLoading) {
    return <div className="w-full max-w-md h-96 flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="w-full max-w-md p-4 text-center text-red-600 bg-red-100 border border-red-400">{error}</div>;
  }

  if (reward) {
    return (
      <div className="w-full max-w-md flex flex-col items-center gap-4 animate-fade-in">
        <div className="aspect-square w-full bg-gray-100 border border-gray-800">
            <img src={reward.imageUrl} alt="AI-generated art for a Bible verse" className="w-full h-full object-cover" />
        </div>
        <div className="text-center">
            <p className="text-gray-800">"{reward.verse.verseText}"</p>
            <p className="mt-2 text-sm text-gray-600 font-bold">{reward.verse.reference}</p>
        </div>
      </div>
    );
  }

  return null;
};
