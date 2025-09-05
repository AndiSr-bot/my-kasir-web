/* eslint-disable @typescript-eslint/no-explicit-any */
export enum EStatusHutang {
    BELUM_LUNAS = "belum_lunas",
    LUNAS = "lunas",
}
export interface THutang {
    id?: string;
    tanggal: string;
    bulan: string;
    tahun: number;
    tanggal_lengkap: string;
    nominal: number;
    status: EStatusHutang;
    transaksiId: string;
    created_at: any;
    updated_at: any;
}
