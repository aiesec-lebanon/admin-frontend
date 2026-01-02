"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { PaginatedRedirectResponse } from "@/layout/types";

type Props = {
  mine?: boolean;
};

const PAGE_SIZE = 20;

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

export default function LinksTable({ mine = false }: Props) {
  const [page, setPage] = useState(0);

  const apiUrl = mine
    ? `/api/get-redirect-list?mine=true&page=${page + 1}&pageSize=${PAGE_SIZE}`
    : `/api/get-redirect-list?page=${page + 1}&pageSize=${PAGE_SIZE}`;

  const { data, isLoading, error } = useSWR(apiUrl, fetcher);

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  const {
    items,
    totalItems,
  } = data as PaginatedRedirectResponse;

  const handleCopy = async (key: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_REDIRECT_SERVICE_URL;

    if (!baseUrl) {
      console.error("NEXT_PUBLIC_REDIRECT_SERVICE_URL is not defined");
      return;
    }

    const fullUrl = `${baseUrl}/${key}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      // optional: show success feedback
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };


  return (
    <Paper sx={{ width: "100%", overflowX: "auto" }}>
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <TableCell>Link</TableCell>
            <TableCell>Target</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell
                align="right"
                sx={{
                  position: "sticky",
                  right: 0,
                  backgroundColor: "background.paper",
                  zIndex: 2,
                }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item.key}>
              <TableCell>{item.key}</TableCell>

              <TableCell
                sx={{
                  maxWidth: 300,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.data.target}
              </TableCell>

              <TableCell>{item.data.title ?? "-"}</TableCell>
              <TableCell>{item.data.createdBy}</TableCell>
              <TableCell>
                {new Date(item.data.createdAt).toLocaleString()}
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  position: "sticky",
                  right: 0,
                  backgroundColor: "background.paper",
                  zIndex: 1,
                  boxShadow: "-4px 0 8px rgba(0,0,0,0.05)",
                  borderColor: "divider",
                  whiteSpace: "nowrap",
                }}
              >
                <Tooltip title="Copy link">
                  <IconButton 
                    size="small"
                    onClick={() => handleCopy(item.key)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit">
                  <IconButton size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={totalItems}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={PAGE_SIZE}
        rowsPerPageOptions={[PAGE_SIZE]}
      />
    </Paper>
  );
}
