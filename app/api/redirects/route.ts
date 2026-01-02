import { NextRequest, NextResponse } from "next/server";
import type { RedirectEntry } from "@/layout/types";
import axios, { AxiosError } from "axios";

/* Create new redirect */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { target, slug, title, notes } = body;

    if (!target || !slug) {
      return NextResponse.json(
        { error: "target and slug are required" },
        { status: 400 }
      );
    }

    /**
     * 🔐 AUTH CONTEXT (example)
     * Replace this with your real auth logic
     */
    const user = {
      id: "Tharindu Wijekoon",
      group: "r",
    };

    const redirectEntry: RedirectEntry = {
      target,
      slug,
      title,
      notes,
      group: user.group,
      createdBy: user.id,
    };

    /**
     * 🔁 Forward request to your backend service
     */
    const response = await axios.post(
      `${process.env.REDIRECT_SERVICE_URL}/admin/redirects`,
      redirectEntry,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Api-Key": process.env.REDIRECT_SERVICE_AUTH_TOKEN ?? "1234",
        },
      }
    );

    const data = response.data;
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof AxiosError ? err.response?.data?.error || err.message : String(err) },
      { status: 500 }
    );
  }
}
