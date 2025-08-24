import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { buildCooldowns } from "../xmlUtils";
import { XMLViewer } from "./XMLViewer";

export function AppHeader() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, { open, close }] = useDisclosure();
  const data = useSelector((state: RootState) => state.cooldowns.data);

  const handleViewRawXML = () => {
    open();
  };

  const rawXML = data ? buildCooldowns(data) : "";

  return (
    <>
      <Group justify="space-between" align="center">
        <Title order={1}>Outlands Cooldowns Manager</Title>
        <Group gap="xs">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewRawXML}
            disabled={!data}
          >
            View Raw XML
          </Button>
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

      <XMLViewer opened={opened} onClose={close} xmlContent={rawXML} />
    </>
  );
}
