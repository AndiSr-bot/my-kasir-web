"use client";
import Navbar from "@/components/Navbar";
import { getAllPerusahaan } from "@/repositories/perusahaan_repository";
import { TPerusahaan } from "@/types/perusahaan";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PerusahaanListPage() {
    const [data, setData] = useState<TPerusahaan[]>([]);
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
        const list = await getAllPerusahaan();
        setData(list);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <Navbar
                title="Perusahaan"
                breadcrumbs={["Dashboard", "Perusahaan"]}
            />
            <div className="mx-auto mt-5 p-6 rounded-2xl shadow-lg bg-white">
                <h1 className="text-2xl font-bold mb-6 ">Daftar Perusahaan</h1>

                <table className="min-w-full border border-gray-100">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-4 text-left  font-semibold">
                                Logo
                            </th>
                            <th className="px-4 py-4 text-left  font-semibold">
                                Nama
                            </th>
                            <th className="px-4 py-4 text-left  font-semibold">
                                Alamat
                            </th>
                            <th className="px-4 py-4 text-left  font-semibold">
                                Telepon
                            </th>
                            <th className="px-4 py-4 text-left  font-semibold">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr
                                key={item.id}
                                className={`${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                } hover:bg-blue-50 transition-colors`}>
                                <td className="px-4 py-2">
                                    <Image
                                        src={item.logo || "/default-logo.png"}
                                        alt="Logo"
                                        className="w-12 h-12 rounded-lg border"
                                        width={48}
                                        height={48}
                                    />
                                </td>
                                <td className="px-4 py-2 font-medium ">
                                    {item.nama}
                                </td>
                                <td className="px-4 py-2 ">{item.alamat}</td>
                                <td className="px-4 py-2 ">{item.telepon}</td>
                                <td className="px-4 py-2">
                                    <Link href={`/perusahaan/${item.id}`}>
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                                            Detail
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
