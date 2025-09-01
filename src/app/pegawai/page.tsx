/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Navbar from "@/components/Navbar";
import {
    createPegawai,
    getAllPegawai,
} from "@/repositories/pegawai_repository";
import { getAllPerusahaan } from "@/repositories/perusahaan_repository";
import { RolePegawai, TPegawai, TPegawaiCreate } from "@/types/pegawai";
import { TPerusahaan } from "@/types/perusahaan";
import { getRoleLabel } from "@/utils/role_label";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function PegawaiListPage() {
    const [data, setData] = useState<TPegawai[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const [perusahaanList, setPerusahaanList] = useState<TPerusahaan[]>([]);
    const [selectedPerusahaan, setSelectedPerusahaan] = useState<string>("");

    const fetchPegawai = async (perusahaanId: string) => {
        setLoading(true);
        const list = await getAllPegawai(perusahaanId);
        setData(list);
        setLoading(false);
    };

    const fetchPerusahaan = async () => {
        const list = await getAllPerusahaan();
        setPerusahaanList(list);
        if (list.length > 0) {
            setSelectedPerusahaan(list[0].id!);
            fetchPegawai(list[0].id!);
        }
    };

    useEffect(() => {
        fetchPerusahaan();
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TPegawaiCreate>();

    const onSubmit = async (formData: TPegawaiCreate) => {
        if (!selectedPerusahaan) return;

        const fotoUrl = formData.foto ? formData.foto : "/default-avatar.png";

        await createPegawai(selectedPerusahaan, {
            perusahaanId: selectedPerusahaan,
            nama: formData.nama,
            jabatan: formData.jabatan,
            role: formData.role,
            no_hp: formData.no_hp,
            email: formData.email,
            foto: fotoUrl || null,
            auth_uid: "",
        });

        setIsOpen(false);
        reset();
        fetchPegawai(selectedPerusahaan);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <Navbar title="Pegawai" breadcrumbs={["Dashboard", "Pegawai"]} />

            <div className="mx-auto mt-5 p-6 rounded-2xl shadow-lg bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Daftar Pegawai</h1>
                    <div className="flex gap-4">
                        <select
                            value={selectedPerusahaan}
                            onChange={(e) => {
                                setSelectedPerusahaan(e.target.value);
                                fetchPegawai(e.target.value);
                            }}
                            className="border p-2 rounded-md h-10">
                            {perusahaanList.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nama}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => setIsOpen(true)}
                            disabled={!selectedPerusahaan}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer disabled:opacity-50">
                            + Tambah Pegawai
                        </button>
                    </div>
                </div>

                <table className="min-w-full border border-gray-100">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-4 text-left font-semibold">
                                Foto
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
                                Nama
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
                                Jabatan
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
                                Role
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
                                No HP
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
                                Email
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
                                        src={item.foto || "/default-avatar.png"}
                                        alt="Foto Pegawai"
                                        className="w-12 h-12 rounded-full border"
                                        width={48}
                                        height={48}
                                    />
                                </td>
                                <td className="px-4 py-2 font-medium">
                                    {item.nama}
                                </td>
                                <td className="px-4 py-2">{item.jabatan}</td>
                                <td className="px-4 py-2">
                                    {getRoleLabel(item.role)}
                                </td>
                                <td className="px-4 py-2">{item.no_hp}</td>
                                <td className="px-4 py-2">{item.email}</td>
                                <td className="px-4 py-2">
                                    <Link
                                        href={`/pegawai/${selectedPerusahaan}-${item.id}`}>
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

            {/* Modal Tambah Pegawai */}
            {isOpen && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.25)] flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-[450px]">
                        <h2 className="text-xl font-bold mb-4">
                            Tambah Pegawai
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
                                    className="w-full border p-2 rounded-md"
                                    placeholder="Nama pegawai"
                                />
                                {errors.nama && (
                                    <p className="text-red-500 text-sm">
                                        Nama wajib diisi
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                    Jabatan
                                </label>
                                <input
                                    {...register("jabatan", { required: true })}
                                    className="w-full border p-2 rounded-md h-10"
                                    placeholder="Jabatan pegawai"
                                />
                                {errors.jabatan && (
                                    <p className="text-red-500 text-sm">
                                        Jabatan wajib diisi
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                    Role
                                </label>
                                <select
                                    {...register("role", { required: true })}
                                    className="w-full border p-2 rounded-md h-10">
                                    <option value="">-- Pilih Role --</option>
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
                                {errors.role && (
                                    <p className="text-red-500 text-sm">
                                        Role wajib dipilih
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                    No HP
                                </label>
                                <input
                                    {...register("no_hp", { required: true })}
                                    className="w-full border p-2 rounded-md h-10"
                                    placeholder="Nomor HP"
                                />
                                {errors.no_hp && (
                                    <p className="text-red-500 text-sm">
                                        Nomor HP wajib diisi
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    {...register("email", { required: true })}
                                    className="w-full border p-2 rounded-md h-10"
                                    placeholder="Email pegawai"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">
                                        Email wajib diisi
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                    Foto (opsional)
                                </label>
                                <input
                                    type="text"
                                    {...register("foto")}
                                    className="w-full border p-2 rounded-md h-10"
                                    placeholder="URL Foto (opsional)"
                                />
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
        </>
    );
}
