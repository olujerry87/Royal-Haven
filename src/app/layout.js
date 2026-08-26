import { Cormorant_Garamond, Montserrat } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LiquidBackground from "@/components/LiquidBackground";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import BuilderRegistry from "@/components/BuilderRegistry";
import { getProductCategories } from "@/lib/woocommerce";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heritage",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Wura & Ewa | Modern Indigenous Fashion & Artistry",
  description: "A dual experience of heritage fashion and luxury artistry.",
};

import AnnouncementBar from "@/components/AnnouncementBar";
import FloatingBadge from "@/components/FloatingBadge";
import AddToCartNotification from "@/components/AddToCartNotification";

export default async function RootLayout({ children }) {
  let categories = [];
  try {
    categories = await getProductCategories();
    // Filter out 'Uncategorized' if it exists
    if (categories && Array.isArray(categories)) {
        categories = categories.filter(c => c.name !== 'Uncategorized' && c.count > 0);
    }
  } catch (error) {
    console.warn("Could not fetch WooCommerce categories for Navigation");
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${montserrat.variable} antialiased`} suppressHydrationWarning>
        <CartProvider>
          <LanguageProvider>
            <BuilderRegistry />
            <LiquidBackground />
            <AnnouncementBar />
            <FloatingBadge />
            <AddToCartNotification />
            <Navigation wuraCategories={categories} />
            {children}
            <Footer />
          </LanguageProvider>
        </CartProvider>
      </body>
    </html>
  );
}
