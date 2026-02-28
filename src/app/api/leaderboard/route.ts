import { NextResponse } from "next/server";
import { getTopCitizens, getAllAreas } from "@/lib/db";

export async function GET() {
    try {
        const users = getTopCitizens(20).map((u) => ({
            id: u.id,
            name: u.name,
            points: u.points,
            streak: u.streak,
        }));
        const areas = getAllAreas();
        return NextResponse.json({ users, areas });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
