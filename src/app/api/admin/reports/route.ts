import { NextResponse } from "next/server";
import { getAllReports, updateReportStatus } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const role = cookieStore.get("user_role")?.value;
        if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const reports = getAllReports();
        return NextResponse.json({ reports });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const cookieStore = await cookies();
        const role = cookieStore.get("user_role")?.value;
        if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { reportId, status } = await req.json();
        const report = updateReportStatus(reportId, status);

        if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
        return NextResponse.json({ report });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
    }
}
