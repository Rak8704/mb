"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const WIDGET_KEY = process.env.NEXT_PUBLIC_ODDS_WIDGET_KEY || 'wk_1d6cbbf74887041be4402040f8690b7d';

type Sport = {
    key: string;
    title: string;
    icon: string;
};

const SPORTS: Sport[] = [
    { key: 'soccer_epl', title: 'Premier League', icon: '⚽' },
    { key: 'basketball_nba', title: 'NBA', icon: '🏀' },
    { key: 'americanfootball_nfl', title: 'NFL', icon: '🏈' },
    { key: 'icehockey_nhl', title: 'NHL', icon: '🏒' },
    { key: 'baseball_mlb', title: 'MLB', icon: '⚾' },
    { key: 'cricket_test_match', title: 'Cricket', icon: '🏏' },
    { key: 'tennis_atp', title: 'Tennis ATP', icon: '🎾' },
];

export default function OddsWidget() {
    const [selectedSport, setSelectedSport] = useState<string>('soccer_epl');

    const getWidgetUrl = (sportKey: string) => {
        const baseUrl = 'https://widget.the-odds-api.com/v1/sports';
        const params = new URLSearchParams({
            accessKey: WIDGET_KEY,
            oddsFormat: 'decimal',
            markets: 'h2h',
            marketNames: 'h2h:Match Winner',
        });

        return `${baseUrl}/${sportKey}/events/?${params.toString()}`;
    };

    return (
        <Card className="w-full bg-card border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span className="text-primary">📊</span>
                    Live Odds Widget
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={selectedSport} onValueChange={setSelectedSport} className="w-full">
                    <TabsList className="grid grid-cols-3 lg:grid-cols-7 gap-1 mb-4 bg-accent">
                        {SPORTS.map((sport) => (
                            <TabsTrigger
                                key={sport.key}
                                value={sport.key}
                                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                <span className="mr-1">{sport.icon}</span>
                                <span className="hidden sm:inline">{sport.title}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {SPORTS.map((sport) => (
                        <TabsContent key={sport.key} value={sport.key} className="mt-0">
                            <div className="relative w-full" style={{ height: '600px' }}>
                                <iframe
                                    title={`${sport.title} Odds Widget`}
                                    className="w-full h-full rounded-lg border border-border"
                                    src={getWidgetUrl(sport.key)}
                                    style={{
                                        border: '1px solid var(--border)',
                                        borderRadius: '0.5rem',
                                    }}
                                    loading="lazy"
                                />
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>

                <div className="mt-4 p-3 bg-accent/50 rounded-md text-xs text-muted-foreground">
                    <p>
                        <strong>Live Odds:</strong> Powered by The Odds API. Odds update in real-time from multiple bookmakers.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
