/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Navbar from "@/components/Navbar";
import { getStokById, updateStok } from "@/repositories/stok_repository";
import { TRestock, TStok, TStokUpdate } from "@/types/stok";
import { serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";

export default function StokDetailPage() {
    const params = useParams();
    const idParam = params?.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    const splitedId = id ? id.split("-") : [];
    const perusahaanId = splitedId?.[0];
    const stokId = splitedId?.[1];

    const [data, setData] = useState<TStok | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRestockModal, setIsRestockModal] = useState(false);
    const [hargaBeli, setHargaBeli] = useState<string>("");
    const [stokAwal, setStokAwal] = useState<string>("");

    const { register, handleSubmit, reset } = useForm<TStokUpdate>();

    const fetchData = async () => {
        if (!perusahaanId || !stokId) return;
        const stok = await getStokById(perusahaanId, stokId);
        setData(stok);
        reset(stok || {});
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [perusahaanId, stokId]);

    const onEdit = async (formData: TStokUpdate) => {
        if (!perusahaanId || !stokId) return;
        await updateStok(perusahaanId, stokId, formData);
        fetchData();
        setIsModalOpen(false);
    };
    const onRestock = async (formData: TStokUpdate) => {
        if (!perusahaanId || !stokId) return;
        const now = new Date();
        const tahun = now.getFullYear();
        const bulan = String(now.getMonth() + 1).padStart(2, "0");
        const tanggal = String(now.getDate()).padStart(2, "0");
        const dataRestoks: TRestock[] = data?.restocks || [];
        dataRestoks.push({
            harga_beli: Number(hargaBeli),
            jumlah: Number(stokAwal),
            tanggal: `${tanggal}/${bulan}/${tahun}`,
        });
        await updateStok(perusahaanId, stokId, {
            harga: Number(formData.harga),
            stok_awal: Number(formData.stok_awal) + Number(stokAwal),
            stok_sisa: Number(formData.stok_sisa) + Number(stokAwal),
            restocks: dataRestoks,
            restocked_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });
        setHargaBeli("");
        setStokAwal("");
        fetchData();
        setIsRestockModal(false);
    };

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>Produk tidak ditemukan</p>;

    return (
        <div className="p-6">
            <Navbar
                title="Detail Stok"
                breadcrumbs={["Dashboard", "Stok", data.nama]}
            />

            <div className="mx-auto mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6 ">
                <div className="p-6 rounded-2xl shadow-lg bg-white relative">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="absolute top-4 right-4 hover:text-blue-600 cursor-pointer">
                        <FiEdit size={20} />
                    </button>

                    <div className="flex items-center gap-6">
                        <Image
                            src={"/default-image.png"}
                            alt="Foto Produk"
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div>
                            <h1 className="text-2xl font-bold">{data.nama}</h1>
                            <p>Barcode: {data.no_barcode}</p>
                            <p className="text-sm text-gray-600 font-semibold">
                                Harga Jual: Rp {data.harga.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
                            <p className="font-semibold">Stok Awal</p>
                            <p>{data.stok_awal}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
                            <p className="font-semibold">Stok Terjual</p>
                            <p>{data.stok_terjual}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
                            <p className="font-semibold">Stok Sisa</p>
                            <p>{data.stok_sisa}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl shadow-lg bg-white relative">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            Riwayat Restock
                        </h2>
                        <button
                            onClick={() => setIsRestockModal(true)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md">
                            + Restock
                        </button>
                    </div>
                    <table className="w-full text-sm border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Tanggal</th>
                                <th className="p-2 border">Jumlah</th>
                                <th className="p-2 border">Harga Beli</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.restocks?.map((r, idx) => (
                                <tr key={idx} className="text-center">
                                    <td className="p-2 border">{r.tanggal}</td>
                                    <td className="p-2 border">{r.jumlah}</td>
                                    <td className="p-2 border">
                                        Rp {r.harga_beli.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.25)] z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            Edit Produk
                        </h2>
                        <form
                            onSubmit={handleSubmit(onEdit)}
                            className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">
                                    Nama Produk
                                </label>
                                <input
                                    {...register("nama", { required: true })}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Harga Jual
                                </label>
                                <input
                                    type="number"
                                    {...register("harga", { required: true })}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-md bg-gray-200">
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-blue-600 text-white">
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isRestockModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.25)] z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            Tambah Restock
                        </h2>
                        <form
                            className="space-y-4"
                            onSubmit={handleSubmit(onRestock)}>
                            <div>
                                <label className="block text-sm font-medium">
                                    Jumlah
                                </label>
                                <input
                                    value={stokAwal}
                                    onChange={(e) =>
                                        setStokAwal(e.target.value)
                                    }
                                    type="number"
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Harga Beli
                                </label>
                                <input
                                    value={hargaBeli}
                                    onChange={(e) =>
                                        setHargaBeli(e.target.value)
                                    }
                                    type="number"
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Harga Jual
                                </label>
                                <input
                                    {...register("harga", { required: true })}
                                    type="number"
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsRestockModal(false)}
                                    className="px-4 py-2 rounded-md bg-gray-200">
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-blue-600 text-white">
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
