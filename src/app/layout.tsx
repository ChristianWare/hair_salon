import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import { auth } from "../../auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  variable: "--poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "800", "900"],
});

const ButlerRegular = localFont({
  src: "../../public/fonts/ButlerRegular.woff",
  variable: "--ButlerRegular",
  display: "swap",
});

const ButlerUltraLight = localFont({
  src: "../../public/fonts/ButlerUltraLight.woff",
  variable: "--ButlerUltraLight",
  display: "swap",
});

const NyghtSerifLight = localFont({
  src: "../../public/fonts/NyghtSerifLight.woff",
  variable: "--NyghtSerifLight",
  display: "swap",
});

const Voyage = localFont({
  src: "../../public/fonts/Voyage.woff2",
  variable: "--Voyage",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Velvet & Vine | Luxury Hair Salon",
    template: "%s - Velvet & Vine",
  },
  description:
    "Velvet & Vine is a luxury hair salon offering personalized services to help you look and feel your best.",
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang='en'>
        <body
          className={`${poppins.variable} ${ButlerRegular.variable} ${ButlerUltraLight.variable} ${NyghtSerifLight.variable} ${Voyage.variable}`}
        >
          <Toaster
            position='top-right'
            toastOptions={{
              className: "toastFont",
            }}
          />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
