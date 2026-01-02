'use client';

import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


export default function LoginPage() {
  useEffect(() => {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID || '',
      redirect_uri: `${window.location.origin}/api/auth/callback`,
    });

    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/authorize?${params.toString()}`;
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress />
    </Box>
  );

}