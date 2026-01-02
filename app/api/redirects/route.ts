import { NextRequest, NextResponse } from "next/server";
import type { RedirectEntry } from "@/layout/types";
import axios, { AxiosError } from "axios";
import { getValidAccessToken } from "@/server-utils/TokenManager";
import validateUser from "@/server-utils/UserValidation";

interface RedirectCheckResponse {
  exists: boolean;
}

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
    const access_token = await getValidAccessToken()

    if (!access_token) throw Error("Access Denied! Try again later.")

    const { isValid, user, group } = await validateUser(access_token)

    if (!isValid || !user) throw Error("Access Denied! Not a valid user.")

    const redirectEntry: RedirectEntry = {
      target,
      slug,
      title,
      notes,
      group: group,
      createdBy: user?.full_name,
    };

    /**
     * 🔁 Forward request to your backend service
     */
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_REDIRECT_SERVICE_URL}/admin/redirects`,
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

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json(
      { error: "Slug is required" },
      { status: 400 }
    );
  }

  try {
    const access_token = await getValidAccessToken()

    if (!access_token) throw Error("Access Denied! Try again later.")

    const { group } = await validateUser(access_token)

    const response = await axios.get<RedirectCheckResponse>(
      `${process.env.NEXT_PUBLIC_REDIRECT_SERVICE_URL}/admin/redirects/check`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Api-Key": process.env.REDIRECT_SERVICE_AUTH_TOKEN ?? "1234",
        },
        params: {
          group: group,
          slug: slug
        }
      }
    );

    return NextResponse.json(response.data, {status: 200})
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof AxiosError ? err.response?.data?.error || err.message : String(err) },
      { status: 500 }
    );
  } 
}
