import { NextRequest, NextResponse } from "next/server";

const ODDS_API_KEY = process.env.ODDS_API_KEY;
const BASE_URL = "https://api.the-odds-api.com/v4";

export async function GET(req: NextRequest) {
    if (!ODDS_API_KEY) {
        return NextResponse.json(
            { error: "Odds API key not configured" },
            { status: 500 }
        );
    }

    try {
        // Fetch all available sports
        const sportsUrl = `${BASE_URL}/sports/?apiKey=${ODDS_API_KEY}`;

        const response = await fetch(sportsUrl, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Odds API Error:", errorText);
            return NextResponse.json(
                { error: "Failed to fetch sports data", details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Filter for active sports only
        const activeSports = data.filter((sport: any) => sport.active);

        return NextResponse.json({
            success: true,
            data: activeSports,
            count: activeSports.length,
        });
    } catch (error) {
        console.error("Error fetching sports:", error);
        return NextResponse.json(
            { error: "Internal server error", details: String(error) },
            { status: 500 }
        );
    }
}
