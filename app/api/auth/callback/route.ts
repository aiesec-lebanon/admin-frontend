'use server'

import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';
import validateUser from '@/server-utils/UserValidation';
import { TokenResponse } from '@/layout/types';

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');
    if (!code) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const tokenResponse = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/token`, {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `${req.nextUrl.origin}/api/auth/callback`,
            client_secret: process.env.CLIENT_SECRET,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const tokenData: TokenResponse = tokenResponse.data;

        const {isValid, user} = await validateUser(tokenData.access_token);

        if (!isValid) {
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        const expiresAt = tokenData.created_at + tokenData.expires_in;

        const response = NextResponse.redirect(new URL('/', req.url));
        
        response.cookies.set('aiesec_token', tokenData.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            expires: new Date(expiresAt*1000)
        });

        response.cookies.set('refresh_token', tokenData.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        });

        response.cookies.set("token_expires_at", expiresAt.toString(), {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
        });

        response.cookies.set(
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
        return response;
    } catch (error) {
        console.error('Error fetching tokens:', error);
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
}