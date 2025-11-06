
export interface Donation {
  id: string;
  address: string;
  amount: number;
}

export interface BibleVerse {
  verseText: string;
  reference: string;
}

export interface LeaderboardEntry {
  address: string;
  totalAmount: number;
}