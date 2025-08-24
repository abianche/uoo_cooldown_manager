import {
  ActionIcon,
  Button,
  Checkbox,
  Collapse,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  COOLDOWN_BAR_TYPES,
  CooldownEntry,
  Trigger,
  TRIGGER_TYPES,
} from "../types";

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

function getTriggerTypeDescription(type: string): string {
  switch (type) {
    case "SysMessage":
      return "System message that appears in the chat";
    case "OverheadMessage":
      return "Message that appears above the player's head";
    case "BuffAdded":
      return "When a buff or positive effect is applied";
    case "BuffRemoved":
      return "When a buff or positive effect is removed";
    default:
      return "Unknown trigger type";
  }
}

interface EntryEditorProps {
  entry: CooldownEntry;
  onChange: (e: CooldownEntry) => void;
  onDelete: () => void;
}

export function EntryEditor({
  entry,
  onChange, // kept in props, but unused if you're handling state locally
  onDelete,
}: Readonly<EntryEditorProps>) {
  const [entryState, setEntryState] = useState(entry);
  const [triggersOpen, setTriggersOpen] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  // keep local state in sync if parent changes the prop
  useEffect(() => {
    setEntryState(entry);
  }, [entry]);

  const update = (patch: Partial<CooldownEntry>) => {
    setEntryState((prev) => ({ ...prev, ...patch }));
  };

  const updateTrigger = (index: number, trigger: Trigger) => {
    setEntryState((prev) => {
      const triggers = [...prev.trigger];
      triggers[index] = trigger;
      return { ...prev, trigger: triggers };
    });
  };

  const addTrigger = () => {
    setEntryState((prev) => ({
      ...prev,
      trigger: [
        ...prev.trigger,
        { triggertype: "SysMessage", duration: 0, triggertext: "" },
      ],
    }));
  };

  const deleteTrigger = (index: number) => {
    setEntryState((prev) => ({
      ...prev,
      trigger: prev.trigger.filter((_, i) => i !== index),
    }));
  };

  return (
    <Stack>
      <TextInput
        label="Name"
        value={entryState.name}
        onChange={(e) => update({ name: e.currentTarget.value })}
      />
      <NumberInput
        label="Default Cooldown"
        value={entryState.defaultcooldown}
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
        value={entryState.cooldownbartype}
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
        value={entryState.hue}
        onChange={(value) => update({ hue: Number(value) })}
      />
      <Checkbox
        label="Hide When Inactive"
        checked={entryState.hidewheninactive}
        onChange={(e) => update({ hidewheninactive: e.currentTarget.checked })}
      />
      {entryState.cooldownbartype === "Regular" && (
        <Stack>
          <Group justify="space-between" align="center">
            <Text fw={500}>Triggers</Text>
            <ActionIcon
              variant="subtle"
              onClick={() => setTriggersOpen((o) => !o)}
              aria-label={
                triggersOpen ? "Collapse triggers" : "Expand triggers"
              }
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
            {entryState.trigger.map((t, i) => (
              <Paper
                key={i}
                withBorder
                p="xs"
                style={{ borderStyle: "dashed" }}
              >
                <Group gap="md" align="flex-end">
                  <Select
                    label="Type"
                    description="Choose the type of trigger"
                    data={TRIGGER_TYPES.map((type) => ({
                      value: type,
                      label: type,
                      description: getTriggerTypeDescription(type),
                    }))}
                    value={t.triggertype || "SysMessage"}
                    onChange={(value) => {
                      if (value) {
                        updateTrigger(i, {
                          ...t,
                          triggertype: value as (typeof TRIGGER_TYPES)[number],
                        });
                      }
                    }}
                    allowDeselect={false}
                    searchable
                    clearable={false}
                    maxDropdownHeight={200}
                    style={{ minWidth: "200px" }}
                  />
                  <NumberInput
                    label="Duration"
                    description="Cooldown duration in seconds"
                    placeholder="Duration"
                    value={t.duration}
                    onChange={(value) =>
                      updateTrigger(i, { ...t, duration: Number(value) })
                    }
                    min={0}
                    step={1}
                    style={{ minWidth: "150px" }}
                  />
                  <TextInput
                    label="Trigger Text"
                    description="Text that triggers this cooldown"
                    placeholder="Text"
                    value={t.triggertext}
                    onChange={(e) =>
                      updateTrigger(i, {
                        ...t,
                        triggertext: e.currentTarget.value,
                      })
                    }
                    style={{ flex: 1 }}
                  />
                  <Button
                    color="red"
                    variant="subtle"
                    onClick={() => deleteTrigger(i)}
                    style={{ marginBottom: "4px" }}
                  >
                    Delete
                  </Button>
                </Group>
              </Paper>
            ))}
            <Button variant="light" onClick={addTrigger}>
              Add Trigger
            </Button>
          </Collapse>
        </Stack>
      )}
    </Stack>
  );
}
