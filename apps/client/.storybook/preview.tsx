import type { Preview } from "@storybook/react";
import { AuthProvider } from "../src/features/shared/utils/contexts/AuthContext";
import { LoadingProvider } from "../src/features/shared/utils/contexts/LoadingContext";
import { ToastProvider } from "../src/features/shared/hooks/useToast";
import "../src/styles/reset.css";

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <LoadingProvider>
          <AuthProvider>
            <Story />
          </AuthProvider>
        </LoadingProvider>
      </ToastProvider>
    ),
  ],
};

export default preview;
