import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProviders";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Buckit.",
  description:
    "A user friendly budget tracker application. Use it to manage your finances, smartly. Track inflow and outflow of your money with interactive graphs and statistics.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <RootProviders>
            {children}
            <Toaster richColors position="bottom-right" />
          </RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
