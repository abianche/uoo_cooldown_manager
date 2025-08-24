import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppContainer,
  AppHeader,
  CooldownList,
  FileUpload,
  GeneralSettingsPanel,
} from "./components";
import {
  addEntry,
  AppDispatch,
  deleteEntry,
  initializeData,
  reorderEntries,
  RootState,
  setData,
  setError,
  updateEntry,
  updateGeneralSettings,
} from "./store";
import { CooldownEntry } from "./types";
import { buildCooldowns, parseCooldowns } from "./xmlUtils";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.cooldowns.data);
  const error = useSelector((state: RootState) => state.cooldowns.error);

  useEffect(() => {
    fetch("/uoo_cooldown_manager/cooldowns.xml")
      .then((res) => (res.ok ? res.text() : null))
      .then((xml) => {
        if (!xml) return;
        try {
          const parsed = parseCooldowns(xml);
          dispatch(setData(parsed));
          dispatch(initializeData());
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
        dispatch(initializeData());
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

  const onUpdateGeneralSettings = (settings: any) =>
    dispatch(updateGeneralSettings(settings));

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
    <AppContainer>
      <AppHeader />
      <FileUpload onFileSelect={handleFile} error={error} />
      {data && (
        <>
          <GeneralSettingsPanel
            settings={data.cooldowns.generalsettings}
            onChange={onUpdateGeneralSettings}
          />
          <CooldownList
            entries={data.cooldowns.cooldownentry}
            onAddEntry={onAddEntry}
            onUpdateEntry={onUpdateEntry}
            onDeleteEntry={onDeleteEntry}
            onReorderEntries={onReorderEntries}
            onDownload={download}
          />
        </>
      )}
    </AppContainer>
  );
}
