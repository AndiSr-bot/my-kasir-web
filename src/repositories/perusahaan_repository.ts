import { db } from "@/lib/firebase";
import {
    TPerusahaan,
    TPerusahaanCreate,
    TPerusahaanUpdate,
} from "@/types/perusahaan";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from "firebase/firestore";

export async function getAllPerusahaan(): Promise<TPerusahaan[]> {
    const snap = await getDocs(collection(db, "perusahaan"));
    return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as TPerusahaan[];
}

export async function getPerusahaan(id: string): Promise<TPerusahaan | null> {
    const ref = doc(db, "perusahaan", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return { id: snap.id, ...snap.data() } as TPerusahaan;
}

export async function createPerusahaan(
    perusahaan: TPerusahaanCreate
): Promise<void> {
    const dataPerusahaan = { ...perusahaan };
    await addDoc(collection(db, "perusahaan"), dataPerusahaan);
}

export async function updatePerusahaan(
    perusahaan: TPerusahaanUpdate,
    id: string
): Promise<void> {
    const docRef = doc(db, "perusahaan", String(id));
    const dataPerusahaan = { ...perusahaan };
    await updateDoc(docRef, { ...dataPerusahaan });
}
