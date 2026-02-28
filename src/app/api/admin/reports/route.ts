import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const role = cookieStore.get("user_role")?.value;

        if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const reports = await prisma.report.findMany({
            include: { user: { select: { name: true, email: true } }, area: true },
            orderBy: { createdAt: "desc" },
        });

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

        const { reportId, status } = await req.json(); // status: APPROVED | REJECTED

        const report = await prisma.report.update({
            where: { id: reportId },
            data: { status },
        });

        // If approved, reward citizen points
        if (status === "APPROVED") {
            await prisma.user.update({
                where: { id: report.userId },
                data: { points: { increment: 50 } }, // Reward 50 pts
            });
        }

        return NextResponse.json({ report });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
    }
}
