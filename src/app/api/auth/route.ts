import { NextResponse } from "next/server";
import { createUser, findUserByEmail, findUserById, verifyPassword } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { email, password, name, isLogin } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        if (isLogin) {
            const user = findUserByEmail(email);
            if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

            const isMatch = await verifyPassword(user, password);
            if (!isMatch) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

            const cookieStore = await cookies();
            cookieStore.set("user_id", user.id, { path: "/", httpOnly: true });
            cookieStore.set("user_role", user.role, { path: "/" });

            const { password: _, ...safeUser } = user;
            return NextResponse.json({ user: safeUser });
        } else {
            try {
                const role = email.includes("admin") ? "ADMIN" as const : "CITIZEN" as const;
                const user = await createUser(email, password, name || email.split("@")[0], role);

                const cookieStore = await cookies();
                cookieStore.set("user_id", user.id, { path: "/", httpOnly: true });
                cookieStore.set("user_role", user.role, { path: "/" });

                const { password: _, ...safeUser } = user;
                return NextResponse.json({ user: safeUser });
            } catch (e: any) {
                return NextResponse.json({ error: e.message || "Registration failed" }, { status: 400 });
            }
        }
    } catch (error) {
        console.error("Auth Error", error);
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("user_id")?.value;
        if (!userId) return NextResponse.json({ user: null }, { status: 401 });

        const user = findUserById(userId);
        if (!user) return NextResponse.json({ user: null }, { status: 401 });

        const { password: _, ...safeUser } = user;
        return NextResponse.json({ user: safeUser });
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
