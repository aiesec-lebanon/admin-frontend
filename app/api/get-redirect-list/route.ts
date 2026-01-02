import { NextRequest, NextResponse } from "next/server";
import type { PaginatedRedirectResponse } from "@/layout/types";
import axios, { AxiosError } from "axios";
import { getValidAccessToken } from "@/server-utils/TokenManager";
import validateUser from "@/server-utils/UserValidation";

export async function GET(req: NextRequest) {
    const page = parseInt(req.nextUrl.searchParams.get('page') || "1");
    const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize') || "20");
    const mine = req.nextUrl.searchParams.get('mine') ? true : false;

    const client = axios.create({
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Api-Key": process.env.REDIRECT_SERVICE_AUTH_TOKEN ?? "1234",
        },
        params: {
            page: page,
            pageSize: pageSize
        }
    })

    try {
        const access_token = await getValidAccessToken()        
        if (!access_token) throw Error("Access Denied! Try again later.");
    
        const { isValid, user } = await validateUser(access_token);
        if (!isValid || !user) throw Error("Access Denied! Invalid user.");

        let response
        if (mine) {
            response = await client.get<PaginatedRedirectResponse>(
                `${process.env.NEXT_PUBLIC_REDIRECT_SERVICE_URL}/admin/redirects/by-user`,
                {
                    params: { user: user.full_name }
                }
            )
        } else {
            response = await client.get<PaginatedRedirectResponse>(`${process.env.NEXT_PUBLIC_REDIRECT_SERVICE_URL}/admin/redirects`)
        }

        return NextResponse.json(response.data, {status: 200})
    } catch (err: any) {
        return NextResponse.json(
            { error: "Internal server error", details: err instanceof AxiosError ? err.response?.data?.error || err.message : String(err) },
            { status: 500 }
        );
    } 
}