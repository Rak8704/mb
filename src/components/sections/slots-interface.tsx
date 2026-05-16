"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Star, Zap, Crown, Flame, TrendingUp, Sparkles, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SlotGame {
  id: string;
  name: string;
  image: string;
  provider: string;
  category: string[];
  popular: boolean;
  new: boolean;
  hot: boolean;
  jackpot?: boolean;
}

const slotGames: SlotGame[] = [
  { id: '1', name: 'Book of Dead', image: 'https://v3.fal.media/files/kangaroo/Ok1Pi6_uTGoThL7eivq90_output.png', provider: 'Play\'n GO', category: ['Popular', 'Egyptian'], popular: true, new: false, hot: true },
  { id: '2', name: 'Starburst', image: 'https://v3.fal.media/files/penguin/VTYYyOoJHSasqapk8hPr3_output.png', provider: 'NetEnt', category: ['Popular', 'Classic'], popular: true, new: false, hot: false },
  { id: '3', name: 'Gonzo\'s Quest', image: 'https://v3.fal.media/files/rabbit/aLEXMOKgAiZv66Qq8zAVc_output.png', provider: 'NetEnt', category: ['Popular', 'Adventure'], popular: true, new: false, hot: true },
  { id: '4', name: 'Mega Moolah', image: 'https://v3.fal.media/files/penguin/jwLf3S55fiBQKLHvfJyVH_output.png', provider: 'Microgaming', category: ['Jackpot', 'Safari'], popular: true, new: false, hot: false, jackpot: true },
  { id: '5', name: 'Immortal Romance', image: 'https://v3.fal.media/files/koala/EhxVmzU0Pqk9zvk6p8G5K_output.png', provider: 'Microgaming', category: ['Popular', 'Vampire'], popular: true, new: false, hot: false },
  { id: '6', name: 'Bonanza', image: 'https://v3.fal.media/files/panda/Y3n9ZFl8RePKuonGulImg_output.png', provider: 'Big Time Gaming', category: ['Megaways', 'Mining'], popular: true, new: false, hot: true },
  { id: '7', name: 'Dead or Alive 2', image: 'https://v3.fal.media/files/elephant/qfLxnZgwR4BWxB98iQlri_output.png', provider: 'NetEnt', category: ['Western', 'High Volatility'], popular: false, new: false, hot: true },
  { id: '8', name: 'Reactoonz', image: 'https://v3.fal.media/files/lion/Xyv0y15d0vP068fqefxTi_output.png', provider: 'Play\'n GO', category: ['Cluster Pays', 'Aliens'], popular: true, new: false, hot: false },
  { id: '9', name: 'Viking Runecraft', image: 'https://v3.fal.media/files/rabbit/qdpVP77rdxngzKTAT2uk4_output.png', provider: 'Play\'n GO', category: ['Vikings', 'Cluster Pays'], popular: false, new: false, hot: false },
  { id: '10', name: 'Jammin\' Jars', image: 'https://v3.fal.media/files/zebra/Yfq5lsnIUPdueGPNBBIGs_output.png', provider: 'Push Gaming', category: ['Cluster Pays', 'Fruits'], popular: true, new: false, hot: true },
  { id: '11', name: 'Wolf Gold', image: 'https://v3.fal.media/files/rabbit/2GXI-xlBfTSc04d-2ZCqh_output.png', provider: 'Pragmatic Play', category: ['Jackpot', 'Wildlife'], popular: true, new: false, hot: false, jackpot: true },
  { id: '12', name: 'Sweet Bonanza', image: 'https://v3.fal.media/files/monkey/Dll0mczrVKZYCTOigIoLL_output.png', provider: 'Pragmatic Play', category: ['Popular', 'Candy'], popular: true, new: true, hot: true },
  { id: '13', name: 'Gates of Olympus', image: 'https://v3.fal.media/files/koala/VeCElJ_VB0Ku6Xmo8Vz4h_output.png', provider: 'Pragmatic Play', category: ['Greek Mythology', 'Popular'], popular: true, new: true, hot: true },
  { id: '14', name: 'The Dog House', image: 'https://v3.fal.media/files/monkey/Oya4bNlocaOjMzIHnkPiN_output.png', provider: 'Pragmatic Play', category: ['Animals', 'Popular'], popular: true, new: false, hot: false },
  { id: '15', name: 'Fruit Party', image: 'https://v3.fal.media/files/tiger/US1z1oBBnUZGRKtXXb86w_output.png', provider: 'Pragmatic Play', category: ['Fruits', 'Cluster Pays'], popular: false, new: false, hot: false },
  { id: '16', name: 'Fire Joker', image: 'https://v3.fal.media/files/kangaroo/ZPFKXr5kPwJ25rDgOBpVe_output.png', provider: 'Play\'n GO', category: ['Classic', 'Fruits'], popular: false, new: false, hot: false },
  { id: '17', name: 'Legacy of Dead', image: 'https://v3.fal.media/files/kangaroo/lYHaR_DETnLxNzv5Qx5vs_output.png', provider: 'Play\'n GO', category: ['Egyptian', 'Adventure'], popular: true, new: false, hot: false },
  { id: '18', name: 'Rich Wilde and the Tome of Madness', image: 'https://v3.fal.media/files/panda/8PzjIC3DLmmzqirl5FTyl_output.png', provider: 'Play\'n GO', category: ['Adventure', 'Lovecraft'], popular: false, new: false, hot: false },
  { id: '19', name: 'Razor Shark', image: 'https://v3.fal.media/files/koala/0AnBO-Dx8RCvMj5vssF9v_output.png', provider: 'Push Gaming', category: ['Ocean', 'High Volatility'], popular: true, new: false, hot: true },
  { id: '20', name: 'Money Train 2', image: 'https://v3.fal.media/files/penguin/4h35WftNO-_GdhZusBMWQ_output.png', provider: 'Relax Gaming', category: ['Western', 'High Volatility'], popular: true, new: false, hot: true },
  { id: '21', name: 'Big Bass Bonanza', image: 'https://v3.fal.media/files/penguin/cWeb1Nu0nz79XOQzC1lRV_output.png', provider: 'Pragmatic Play', category: ['Fishing', 'Popular'], popular: true, new: true, hot: true },
  { id: '22', name: 'Buffalo King', image: 'https://v3.fal.media/files/penguin/8bEOMfjhp6GRTLreMg1ID_output.png', provider: 'Pragmatic Play', category: ['Wildlife', 'Megaways'], popular: false, new: false, hot: false },
  { id: '23', name: 'Moon Princess', image: 'https://v3.fal.media/files/elephant/ILkEO6gBUSCsrh9b-bBtH_output.png', provider: 'Play\'n GO', category: ['Anime', 'Cluster Pays'], popular: true, new: false, hot: false },
  { id: '24', name: 'Mystery Joker', image: 'https://v3.fal.media/files/tiger/fxGXhvVyUzh7XBkPkrLOk_output.png', provider: 'Play\'n GO', category: ['Classic', 'Mystery'], popular: false, new: false, hot: false },
];

const categories = [
  { id: 'all', label: 'All Games', icon: Sparkles },
  { id: 'popular', label: 'Popular', icon: TrendingUp },
  { id: 'new', label: 'New Games', icon: Zap },
  { id: 'hot', label: 'Hot Games', icon: Flame },
  { id: 'jackpot', label: 'Jackpot', icon: Crown },
];

const providers = ['All Providers', 'Play\'n GO', 'NetEnt', 'Pragmatic Play', 'Microgaming', 'Big Time Gaming', 'Push Gaming', 'Relax Gaming'];

export default function SlotsInterface() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('All Providers');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredGames = useMemo(() => {
    return slotGames.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          game.provider.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesCategory = true;
      if (selectedCategory === 'popular') matchesCategory = game.popular;
      else if (selectedCategory === 'new') matchesCategory = game.new;
      else if (selectedCategory === 'hot') matchesCategory = game.hot;
      else if (selectedCategory === 'jackpot') matchesCategory = game.jackpot || false;

      const matchesProvider = selectedProvider === 'All Providers' || game.provider === selectedProvider;

      return matchesSearch && matchesCategory && matchesProvider;
    });
  }, [searchTerm, selectedCategory, selectedProvider]);

  const toggleFavorite = (gameId: string) => {
    setFavorites(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">Slot Games</h1>
          <p className="text-muted-foreground">Play the best online slot games with amazing jackpots and bonuses</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border text-foreground"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'bg-primary text-primary-foreground' : ''}
              >
                <Icon className="mr-2 h-4 w-4" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Provider Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {providers.map((provider) => (
            <Badge
              key={provider}
              variant={selectedProvider === provider ? 'default' : 'outline'}
              className={`cursor-pointer px-4 py-2 ${
                selectedProvider === provider 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'hover:bg-secondary/50'
              }`}
              onClick={() => setSelectedProvider(provider)}
            >
              {provider}
            </Badge>
          ))}
        </div>

        {/* Games Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="group relative overflow-hidden rounded-lg bg-card border border-border transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              {/* Game Image */}
              <div className="relative aspect-[3/4] w-full bg-muted">
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
                    <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Play Now
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      Demo
                    </Button>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {game.new && (
                    <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5">NEW</Badge>
                  )}
                  {game.hot && (
                    <Badge className="bg-red-600 text-white text-xs px-2 py-0.5">HOT</Badge>
                  )}
                  {game.jackpot && (
                    <Badge className="bg-yellow-600 text-white text-xs px-2 py-0.5">
                      <Crown className="mr-1 h-3 w-3" />
                      JACKPOT
                    </Badge>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(game.id)}
                  className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 transition-colors hover:bg-black/70"
                  aria-label="Add to favorites"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.includes(game.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-white'
                    }`}
                  />
                </button>
              </div>

              {/* Game Info */}
              <div className="p-3">
                <h3 className="mb-1 text-sm font-semibold text-foreground line-clamp-1">
                  {game.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{game.provider}</p>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredGames.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No games found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedProvider('All Providers');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}