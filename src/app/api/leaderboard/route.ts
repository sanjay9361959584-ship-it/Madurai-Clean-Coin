import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: { role: "CITIZEN" },
            orderBy: { points: "desc" },
            take: 20,
            select: { id: true, name: true, points: true, streak: true }
        });

        const areas = await prisma.area.findMany({
            orderBy: { cleanlinessScore: "desc" }
        });

        return NextResponse.json({ users, areas });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
