import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography variant="h3" fontWeight={600} gutterBottom>
        Access not allowed
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 420, mb: 4 }}
      >
        You don’t have the required permissions to access this platform.
        If you believe this is a mistake, please contact an administrator.
      </Typography>

      <Link href="/login" style={{ textDecoration: "none" }}>
        <Button variant="contained" color="primary">
          Go to login
        </Button>
      </Link>
    </Box>
  );
}