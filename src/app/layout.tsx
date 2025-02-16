import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { WebsocketProvider } from "@/context/WebsocketContext";
import { cn } from "@/lib/utils";

const lato = Lato({
    variable: "--font-lato",
    subsets: ["latin"],
    weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
    title: "Trie View",
    description: "Trie and Radix View Application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn("antialiased", lato.className)}>
                <Navbar />
                <WebsocketProvider>
                    <main>{children}</main>
                </WebsocketProvider>
            </body>
        </html>
    );
}
