import React, { useState, useCallback, useEffect } from 'react';
import { DonationForm } from './components/DonationForm';
import { RewardDisplay } from './components/RewardDisplay';
import { Leaderboard } from './components/Leaderboard';
import { getBibleVerse, generateImageForVerse, getRevelationVerse } from './services/geminiService';
import type { Donation, BibleVerse, LeaderboardEntry } from './types';

const DONATION_ADDRESS = "Bagz8tdTAjKJDUwM5cHhJt2SzD7siQUPb7U9mNhFwHxW";

const App: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reward, setReward] = useState<{ imageUrl: string; verse: BibleVerse } | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [revelationVerse, setRevelationVerse] = useState<BibleVerse | null>(null);

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        const verseData = await getRevelationVerse();
        setRevelationVerse(verseData);
        localStorage.setItem('revelationVerse', JSON.stringify(verseData));
        localStorage.setItem('verseTimestamp', Date.now().toString());
      } catch (err) {
        console.error("Failed to fetch Revelation verse", err);
      }
    };

    const cachedVerse = localStorage.getItem('revelationVerse');
    const cachedTimestamp = localStorage.getItem('verseTimestamp');
    const THREE_HOURS_IN_MS = 3 * 60 * 60 * 1000;

    if (cachedVerse && cachedTimestamp && (Date.now() - parseInt(cachedTimestamp, 10)) < THREE_HOURS_IN_MS) {
      setRevelationVerse(JSON.parse(cachedVerse));
    } else {
      fetchVerse();
    }

    const intervalId = setInterval(fetchVerse, THREE_HOURS_IN_MS);

    return () => clearInterval(intervalId);
  }, []);

  const generateSolanaAddress = () => {
    // Generates a more consistent-looking fake address for display
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let address = '';
    for (let i = 0; i < 44; i++) {
        address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
  };
  
  const handleConnectWallet = useCallback(() => {
    setConnectedWallet(generateSolanaAddress());
  }, []);

  const handleDisconnectWallet = useCallback(() => {
    setConnectedWallet(null);
  }, []);

  const handleCopyAddress = useCallback(() => {
    navigator.clipboard.writeText(DONATION_ADDRESS).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, []);


  const handleDonate = useCallback(async (amount: number) => {
    setIsLoading(true);
    setError(null);
    setReward(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const verse = await getBibleVerse();
      const imageUrl = await generateImageForVerse(verse.verseText);
      
      setReward({ imageUrl, verse });

      // Use connected wallet or create a new one for the leaderboard
      const donorAddress = connectedWallet || generateSolanaAddress();
      if (!connectedWallet) {
        setConnectedWallet(donorAddress);
      }

      const newDonation: Donation = {
        id: new Date().toISOString() + Math.random(),
        address: donorAddress,
        amount: amount,
      };
      setDonations(prevDonations => [...prevDonations, newDonation]);

      // --- LEADERBOARD LOGIC ---
      const existingEntry = leaderboard.find(e => e.address === donorAddress);
      const oldTotalAmount = existingEntry?.totalAmount || 0;
      const newTotalAmount = oldTotalAmount + amount;

      const updatedEntry: LeaderboardEntry = {
        address: donorAddress,
        totalAmount: newTotalAmount,
      };

      setLeaderboard(prevLeaderboard => [
        ...prevLeaderboard.filter(e => e.address !== donorAddress),
        updatedEntry
      ]);
      // --- END LEADERBOARD LOGIC ---

    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [connectedWallet, leaderboard]);

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col items-center justify-start p-4 sm:p-8">
       <header className="w-full max-w-md flex justify-end mb-4 h-12">
          {connectedWallet ? (
              <div className="text-right">
                  <span className="font-mono text-xs bg-gray-100 border border-gray-300 px-2 py-1">{connectedWallet.slice(0, 4)}...{connectedWallet.slice(-4)}</span>
                  <button onClick={handleDisconnectWallet} className="block text-gray-500 hover:text-gray-800 text-xs mt-1 transition-colors w-full text-right">Disconnect</button>
              </div>
          ) : (
              <button onClick={handleConnectWallet} className="px-3 py-2 text-sm border border-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-300">
                  Connect Wallet
              </button>
          )}
      </header>
      <main className="w-full flex flex-col items-center text-center">
        <h1 className="text-6xl font-bold tracking-wider title-giallo mb-2">$SOLALM$</h1>

        <p className="text-gray-600 mb-6 max-w-md">Give $SOL to receive the blessing of art - from the void to the heart.</p>
        
        <div className="w-full max-w-md p-4 mb-8">
            <p className="text-sm text-gray-500 mb-2">donate // don't let my marigolds die</p>
            <div className="flex items-center justify-between bg-gray-100 p-2 border border-gray-200">
                <p className="text-xs sm:text-sm truncate font-mono select-all text-left">{DONATION_ADDRESS}</p>
                <button onClick={handleCopyAddress} className="ml-2 px-3 py-1 text-xs border border-gray-400 bg-white rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                    {isCopied ? 'Copied!' : 'Copy'}
                </button>
            </div>
             {revelationVerse && (
                <blockquote className="mt-4 text-xs text-gray-500 italic text-left">
                    <p>"{revelationVerse.verseText}"</p>
                    <cite className="block text-right not-italic mt-1">{revelationVerse.reference}</cite>
                </blockquote>
            )}
        </div>

        <DonationForm isLoading={isLoading} onDonate={handleDonate} />
        
        <div className="mt-8 w-full flex justify-center">
            <RewardDisplay isLoading={isLoading} error={error} reward={reward} />
        </div>

        <Leaderboard entries={leaderboard} />
      </main>
      <footer className="mt-12 text-center text-xs text-gray-400 space-y-2">
        <p>This is a holy tool for artistic and charitable purposes. Wallet donations are appreciated. Wallet connection and donation buttons are simulated.</p>
        <p>Created by: <a href="https://jamie-grefe.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700 transition-colors">https://jamie-grefe.com</a></p>
      </footer>
    </div>
  );
};

export default App;