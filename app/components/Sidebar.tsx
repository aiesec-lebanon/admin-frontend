"use client";

import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from "@/layout/constants";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        borderRight: "1px solid",
        borderColor: "divider",
        backgroundColor: "#001529",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo section (aligned with header) */}
      <Box
        sx={{
          height: HEADER_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Image
          src="/human.png"
          alt="Logo"
          width={SIDEBAR_WIDTH}
          height={HEADER_HEIGHT}
        />
      </Box>

      {/* Navigation */}
      <List sx={{ pt: 1 }}>
        <Tooltip title="Create Custom Link" placement="right">
          <ListItemButton
            onClick={() => router.push("/")}
            selected={pathname === "/"}
            sx={{
              justifyContent: "center",
              minHeight: 48,
              color: "white",
              "&.Mui-selected": {
                backgroundColor: "primary.main",
              },
            }}
          >
            <AddLinkIcon />
          </ListItemButton>
        </Tooltip>
      </List>

      <Divider sx={{ mt: "auto" }} />
    </Box>
  );
}