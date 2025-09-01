import { db } from "@/lib/firebase";
import { TStok, TStokCreate, TStokUpdate } from "@/types/stok";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

export async function getAllStok(perusahaanId: string): Promise<TStok[]> {
    const q = collection(db, "perusahaan", perusahaanId, "stok");
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
    })) as TStok[];
}

export async function getStokById(
    perusahaanId: string,
    id: string
): Promise<TStok | null> {
    const ref = doc(db, "perusahaan", perusahaanId, "stok", id);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as TStok;
}

export async function getStokByBarcode(
    perusahaanId: string,
    no_barcode: string
): Promise<TStok | null> {
    const q = query(
        collection(db, "perusahaan", perusahaanId, "stok"),
        where("no_barcode", "==", no_barcode)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as TStok;
}

export async function createStok(
    perusahaanId: string,
    data: TStokCreate
): Promise<string> {
    const ref = collection(db, "perusahaan", perusahaanId, "stok");
    const docRef = await addDoc(ref, data);
    return docRef.id;
}

export async function updateStok(
    perusahaanId: string,
    id: string,
    data: TStokUpdate
) {
    const ref = doc(db, "perusahaan", perusahaanId, "stok", id);
    await updateDoc(ref, { ...data });
}

export async function deleteStok(perusahaanId: string, id: string) {
    const ref = doc(db, "perusahaan", perusahaanId, "stok", id);
    await deleteDoc(ref);
}
