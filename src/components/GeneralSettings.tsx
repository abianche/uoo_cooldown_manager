import React, { useState } from "react";
import {
  Paper,
  Stack,
  Text,
  Checkbox,
  NumberInput,
  Group,
  useMantineColorScheme,
  Collapse,
  ActionIcon,
} from "@mantine/core";
import { GeneralSettings } from "../types";

interface GeneralSettingsProps {
  settings: GeneralSettings;
  onChange: (settings: Partial<GeneralSettings>) => void;
}

export function GeneralSettingsPanel({
  settings,
  onChange,
}: GeneralSettingsProps) {
  const { colorScheme } = useMantineColorScheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Paper
      withBorder
      p="md"
      style={{
        borderColor:
          colorScheme === "dark"
            ? "var(--mantine-color-dark-4)"
            : "var(--mantine-color-gray-3)",
      }}
    >
      <Stack>
        <Group justify="space-between" align="center">
          <Text fw={600} size="lg">
            ⚙️ General Settings
          </Text>
          <ActionIcon
            variant="subtle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse settings" : "Expand settings"}
            style={{
              color:
                colorScheme === "dark"
                  ? "var(--mantine-color-gray-3)"
                  : "var(--mantine-color-gray-6)",
            }}
          >
            {isExpanded ? "▼" : "▶"}
          </ActionIcon>
        </Group>

        <Collapse in={isExpanded}>
          <Stack gap="md">
            <Checkbox
              label="Show Cooldown Gump"
              description="Display the cooldown gump interface"
              checked={settings.showCooldownGump}
              onChange={(e) =>
                onChange({ showCooldownGump: e.currentTarget.checked })
              }
            />

            <Group grow>
              <NumberInput
                label="Cooldown Bar Height"
                description="Height of cooldown bars in pixels"
                value={settings.cooldownBarHeight}
                onChange={(value) =>
                  onChange({ cooldownBarHeight: Number(value) })
                }
                min={10}
                max={100}
                step={1}
              />

              <NumberInput
                label="Cooldown Bar Width"
                description="Width of cooldown bars in pixels"
                value={settings.cooldownBarWidth}
                onChange={(value) =>
                  onChange({ cooldownBarWidth: Number(value) })
                }
                min={50}
                max={500}
                step={5}
              />
            </Group>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
}
