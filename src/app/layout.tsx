import Sidebar from "@/components/Sidebar";
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
                {/* Sidebar */}
                <Sidebar />

                {/* Konten */}
                <main className="flex-1 p-6">{children}</main>
            </body>
        </html>
    );
}
