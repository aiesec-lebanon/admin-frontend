"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

type Props = {
  mine?: boolean;
};

export default function LinksTable({ mine = false }: Props) {
  const rows = [
    { link: "my-link", target: "https://example.com", owner: "You" },
    { link: "docs", target: "https://docs.com", owner: "Admin" },
  ].filter((r) => (mine ? r.owner === "You" : true));

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Custom Link</TableCell>
          <TableCell>Target URL</TableCell>
          <TableCell>Owner</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.link}>
            <TableCell>{row.link}</TableCell>
            <TableCell>{row.target}</TableCell>
            <TableCell>{row.owner}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
