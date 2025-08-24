import { Container, Stack, useMantineColorScheme } from "@mantine/core";
import React from "react";

interface AppContainerProps {
  children: React.ReactNode;
}

export function AppContainer({ children }: AppContainerProps) {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Container
      p="md"
      style={{
        minHeight: "100vh",
        backgroundColor:
          colorScheme === "dark"
            ? "var(--mantine-color-dark-8)"
            : "var(--mantine-color-gray-0)",
        transition: "background-color 0.2s ease",
      }}
    >
      <Stack>{children}</Stack>
    </Container>
  );
}
