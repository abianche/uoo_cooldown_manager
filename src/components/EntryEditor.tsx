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
} from "@mantine/core";
import { CooldownEntry, Trigger } from "../types";

interface EntryEditorProps {
  entry: CooldownEntry;
  onChange: (e: CooldownEntry) => void;
  onDelete: () => void;
}

export function EntryEditor({ entry, onChange, onDelete }: EntryEditorProps) {
  const [triggersOpen, setTriggersOpen] = useState(false);
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
      <TextInput
        label="Cooldown Bar Type"
        value={entry.cooldownbartype}
        onChange={(e) => update({ cooldownbartype: e.currentTarget.value })}
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
