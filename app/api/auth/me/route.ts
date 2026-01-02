import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies()
    const user = cookieStore.get("user")?.value;
    if (!user) return NextResponse.json(null, { status: 401 });

    return NextResponse.json(JSON.parse(user));
}
