import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk } from "next/font/google"
import { ThemeProvider } from "@/components/provides/theme-provider";
import QueryProvider from "@/components/provides/query-provider";
import { ToastContainer } from "react-toastify"
import SessionProvider from "@/components/provides/session.provider";

export const metadata: Metadata = {
  title: "Telegram Web",
  description: "Telegramm orginilan web application clone created by Jamshid",
  icons: {
    icon: "/icon.svg"
  }
};

const space_grotesk = Space_Grotesk({
  weight: ["400", "500", "300", "600", "700"],
  subsets: ["latin"],
  variable: "--font-spaceGrotesk"
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <QueryProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            suppressHydrationWarning
            className={`${space_grotesk.className} antialiased`}
          >
            <ThemeProvider
              attribute={"class"}
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
                {children}
                <ToastContainer />
            </ThemeProvider>
          </body>
        </html>
      </QueryProvider>
    </SessionProvider>
  );
}
