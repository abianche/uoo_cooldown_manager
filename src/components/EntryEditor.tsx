import React, { useState } from "react";
import {
  Button,
  Paper,
  TextInput,
  NumberInput,
  Checkbox,
  Group,
  Stack,
  Text,
  Collapse,
  ActionIcon,
  useMantineColorScheme,
  Select,
} from "@mantine/core";
import { CooldownEntry, Trigger, COOLDOWN_BAR_TYPES } from "../types";

function getCooldownBarTypeDescription(type: string): string {
  switch (type) {
    case "Regular":
      return "Standard cooldown bar for general abilities";
    case "Bandage":
      return "Cooldown bar specifically for healing/bandaging";
    case "Criminal":
      return "Cooldown bar for criminal activities";
    case "PvP":
      return "Cooldown bar for player vs player actions";
    case "WeaponSwing":
      return "Cooldown bar for weapon attacks";
    case "Walk":
      return "Cooldown bar for movement abilities";
    default:
      return "Unknown cooldown bar type";
  }
}

interface EntryEditorProps {
  entry: CooldownEntry;
  onChange: (e: CooldownEntry) => void;
  onDelete: () => void;
}

export function EntryEditor({ entry, onChange, onDelete }: EntryEditorProps) {
  const [triggersOpen, setTriggersOpen] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const update = (patch: Partial<CooldownEntry>) =>
    onChange({ ...entry, ...patch });

  const updateTrigger = (index: number, trigger: Trigger) => {
    const triggers = [...entry.trigger];
    triggers[index] = trigger;
    update({ trigger: triggers });
  };

  const addTrigger = () =>
    update({
      trigger: [
        ...entry.trigger,
        { triggertype: "", duration: 0, triggertext: "" },
      ],
    });

  const deleteTrigger = (index: number) =>
    update({ trigger: entry.trigger.filter((_, i) => i !== index) });

  return (
    <Stack>
      <TextInput
        label="Name"
        value={entry.name}
        onChange={(e) => update({ name: e.currentTarget.value })}
      />
      <NumberInput
        label="Default Cooldown"
        value={entry.defaultcooldown}
        onChange={(value) => update({ defaultcooldown: Number(value) })}
      />
      <Select
        label="Cooldown Bar Type"
        description="Choose the type of cooldown bar for this entry"
        data={COOLDOWN_BAR_TYPES.map((type) => ({
          value: type,
          label: type,
          description: getCooldownBarTypeDescription(type),
        }))}
        value={entry.cooldownbartype}
        onChange={(value) => {
          if (value) {
            update({
              cooldownbartype: value as (typeof COOLDOWN_BAR_TYPES)[number],
            });
          }
        }}
        allowDeselect={false}
        searchable
        clearable={false}
        maxDropdownHeight={200}
      />
      <NumberInput
        label="Hue"
        value={entry.hue}
        onChange={(value) => update({ hue: Number(value) })}
      />
      <Checkbox
        label="Hide When Inactive"
        checked={entry.hidewheninactive}
        onChange={(e) => update({ hidewheninactive: e.currentTarget.checked })}
      />
      <Stack>
        <Group justify="space-between" align="center">
          <Text fw={500}>Triggers</Text>
          <ActionIcon
            variant="subtle"
            onClick={() => setTriggersOpen(!triggersOpen)}
            aria-label={triggersOpen ? "Collapse triggers" : "Expand triggers"}
            style={{
              color:
                colorScheme === "dark"
                  ? "var(--mantine-color-gray-3)"
                  : "var(--mantine-color-gray-6)",
            }}
          >
            {triggersOpen ? "▼" : "▶"}
          </ActionIcon>
        </Group>
        <Collapse in={triggersOpen}>
          {entry.trigger.map((t, i) => (
            <Group key={i} align="flex-end">
              <TextInput
                placeholder="Type"
                value={t.triggertype}
                onChange={(e) =>
                  updateTrigger(i, {
                    ...t,
                    triggertype: e.currentTarget.value,
                  })
                }
              />
              <NumberInput
                placeholder="Duration"
                value={t.duration}
                onChange={(value) =>
                  updateTrigger(i, { ...t, duration: Number(value) })
                }
              />
              <TextInput
                placeholder="Text"
                value={t.triggertext}
                onChange={(e) =>
                  updateTrigger(i, {
                    ...t,
                    triggertext: e.currentTarget.value,
                  })
                }
              />
              <Button
                color="red"
                variant="subtle"
                onClick={() => deleteTrigger(i)}
              >
                Delete
              </Button>
            </Group>
          ))}
          <Button variant="light" onClick={addTrigger}>
            Add Trigger
          </Button>
        </Collapse>
      </Stack>
    </Stack>
  );
}
