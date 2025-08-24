import {
  ActionIcon,
  Button,
  Collapse,
  Group,
  Paper,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useState } from "react";
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
}: Readonly<CooldownListProps>) {
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);
  const { colorScheme } = useMantineColorScheme();

  const moveEntry = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex >= 0 && toIndex < entries.length) {
      onReorderEntries(fromIndex, toIndex);
    }
  };

  const toggleEntry = (index: number) => {
    setExpandedEntry(expandedEntry === index ? null : index);
  };

  return (
    <Stack>
      <Button
        onClick={onAddEntry}
        style={{
          backgroundColor:
            colorScheme === "dark"
              ? "var(--mantine-color-blue-8)"
              : "var(--mantine-color-blue-6)",
        }}
      >
        Add Entry
      </Button>
      {entries.length > 0 && (
        <Text size="sm" c="dimmed" ta="center">
          Click on an entry name to edit, use arrows to reorder
        </Text>
      )}
      {entries.map((entry, i) => (
        <Paper
          key={i}
          withBorder
          p="xs"
          mb="sm"
          style={{
            borderColor:
              colorScheme === "dark"
                ? "var(--mantine-color-dark-4)"
                : "var(--mantine-color-gray-3)",
          }}
        >
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <Text size="sm" c="dimmed" fw={500} style={{ minWidth: "40px" }}>
                {i + 1}.
              </Text>
              <Text
                fw={500}
                style={{
                  cursor: "pointer",
                  flex: 1,
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backgroundColor:
                    expandedEntry === i
                      ? colorScheme === "dark"
                        ? "var(--mantine-color-blue-9)"
                        : "var(--mantine-color-blue-0)"
                      : "transparent",
                  transition: "background-color 0.2s ease",
                }}
                onClick={() => toggleEntry(i)}
                c={expandedEntry === i ? "blue" : undefined}
              >
                {entry.name || "Unnamed Entry"}
              </Text>
              <Text size="sm" c="dimmed" style={{ marginRight: "8px" }}>
                {expandedEntry === i ? "▼" : "▶"}
              </Text>
            </Group>
            <Group gap="xs">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => moveEntry(i, "up")}
                disabled={i === 0}
                aria-label="Move entry up"
                size="sm"
              >
                ↑
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => moveEntry(i, "down")}
                disabled={i === entries.length - 1}
                aria-label="Move entry down"
                size="sm"
              >
                ↓
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => onDeleteEntry(i)}
                aria-label="Delete entry"
                size="sm"
              >
                ×
              </ActionIcon>
            </Group>
          </Group>

          <Collapse in={expandedEntry === i}>
            <div style={{ marginTop: "1rem" }}>
              <EntryEditor
                entry={entry}
                onChange={(val) => onUpdateEntry(i, val)}
                onDelete={() => onDeleteEntry(i)}
              />
            </div>
          </Collapse>
        </Paper>
      ))}
      <Button
        onClick={onDownload}
        style={{
          backgroundColor:
            colorScheme === "dark"
              ? "var(--mantine-color-green-8)"
              : "var(--mantine-color-green-6)",
        }}
      >
        Download XML
      </Button>
    </Stack>
  );
}
