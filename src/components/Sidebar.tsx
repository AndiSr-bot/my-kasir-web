"use client";
import {
    Box,
    Building2,
    Clock,
    Home,
    Menu,
    ShoppingCart,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { version } from "../../package.json";
const menus = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Perusahaan", path: "/perusahaan", icon: Building2 },
    { name: "Pegawai", path: "/pegawai", icon: Users },
    { name: "Stok", path: "/stok", icon: Box },
    { name: "Transaksi", path: "/transaksi", icon: ShoppingCart },
    { name: "Riwayat", path: "/riwayat", icon: Clock },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    useEffect(() => {
        if (pathname === "/kasir") {
            setCollapsed(true);
        }
    }, [pathname]);
    return (
        <aside
            className={`${
                collapsed ? "w-20" : "w-64"
            } bg-white shadow-lg min-h-screen p-4 transition-all duration-300`}>
            <div
                className={`flex items-center ${
                    collapsed ? "justify-center" : "justify-between"
                } `}>
                {!collapsed && (
                    <h2 className="text-xl font-bold text-blue-600">
                        Kasir Web
                    </h2>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded hover:bg-gray-100 center cursor-pointer">
                    <Menu size={20} />
                </button>
            </div>

            <div className="flex items-center mb-4">
                {!collapsed && (
                    <>
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-xs text-gray-400">
                            Versi {version}
                        </span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </>
                )}
            </div>

            <nav className="flex flex-col gap-2">
                {menus.map(({ name, path, icon: Icon }) => {
                    const cleanPath = path.replace("/", "");

                    const pathSegments = pathname.split("/");

                    const isActive =
                        path !== "/"
                            ? pathSegments.includes(cleanPath)
                            : pathname === path;
                    return (
                        <Link
                            key={path}
                            href={path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${
                                isActive
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-blue-100"
                            }`}>
                            <Icon size={20} />
                            {!collapsed && <span>{name}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
