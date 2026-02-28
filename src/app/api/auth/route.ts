import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password, name, isLogin } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        let user;

        if (isLogin) {
            user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
            }
        } else {
            // Registration
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
                return NextResponse.json({ error: "User already exists" }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || email.split("@")[0],
                    password: hashedPassword,
                    role: email.includes("admin") ? "ADMIN" : "CITIZEN",
                },
            });
        }

        const cookieStore = await cookies();
        cookieStore.set("user_id", user.id, { path: "/", httpOnly: true });
        cookieStore.set("user_role", user.role, { path: "/" });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Auth Error", error);
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("user_id")?.value;

        if (!userId) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, role: true, points: true, streak: true } });
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete("user_id");
    cookieStore.delete("user_role");
    return NextResponse.json({ success: true });
}
