import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
export const metadata: Metadata = { title: "GreenBasket | Organic Grocery", description: "Fresh, natural and organic products for every home." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Providers>{children}</Providers></body></html>;
}
