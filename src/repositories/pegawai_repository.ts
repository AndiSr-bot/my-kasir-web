/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth, db } from "@/lib/firebase";
import { TPegawai, TPegawaiCreate, TPegawaiUpdate } from "@/types/pegawai";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
    addDoc,
    collection,
    collectionGroup,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

export async function getAllPegawai(perusahaanId: string): Promise<TPegawai[]> {
    const snap = await getDocs(
        collection(db, "perusahaan", perusahaanId, "pegawai")
    );
    return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as TPegawai[];
}

export async function getPegawai(
    id: string,
    perusahaanId: string
): Promise<TPegawai | null> {
    const ref = doc(db, "perusahaan", perusahaanId, "pegawai", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return { id: snap.id, ...snap.data() } as TPegawai;
}

export async function createPegawai(
    perusahaanId: string,
    data: TPegawaiCreate
): Promise<void> {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            data.email,
            "12345678"
        );

        const uid = userCredential.user.uid;

        const dataPegawai: TPegawaiCreate = {
            ...data,
            auth_uid: uid,
            foto: data.foto || null,
        };

        await addDoc(
            collection(db, "perusahaan", perusahaanId, "pegawai"),
            dataPegawai
        );
    } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
            console.log("Email sudah terdaftar di Auth. Cek Firestore...");

            const pegawaiRef = collectionGroup(db, "pegawai");
            const q = query(pegawaiRef, where("email", "==", data.email));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                throw new Error("Email sudah terdaftar sebagai pegawai!");
            }

            const dataPegawai: TPegawaiCreate = {
                ...data,
                auth_uid: "unknown",
                foto: data.foto || null,
            };

            await addDoc(
                collection(db, "perusahaan", perusahaanId, "pegawai"),
                dataPegawai
            );
        } else {
            throw error;
        }
    }
}

export async function updatePegawai(
    pegawai: TPegawaiUpdate,
    id: string
): Promise<void> {
    const docRef = doc(
        db,
        "perusahaan",
        String(pegawai.perusahaanId),
        "pegawai",
        String(id)
    );
    const dataPegawai = { ...pegawai };
    await updateDoc(docRef, { ...dataPegawai });
}
