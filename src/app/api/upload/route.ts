import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
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

        // Save actual file to public/uploads
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure dir exists
        const uploadDir = join(process.cwd(), "public/uploads");
        try { await mkdir(uploadDir, { recursive: true }); } catch (e) { }

        const filename = `${uuidv4()}-${file.name.replace(/\s/g, "_")}`;
        const filePath = join(uploadDir, filename);
        await writeFile(filePath, buffer);
        const publicUrl = `/uploads/${filename}`;

        // Validate using pseudo-AI simulation, but on real file
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay
        const isValid = Math.random() > 0.15; // 85% success rate for demo purposes
        const aiConfidence = isValid ? Number((75 + Math.random() * 24).toFixed(2)) : Number((Math.random() * 40).toFixed(2));
        const segregation = isValid ? (Math.random() > 0.5 ? "WET" : "DRY") : "UNKNOWN";

        const report = await prisma.report.create({
            data: {
                userId,
                imageUrl: publicUrl,
                location,
                aiConfidence,
                segregation,
                status: isValid ? "PENDING" : "REJECTED",
            },
        });

        return NextResponse.json({
            report,
            valid: isValid,
            confidence: aiConfidence,
            segregation,
            reason: isValid ? "Image validated successfully." : "Image unclear or no waste detected.",
            publicUrl
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Failed to process upload" }, { status: 500 });
    }
}
