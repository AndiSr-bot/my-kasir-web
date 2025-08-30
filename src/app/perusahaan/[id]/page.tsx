/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Navbar from "@/components/Navbar";
import {
    getPerusahaan,
    updatePerusahaan,
} from "@/repositories/perusahaan_repository";
import { TPerusahaan, TPerusahaanUpdate } from "@/types/perusahaan";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";

export default function PerusahaanDetailPage() {
    const params = useParams();
    const { id } = params;

    const [data, setData] = useState<TPerusahaan | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register, handleSubmit, reset } = useForm<TPerusahaanUpdate>();

    const fetchData = async () => {
        if (!id) return;
        const perusahaan = await getPerusahaan(id as string);
        setData(perusahaan);
        reset(perusahaan || {});
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const onSubmit = async (formData: TPerusahaanUpdate) => {
        if (!id) return;
        await updatePerusahaan(formData, id as string);
        fetchData();
        setIsModalOpen(false);
    };

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>Perusahaan tidak ditemukan</p>;

    return (
        <>
            <Navbar
                title="Detail Perusahaan"
                breadcrumbs={["Dashboard", "Perusahaan", data.nama]}
            />

            <div className="mx-auto mt-5 p-6 rounded-2xl shadow-lg bg-white max-w-2xl relative">
                {/* Tombol Edit */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute top-4 right-4 hover:text-blue-600 cursor-pointer">
                    <FiEdit size={20} />
                </button>

                <div className="flex items-center gap-6">
                    <Image
                        src={data.logo || "/default-logo.png"}
                        alt="Logo"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-lg border"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{data.nama}</h1>
                        <p>{data.alamat}</p>
                        <p>📞 {data.telepon}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold">Data Lengkap :</h2>
                    <div className="flex justify-between">
                        <p className="font-semibold">Nama</p>
                        <p>{data.nama}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Alamat</p>
                        <p>{data.alamat}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Telepon</p>
                        <p>{data.telepon}</p>
                    </div>
                </div>
            </div>

            {/* Modal Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.25)] z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            Edit Perusahaan
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
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Nama perusahaan"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Alamat
                                </label>
                                <input
                                    {...register("alamat", { required: true })}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Alamat perusahaan"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Telepon
                                </label>
                                <input
                                    {...register("telepon", { required: true })}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Nomor telepon"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-md bg-gray-200 cursor-pointer">
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-blue-600 text-white cursor-pointer">
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
