import React, { useEffect } from 'react';
import { CooldownEntry, Trigger } from './types';
import { parseCooldowns, buildCooldowns } from './xmlUtils';
import { useDispatch, useSelector } from 'react-redux';
import {
  RootState,
  AppDispatch,
  setData,
  setError,
  addEntry,
  updateEntry,
  deleteEntry,
} from './store';
import {
  Button,
  Container,
  Title,
  FileInput,
  Alert,
  Paper,
  TextInput,
  NumberInput,
  Checkbox,
  Group,
  Stack,
  Text,
} from '@mantine/core';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.cooldowns.data);
  const error = useSelector((state: RootState) => state.cooldowns.error);

  useEffect(() => {
    fetch('/cooldowns.xml')
      .then((res) => (res.ok ? res.text() : null))
      .then((xml) => {
        if (!xml) return;
        try {
          const parsed = parseCooldowns(xml);
          dispatch(setData(parsed));
        } catch {
          /* ignore */
        }
      })
      .catch(() => {});
  }, []);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseCooldowns(reader.result as string);
        dispatch(setData(parsed));
        dispatch(setError(null));
      } catch (e) {
        dispatch(setError('Failed to parse XML'));
      }
    };
    reader.readAsText(file);
  };

  const onAddEntry = () => dispatch(addEntry());

  const onUpdateEntry = (index: number, entry: CooldownEntry) =>
    dispatch(updateEntry({ index, entry }));

  const onDeleteEntry = (index: number) => dispatch(deleteEntry(index));

  const download = () => {
    if (!data) return;
    const xml = buildCooldowns(data);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cooldowns.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container p="md">
      <Stack>
        <Title order={1}>UOO Cooldown Manager</Title>
        <FileInput
          accept=".xml"
          placeholder="Upload cooldowns.xml"
          onChange={(file) => file && handleFile(file)}
        />
        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}
        {data && (
          <Stack>
            <Button onClick={onAddEntry}>Add Entry</Button>
            {data.cooldowns.cooldownentry.map((entry, i) => (
              <EntryEditor
                key={i}
                entry={entry}
                onChange={(val) => onUpdateEntry(i, val)}
                onDelete={() => onDeleteEntry(i)}
              />
            ))}
            <Button onClick={download}>Download XML</Button>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

function EntryEditor({
  entry,
  onChange,
  onDelete,
}: {
  entry: CooldownEntry;
  onChange: (e: CooldownEntry) => void;
  onDelete: () => void;
}) {
  const update = (patch: Partial<CooldownEntry>) => onChange({ ...entry, ...patch });

  const updateTrigger = (index: number, trigger: Trigger) => {
    const triggers = [...entry.trigger];
    triggers[index] = trigger;
    update({ trigger: triggers });
  };

  const addTrigger = () => update({ trigger: [...entry.trigger, { triggertype: '', duration: 0, triggertext: '' }] });

  const deleteTrigger = (index: number) => update({ trigger: entry.trigger.filter((_, i) => i !== index) });

  return (
    <Paper withBorder p="md" mt="md">
      <Stack>
        <TextInput label="Name" value={entry.name} onChange={(e) => update({ name: e.currentTarget.value })} />
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
        <NumberInput label="Hue" value={entry.hue} onChange={(value) => update({ hue: Number(value) })} />
        <Checkbox
          label="Hide When Inactive"
          checked={entry.hidewheninactive}
          onChange={(e) => update({ hidewheninactive: e.currentTarget.checked })}
        />
        <Stack>
          <Text fw={500}>Triggers</Text>
          {entry.trigger.map((t, i) => (
            <Group key={i} align="flex-end">
              <TextInput
                placeholder="Type"
                value={t.triggertype}
                onChange={(e) => updateTrigger(i, { ...t, triggertype: e.currentTarget.value })}
              />
              <NumberInput
                placeholder="Duration"
                value={t.duration}
                onChange={(value) => updateTrigger(i, { ...t, duration: Number(value) })}
              />
              <TextInput
                placeholder="Text"
                value={t.triggertext}
                onChange={(e) => updateTrigger(i, { ...t, triggertext: e.currentTarget.value })}
              />
              <Button color="red" variant="subtle" onClick={() => deleteTrigger(i)}>
                Delete
              </Button>
            </Group>
          ))}
          <Button variant="light" onClick={addTrigger}>
            Add Trigger
          </Button>
        </Stack>
        <Button color="red" onClick={onDelete}>
          Delete Entry
        </Button>
      </Stack>
    </Paper>
  );
}
