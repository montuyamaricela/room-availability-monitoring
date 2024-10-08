import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import Topbar from "~/components/common/Topbar";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Provider from "~/components/common/Provider";

const poppins = Poppins({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata = {
  title: "BulSu - Room Availability Monitoring",
  description: "Room Availability Monitoring - BulSu Bustos Campus",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.className}`}>
      <body>
        <Provider>
          <TRPCReactProvider>
            <Topbar />
            {children}
          </TRPCReactProvider>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
