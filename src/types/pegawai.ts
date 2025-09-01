import { TPerusahaan } from "./perusahaan";

export enum RolePegawai {
    ADMIN = "admin",
    ADMIN_PERUSAHAAN = "admin_perusahaan",
    STAFF = "staff",
}

export interface TPegawai {
    id?: string;
    perusahaanId: string;
    nama: string;
    jabatan: string;
    role: RolePegawai;
    no_hp: string;
    email: string;
    foto?: string | null;
    auth_uid: string;
    perusahaan?: TPerusahaan;
}

export interface TPegawaiCreate {
    perusahaanId: string;
    nama: string;
    jabatan: string;
    role: RolePegawai;
    no_hp: string;
    email: string;
    foto?: string | null;
    auth_uid: string;
}

export interface TPegawaiUpdate {
    perusahaanId?: string;
    nama?: string;
    jabatan?: string;
    role?: RolePegawai;
    no_hp?: string;
    foto?: string | null;
}
