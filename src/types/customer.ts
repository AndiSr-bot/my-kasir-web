export enum ECustomerStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

export interface TCustomer {
    id?: string;
    nama: string;
    no_hp: string;
    alamat: string;
    join_date: string;
    status: ECustomerStatus;
}
