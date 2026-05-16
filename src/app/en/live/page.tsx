import { HeaderNavigation } from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Trophy, Star, ChevronRight } from "lucide-react";

// Mock Data
const todayMatches = [
  { id: 1, league: "Premier League", teamA: "Man United", teamB: "Chelsea", time: "19:45", odds: { home: 2.10, draw: 3.40, away: 3.20 } },
  { id: 2, league: "La Liga", teamA: "Real Madrid", teamB: "Barcelona", time: "21:00", odds: { home: 1.95, draw: 3.60, away: 3.50 } },
  { id: 3, league: "Serie A", teamA: "Juventus", teamB: "AC Milan", time: "20:30", odds: { home: 2.25, draw: 3.10, away: 3.00 } },
];

const tomorrowMatches = [
  { id: 4, league: "Champions League", teamA: "Bayern Munich", teamB: "PSG", time: "20:00", odds: { home: 1.85, draw: 3.80, away: 3.90 } },
  { id: 5, league: "Champions League", teamA: "Man City", teamB: "Inter Milan", time: "20:00", odds: { home: 1.60, draw: 4.00, away: 5.50 } },
];

const upcomingHighlights = [
  { id: 6, league: "World Cup Qualifiers", teamA: "Brazil", teamB: "Argentina", date: "Oct 15", time: "01:00", odds: { home: 2.40, draw: 3.00, away: 2.90 } },
  { id: 7, league: "Euro Qualifiers", teamA: "England", teamB: "Italy", date: "Oct 16", time: "19:45", odds: { home: 2.00, draw: 3.20, away: 3.60 } },
];

const upcomingSoccer = [
  { id: 8, league: "Ligue 1", teamA: "Lyon", teamB: "Marseille", date: "Oct 14", time: "20:00", odds: { home: 2.50, draw: 3.30, away: 2.70 } },
  { id: 9, league: "Bundesliga", teamA: "Dortmund", teamB: "Leipzig", date: "Oct 14", time: "15:30", odds: { home: 2.15, draw: 3.50, away: 3.10 } },
  { id: 10, league: "Eredivisie", teamA: "Ajax", teamB: "Feyenoord", date: "Oct 15", time: "14:30", odds: { home: 1.90, draw: 3.70, away: 3.40 } },
];

const MatchCard = ({ match, showDate = false }: { match: any, showDate?: boolean }) => (
  <Card className="mb-3 hover:bg-muted/50 transition-colors border-border/50">
    <CardContent className="p-4 flex items-center justify-between">
      <div className="flex flex-col gap-1 min-w-[120px]">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Trophy size={12} className="text-yellow-500" />
          <span>{match.league}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Clock size={14} className="text-primary" />
          <span>{showDate && match.date ? `${match.date} • ` : ''}{match.time}</span>
        </div>
      </div>

      <div className="flex-1 px-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">{match.teamA}</span>
            <span className="text-xs text-muted-foreground">vs</span>
            <span className="font-medium text-right">{match.teamB}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="w-16 flex flex-col h-auto py-1 gap-0.5 border-primary/20 hover:bg-primary/10 hover:text-primary">
          <span className="text-[10px] text-muted-foreground">1</span>
          <span className="font-bold">{match.odds.home.toFixed(2)}</span>
        </Button>
        <Button variant="outline" size="sm" className="w-16 flex flex-col h-auto py-1 gap-0.5 border-primary/20 hover:bg-primary/10 hover:text-primary">
          <span className="text-[10px] text-muted-foreground">X</span>
          <span className="font-bold">{match.odds.draw.toFixed(2)}</span>
        </Button>
        <Button variant="outline" size="sm" className="w-16 flex flex-col h-auto py-1 gap-0.5 border-primary/20 hover:bg-primary/10 hover:text-primary">
          <span className="text-[10px] text-muted-foreground">2</span>
          <span className="font-bold">{match.odds.away.toFixed(2)}</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function LivePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <main className="container py-6 space-y-8">

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              Live & Upcoming
            </h1>
            <p className="text-muted-foreground mt-1">Real-time odds and upcoming fixtures</p>
          </div>
          <Button variant="secondary" className="gap-2">
            <Calendar size={16} />
            Schedule
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="soccer">Soccer</TabsTrigger>
          </TabsList>

          {/* Today's Matches */}
          <TabsContent value="today" className="mt-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="text-green-500" size={20} />
                Today's Matches
              </h2>
              <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10">
                {todayMatches.length} Events
              </Badge>
            </div>
            {todayMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </TabsContent>

          {/* Tomorrow's Matches */}
          <TabsContent value="tomorrow" className="mt-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="text-blue-500" size={20} />
                Tomorrow's Matches
              </h2>
              <Badge variant="outline" className="text-blue-500 border-blue-500/20 bg-blue-500/10">
                {tomorrowMatches.length} Events
              </Badge>
            </div>
            {tomorrowMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </TabsContent>

          {/* Upcoming Highlights */}
          <TabsContent value="upcoming" className="mt-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Star className="text-yellow-500" size={20} />
                Upcoming Highlights
              </h2>
              <Button variant="ghost" size="sm" className="text-xs">View All <ChevronRight size={14} /></Button>
            </div>
            {upcomingHighlights.map(match => (
              <MatchCard key={match.id} match={match} showDate={true} />
            ))}
          </TabsContent>

          {/* Upcoming Soccer */}
          <TabsContent value="soccer" className="mt-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Trophy className="text-purple-500" size={20} />
                Upcoming Soccer
              </h2>
              <Badge variant="secondary">Top Leagues</Badge>
            </div>
            {upcomingSoccer.map(match => (
              <MatchCard key={match.id} match={match} showDate={true} />
            ))}
          </TabsContent>
        </Tabs>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="bg-gradient-to-br from-blue-900/20 to-transparent border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-blue-400">Live Streaming</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Watch selected matches live directly on our platform. Look for the play icon.</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-900/20 to-transparent border-green-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">In-Play Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Get real-time statistics, possession data, and shot maps for informed betting.</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/20 to-transparent border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-purple-400">Cash Out</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Secure your winnings or minimize losses with our Cash Out feature on live bets.</p>
            </CardContent>
          </Card>
        </div>

      </main>
      <Footer />
    </div>
  );
}