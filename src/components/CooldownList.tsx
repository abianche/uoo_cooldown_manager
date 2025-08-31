import {
  ActionIcon,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Transition,
  useMantineColorScheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
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
  const [entriesState, setEntriesState] = useState(entries);
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const { colorScheme } = useMantineColorScheme();

  // keep local state in sync if parent swaps the prop
  useEffect(() => {
    setEntriesState(entries);
  }, [entries]);

  const moveEntry = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= entriesState.length) return;

    setEntriesState((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });

    // keep parent informed (e.g., to persist)
    onReorderEntries(fromIndex, toIndex);

  };

  const deleteEntryLocal = (index: number) => {
    setEntriesState((prev) => prev.filter((_, i) => i !== index));
    onDeleteEntry(index);
  };

  return (
    <Stack>
      <Transition mounted={editingEntry === null} transition="slide-right" duration={200} timingFunction="ease">
        {(styles) => (
          <div style={styles}>
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

            {entriesState.map((entry, i) => (
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
                    <Text fw={500}>{entry.name || "Unnamed Entry"}</Text>
                  </Group>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => setEditingEntry(i)}
                      aria-label="Edit entry"
                      size="sm"
                    >
                      →
                    </ActionIcon>
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
                      disabled={i === entriesState.length - 1}
                      aria-label="Move entry down"
                      size="sm"
                    >
                      ↓
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => deleteEntryLocal(i)}
                      aria-label="Delete entry"
                      size="sm"
                    >
                      ×
                    </ActionIcon>
                  </Group>
                </Group>
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
          </div>
        )}
      </Transition>

      {editingEntry !== null && (
        <Transition mounted transition="slide-left" duration={200} timingFunction="ease">
          {(styles) => (
            <div style={styles}>
              <Button
                mb="sm"
                onClick={() => setEditingEntry(null)}
                variant="subtle"
              >
                ← Back
              </Button>
              <EntryEditor
                entry={entriesState[editingEntry]}
                onChange={(val) => {
                  setEntriesState((prev) => {
                    const next = [...prev];
                    next[editingEntry] = val;
                    return next;
                  });
                  onUpdateEntry(editingEntry, val);
                }}
                onDelete={() => {
                  deleteEntryLocal(editingEntry);
                  setEditingEntry(null);
                }}
              />
            </div>
          )}
        </Transition>
      )}
    </Stack>
  );
}
