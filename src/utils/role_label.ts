import { RolePegawai } from "@/types/pegawai";

export const roleLabels: Record<RolePegawai, string> = {
    [RolePegawai.ADMIN]: "Admin",
    [RolePegawai.ADMIN_PERUSAHAAN]: "Admin Perusahaan",
    [RolePegawai.STAFF]: "Staff",
};

export function getRoleLabel(role: RolePegawai): string {
    return roleLabels[role] || role;
}
