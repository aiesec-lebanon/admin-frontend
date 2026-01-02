"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LinkForm, { LinkFormValues } from "./LinkForm";

type Props = {
  open: boolean;
  onClose: () => void;
  link: string;
};

export default function CreateLinkDialog({ open, onClose, link }: Props) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleCreate = async (values: LinkFormValues) => {
    await axios.post("/api/redirects", values);
    onClose();
    router.refresh();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create custom link</DialogTitle>

      <DialogContent>
        <LinkForm
          submitLabel="Create"
          initialValues={{
            slug: link,
            target: "",
            title: "",
            notes: "",
          }}
          loading={loading}
          setLoading={setLoading}
          onSubmit={handleCreate}
        />
      </DialogContent>
    </Dialog>
  );
}
