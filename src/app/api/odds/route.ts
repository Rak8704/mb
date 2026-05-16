import { NextRequest, NextResponse } from "next/server";

const ODDS_API_KEY = process.env.ODDS_API_KEY;
const BASE_URL = "https://api.the-odds-api.com/v4";

// Mock data that matches The Odds API structure
const MOCK_ODDS_DATA = [
    {
        id: "mock_1",
        sport_key: "soccer_epl",
        sport_title: "EPL",
        commence_time: new Date(Date.now() + 3600000).toISOString(),
        home_team: "Manchester City",
        away_team: "Liverpool",
        bookmakers: [
            {
                key: "draftkings",
                title: "DraftKings",
                last_update: new Date().toISOString(),
                markets: [
                    {
                        key: "h2h",
                        outcomes: [
                            { name: "Manchester City", price: 2.10 },
                            { name: "Draw", price: 3.40 },
                            { name: "Liverpool", price: 3.50 }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "mock_2",
        sport_key: "soccer_epl",
        sport_title: "EPL",
        commence_time: new Date(Date.now() + 7200000).toISOString(),
        home_team: "Arsenal",
        away_team: "Chelsea",
        bookmakers: [
            {
                key: "fanduel",
                title: "FanDuel",
                last_update: new Date().toISOString(),
                markets: [
                    {
                        key: "h2h",
                        outcomes: [
                            { name: "Arsenal", price: 1.85 },
                            { name: "Draw", price: 3.60 },
                            { name: "Chelsea", price: 4.20 }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "mock_3",
        sport_key: "soccer_epl",
        sport_title: "EPL",
        commence_time: new Date(Date.now() + 10800000).toISOString(),
        home_team: "Tottenham",
        away_team: "Manchester United",
        bookmakers: [
            {
                key: "betmgm",
                title: "BetMGM",
                last_update: new Date().toISOString(),
                markets: [
                    {
                        key: "h2h",
                        outcomes: [
                            { name: "Tottenham", price: 2.30 },
                            { name: "Draw", price: 3.30 },
                            { name: "Manchester United", price: 3.10 }
                        ]
                    }
                ]
            }
        ]
    }
];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sport = searchParams.get("sport") || "soccer_epl";
    const region = searchParams.get("region") || "uk";
    const markets = searchParams.get("markets") || "h2h";

    if (!ODDS_API_KEY) {
        console.warn("⚠️ Odds API key not configured - using mock data");
        return NextResponse.json({
            success: true,
            data: transformMockData(MOCK_ODDS_DATA, markets),
            count: MOCK_ODDS_DATA.length,
            remainingRequests: "N/A (Mock Data)",
            usedRequests: "N/A (Mock Data)",
            isMockData: true
        });
    }

    try {
        const oddsUrl = `${BASE_URL}/sports/${sport}/odds/?apiKey=${ODDS_API_KEY}&regions=${region}&markets=${markets}&oddsFormat=decimal`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(oddsUrl, {
            next: { revalidate: 60 },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Odds API Error:", errorText);

            // If quota exceeded or any error, use mock data
            console.warn("⚠️ Odds API error - falling back to mock data");
            return NextResponse.json({
                success: true,
                data: transformMockData(MOCK_ODDS_DATA, markets),
                count: MOCK_ODDS_DATA.length,
                remainingRequests: "N/A (Mock Data)",
                usedRequests: "N/A (Mock Data)",
                isMockData: true,
                apiError: errorText
            });
        }

        const data = await response.json();

        const transformedData = data.map((event: any) => ({
            id: event.id,
            sport: event.sport_key,
            league: event.sport_title,
            teamA: event.home_team,
            teamB: event.away_team,
            time: new Date(event.commence_time).toLocaleString(),
            commenceTime: event.commence_time,
            bookmakers: event.bookmakers,
            odds: extractOdds(event.bookmakers, markets),
        }));

        return NextResponse.json({
            success: true,
            data: transformedData,
            count: transformedData.length,
            remainingRequests: response.headers.get("x-requests-remaining"),
            usedRequests: response.headers.get("x-requests-used"),
            isMockData: false
        });
    } catch (error) {
        console.error("Error fetching odds:", error);
        console.warn("⚠️ Falling back to mock data due to error");

        return NextResponse.json({
            success: true,
            data: transformMockData(MOCK_ODDS_DATA, markets),
            count: MOCK_ODDS_DATA.length,
            remainingRequests: "N/A (Mock Data)",
            usedRequests: "N/A (Mock Data)",
            isMockData: true
        });
    }
}

// Transform mock data to match our interface
function transformMockData(mockData: any[], markets: string) {
    return mockData.map((event: any) => ({
        id: event.id,
        sport: event.sport_key,
        league: event.sport_title,
        teamA: event.home_team,
        teamB: event.away_team,
        time: new Date(event.commence_time).toLocaleString(),
        commenceTime: event.commence_time,
        bookmakers: event.bookmakers,
        odds: extractOdds(event.bookmakers, markets),
    }));
}

// Helper function to extract odds from bookmakers
function extractOdds(bookmakers: any[], market: string) {
    if (!bookmakers || bookmakers.length === 0) {
        return { "1": 0, X: 0, "2": 0 };
    }

    const bookmaker = bookmakers[0];
    const marketData = bookmaker.markets?.find((m: any) => m.key === market);

    if (!marketData || !marketData.outcomes) {
        return { "1": 0, X: 0, "2": 0 };
    }

    const outcomes = marketData.outcomes;

    if (market === "h2h") {
        // Find home, away, and draw outcomes
        const homeOutcome = outcomes.find((o: any) =>
            o.name === bookmaker.home_team || outcomes.indexOf(o) === 0
        );
        const drawOutcome = outcomes.find((o: any) =>
            o.name === "Draw" || o.name.toLowerCase().includes("draw")
        );
        const awayOutcome = outcomes.find((o: any) =>
            o.name === bookmaker.away_team || outcomes.indexOf(o) === outcomes.length - 1
        );

        return {
            "1": homeOutcome?.price || 0,
            X: drawOutcome?.price || 0,
            "2": awayOutcome?.price || 0,
        };
    }

    return { "1": 0, X: 0, "2": 0 };
}
