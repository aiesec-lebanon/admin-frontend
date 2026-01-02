"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from "@/layout/constants";

type HeaderProps = {
  userName?: string;
  profileImageUrl?: string;
  onLogout: () => void;
};

export default function Header({
  userName = "User",
  profileImageUrl,
  onLogout,
}: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        height: HEADER_HEIGHT,
        left: SIDEBAR_WIDTH,
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
      }}
    >
      <Toolbar
        sx={{
          minHeight: HEADER_HEIGHT,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Admin Portal
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={profileImageUrl}
            alt={userName}
            sx={{ width: 32, height: 32 }}
          />
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            onClick={onLogout}
            sx={{ textTransform: "none" }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
