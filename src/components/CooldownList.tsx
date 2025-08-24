import React from "react";
import { Button, Stack } from "@mantine/core";
import { CooldownEntry } from "../types";
import { EntryEditor } from "./EntryEditor";

interface CooldownListProps {
  entries: CooldownEntry[];
  onAddEntry: () => void;
  onUpdateEntry: (index: number, entry: CooldownEntry) => void;
  onDeleteEntry: (index: number) => void;
  onDownload: () => void;
}

export function CooldownList({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onDownload,
}: CooldownListProps) {
  return (
    <Stack>
      <Button onClick={onAddEntry}>Add Entry</Button>
      {entries.map((entry, i) => (
        <EntryEditor
          key={i}
          entry={entry}
          onChange={(val) => onUpdateEntry(i, val)}
          onDelete={() => onDeleteEntry(i)}
        />
      ))}
      <Button onClick={onDownload}>Download XML</Button>
    </Stack>
  );
}
