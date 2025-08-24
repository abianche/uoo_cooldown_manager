import React, { useEffect } from "react";
import { CooldownEntry } from "./types";
import { parseCooldowns, buildCooldowns } from "./xmlUtils";
import { useDispatch, useSelector } from "react-redux";
import {
  RootState,
  AppDispatch,
  setData,
  setError,
  addEntry,
  updateEntry,
  deleteEntry,
  reorderEntries,
} from "./store";
import { Container, Title, Stack } from "@mantine/core";
import { CooldownList, FileUpload } from "./components";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.cooldowns.data);
  const error = useSelector((state: RootState) => state.cooldowns.error);

  useEffect(() => {
    fetch("/cooldowns.xml")
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
        dispatch(setError("Failed to parse XML"));
      }
    };
    reader.readAsText(file);
  };

  const onAddEntry = () => dispatch(addEntry());

  const onUpdateEntry = (index: number, entry: CooldownEntry) =>
    dispatch(updateEntry({ index, entry }));

  const onDeleteEntry = (index: number) => dispatch(deleteEntry(index));

  const onReorderEntries = (fromIndex: number, toIndex: number) =>
    dispatch(reorderEntries({ fromIndex, toIndex }));

  const download = () => {
    if (!data) return;
    const xml = buildCooldowns(data);
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cooldowns.xml";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container p="md">
      <Stack>
        <Title order={1}>UOO Cooldown Manager</Title>
        <FileUpload onFileSelect={handleFile} error={error} />
        {data && (
          <CooldownList
            entries={data.cooldowns.cooldownentry}
            onAddEntry={onAddEntry}
            onUpdateEntry={onUpdateEntry}
            onDeleteEntry={onDeleteEntry}
            onReorderEntries={onReorderEntries}
            onDownload={download}
          />
        )}
      </Stack>
    </Container>
  );
}
