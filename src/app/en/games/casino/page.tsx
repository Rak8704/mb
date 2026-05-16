"use client";

import React, { useState } from "react";
import { GameLauncher } from "@/components/sections/game-launcher";

// Type definitions
interface Game {
  id: number;
  name: string;
  category: string;
  image: string;
  popular: boolean;
  description: string;
  minBet: number;
  maxBet: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

// Game data
const games: Game[] = [
  {
    id: 1,
    name: "Slot Machine",
    category: "slot",
    image: "/images/slot-game.jpg",
    popular: true,
    description: "Classic slot machine with huge jackpots",
    minBet: 10,
    maxBet: 1000,
  },
  {
    id: 2,
    name: "Blackjack",
    category: "card",
    image: "/images/blackjack.jpg",
    popular: true,
    description: "Beat the dealer to 21",
    minBet: 25,
    maxBet: 5000,
  },
  {
    id: 3,
    name: "Roulette",
    category: "table",
    image: "/images/roulette.jpg",
    popular: false,
    description: "Place your bets on red, black, or numbers",
    minBet: 5,
    maxBet: 10000,
  },
  {
    id: 4,
    name: "Poker",
    category: "card",
    image: "/images/poker.jpg",
    popular: true,
    description: "Texas Hold'em Poker",
    minBet: 50,
    maxBet: 10000,
  },
  {
    id: 5,
    name: "Baccarat",
    category: "card",
    image: "/images/baccarat.jpg",
    popular: false,
    description: "Classic Baccarat game",
    minBet: 100,
    maxBet: 50000,
  },
  {
    id: 6,
    name: "Craps",
    category: "dice",
    image: "/images/craps.jpg",
    popular: false,
    description: "Dice rolling game",
    minBet: 10,
    maxBet: 5000,
  },
  {
    id: 7,
    name: "Video Poker",
    category: "card",
    image: "/images/video-poker.jpg",
    popular: true,
    description: "Poker with slot machine style",
    minBet: 25,
    maxBet: 2500,
  },
  {
    id: 8,
    name: "Wheel of Fortune",
    category: "wheel",
    image: "/images/wheel.jpg",
    popular: false,
    description: "Spin the wheel for big wins",
    minBet: 15,
    maxBet: 3000,
  },
];

export default function CasinoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showGameLauncher, setShowGameLauncher] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [userBalance, setUserBalance] = useState<number>(5000);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Categories for filtering
  const categories: Category[] = [
    { id: "all", name: "All Games", icon: "🎮" },
    { id: "slot", name: "Slots", icon: "🎰" },
    { id: "card", name: "Card Games", icon: "🃏" },
    { id: "table", name: "Table Games", icon: "🎲" },
    { id: "dice", name: "Dice Games", icon: "🎯" },
    { id: "wheel", name: "Wheel Games", icon: "🎡" },
  ];

  // Filter games by category and search
  const filteredGames: Game[] = games.filter((game: Game) => {
    const matchesCategory: boolean =
      selectedCategory === "all" || game.category === selectedCategory;
    const matchesSearch: boolean = game.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Popular games
  const popularGames: Game[] = games.filter((game: Game) => game.popular);

  // Handle game launch
  const handlePlayGame = (game: Game): void => {
    setSelectedGame(game);
    setShowGameLauncher(true);
  };

  // Close game launcher
  const closeGameLauncher = (): void => {
    setShowGameLauncher(false);
    setSelectedGame(null);
  };

  // Handle bet placement
  const handlePlaceBet = (amount: number): boolean => {
    if (amount <= userBalance) {
      setUserBalance(userBalance - amount);
      return true;
    }
    return false;
  };

  // Handle add funds
  const handleAddFunds = (): void => {
    setUserBalance(userBalance + 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <div className="relative bg-black/50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/casino-bg.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-bounce">
              🎰 Casino Royale
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Experience classic and modern casino games
            </p>
            
            {/* User Balance Card */}
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm px-8 py-4 rounded-full">
              <span className="text-yellow-400 text-2xl">💰</span>
              <div className="text-left">
                <p className="text-sm text-gray-400">Your Balance</p>
                <p className="text-2xl font-bold text-white">${userBalance.toLocaleString()}</p>
              </div>
              <button 
                onClick={handleAddFunds}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-full text-sm font-semibold transition"
              >
                + Add Funds
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="🔍 Search games..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category: Category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Games Section */}
        {selectedCategory === "all" && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>🔥</span> Popular Games
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularGames.map((game: Game) => (
                <div
                  key={game.id}
                  className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => handlePlayGame(game)}
                >
                  <div className="relative h-48 bg-gray-700">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                    <div className="absolute bottom-2 left-2 z-20 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                      🔥 POPULAR
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{game.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        Min: ${game.minBet}
                      </div>
                      <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition">
                        Play Now →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Games Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🎲</span> {selectedCategory === "all" ? "All Games" : categories.find((c: Category) => c.id === selectedCategory)?.name}
          </h2>
          
          {filteredGames.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">No games found</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-purple-400 hover:text-purple-300"
              >
                Clear filters →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game: Game) => (
                <div
                  key={game.id}
                  className="group bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-purple-500"
                  onClick={() => handlePlayGame(game)}
                >
                  <div className="relative h-48 bg-gray-700 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 group-hover:from-black/40 transition"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-20">
                      <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full">
                        Play Now
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{game.name}</h3>
                    <p className="text-gray-400 text-xs mb-3">{game.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-400">💰 Min: ${game.minBet}</span>
                      <span className="text-yellow-400">🎯 Max: ${game.maxBet}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🎁</div>
            <h3 className="text-white font-bold mb-2">Welcome Bonus</h3>
            <p className="text-gray-400 text-sm">100% deposit bonus up to $1000</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-white font-bold mb-2">Secure & Fair</h3>
            <p className="text-gray-400 text-sm">Provably fair games with SSL encryption</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-red-500/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-white font-bold mb-2">Instant Withdrawals</h3>
            <p className="text-gray-400 text-sm">Fast payouts to your wallet</p>
          </div>
        </div>
      </div>

      {/* Game Launcher Modal */}
      {showGameLauncher && selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-6xl mx-4">
            <button
              onClick={closeGameLauncher}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black/50 mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Casino Royale. All rights reserved. | 18+ Only | Play Responsibly
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <span className="text-gray-500 text-xs">🔒 Secure Gaming</span>
            <span className="text-gray-500 text-xs">⚖️ Fair Play Certified</span>
            <span className="text-gray-500 text-xs">🎯 RNG Tested</span>
          </div>
        </div>
      </footer>
    </div>
  );
}