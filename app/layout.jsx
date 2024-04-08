import Navbar from "@components/UiComponents/Navbar";
import SessionProviderComponent from "@components/SessionProviderComponent";
import "@styles/global.css";
import { Toaster } from "@/components/ui/toaster";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@lib/utils";
export const metadata = {
  title: "Fitness Flex",
  description: "Gym Management Web App!",
};

// const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-inter">
      <SessionProviderComponent>
        <body className={cn("h-screen w-full overflow-auto md:h-full")}>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </SessionProviderComponent>
    </html>
  );
}
