import React from "react";
import { Title, Group, Badge, ActionIcon, useMantineColorScheme } from "@mantine/core";

export function AppHeader() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group justify="space-between" align="center">
      <Title order={1}>Outlands Cooldowns Manager</Title>
      <Group gap="xs">
        <Badge
          variant="filled"
          color="orange"
          size="sm"
          style={{
            fontFamily: "monospace",
            fontWeight: "bold",
          }}
        >
          DEVELOPMENT PREVIEW
        </Badge>
        <ActionIcon
          onClick={() => toggleColorScheme()}
          variant="outline"
          size="lg"
          aria-label="Toggle color scheme"
          style={{
            borderColor:
              colorScheme === "dark"
                ? "var(--mantine-color-dark-4)"
                : "var(--mantine-color-gray-4)",
          }}
        >
          {colorScheme === "dark" ? "☀️" : "🌙"}
        </ActionIcon>
      </Group>
    </Group>
  );
}
