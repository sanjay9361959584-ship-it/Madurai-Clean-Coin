import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const areaNames = ["Madurai Central", "Anna Nagar", "Simmakkal"];
        let areas = [];

        for (const name of areaNames) {
            let area = await prisma.area.findUnique({ where: { name } });
            if (!area) {
                area = await prisma.area.create({
                    data: { name, cleanlinessScore: Math.random() * 5 }
                });
            }
            areas.push(area);
        }

        return NextResponse.json({ areas, message: "Database seeded successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Seed failed" }, { status: 500 });
    }
}
