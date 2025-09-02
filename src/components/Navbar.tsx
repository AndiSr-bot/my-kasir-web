"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import UserMenu from "./UserMenu";

interface NavbarProps {
    title: string;
    breadcrumbs?: string[];
}

export default function Navbar({ title, breadcrumbs = [] }: NavbarProps) {
    const router = useRouter();

    return (
        <div className="w-full bg-white px-6 py-3 flex flex-col gap-2 shadow-sm rounded-2xl">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-400">
                        {breadcrumbs.join(" / ")}
                    </div>

                    <div className="flex items-center gap-2">
                        {breadcrumbs.length > 2 && (
                            <button
                                onClick={() => router.back()}
                                className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        )}
                        <h1 className="text-xl font-bold text-gray-700">
                            {title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <UserMenu />
                </div>
            </div>
        </div>
    );
}
