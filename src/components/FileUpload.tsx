import { Alert, FileInput } from "@mantine/core";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  error: string | null;
}

export function FileUpload({ onFileSelect, error }: Readonly<FileUploadProps>) {
  return (
    <>
      <FileInput
        accept=".xml"
        placeholder="Upload cooldowns.xml"
        onChange={(file) => file && onFileSelect(file)}
      />
      {error && (
        <Alert color="red" variant="light">
          {error}
        </Alert>
      )}
    </>
  );
}
