import { db } from "@/lib/firebase";
import { TKeranjang } from "@/types/keranjang";
import { TStokUpdate } from "@/types/stok";
import { TTransaksiCreate } from "@/types/transaksi";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

export async function createTransaksi(
    perusahaanId: string,
    keranjang: TKeranjang[],
    kode: string,
    hari: string,
    tanggal: string,
    bulan: string,
    tahun: number
) {
    for (const item of keranjang) {
        const data: TTransaksiCreate = {
            perusahaanId,
            stokId: item.stokId,
            nama: item.nama,
            harga: item.harga,
            jumlah: item.jumlah,
            gambar: item.gambar || null,
            hari,
            tanggal,
            bulan,
            tahun: tahun.toString(),
            kode,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        };
        await addDoc(
            collection(db, "perusahaan", perusahaanId, "transaksi"),
            data
        );
        const stokRef = doc(
            db,
            "perusahaan",
            perusahaanId,
            "stok",
            item.stokId
        );
        const stokSnap = await getDoc(stokRef);

        if (stokSnap.exists()) {
            const stokData: TStokUpdate = {
                stok_sisa: stokSnap.data().stok_sisa,
                stok_terjual: stokSnap.data().stok_terjual,
            };
            const stokTerjual = (stokData.stok_terjual || 0) + item.jumlah;
            const stokSisa = (stokData.stok_sisa || 0) - item.jumlah;

            await updateDoc(stokRef, {
                stok_terjual: stokTerjual,
                stok_sisa: Math.max(stokSisa, 0),
                updated_at: serverTimestamp(),
            });
        }
    }

    return kode;
}
