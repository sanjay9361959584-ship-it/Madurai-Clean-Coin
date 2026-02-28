import { NextResponse } from "next/server";
import { getReportsByUser, createReport } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("user_id")?.value;
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const reports = getReportsByUser(userId);
        return NextResponse.json({ reports });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("user_id")?.value;
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { imageUrl, location, aiConfidence, segregation, areaId } = await req.json();

        const report = createReport({
            userId,
            imageUrl,
            location,
            aiConfidence,
            segregation,
            areaId,
            status: "PENDING",
        });

        return NextResponse.json({ report });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
    }
}
