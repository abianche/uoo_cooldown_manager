import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mantine/core";
import {
  AppContainer,
  AppHeader,
  CooldownList,
  FileUpload,
  GeneralSettingsPanel,
} from "./components";
import {
  AppDispatch,
  initializeData,
  RootState,
  setData,
  setError,
} from "./store";
import { CooldownEntry, Cooldowns } from "./types";
import { buildCooldowns, parseCooldowns } from "./xmlUtils";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const storeData = useSelector((state: RootState) => state.cooldowns.data);
  const error = useSelector((state: RootState) => state.cooldowns.error);

  const [localData, setLocalData] = useState<Cooldowns | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

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
  }, [dispatch]);

  useEffect(() => {
    if (storeData) {
      setLocalData(storeData);
      setHasChanges(false);
    }
  }, [storeData]);

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

  const onAddEntry = () => {
    if (!localData) return;
    const newEntry: CooldownEntry = {
      name: "",
      defaultcooldown: 0,
      cooldownbartype: "Regular",
      hue: 0,
      hidewheninactive: true,
      trigger: [],
    };
    const generalsettings =
      localData.cooldowns.generalsettings || {
        showCooldownGump: true,
        cooldownBarHeight: 20,
        cooldownBarWidth: 200,
      };
    setLocalData({
      cooldowns: {
        generalsettings,
        cooldownentry: [...localData.cooldowns.cooldownentry, newEntry],
      },
    });
    setHasChanges(true);
  };

  const onUpdateEntry = (index: number, entry: CooldownEntry) => {
    if (!localData) return;
    const entries = [...localData.cooldowns.cooldownentry];
    entries[index] = entry;
    setLocalData({
      cooldowns: {
        ...localData.cooldowns,
        cooldownentry: entries,
      },
    });
    setHasChanges(true);
  };

  const onDeleteEntry = (index: number) => {
    if (!localData) return;
    const entries = [...localData.cooldowns.cooldownentry];
    entries.splice(index, 1);
    setLocalData({
      cooldowns: {
        ...localData.cooldowns,
        cooldownentry: entries,
      },
    });
    setHasChanges(true);
  };

  const onReorderEntries = (fromIndex: number, toIndex: number) => {
    if (!localData) return;
    const entries = [...localData.cooldowns.cooldownentry];
    const [movedEntry] = entries.splice(fromIndex, 1);
    entries.splice(toIndex, 0, movedEntry);
    setLocalData({
      cooldowns: {
        ...localData.cooldowns,
        cooldownentry: entries,
      },
    });
    setHasChanges(true);
  };

  const onUpdateGeneralSettings = (settings: any) => {
    if (!localData) return;
    setLocalData({
      cooldowns: {
        ...localData.cooldowns,
        generalsettings: {
          ...localData.cooldowns.generalsettings,
          ...settings,
        },
      },
    });
    setHasChanges(true);
  };

  const onSave = () => {
    if (!localData) return;
    dispatch(setData(localData));
    dispatch(initializeData());
    setHasChanges(false);
  };

  const download = () => {
    if (!localData) return;
    const xml = buildCooldowns(localData);
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
      {localData && (
        <>
          <GeneralSettingsPanel
            settings={localData.cooldowns.generalsettings}
            onChange={onUpdateGeneralSettings}
          />
          <CooldownList
            entries={localData.cooldowns.cooldownentry}
            onAddEntry={onAddEntry}
            onUpdateEntry={onUpdateEntry}
            onDeleteEntry={onDeleteEntry}
            onReorderEntries={onReorderEntries}
            onDownload={download}
          />
          {hasChanges && (
            <Button
              onClick={onSave}
              style={{ position: "fixed", bottom: 20, right: 20 }}
            >
              Save Changes
            </Button>
          )}
        </>
      )}
    </AppContainer>
  );
}
