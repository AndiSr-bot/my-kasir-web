import Sidebar from "@/components/Sidebar";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import "./globals.css";

export const metadata = {
    title: "Kasir Web",
    description: "Aplikasi Kasir Versi Web",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <body className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <Link
                    href="/kasir"
                    className="fixed bottom-6 right-6 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg w-20 h-20 hover:bg-blue-700 transition">
                    <ShoppingCart className="w-11 h-11" />
                </Link>

                <main className="flex-1">{children}</main>
            </body>
        </html>
    );
}
