import Providers from "./Providers";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeMode =
    cookieStore.get("themeMode")?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en" className={inter.variable}>
      <Providers initialMode={themeMode}>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
