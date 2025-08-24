import React from "react";
import { Button, Stack, Group, ActionIcon, Text, Paper } from "@mantine/core";
import { CooldownEntry } from "../types";
import { EntryEditor } from "./EntryEditor";

interface CooldownListProps {
  entries: CooldownEntry[];
  onAddEntry: () => void;
  onUpdateEntry: (index: number, entry: CooldownEntry) => void;
  onDeleteEntry: (index: number) => void;
  onReorderEntries: (fromIndex: number, toIndex: number) => void;
  onDownload: () => void;
}

export function CooldownList({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onReorderEntries,
  onDownload,
}: CooldownListProps) {
  const moveEntry = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex >= 0 && toIndex < entries.length) {
      onReorderEntries(fromIndex, toIndex);
    }
  };

  return (
    <Stack>
      <Button onClick={onAddEntry}>Add Entry</Button>
      {entries.length > 0 && (
        <Text size="sm" c="dimmed" ta="center">
          Use the ↑↓ arrows to reorder entries
        </Text>
      )}
      {entries.map((entry, i) => (
        <Paper key={i} withBorder p="xs" mb="md">
          <Group justify="space-between" align="center" mb="xs">
            <Text size="sm" c="dimmed" fw={500}>
              Entry {i + 1}
            </Text>
            <Group gap="xs">
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => moveEntry(i, "up")}
                disabled={i === 0}
                aria-label="Move entry up"
                size="sm"
              >
                ↑
              </ActionIcon>
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => moveEntry(i, "down")}
                disabled={i === entries.length - 1}
                aria-label="Move entry down"
                size="sm"
              >
                ↓
              </ActionIcon>
            </Group>
          </Group>
          <EntryEditor
            entry={entry}
            onChange={(val) => onUpdateEntry(i, val)}
            onDelete={() => onDeleteEntry(i)}
          />
        </Paper>
      ))}
      <Button onClick={onDownload}>Download XML</Button>
    </Stack>
  );
}
