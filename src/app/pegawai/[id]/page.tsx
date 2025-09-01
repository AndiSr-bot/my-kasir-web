/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Navbar from "@/components/Navbar";
import { getPegawai, updatePegawai } from "@/repositories/pegawai_repository";
import { RolePegawai, TPegawai, TPegawaiUpdate } from "@/types/pegawai";
import { getRoleLabel } from "@/utils/role_label";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";

export default function PegawaiDetailPage() {
    const params = useParams();
    const idParam = params?.id;

    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    const splitedId = id ? id.split("-") : [];
    const perusahaanId = splitedId?.[0];
    const pegawaiId = splitedId?.[1];

    const [data, setData] = useState<TPegawai | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register, handleSubmit, reset } = useForm<TPegawaiUpdate>();

    const fetchData = async () => {
        if (!perusahaanId || !pegawaiId) return;
        const pegawai = await getPegawai(pegawaiId, perusahaanId);
        setData(pegawai);
        reset(pegawai || {});
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [perusahaanId, pegawaiId]);

    const onSubmit = async (formData: TPegawaiUpdate) => {
        if (!perusahaanId || !pegawaiId) return;
        await updatePegawai(formData, pegawaiId);
        fetchData();
        setIsModalOpen(false);
    };

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>Pegawai tidak ditemukan</p>;

    return (
        <>
            <Navbar
                title="Detail Pegawai"
                breadcrumbs={["Dashboard", "Pegawai", data.nama]}
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
                        src={data.foto || "/default-avatar.png"}
                        alt="Foto Pegawai"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full border"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{data.nama}</h1>
                        <p>{data.jabatan}</p>
                        <p className="text-sm text-gray-600">{data.email}</p>
                        <p>📞 {data.no_hp}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold">Data Lengkap :</h2>
                    <div className="flex justify-between">
                        <p className="font-semibold">Nama</p>
                        <p>{data.nama}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Jabatan</p>
                        <p>{data.jabatan}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Role</p>
                        <p>{getRoleLabel(data.role)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">No HP</p>
                        <p>{data.no_hp}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Email</p>
                        <p>{data.email}</p>
                    </div>
                </div>
            </div>

            {/* Modal Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.25)] z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            Edit Pegawai
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
                                    className="w-full border rounded-md px-3 py-2"
                                    placeholder="Nama pegawai"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Jabatan
                                </label>
                                <input
                                    {...register("jabatan", { required: true })}
                                    className="w-full border rounded-md px-3 py-2"
                                    placeholder="Jabatan"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Role
                                </label>
                                <select
                                    {...register("role", { required: true })}
                                    className="w-full border rounded-md h-10 px-3 py-2">
                                    <option value={RolePegawai.ADMIN}>
                                        {getRoleLabel(RolePegawai.ADMIN)}
                                    </option>
                                    <option
                                        value={RolePegawai.ADMIN_PERUSAHAAN}>
                                        {getRoleLabel(
                                            RolePegawai.ADMIN_PERUSAHAAN
                                        )}
                                    </option>
                                    <option value={RolePegawai.STAFF}>
                                        {getRoleLabel(RolePegawai.STAFF)}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    No HP
                                </label>
                                <input
                                    {...register("no_hp", { required: true })}
                                    className="w-full border rounded-md px-3 py-2"
                                    placeholder="Nomor HP"
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
