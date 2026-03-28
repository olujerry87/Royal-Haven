import { Cormorant_Garamond, Montserrat } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LiquidBackground from "@/components/LiquidBackground";
import { CartProvider } from "@/context/CartContext";
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
          <BuilderRegistry />
          <LiquidBackground />
          <Navigation wuraCategories={categories} />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html >
  );
}
