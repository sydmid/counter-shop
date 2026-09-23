import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LivePriceTicker } from "@/components/layout/LivePriceTicker";
import { CartProvider } from "@/lib/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "SteamItemExchange (Counter-Shop) - Ultra-Fast CS2 & Dota 2 Trading",
  description:
    "High-performance open-source marketplace for CS2 & Dota 2 items. Features real-time price tickers, BUFF163 arbitrage scanner, provably fair P2P trade matching, and automated bot fulfillment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 antialiased selection:bg-blue-600 selection:text-white">
        <CartProvider>
          <LivePriceTicker />
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
