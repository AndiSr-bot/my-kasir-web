"use client";
import Navbar from "@/components/Navbar";
import {
    createPerusahaan,
    getAllPerusahaan,
} from "@/repositories/perusahaan_repository";
import { TPerusahaan } from "@/types/perusahaan";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
    nama: string;
    alamat: string;
    telepon: string;
    logo?: FileList;
};

export default function PerusahaanListPage() {
    const [data, setData] = useState<TPerusahaan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const fetchData = async () => {
        const list = await getAllPerusahaan();
        setData(list);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormInputs>();

    const onSubmit = async (formData: FormInputs) => {
        const logoUrl = formData.logo?.[0]
            ? URL.createObjectURL(formData.logo[0])
            : "/default-logo.png";

        await createPerusahaan({
            nama: formData.nama,
            alamat: formData.alamat,
            telepon: formData.telepon,
            logo: logoUrl,
        });

        setIsOpen(false);
        reset();
        fetchData();
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <Navbar
                title="Perusahaan"
                breadcrumbs={["Dashboard", "Perusahaan"]}
            />

            <div className="mx-auto mt-5 p-6 rounded-2xl shadow-lg bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Daftar Perusahaan</h1>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer">
                        + Tambah Perusahaan
                    </button>
                </div>

                <table className="min-w-full border border-gray-100">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-4 text-left font-semibold">
                                Logo
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
                                Nama
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
                                Alamat
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
                                Telepon
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
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
                                <td className="px-4 py-2 font-medium">
                                    {item.nama}
                                </td>
                                <td className="px-4 py-2">{item.alamat}</td>
                                <td className="px-4 py-2">{item.telepon}</td>
                                <td className="px-4 py-2">
                                    <Link href={`/perusahaan/${item.id}`}>
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition cursor-pointer">
                                            Detail
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.25)]  bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
                        <h2 className="text-xl font-bold mb-4">
                            Tambah Perusahaan
                        </h2>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">
                                    Nama
                                </label>
                                <input
                                    {...register("nama", { required: true })}
                                    className="w-full border p-2 rounded"
                                    placeholder="Nama perusahaan"
                                />
                                {errors.nama && (
                                    <p className="text-red-500 text-sm">
                                        Nama wajib diisi
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                    Alamat
                                </label>
                                <input
                                    {...register("alamat", { required: true })}
                                    className="w-full border p-2 rounded"
                                    placeholder="Alamat perusahaan"
                                />
                                {errors.alamat && (
                                    <p className="text-red-500 text-sm">
                                        Alamat wajib diisi
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                    Telepon
                                </label>
                                <input
                                    {...register("telepon", { required: true })}
                                    className="w-full border p-2 rounded"
                                    placeholder="Telepon perusahaan"
                                />
                                {errors.telepon && (
                                    <p className="text-red-500 text-sm">
                                        Telepon wajib diisi
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 rounded-md bg-gray-200 cursor-pointer">
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer">
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
