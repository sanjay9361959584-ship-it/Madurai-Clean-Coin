import { NextResponse } from "next/server";
import { createReport } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("user_id")?.value;
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const location = formData.get("location") as string;

        if (!file || !location) {
            return NextResponse.json({ error: "File and location are required." }, { status: 400 });
        }

        // Convert image to base64 data URL for Vercel (no filesystem)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        const mimeType = file.type || "image/jpeg";
        const dataUrl = `data:${mimeType};base64,${base64}`;

        // AI simulation
        await new Promise((resolve) => setTimeout(resolve, 800));
        const isValid = Math.random() > 0.15;
        const aiConfidence = isValid ? Number((75 + Math.random() * 24).toFixed(2)) : Number((Math.random() * 40).toFixed(2));
        const segregation = isValid ? (Math.random() > 0.5 ? "WET" : "DRY") : "UNKNOWN";

        const report = createReport({
            userId,
            imageUrl: dataUrl,
            location,
            aiConfidence,
            segregation,
            areaId: null,
            status: isValid ? "PENDING" : "REJECTED",
        });

        return NextResponse.json({
            report,
            valid: isValid,
            confidence: aiConfidence,
            segregation,
            reason: isValid ? "Image validated successfully." : "Image unclear or no waste detected.",
            publicUrl: dataUrl,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Failed to process upload" }, { status: 500 });
    }
}
