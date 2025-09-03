export interface TTransaksi {
    id?: string;
    perusahaanId: string;
    stokId: string;
    nama: string;
    harga: number;
    jumlah: number;
    gambar?: string | null;
    hari: string;
    tanggal: string;
    bulan: string;
    tahun: string;
    kode: string;
    created_at?: string;
    updated_at?: string;
}
export interface TPembukuan {
    id: string;
    tanggal: string;
    jenis: string;
    jumlah: number;
    harga: number;
    nominal: number;
    keterangan: string;
}
export interface TTransaksiCreate {
    perusahaanId: string;
    stokId: string;
    nama: string;
    harga: number;
    jumlah: number;
    gambar?: string | null;
    hari: string;
    tanggal: string;
    bulan: string;
    tahun: string;
    kode: string;
    created_at: string;
    updated_at: string;
}

export interface TTransaksiGrouped {
    namaPerusahaan: string;
    tanggal: any;
    kode: string;
    total: number;
    transaksi: TTransaksi[];
}
