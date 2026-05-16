"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Goal, Dribbble, Trophy, Star, Search, Trash2, ShieldCheck, Menu, Pin, PinOff, Crown, Puzzle, Heart, LayoutGrid, Spade, Gamepad2, Bird, Club, Fish, Ticket, Gem, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

// NOTE: The following imports are placeholders for shadcn/ui components.
// Ensure you have these components set up in your project.
import { Button } from '@/components/ui/button';
import { BuyCoinsDialog } from '@/components/payments/buy-coins-dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Sheet, SheetContent } from '@/components/ui/sheet';

// Types
type Bet = {
  match: string;
  market: string;
  odd: string;
  value: number;
  stake?: number;
};

// Placeholder Data
const sports = [
  { name: 'Favourites', icon: Star, count: 5, href: '/en/sports?page=favorites' },
  { name: 'Football', icon: Goal, count: 124, slug: 'football' },
  { name: 'Basketball', icon: Dribbble, count: 48, slug: 'basketball' },
  { name: 'Tennis', icon: Trophy, count: 72, slug: 'tennis' },
  { name: 'American Football', icon: ShieldCheck, count: 31, slug: 'american-football' },
];

// Extended sports list to mirror the reference menu
const extraSports = [
  { name: 'Volleyball', slug: 'volleyball' },
  { name: 'Ice Hockey', slug: 'ice-hockey' },
  { name: 'Table Tennis', slug: 'table-tennis' },
  { name: 'Handball', slug: 'handball' },
  { name: 'Baseball', slug: 'baseball' },
  { name: 'Boxing', slug: 'boxing' },
  { name: 'Rugby', slug: 'rugby' },
  { name: 'Cricket', slug: 'cricket' },
  { name: 'Cycling', slug: 'cycling' },
  { name: 'MMA', slug: 'mma' },
  { name: 'Snooker', slug: 'snooker' },
  { name: 'Waterpolo', slug: 'waterpolo' },
  { name: 'Futsal', slug: 'futsal' },
  { name: 'Beach Volley', slug: 'beach-volley' },
  { name: 'Bandy', slug: 'bandy' },
  { name: 'Badminton', slug: 'badminton' },
  { name: 'Floorball', slug: 'floorball' },
  { name: 'Darts', slug: 'darts' },
];

const liveMatches = [
  { id: 1, teamA: 'Man United', teamB: 'Chelsea', scoreA: 1, scoreB: 0, time: "65'" },
  { id: 2, teamA: 'Liverpool', teamB: 'Arsenal', scoreA: 2, scoreB: 2, time: "88'" },
  { id: 3, teamA: 'LA Lakers', teamB: 'GS Warriors', scoreA: 102, scoreB: 98, time: "Q4 2:15" },
];

// Sport key mappings for The Odds API
const SPORT_MAPPINGS: Record<string, string> = {
  'football': 'soccer_epl',
  'basketball': 'basketball_nba',
  'tennis': 'tennis_atp',
  'american-football': 'americanfootball_nfl',
  'ice-hockey': 'icehockey_nhl',
  'baseball': 'baseball_mlb',
  'cricket': 'cricket_test_match',
  'rugby': 'rugbyleague_nrl',
};

// New: Autoplay slideshow at the top (uses existing assets in /public)
const slides = [
  'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Nicebet_Crash_Games_Homepage_Banner_15_Sep_2025_Tablet_faf0c6f495-1758327159486.webp',
  'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/NICEBET_LIBERIA_200_ACCA_BONUS_TABLET_fcd2836967-1758327159153.webp',
  'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Nicebet_Kickoff_Sports_with_up_to_100_Free_Bet_Homepage_Banner_1024x400px_TABLET_ENG_copy_V4_d5231f5eb3-1758327159319.webp',
  'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/NICEBET_WELCOME_CRASH_GAMES_TABLET_1_9d4692fd98-1758327159209.webp',
  'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/nicebet_bet_soc_homepage_tablet_1024x400_2c42f522b1-1758327159739.webp',
];

const Slideshow = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mb-3 md:mb-6">
      <div className="relative overflow-hidden rounded-lg border border-border bg-card">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((src, i) => (
            <div key={i} className="relative min-w-full aspect-[256/100]">
              <Image src={src} alt="Promotion slide" fill className="object-cover" />
            </div>
          ))}
        </div>
        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-4 rounded-full ${i === index ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

import { GamesNavigation } from '@/components/sections/games-navigation';

// New: Horizontal sports category bar (icons + labels)
const CategoryBar = ({ active, onChange }: { active: string; onChange: (v: string) => void }) => {
  const cats = [
    { id: 'football', label: 'Football', icon: Goal },
    { id: 'basketball', label: 'Basketball', icon: Dribbble },
    { id: 'tennis', label: 'Tennis', icon: Trophy },
    { id: 'american', label: 'American Football', icon: ShieldCheck },
  ];
  return (
    <div
      className="mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      style={{ touchAction: 'pan-x', overscrollBehaviorX: 'contain' }}
    >
      <div className="flex gap-2 min-w-min pb-2">
        {cats.map(c => (
          <Button
            key={c.id}
            variant={active === c.id ? 'default' : 'outline'}
            className={`flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${active === c.id ? 'bg-primary text-primary-foreground' : 'bg-accent text-foreground border-border hover:border-primary'}`}
            onClick={() => onChange(c.id)}
          >
            <c.icon className="h-4 w-4" />
            <span>{c.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

// New: Segmented control for date filters (Today / Tomorrow / Upcoming)
const DateSegments = ({ active, onChange }: { active: string; onChange: (v: string) => void }) => {
  const segs = [
    { id: 'today', label: 'Today matches' },
    { id: 'tomorrow', label: 'Tomorrow matches' },
    { id: 'upcoming', label: 'Upcoming matches' },
  ];
  return (
    <div
      className="mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      style={{ touchAction: 'pan-x', overscrollBehaviorX: 'contain' }}
    >
      <div className="flex items-center justify-center gap-2 min-w-min">
        {segs.map(s => (
          <Button
            key={s.id}
            size="sm"
            variant={active === s.id ? 'default' : 'outline'}
            className={`flex-shrink-0 ${active === s.id ? 'bg-primary text-primary-foreground' : 'bg-accent text-foreground border-border hover:border-primary'}`}
            onClick={() => onChange(s.id)}
          >
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

// New: Partner/Sponsor logos marquee scrolling from right to left
const PromotionalCards = ({ onDeposit }: { onDeposit: () => void }) => {
  const router = useRouter();

  // Instant authentication check using localStorage (no API delay)
  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('bearer_token');
    return !!token;
  };

  // Card data with text and images
  const cards = [
    {
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/deposit-now.d0a010e0-1764351594771.png?width=8000&height=8000&resize=contain',
      line1: 'DEPOSIT',
      line2: 'NOW!',
      subtitle: 'GET MORE BONUS',
      hasSeparator: true,
      action: 'deposit'
    },
    {
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/invite-friend.45f0732f-1764351594679.png?width=8000&height=8000&resize=contain',
      line1: 'INVITE',
      line2: 'FRIENDS',
      subtitle: '',
      hasSeparator: true,
      action: 'invite'
    },
    {
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/promo-code.46231421-1764351594261.png?width=8000&height=8000&resize=contain',
      line1: 'PROMO',
      line2: 'CODE',
      subtitle: '',
      hasSeparator: true,
      action: 'promo'
    },
  ];

  const handleCardClick = (action: string) => {
    // Instant check - no delay
    if (!isAuthenticated()) {
      toast.info("Please login to access this feature");
      router.push('/login');
      return;
    }

    // User is logged in - navigate to appropriate page
    switch (action) {
      case 'deposit':
        onDeposit();
        break;
      case 'invite':
        router.push('/en/invite');
        break;
      case 'promo':
        router.push('/en/redeem');
        break;
    }
  };

  return (
    <div className="mb-2 md:mb-4">
      {/* Promotional Cards - Grid Layout */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative w-full aspect-[3/2] rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer shadow-lg group"
            onClick={() => handleCardClick(card.action)}
          >
            {/* Background Image */}
            <Image
              src={card.image}
              alt={`${card.line1} ${card.line2}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Subtle Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

            {/* Text Content - Top Left */}
            <div className="absolute top-3 left-3 sm:left-4">
              <div className="flex flex-col leading-none">
                <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] uppercase tracking-wide">
                  {card.line1}
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] uppercase tracking-wide mt-0.5">
                  {card.line2}
                </span>
              </div>

              {card.subtitle && (
                <p className="text-[7px] sm:text-[9px] text-white mt-1 font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] uppercase tracking-wider">
                  {card.subtitle}
                </p>
              )}
            </div>

            {/* Horizontal Separator Line with Arrow - Fixed Position at Bottom */}
            {card.hasSeparator && (
              <div className="absolute bottom-3 left-3 sm:left-4 flex items-center gap-1">
                <div className="w-12 sm:w-16 h-[2px] bg-white shadow-sm" />
                <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


// New: VIP Banner Component - Image-based with animated shine
const VIPBanner = () => {
  return (
    <div className="mb-2 md:mb-4">
      {/* VIP Banner with image background */}
      <div className="relative h-12 rounded-full overflow-hidden shadow-lg">
        {/* Background Image */}
        <Image
          src="/vip-banner.jpg"
          alt="VIP Banner"
          fill
          className="object-cover"
          priority
        />

        {/* Animated Shine Effect - Moving from left to right automatically */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div
            className="absolute top-0 left-0 w-full h-full animate-shine"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
            }}
          />
        </div>
      </div>

      {/* Keyframe animation for shine effect */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        .animate-shine {
          animation: shine 3s infinite linear;
        }
      `}</style>
    </div>
  );
}


// Message Notification Component - Scrolling Marquee
const MessageNotification = () => {
  const [messages, setMessages] = React.useState<string[]>([]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/scrolling-messages');
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages.map((m: any) => m.message));
        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  React.useEffect(() => {
    fetchMessages();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  if (messages.length === 0) return null;

  return (
    <div className="mb-2 md:mb-4">
      <div className="bg-black/40 border border-orange-500/20 rounded-lg p-2 flex items-center gap-3 overflow-hidden">
        <MessageSquare className="w-5 h-5 text-orange-500 flex-shrink-0 ml-1" />

        {/* Scrolling Text Container */}
        <div className="flex-1 overflow-hidden relative h-6">
          <div className="absolute whitespace-nowrap animate-marquee flex items-center h-full text-sm text-white/90 font-medium">
            {messages.map((msg, index) => (
              <span key={index} className="mr-8">{msg}</span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Sub-components

const SportsSidebar = ({ pinned, onTogglePin, mobile = false }: { pinned: boolean; onTogglePin: () => void; mobile?: boolean }) => (
  <aside
    className={`${pinned ? 'w-64' : 'group w-16 hover:w-64'} ${mobile ? '' : 'hidden lg:flex'} bg-card border-r border-border p-4 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out`}
  >
    <div className="flex items-center gap-3 mb-4">
      <Menu className="h-5 w-5 text-foreground shrink-0" />
      <h2 className={`${pinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} text-lg font-bold text-foreground transition-opacity duration-200 truncate`}>Sports</h2>
      <div className="ml-auto">
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={onTogglePin} aria-label={pinned ? 'Unpin sidebar' : 'Pin sidebar'}>
          {pinned ? <Pin className="h-4 w-4 text-primary" /> : <PinOff className="h-4 w-4" />}
        </Button>
      </div>
    </div>
    <div className={`relative mb-4 ${pinned ? 'block' : 'hidden group-hover:block'}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Enter Team or Championship" className="pl-10 bg-accent border-border text-foreground" />
    </div>
    <nav className="flex-grow">
      <ul>
        {sports.map((sport) => (
          <li key={sport.name} className="mb-1">
            <Link
              href={(sport as any).href ?? `/en/sports?sportId=${((sport as any).slug ?? sport.name.toLowerCase().replace(/\s+/g, '-'))}`}
              className="flex items-center p-2 rounded-md hover:bg-accent text-sm text-foreground transition-colors"
            >
              <TooltipProvider>
                <Tooltip disableHoverableContent={false}>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <sport.icon className="w-4 h-4 text-primary shrink-0" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center" className="bg-popover text-popover-foreground border border-border">
                    {sport.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className={`${pinned ? 'ml-3 opacity-100' : 'ml-0 group-hover:ml-3 opacity-0 group-hover:opacity-100'} transition-all duration-200 truncate`}>
                {sport.name}
              </span>
              <span className={`${pinned ? 'ml-auto inline text-muted-foreground' : 'ml-auto text-muted-foreground hidden group-hover:inline'}`}>{sport.count}</span>
            </Link>
          </li>
        ))}
        {extraSports.map(item => (
          <li key={item.slug} className="mb-1">
            <Link
              href={`/en/sports?sportId=${item.slug}`}
              className="flex items-center p-2 rounded-md hover:bg-accent text-sm text-foreground transition-colors"
            >
              <TooltipProvider>
                <Tooltip disableHoverableContent={false}>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <Trophy className="w-4 h-4 text-primary shrink-0" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center" className="bg-popover text-popover-foreground border border-border">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className={`${pinned ? 'ml-3 opacity-100' : 'ml-0 group-hover:ml-3 opacity-0 group-hover:opacity-100'} transition-all duration-200 truncate`}>
                {item.name}
              </span>
              <span className={`${pinned ? 'ml-auto inline text-muted-foreground' : 'ml-auto text-muted-foreground hidden group-hover:inline'}`}>{Math.floor(Math.random() * 50) + 1}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

const LiveEvents = () => (
  <div className="mb-8">
    <h2 className="text-xl font-bold mb-4 text-foreground">Live Events</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {liveMatches.map(match => (
        <Card key={match.id} className="bg-card border-border hover:border-primary transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <Badge variant="destructive" className="bg-red-600/80 text-white">LIVE</Badge>
              <span className="text-sm text-primary font-semibold">{match.time}</span>
            </div>
            <div className="space-y-2 text-sm text-foreground">
              <div className="flex justify-between items-center">
                <span>{match.teamA}</span>
                <span className="font-bold text-lg">{match.scoreA}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{match.teamB}</span>
                <span className="font-bold text-lg">{match.scoreB}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// New: Highlights section (compact rows with 1x2 odds)
const Highlights = ({ onBetSelect, activeBets, upcomingMatches }: { onBetSelect: (bet: Bet) => void; activeBets: Bet[]; upcomingMatches: any[] }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-3 gap-3">
      <h2 className="text-xl font-bold text-foreground flex-shrink-0">Highlights</h2>
      <div
        className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
        style={{ touchAction: 'pan-x', overscrollBehaviorX: 'contain' }}
      >
        {['Football', 'Basketball', 'Tennis', 'Ice Hockey', 'Cricket'].map(tag => (
          <Badge key={tag} className="bg-accent text-foreground border-border whitespace-nowrap flex-shrink-0 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-1.5">{tag}</Badge>
        ))}
      </div>
    </div>
    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center p-3 text-xs text-muted-foreground border-b border-border">
        <div className="flex-grow">Event</div>
        <div className="w-[72px] text-center shrink-0">1</div>
        <div className="w-[72px] text-center shrink-0">X</div>
        <div className="w-[72px] text-center shrink-0">2</div>
      </div>
      {upcomingMatches.map((m: any) => {
        const matchIdentifier = `${m.teamA} vs ${m.teamB}`;
        return (
          <div key={`hl-${m.id}`} className="flex items-center p-3 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors">
            <div className="flex-grow">
              <div className="font-semibold text-foreground">{matchIdentifier}</div>
              <div className="text-xs text-muted-foreground">{m.league} • {m.time}</div>
            </div>
            {Object.entries(m.odds).map(([market, value]) => {
              const numValue = typeof value === 'number' ? value : 0;
              const isSelected = activeBets.some(b => b.match === matchIdentifier && b.market === market);
              return (
                <div key={market} className="w-[72px] flex justify-center shrink-0">
                  <Button
                    variant={isSelected ? 'default' : 'outline'}
                    className={`h-9 w-16 text-sm ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-accent hover:bg-primary/20 border-border text-foreground hover:border-primary'}`}
                    onClick={() => onBetSelect({ match: matchIdentifier, market, odd: market, value: numValue })}
                  >
                    {numValue.toFixed(2)}
                  </Button>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  </div>
);

const MatchList = ({ onBetSelect, activeBets, upcomingMatches, loading, error }: {
  onBetSelect: (bet: Bet) => void;
  activeBets: Bet[];
  upcomingMatches: any[];
  loading?: boolean;
  error?: string | null;
}) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xl font-bold text-foreground">Upcoming - Soccer</h2>
      <div className="hidden md:flex items-center gap-2">
        <select className="h-9 rounded-md bg-accent border border-border px-2 text-sm text-foreground">
          <option>1x2</option>
          <option>Double Chance</option>
          <option>Draw No Bet</option>
        </select>
        <select className="h-9 rounded-md bg-accent border border-border px-2 text-sm text-foreground">
          <option>Total</option>
          <option>Handicap</option>
          <option>Both Teams To Score</option>
        </select>
      </div>
    </div>

    {error && (
      <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/40 text-sm text-destructive-foreground">
        {error}
      </div>
    )}

    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center p-3 text-xs text-muted-foreground border-b border-border">
        <div className="flex-grow">Match</div>
        <div className="w-[72px] text-center shrink-0">1</div>
        <div className="w-[72px] text-center shrink-0">X</div>
        <div className="w-[72px] text-center shrink-0">2</div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2">Loading live odds...</p>
        </div>
      ) : upcomingMatches.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No matches available at the moment
        </div>
      ) : (
        upcomingMatches.map(match => {
          const matchIdentifier = `${match.teamA} vs ${match.teamB}`;
          return (
            <div key={match.id} className="flex items-center p-3 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors">
              <div className="flex-grow">
                <div className="font-semibold text-foreground">{matchIdentifier}</div>
                <div className="text-xs text-muted-foreground">{match.league} • {match.time}</div>
              </div>
              {Object.entries(match.odds).map(([market, value]) => {
                const isSelected = activeBets.some(b => b.match === matchIdentifier && b.market === market);
                return (
                  <div key={market} className="w-[72px] flex justify-center shrink-0">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      className={`h-9 w-16 text-sm transition-all ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-accent hover:bg-primary/20 border-border text-foreground hover:border-primary'}`}
                      onClick={() => onBetSelect({ match: matchIdentifier, market, odd: market, value: typeof value === 'number' ? value : 0 })}
                    >
                      {typeof value === 'number' ? value.toFixed(2) : '0.00'}
                    </Button>
                  </div>
                );
              })}
            </div>
          );
        })
      )}
    </div>
    <div className="flex justify-center mt-4">
      <Button variant="outline" className="bg-accent border-border text-foreground hover:border-primary">
        View all events
      </Button>
    </div>
  </div>
);

const BetSlip = ({ bets, updateStake, removeBet, clearBets }: { bets: Bet[], updateStake: (index: number, stake: number) => void, removeBet: (index: number) => void, clearBets: () => void }) => {
  const totalStake = bets.reduce((acc, bet) => acc + (bet.stake || 0), 0);
  const potentialWinnings = bets.reduce((acc, bet) => acc + (bet.stake || 0) * bet.value, 0);

  return (
    <aside className="w-80 bg-card border-l border-border p-4 hidden xl:flex flex-col flex-shrink-0">
      <h2 className="text-lg font-bold mb-4 text-foreground">Bet Slip</h2>
      {bets.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-muted-foreground p-4">
          <Trophy className="w-12 h-12 mb-4 text-primary/50" />
          <p className="text-sm font-semibold">Your slip is empty</p>
          <p className="text-xs mt-1">Click on odds to add a bet.</p>
        </div>
      ) : (
        <>
          <div className="flex-grow overflow-y-auto space-y-3 -mr-2 pr-2">
            {bets.map((bet, index) => (
              <div key={index} className="bg-accent p-3 rounded-lg border border-border">
                <div className="flex justify-between items-start">
                  <div className="pr-2">
                    <p className="text-sm font-semibold text-foreground">{bet.market} on {bet.match}</p>
                    <p className="text-xs text-muted-foreground">Full time result</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => removeBet(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-primary">@{bet.value.toFixed(2)}</span>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`stake-${index}`} className="text-xs text-muted-foreground">Stake:</label>
                    <Input
                      id={`stake-${index}`}
                      type="number"
                      value={bet.stake || ''}
                      onChange={(e) => updateStake(index, parseFloat(e.target.value))}
                      className="w-24 h-8 bg-background border-border text-foreground"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="space-y-2 text-sm mb-4 text-foreground">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Stake:</span>
                <span>${totalStake.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Potential Winnings:</span>
                <span className="text-primary">${potentialWinnings.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-base" disabled={totalStake <= 0}>
              Place Bet
            </Button>
            <Button variant="ghost" className="w-full mt-2 hover:bg-accent" onClick={clearBets}>Clear All</Button>
          </div>
        </>
      )}
    </aside>
  );
};

type SportsBettingInterfaceProps = {
  initialQuery?: { page?: string; sportId?: string };
  showSportsContent?: boolean;
  children?: React.ReactNode;
};

export default function SportsBettingInterface({ initialQuery, showSportsContent = true, children }: SportsBettingInterfaceProps) {
  // initialQuery is reserved for future enhancements (filtering by page/sportId)
  const [bets, setBets] = useState<Bet[]>([]);
  const [activeTab, setActiveTab] = useState<'sport' | 'esports' | 'virtuals'>('sport');
  const [activeCat, setActiveCat] = useState<string>(initialQuery?.sportId || 'football');

  const [sidebarPinned, setSidebarPinned] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);

  // New state for live odds
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [loadingOdds, setLoadingOdds] = useState<boolean>(false);

  const [oddsError, setOddsError] = useState<string | null>(null);
  const [buyCoinsOpen, setBuyCoinsOpen] = useState(false);

  // Fetch live odds when sport category changes
  useEffect(() => {
    const fetchOdds = async () => {
      setLoadingOdds(true);
      setOddsError(null);

      try {
        // Assuming SPORT_MAPPINGS is defined elsewhere or will be added
        const SPORT_MAPPINGS: { [key: string]: string } = {
          'football': 'soccer_epl',
          // Add other mappings as needed
        };
        const sportKey = SPORT_MAPPINGS[activeCat] || 'soccer_epl';
        const response = await fetch(`/api/odds?sport=${sportKey}&markets=h2h`);

        if (!response.ok) {
          throw new Error('Failed to fetch odds');
        }

        const result = await response.json();

        if (result.success && result.data) {
          setUpcomingMatches(result.data);
        } else {
          // Fallback to mock data if API fails
          setUpcomingMatches([
            {
              id: 1,
              sport: 'Soccer',
              league: 'Premier League',
              teamA: 'Man City',
              teamB: 'Tottenham',
              time: 'Today, 22:00',
              odds: { '1': 1.50, 'X': 3.80, '2': 5.20 }
            },
            {
              id: 2,
              sport: 'Soccer',
              league: 'Premier League',
              teamA: 'Newcastle',
              teamB: 'Everton',
              time: 'Today, 22:00',
              odds: { '1': 2.10, 'X': 3.20, '2': 3.50 }
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching odds:', error);
        setOddsError('Failed to load live odds');
        // Use fallback data
        setUpcomingMatches([
          {
            id: 1,
            sport: 'Soccer',
            league: 'Premier League',
            teamA: 'Man City',
            teamB: 'Tottenham',
            time: 'Today, 22:00',
            odds: { '1': 1.50, 'X': 3.80, '2': 5.20 }
          },
        ]);
      } finally {
        setLoadingOdds(false);
      }
    };

    fetchOdds();

    // Refresh odds every 60 seconds
    const interval = setInterval(fetchOdds, 60000);
    return () => clearInterval(interval);
  }, [activeCat]);

  // listen for header "Menu" button to open mobile sidebar
  useEffect(() => {
    const handler = () => setMobileSidebarOpen(true);
    // custom event from HeaderNavigation > MobileMenuButton
    window.addEventListener('open-mobile-sidebar' as any, handler as EventListener);
    return () => {
      window.removeEventListener('open-mobile-sidebar' as any, handler as EventListener);
    };
  }, []);

  // Sync active category from URL (searchParams) when it changes
  useEffect(() => {
    if (initialQuery?.sportId) {
      setActiveCat(initialQuery.sportId);
    }
  }, [initialQuery?.sportId]);

  // Load/save pinned state
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('sidebar_pinned_v1') : null;
      if (saved) setSidebarPinned(saved === '1');
    } catch { }
  }, []);
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') localStorage.setItem('sidebar_pinned_v1', sidebarPinned ? '1' : '0');
    } catch { }
  }, [sidebarPinned]);

  // Phase 2: Persist betslip to localStorage using effects
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('betslip_v1') : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Bet[];
        if (Array.isArray(parsed)) {
          setBets(parsed.map(b => ({ ...b, stake: typeof b.stake === 'number' ? b.stake : 0 })));
        }
      }
    } catch { }

  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('betslip_v1', JSON.stringify(bets));
      }
    } catch { }
  }, [bets]);

  const handleBetSelect = (newBet: Bet) => {
    setBets(prev => {
      const existingBetIndex = prev.findIndex(b => b.match === newBet.match && b.market === newBet.market);
      const next = existingBetIndex !== -1 ? prev.filter((_, i) => i !== existingBetIndex) : [...prev, { ...newBet, stake: 0 }];
      try { if (typeof window !== 'undefined') localStorage.setItem('betslip_v1', JSON.stringify(next)); } catch { }
      return next;
    });
  };

  const handleUpdateStake = (index: number, stake: number) => {
    setBets(prev => {
      const newBets = [...prev];
      newBets[index].stake = isNaN(stake) ? 0 : stake;
      try { if (typeof window !== 'undefined') localStorage.setItem('betslip_v1', JSON.stringify(newBets)); } catch { }
      return newBets;
    });
  };

  const handleRemoveBet = (index: number) => {
    setBets(prev => {
      const next = prev.filter((_, i) => i !== index);
      try { if (typeof window !== 'undefined') localStorage.setItem('betslip_v1', JSON.stringify(next)); } catch { }
      return next;
    });
  };

  const handleClearAllBets = () => {
    setBets([]);
    try { if (typeof window !== 'undefined') localStorage.removeItem('betslip_v1'); } catch { }
  };

  // add: touch handlers for mobile swipe-to-open
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchDeltaX(currentX - touchStartX);
  };
  const onTouchEnd = () => {
    if (touchStartX === null) return;
    // open if swiped right more than 40px starting from left edge
    if (touchDeltaX > 40) setMobileSidebarOpen(true);
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Mobile swipe edge catcher (left 12px) */}
        <div
          className="fixed inset-y-0 left-0 w-3 z-40 lg:hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
        {/* Desktop sidebar */}
        {showSportsContent && (
          <SportsSidebar pinned={sidebarPinned} onTogglePin={() => setSidebarPinned(p => !p)} />
        )}
        {/* Mobile sheet sidebar */}
        {showSportsContent && (
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent side="left" className="p-0 w-72 sm:w-80 bg-card border-border">
              <SportsSidebar pinned={true} onTogglePin={() => setSidebarPinned(p => !p)} mobile />
            </SheetContent>
          </Sheet>
        )}
        <main className="flex-grow p-3 md:p-6 overflow-y-auto">
          <Slideshow />
          <PromotionalCards onDeposit={() => setBuyCoinsOpen(true)} />
          <VIPBanner />
          <MessageNotification />
          <GamesNavigation />
          {showSportsContent && (
            <>
              <CategoryBar active={activeCat} onChange={setActiveCat} />
              <LiveEvents />
            </>
          )}
          {children}
        </main>
        <BetSlip
          bets={bets}
          updateStake={handleUpdateStake}
          removeBet={handleRemoveBet}
          clearBets={handleClearAllBets}
        />
        <BuyCoinsDialog open={buyCoinsOpen} onOpenChange={setBuyCoinsOpen} />
      </div>
    </TooltipProvider>
  );
}