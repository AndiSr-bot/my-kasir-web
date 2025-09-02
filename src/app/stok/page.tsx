/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Navbar from "@/components/Navbar";
import { getAllPerusahaan } from "@/repositories/perusahaan_repository";
import {
    createStok,
    getAllStok,
    getStokByBarcode,
    updateStok,
} from "@/repositories/stok_repository";
import { TPerusahaan } from "@/types/perusahaan";
import { TRestock, TStok, TStokCreate, TStokUpdate } from "@/types/stok";
import { serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function StokListPage() {
    const [data, setData] = useState<TStok[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [perusahaanList, setPerusahaanList] = useState<TPerusahaan[]>([]);
    const [selectedPerusahaan, setSelectedPerusahaan] = useState<string>("");
    const [hargaBeli, setHargaBeli] = useState<string>("");
    const fetchPerusahaan = async () => {
        const list = await getAllPerusahaan();
        setPerusahaanList(list);
        if (list.length > 0) {
            setSelectedPerusahaan(list[0].id!);
            fetchData(list[0].id!);
        }
    };

    useEffect(() => {
        fetchPerusahaan();
    }, []);
    const fetchData = async (perusahaanId: string) => {
        const list = await getAllStok(perusahaanId);
        setData(list);
        setLoading(false);
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TStokCreate>();

    const onSubmit = async (formData: TStokCreate) => {
        const now = new Date();
        const tahun = now.getFullYear();
        const bulan = String(now.getMonth() + 1).padStart(2, "0");
        const tanggal = String(now.getDate()).padStart(2, "0");
        const stokByBarcode = await getStokByBarcode(
            selectedPerusahaan,
            formData.no_barcode
        );
        if (stokByBarcode) {
            const dataRestoks: TRestock[] = stokByBarcode?.restocks || [];
            dataRestoks.push({
                harga_beli: Number(hargaBeli),
                jumlah: formData.stok_awal,
                tanggal: `${tanggal}/${bulan}/${tahun}`,
            });
            const payload: TStokUpdate = {
                nama: formData.nama,
                harga: Number(formData.harga),
                stok_awal: stokByBarcode.stok_awal + formData.stok_awal,
                stok_sisa: stokByBarcode.stok_sisa + formData.stok_awal,
                gambar: formData.gambar || null,
                updated_at: serverTimestamp(),
                restocked_at: serverTimestamp(),
                restocks: dataRestoks,
            };
            await updateStok(selectedPerusahaan, stokByBarcode.id!, payload);
        } else {
            const payload: TStokCreate = {
                perusahaanId: selectedPerusahaan,
                nama: formData.nama,
                harga: Number(formData.harga),
                stok_awal: Number(formData.stok_awal),
                stok_terjual: 0,
                stok_sisa: Number(formData.stok_awal),
                no_barcode: formData.no_barcode,
                gambar: formData.gambar,
                restocks: [
                    {
                        jumlah: Number(formData.stok_awal),
                        harga_beli: Number(hargaBeli),
                        tanggal: `${tanggal}/${bulan}/${tahun}`,
                    },
                ],
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
                restocked_at: serverTimestamp(),
            };

            await createStok(selectedPerusahaan, payload);
        }

        setIsOpen(false);
        reset();
        fetchData(selectedPerusahaan);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <Navbar title="Stok" breadcrumbs={["Dashboard", "Stok"]} />

            <div className="mx-auto mt-5 p-6 rounded-2xl shadow-lg bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Daftar Stok</h1>
                    <div className="flex gap-4">
                        <select
                            value={selectedPerusahaan}
                            onChange={(e) => {
                                setSelectedPerusahaan(e.target.value);
                                fetchData(e.target.value);
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
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer">
                            + Tambah Stok
                        </button>
                    </div>
                </div>

                <table className="min-w-full border border-gray-100">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-4 text-left font-semibold">
                                Nama
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
                                Harga
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
                                Stok Awal
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
                                Terjual
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
                                Sisa
                            </th>
                            <th className="px-4 py-4 text-left font-semibold">
                                Barcode
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
                                <td className="px-4 py-2 font-medium">
                                    {item.nama}
                                </td>
                                <td className="px-4 py-2">{item.harga}</td>
                                <td className="px-4 py-2">{item.stok_awal}</td>
                                <td className="px-4 py-2">
                                    {item.stok_terjual}
                                </td>
                                <td className="px-4 py-2">{item.stok_sisa}</td>
                                <td className="px-4 py-2">{item.no_barcode}</td>
                                <td className="px-4 py-2">
                                    <Link
                                        href={`/stok/${selectedPerusahaan}-${item.id}`}>
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
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.25)] bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
                        <h2 className="text-xl font-bold mb-4">Tambah Stok</h2>
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
                                    placeholder="Nama produk"
                                />
                                {errors.nama && (
                                    <p className="text-red-500 text-sm">
                                        Nama wajib diisi
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                    Harga
                                </label>
                                <input
                                    type="number"
                                    {...register("harga", {
                                        required: true,
                                        valueAsNumber: true,
                                    })}
                                    className="w-full border p-2 rounded"
                                    placeholder="Harga produk"
                                />
                                {errors.harga && (
                                    <p className="text-red-500 text-sm">
                                        Harga wajib diisi
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                    Harga Beli
                                </label>
                                <input
                                    type="number"
                                    value={hargaBeli}
                                    onChange={(e) =>
                                        setHargaBeli(e.target.value)
                                    }
                                    className="w-full border p-2 rounded"
                                    placeholder="Harga Beli"
                                />
                                {errors.harga && (
                                    <p className="text-red-500 text-sm">
                                        Harga wajib diisi
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                    Stok Awal
                                </label>
                                <input
                                    type="number"
                                    {...register("stok_awal", {
                                        required: true,
                                        valueAsNumber: true,
                                    })}
                                    className="w-full border p-2 rounded"
                                    placeholder="Jumlah stok awal"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                    Nomor Barcode
                                </label>
                                <input
                                    {...register("no_barcode", {
                                        required: true,
                                    })}
                                    className="w-full border p-2 rounded"
                                    placeholder="Nomor barcode"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                    Gambar
                                </label>
                                <input
                                    {...register("gambar")}
                                    className="w-full border p-2 rounded"
                                    placeholder="Gambar produk"
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
        </div>
    );
}
