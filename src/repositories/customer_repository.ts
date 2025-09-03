import { db } from "@/lib/firebase";
import { TCustomer } from "@/types/customer";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

export async function getAllCustomer(
    perusahaanId: string
): Promise<TCustomer[]> {
    const colRef = collection(db, "perusahaan", perusahaanId, "customer");
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(
        (docSnap) =>
            ({
                id: docSnap.id,
                ...docSnap.data(),
            } as TCustomer)
    );
}

export async function getCustomerById(
    perusahaanId: string,
    id: string
): Promise<TCustomer | null> {
    const docRef = doc(db, "perusahaan", perusahaanId, "customer", id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as TCustomer;
}

export async function createCustomer(
    perusahaanId: string,
    customer: Omit<TCustomer, "id" | "join_date">
): Promise<string> {
    const colRef = collection(db, "perusahaan", perusahaanId, "customer");
    const docRef = await addDoc(colRef, {
        ...customer,
        join_date: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateCustomer(
    perusahaanId: string,
    id: string,
    data: Partial<TCustomer>
): Promise<void> {
    const docRef = doc(db, "perusahaan", perusahaanId, "customer", id);
    await updateDoc(docRef, data);
}

export async function deleteCustomer(
    perusahaanId: string,
    id: string
): Promise<void> {
    const docRef = doc(db, "perusahaan", perusahaanId, "customer", id);
    await deleteDoc(docRef);
}
