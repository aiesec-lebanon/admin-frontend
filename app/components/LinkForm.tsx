"use client";

import React, { SetStateAction, useState } from "react";
import { mutate } from "swr";
import {
  Box,
  Stack,
  TextField,
  Button,
  Alert,
} from "@mui/material";

export type LinkFormValues = {
  slug: string;
  target: string;
  title: string;
  notes?: string;
};

type LinkFormProps = {
  initialValues: LinkFormValues;
  submitLabel?: string;
  loading?: boolean;
  setLoading: (value: SetStateAction<boolean>) => void;
  onSubmit: (values: LinkFormValues) => Promise<void>;
};

export default function LinkForm({
  initialValues,
  submitLabel = "Save",
  loading = false,
  setLoading,
  onSubmit,
}: LinkFormProps) {
  const [values, setValues] = useState<LinkFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);

  /* Validation logic */

  const isValidUrl = (urlString: string) => {
    try {
        const url = new URL(urlString);
        return ["http:", "https:"].includes(url.protocol);
    } catch {
        return false;
    }
  };

  const handleUrlBlur = () => {
    if (values.target && !/^https?:\/\//i.test(values.target)) {
      setValues({ ...values, target: `https://${values.target}` });
    }
  };

  const isSulgValid = values.slug.trim().length > 0;
  const isTargetValid = values.target.trim().length > 0 && isValidUrl(values.target);  
  const isTitleValid = values.title.trim().length > 0;

  const isFormValid = isSulgValid && isTargetValid && isTitleValid;

  /* Handlers */

  const updateField = (field: keyof LinkFormValues) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;
    
    setLoading(true);
    setError(null);

    try {
      await onSubmit(values);

      mutate((key) => 
        typeof key === "string" && key.startsWith("/api/get-redirect-list")
      );
    } catch (err: any) {
      // console.error(err);
      setError(err.response?.data?.details || err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Custom link"
          value={values.slug}
          disabled
          fullWidth
        />

        <TextField
          label="Target URL"
          placeholder="https://example.com"
          value={values.target}
          onChange={updateField("target")}
          onBlur={handleUrlBlur}
          error={values.target !== "" && !isValidUrl(values.target)}
          helperText={
            values.target !== "" && !isValidUrl(values.target)
              ? 'URL must start with "http://" or "https://"'
              : ""
          }
        />

        <TextField
          label="Title"
          value={values.title}
          onChange={updateField("title")}
          error={values.title !== "" && !isTitleValid}
          helperText={
            values.title !== "" && !isTitleValid
              ? "Title is required"
              : ""
          }
        />

        <TextField
          label="Description"
          value={values.notes ?? ""}
          onChange={updateField("notes")}
          multiline
          rows={3}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button
          type="submit"
          variant="contained"
          disabled={loading || !isFormValid}
        >
          {loading ? "Saving..." : submitLabel}
        </Button>
      </Stack>
    </Box>
  );
};