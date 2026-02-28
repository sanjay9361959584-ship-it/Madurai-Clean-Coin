// In-memory data store for Vercel deployment
// Data persists as long as the serverless function is warm
// For a hackathon demo, this is perfectly sufficient

import bcrypt from "bcryptjs";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "CITIZEN" | "ADMIN";
    points: number;
    streak: number;
    createdAt: Date;
}

export interface Report {
    id: string;
    userId: string;
    imageUrl: string;
    location: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    aiConfidence: number | null;
    segregation: string | null;
    areaId: string | null;
    createdAt: Date;
}

export interface Area {
    id: string;
    name: string;
    cleanlinessScore: number;
}

// --- In-Memory Storage ---
const users: Map<string, User> = new Map();
const reports: Map<string, Report> = new Map();
const areas: Map<string, Area> = new Map();

function uuid(): string {
    return crypto.randomUUID();
}

// --- User Operations ---
export async function createUser(email: string, password: string, name: string, role: "CITIZEN" | "ADMIN" = "CITIZEN"): Promise<User> {
    const existing = findUserByEmail(email);
    if (existing) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
        id: uuid(),
        name,
        email,
        password: hashedPassword,
        role,
        points: 0,
        streak: 0,
        createdAt: new Date(),
    };
    users.set(user.id, user);
    return user;
}

export function findUserByEmail(email: string): User | undefined {
    return Array.from(users.values()).find((u) => u.email === email);
}

export function findUserById(id: string): User | undefined {
    return users.get(id);
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
}

export function addPoints(userId: string, points: number): void {
    const user = users.get(userId);
    if (user) user.points += points;
}

export function getTopCitizens(limit = 20): User[] {
    return Array.from(users.values())
        .filter((u) => u.role === "CITIZEN")
        .sort((a, b) => b.points - a.points)
        .slice(0, limit);
}

// --- Report Operations ---
export function createReport(data: Omit<Report, "id" | "createdAt">): Report {
    const report: Report = { ...data, id: uuid(), createdAt: new Date() };
    reports.set(report.id, report);
    return report;
}

export function getReportsByUser(userId: string): Report[] {
    return Array.from(reports.values())
        .filter((r) => r.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getAllReports(): (Report & { user: { name: string; email: string } })[] {
    return Array.from(reports.values())
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((r) => {
            const user = users.get(r.userId);
            return { ...r, user: { name: user?.name || "Unknown", email: user?.email || "" } };
        });
}

export function updateReportStatus(reportId: string, status: "APPROVED" | "REJECTED"): Report | null {
    const report = reports.get(reportId);
    if (!report) return null;
    report.status = status;
    if (status === "APPROVED") addPoints(report.userId, 50);
    return report;
}

// --- Area Operations ---
export function seedAreas(): Area[] {
    const defaults = [
        { name: "Madurai Central", score: 3.2 },
        { name: "Anna Nagar", score: 4.1 },
        { name: "Simmakkal", score: 2.5 },
        { name: "K.K. Nagar", score: 1.8 },
        { name: "Teppakulam", score: 3.7 },
    ];
    for (const d of defaults) {
        const existing = Array.from(areas.values()).find((a) => a.name === d.name);
        if (!existing) {
            const area: Area = { id: uuid(), name: d.name, cleanlinessScore: d.score };
            areas.set(area.id, area);
        }
    }
    return Array.from(areas.values());
}

export function getAllAreas(): Area[] {
    return Array.from(areas.values()).sort((a, b) => b.cleanlinessScore - a.cleanlinessScore);
}

// Seed areas on module load
seedAreas();
