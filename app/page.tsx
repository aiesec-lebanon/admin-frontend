"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from "@/layout/constants";
import CreateLinkDialog from "./components/CreateLinkDialog";
import LinksTable from "./components/LinksTable";

export default function CreateCustomLinkPage() {
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState(0);

  // MOCK availability check
  const checkAvailability = async () => {
    setError(null);

    if (!link.trim()) {
      setError("Please enter a custom link.");
      return;
    }

    // fake rule: "admin" is taken
    const isAvailable = link !== "admin";

    if (isAvailable) {
      setDialogOpen(true);
    } else {
      setError("This custom link is already taken.");
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setLink("");        // ✅ reset input
    setError(null);     // optional: clear errors
  };

  return (
    <Box
      component="main"
      sx={{
        ml: `${SIDEBAR_WIDTH}px`,
        mt: `${HEADER_HEIGHT}px`,
        p: 4,
      }}
    >
      {/* Title */}
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Create a custom link
      </Typography>

      {/* Link input section */}
      <Box
        sx={{
          maxWidth: 500,
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: 2,
        }}
      >
        <TextField
          fullWidth
          label="Custom link"
          placeholder="my-awesome-link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <IconButton
          color="primary"
          onClick={checkAvailability}
          sx={{
            height: 56,
            width: 56,
          }}
        >
          <CheckCircleOutlineIcon />
        </IconButton>
      </Box>

      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, maxWidth: 500 }}>
          {error}
        </Alert>
      )}

      {/* Tabs section */}
      <Box sx={{ mt: 5 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="All custom links" />
          <Tab label="Created by me" />
        </Tabs>

        <Paper sx={{ mt: 2 }}>
          {tab === 0 && <LinksTable />}
          {tab === 1 && <LinksTable mine />}
        </Paper>
      </Box>

      {/* Create dialog */}
      <CreateLinkDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        link={link}
      />
    </Box>
  );
}
