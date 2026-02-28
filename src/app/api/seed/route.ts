import { NextResponse } from "next/server";
import { seedAreas } from "@/lib/db";

export async function GET() {
    try {
        const areas = seedAreas();
        return NextResponse.json({ areas, message: "Database seeded successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Seed failed" }, { status: 500 });
    }
}
