// cypress/support/mount.tsx
import React, { ReactNode } from "react";
import { ChakraProvider, theme as chakraTheme, type ChakraProviderProps } from "@chakra-ui/react";
import { mount as cypressMount } from "cypress/react";

export const mount = (component: ReactNode, options?: Partial<ChakraProviderProps>) => {
  return cypressMount(
    <ChakraProvider theme={chakraTheme} {...options}>
      {component}
    </ChakraProvider>
  );
};
