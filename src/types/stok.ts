export interface TStok {
    id?: string;
    perusahaanId: string;
    nama: string;
    harga: number;
    stok_awal: number;
    stok_terjual: number;
    stok_sisa: number;
    no_barcode: string;
    gambar?: string | null;
    restocks?: TRestock[];
    created_at?: string;
    updated_at?: string;
    restocked_at?: string;
}
export interface TStokCreate {
    perusahaanId: string;
    nama: string;
    harga: number;
    stok_awal: number;
    stok_terjual: number;
    stok_sisa: number;
    no_barcode: string;
    gambar?: string | null;
    created_at: string;
    updated_at: string;
    restocked_at: string;
    restocks: TRestock[];
}
export interface TStokUpdate {
    nama?: string;
    harga?: number;
    stok_awal?: number;
    stok_sisa?: number;
    stok_terjual?: number;
    gambar?: string | null;
    updated_at?: string;
    restocked_at?: string;
    restocks?: TRestock[];
}
export interface TRestock {
    tanggal: string;
    jumlah: number;
    harga_beli: number;
}
