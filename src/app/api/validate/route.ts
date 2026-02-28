import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { imageUrl } = await req.json();

        // Simulate AI processing time
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const randVal = Math.random();

        // 20% chance of rejection (invalid image like blurry or no garbage found)
        if (randVal < 0.2) {
            return NextResponse.json({
                valid: false,
                confidence: Number((Math.random() * 40).toFixed(2)),
                segregation: "UNKNOWN",
                reason: "Image unclear or no waste detected."
            });
        }

        // Segregation simulation
        const isWet = Math.random() > 0.5;

        return NextResponse.json({
            valid: true,
            confidence: Number((75 + Math.random() * 24).toFixed(2)), // 75.00 to 99.00
            segregation: isWet ? "WET" : "DRY",
            reason: "Image validated successfully."
        });

    } catch (error) {
        return NextResponse.json({ error: "AI Processing Error" }, { status: 500 });
    }
}
