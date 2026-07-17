import type { Metadata } from "next";
import AppProvider from "@/Components/AppProvider";
import ReduxProvider from "@/redux/provider";
import AuthWrapper from "@/Components/AuthWrapper";
import LayoutWrapper from "@/Components/LayoutWrapper";
import PopUpHandler from "@/Components/PopUpHandler";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Swipeo Banking",
  description:
    "Secure, scalable, and compliant financial infrastructure for modern businesses.",
};

// Provider nesting order (do not change):
// AppProvider → ReduxProvider → AuthWrapper → LayoutWrapper → children → PopUpHandler
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <ReduxProvider>
            <AuthWrapper>
              <LayoutWrapper>{children}</LayoutWrapper>
            </AuthWrapper>
            <PopUpHandler />
          </ReduxProvider>
        </AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
