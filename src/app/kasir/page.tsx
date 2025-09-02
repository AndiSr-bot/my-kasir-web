"use client";

import { getAllPerusahaan } from "@/repositories/perusahaan_repository";
import { searchStok } from "@/repositories/stok_repository"; // ganti sesuai implementasi kamu
import { createTransaksi } from "@/repositories/transaksi_repository";
import { TKeranjang } from "@/types/keranjang";
import { TPerusahaan } from "@/types/perusahaan";
import { TStok } from "@/types/stok";
import { namaBulan, namaHari } from "@/utils/constant";
import { useEffect, useState } from "react";

export default function KasirPage() {
    const [perusahaanList, setPerusahaanList] = useState<TPerusahaan[]>([]);
    const [selectedPerusahaan, setSelectedPerusahaan] = useState<string>("");
    const [keyword, setKeyword] = useState<string>("");
    const [kode, setKode] = useState<string>("");
    const [cart, setCart] = useState<TKeranjang[]>([]);
    const [searchResults, setSearchResults] = useState<TStok[]>([]);
    const [hari, setHari] = useState<string>("");
    const [tanggal, setTanggal] = useState<string>("");
    const [bulan, setBulan] = useState<string>("");
    const [tahun, setTahun] = useState<number>(0);
    const [jumlahBayar, setJumlahBayar] = useState<string>("");

    const getDateNow = () => {
        const now = new Date();
        setHari(namaHari[now.getDay()]);
        setTanggal(String(now.getDate()).padStart(2, "0"));
        setBulan(namaBulan[now.getMonth()]);
        setTahun(now.getFullYear());
    };
    const generateKodeTransaksi = () => {
        const now = new Date();
        const tahun = now.getFullYear();
        const bulan = String(now.getMonth() + 1).padStart(2, "0");
        const tanggal = String(now.getDate()).padStart(2, "0");
        const random = Math.floor(1000 + Math.random() * 9000);
        setKode(`TR-${tahun}${bulan}${tanggal}${random}`);
    };
    // ambil daftar perusahaan
    const fetchPerusahaan = async () => {
        const list = await getAllPerusahaan();
        setPerusahaanList(list);
        if (list.length > 0) setSelectedPerusahaan(list[0].id!);
    };

    useEffect(() => {
        fetchPerusahaan();
        generateKodeTransaksi();
        getDateNow();
    }, []);

    // search produk berdasarkan keyword
    const handleSearchProduk = async () => {
        if (!keyword || !selectedPerusahaan) return;
        const results = await searchStok(selectedPerusahaan, keyword);
        setSearchResults(results);
    };

    // tambah produk dari hasil search ke keranjang
    const handleAddProduk = (stok: TStok) => {
        setCart((prev) => {
            const exist = prev.find((item) => item.stokId === stok.id);
            if (exist) {
                return prev.map((item) =>
                    item.stokId === stok.id
                        ? { ...item, jumlah: item.jumlah + 1 }
                        : item
                );
            }
            const newItem: TKeranjang = {
                perusahaanId: selectedPerusahaan,
                stokId: stok.id!,
                nama: stok.nama,
                harga: stok.harga,
                jumlah: 1,
                gambar: stok.gambar || null,
                stok: stok,
            };
            return [...prev, newItem];
        });
        setKeyword("");
        setSearchResults([]);
    };

    // hapus item dari keranjang
    const handleRemove = (stokId: string) => {
        setCart(cart.filter((item) => item.stokId !== stokId));
    };

    // reset keranjang
    const handleReset = () => {
        generateKodeTransaksi();
        setCart([]);
        setJumlahBayar("");
    };

    // update jumlah beli
    const handleUpdateJumlah = (stokId: string, jumlah: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.stokId === stokId ? { ...item, jumlah } : item
            )
        );
    };

    const handleBayar = async () => {
        if (
            cart.length === 0 ||
            !selectedPerusahaan ||
            !jumlahBayar ||
            !kode ||
            !hari ||
            !tanggal ||
            !bulan ||
            !tahun
        ) {
            alert("Keranjang kosong atau jumlah bayar belum diisi.");
        }
        await createTransaksi(
            selectedPerusahaan,
            cart,
            kode,
            hari,
            tanggal,
            bulan,
            tahun
        );
    };
    const total = cart.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
    const totalBayar = parseInt(jumlahBayar || "0") || 0;
    const kembalian = totalBayar > 0 && total > 0 ? totalBayar - total : 0;
    const hutang = totalBayar > 0 && total > 0 ? total - totalBayar : 0;

    return (
        <>
            <div className="mx-auto p-6 shadow-lg bg-white h-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Pembelian</h1>
                    <div className="flex gap-4">
                        <select
                            value={selectedPerusahaan}
                            onChange={(e) =>
                                setSelectedPerusahaan(e.target.value)
                            }
                            className="border p-2 rounded-md h-10">
                            {perusahaanList.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nama}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleReset}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition cursor-pointer">
                            Reset Keranjang
                        </button>
                    </div>
                </div>

                <div className="mb-4 text-lg">
                    <div className="flex gap-2 w-1/2 items-center justify-end ml-auto">
                        <div className="font-semibold">Tanggal :</div>
                        <span className="font-semibold rounded-md bg-gray-100 py-2 px-4 w-1/3">
                            {hari}, {tanggal} {bulan} {tahun}
                        </span>
                    </div>
                </div>
                <div className="mb-4 text-lg">
                    <div className="flex gap-2 w-1/2 items-center justify-end ml-auto">
                        <div className="font-semibold">Kode Transaksi :</div>
                        <span className="font-semibold rounded-md bg-gray-100 py-2 px-4 w-1/3">
                            {kode}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleSearchProduk()
                        }
                        placeholder="Masukan: Kode / Nama Barang"
                        className="w-full border p-2 rounded-md"
                    />
                    <button
                        onClick={handleSearchProduk}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer">
                        Search
                    </button>
                </div>

                {searchResults.length > 0 && (
                    <div className="border rounded-md mb-6 bg-white shadow">
                        {searchResults.map((stok, index) => (
                            <div key={stok.id}>
                                <div
                                    onClick={() => handleAddProduk(stok)}
                                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer">
                                    <span className="font-semibold">
                                        [{stok.no_barcode}]
                                    </span>{" "}
                                    {stok.nama} @
                                    {"Rp " + stok.harga.toLocaleString("id-ID")}
                                </div>
                                {index === searchResults.length - 1 ? null : (
                                    <div className="flex-grow border-t border-gray-300"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <table className="min-w-full border border-gray-100">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left font-semibold">
                                No
                            </th>
                            <th className="px-4 py-2 text-left font-semibold">
                                Barcode
                            </th>
                            <th className="px-4 py-2 text-left font-semibold">
                                Nama Barang
                            </th>
                            <th className="px-4 py-2 text-left font-semibold">
                                Jumlah
                            </th>
                            <th className="px-4 py-2 text-left font-semibold">
                                Harga
                            </th>
                            <th className="px-4 py-2 text-left font-semibold">
                                Total
                            </th>
                            <th className="px-4 py-2 text-left font-semibold">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center py-4 text-gray-500 italic">
                                    Belum ada data
                                </td>
                            </tr>
                        ) : (
                            cart.map((item, i) => (
                                <tr
                                    key={item.stokId}
                                    className={`${
                                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-blue-50`}>
                                    <td className="px-4 py-2">{i + 1}</td>
                                    <td className="px-4 py-2">
                                        {item.stok?.no_barcode}
                                    </td>
                                    <td className="px-4 py-2">{item.nama}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() =>
                                                    handleUpdateJumlah(
                                                        item.stokId,
                                                        Math.max(
                                                            1,
                                                            item.jumlah - 1
                                                        )
                                                    )
                                                }
                                                className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300">
                                                -
                                            </button>
                                            <input
                                                type="text"
                                                value={item.jumlah}
                                                // readOnly
                                                className="w-12 text-center border rounded-md"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleUpdateJumlah(
                                                        item.stokId,
                                                        item.jumlah + 1
                                                    )
                                                }
                                                className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300">
                                                +
                                            </button>
                                        </div>
                                    </td>

                                    <td className="px-4 py-2">
                                        Rp {item.harga.toLocaleString("id-ID")}
                                    </td>
                                    <td className="px-4 py-2">
                                        Rp{" "}
                                        {(
                                            item.harga * item.jumlah
                                        ).toLocaleString("id-ID")}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() =>
                                                handleRemove(item.stokId)
                                            }
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition cursor-pointer">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-6">
                    {/* Baris pertama */}
                    <div>
                        <label className="block font-bold">Total Semua</label>
                        <div className="w-full rounded-md p-2 bg-gray-100">
                            Rp {total.toLocaleString("id-ID")}
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold">Bayar</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Bayar"
                                value={jumlahBayar}
                                onChange={(e) => {
                                    if (cart.length === 0) return;
                                    setJumlahBayar(e.target.value);
                                }}
                                className="flex-1 border rounded-md p-2"
                            />
                        </div>
                    </div>

                    {/* Baris kedua */}
                    <div>
                        <label className="block font-bold">Kembali</label>
                        <div className="w-full  rounded-md p-2 bg-gray-100">
                            Rp {Math.max(kembalian, 0).toLocaleString("id-ID")}
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold">Terhutang</label>
                        <div className="w-full  rounded-md p-2 bg-gray-100">
                            Rp {Math.max(hutang, 0).toLocaleString("id-ID")}
                        </div>
                    </div>
                </div>

                {/* Tombol print di bawah kanan */}
                <div className="mt-5 flex justify-center gap-2">
                    <button
                        onClick={handleBayar}
                        className="bg-green-500 text-white px-4 rounded-md">
                        Bayar
                    </button>
                    <button
                        // onClick={handlePrint}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md">
                        Print Bukti Pembayaran
                    </button>
                </div>
            </div>
        </>
    );
}
