import { pool } from "../../utils/db";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // Lakukan kueri untuk mendapatkan daftar surat dari basis data
            const queryResult = await pool.query("SELECT * FROM surat");
            const suratList = queryResult.rows;
            res.status(200).json(suratList);
        } catch (error) {
            console.error("Error fetching surat:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else if (req.method === "POST") {
        try {
            // Mendapatkan data surat dari body permintaan
            const { namaSurat, ayatMulai, ayatAkhir, status } = req.body;

            // Memastikan data nama surat, ayat mulai, dan ayat akhir tidak kosong
            if (!namaSurat || !ayatMulai || !ayatAkhir) {
                return res.status(400).json({
                    message:
                        "Nama surat, ayat mulai, dan ayat akhir diperlukan",
                });
            }

            // Lakukan kueri untuk menambahkan surat ke dalam basis data
            await pool.query(
                "INSERT INTO surat (nama_surat, ayat_mulai, ayat_akhir, status) VALUES ($1, $2, $3, $4)",
                [namaSurat, ayatMulai, ayatAkhir, status]
            );

            // Respon dengan data surat yang telah ditambahkan
            res.status(201).json({
                message: "Data hafalan surat berhasil disimpan",
            });
        } catch (error) {
            console.error("Error adding surat:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        // Menanggapi metode HTTP selain GET dan POST
        res.status(405).json({ message: "Method not allowed" });
    }
}
