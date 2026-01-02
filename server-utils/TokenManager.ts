'use server'

import axios from "axios";
import { cookies } from "next/headers";
import { TokenResponse } from '@/layout/types';
import validateUser from "./UserValidation";

export async function getValidAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("aiesec_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const expiresAt = Number(cookieStore.get("token_expires_at")?.value);

  const now = Math.floor(Date.now() / 1000);

  // ✅ Token still valid
  if (accessToken && expiresAt && now < expiresAt - 30) {
    return accessToken;
  }

  // ❌ Cannot refresh
  if (!refreshToken) {
    return null;
  }

  // 🔄 Refresh token
  const res = await axios.post<TokenResponse>(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/token`,
    {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const data = res.data;
  const newExpiresAt = data.created_at + data.expires_in;

  const {isValid, user} = await validateUser(data.access_token)
  if (!isValid) {
    return null;
  }

  // 🆕 Update cookies
  cookieStore.set("aiesec_token", data.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(newExpiresAt * 1000),
  });

  
    cookieStore.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

  cookieStore.set("token_expires_at", newExpiresAt.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  cookieStore.set(
    'user',
    JSON.stringify({
        full_name: user?.full_name,
        profile_photo: user?.profile_photo
    }),
    { 
        sameSite: "lax",
        expires: new Date(expiresAt * 1000),
    }
  )

  return data.access_token;
}
