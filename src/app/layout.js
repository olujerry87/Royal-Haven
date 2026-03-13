import { Cormorant_Garamond, Montserrat } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LiquidBackground from "@/components/LiquidBackground";
import { CartProvider } from "@/context/CartContext";
import BuilderRegistry from "@/components/BuilderRegistry";
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${montserrat.variable} antialiased`} suppressHydrationWarning>
        <CartProvider>
          <BuilderRegistry />
          <LiquidBackground />
          <Navigation />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html >
  );
}
