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

// Ambil semua pegawai
export async function getAllPegawai(perusahaanId: string): Promise<TPegawai[]> {
    const snap = await getDocs(
        collection(db, "perusahaan", perusahaanId, "pegawai")
    );
    return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as TPegawai[];
}

// Ambil satu pegawai by id
export async function getPegawai(
    id: string,
    perusahaanId: string
): Promise<TPegawai | null> {
    const ref = doc(db, "perusahaan", perusahaanId, "pegawai", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return { id: snap.id, ...snap.data() } as TPegawai;
}

// Tambah pegawai baru
export async function createPegawai(
    perusahaanId: string,
    data: TPegawaiCreate
): Promise<void> {
    try {
        // 1. buat user baru di Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            data.email,
            "12345678" // default password
        );

        const uid = userCredential.user.uid;

        // 2. siapkan data pegawai untuk Firestore
        const dataPegawai: TPegawaiCreate = {
            ...data,
            auth_uid: uid,
            foto: data.foto || null,
        };

        // 3. simpan ke subcollection pegawai
        await addDoc(
            collection(db, "perusahaan", perusahaanId, "pegawai"),
            dataPegawai
        );
    } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
            console.log("Email sudah terdaftar di Auth. Cek Firestore...");
            // cek apakah email ini sudah ada di firestore pegawai
            const pegawaiRef = collectionGroup(db, "pegawai");
            const q = query(pegawaiRef, where("email", "==", data.email));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                throw new Error("Email sudah terdaftar sebagai pegawai!");
            }

            // kalau di auth ada, tapi firestore belum -> simpan manual
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

// Update data pegawai
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
