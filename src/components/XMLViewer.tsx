import { Modal, Code, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface XMLViewerProps {
  opened: boolean;
  onClose: () => void;
  xmlContent: string;
}

export function XMLViewer({ opened, onClose, xmlContent }: XMLViewerProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Raw XML Content"
      size="90%"
      styles={{
        body: { padding: 0 },
      }}
    >
      <ScrollArea h={600} p="md">
        <Code
          block
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "Consolas, Monaco, 'Courier New', monospace",
            fontSize: "14px",
            lineHeight: "1.4",
          }}
        >
          {xmlContent}
        </Code>
      </ScrollArea>
    </Modal>
  );
}
