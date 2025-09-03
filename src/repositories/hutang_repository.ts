import { db } from "@/lib/firebase";
import { EStatusHutang, THutang } from "@/types/hutang";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

export const createHutang = async (
    perusahaanId: string,
    customerId: string,
    hutang: Omit<THutang, "id">
): Promise<string> => {
    const ref = collection(
        db,
        "perusahaan",
        perusahaanId,
        "customer",
        customerId,
        "hutang"
    );
    const docRef = await addDoc(ref, {
        ...hutang,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
    });
    return docRef.id;
};

export const getHutangByCustomer = async (
    perusahaanId: string,
    customerId: string
): Promise<THutang[]> => {
    const ref = collection(
        db,
        "perusahaan",
        perusahaanId,
        "customer",
        customerId,
        "hutang"
    );
    const snap = await getDocs(ref);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as THutang));
};

export const updateHutangStatus = async (
    perusahaanId: string,
    customerId: string,
    hutangId: string,
    status: EStatusHutang
): Promise<void> => {
    const ref = doc(
        db,
        "perusahaan",
        perusahaanId,
        "customer",
        customerId,
        "hutang",
        hutangId
    );
    await updateDoc(ref, {
        status,
        updated_at: serverTimestamp(),
    });
};
