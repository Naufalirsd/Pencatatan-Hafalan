import { pool } from "../../utils/db";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // Lakukan kueri untuk mendapatkan daftar surat dari basis data
            const queryResult = await pool.query("SELECT * FROM hafalan");
            const hafalanList = queryResult.rows;
            res.status(200).json(hafalanList);
        } catch (error) {
            console.error("Error fetching hafalan:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else if (req.method === "POST") {
        try {
            // Mendapatkan data hafalan dari body permintaan
            const { id_santri, tanggal, status, halaman, catatan } = req.body;

            // Memastikan data id santri, tanggal, status, dan halaman tidak kosong
            if (!id_santri || !tanggal || !status || !halaman) {
                return res.status(400).json({
                    message:
                        "ID Santri, tanggal, status, dan halaman diperlukan",
                });
            }

            // Lakukan kueri untuk menambahkan hafalan ke dalam basis data
            await pool.query(
                "INSERT INTO hafalan (id_santri, tanggal, status, halaman, catatan) VALUES ($1, $2, $3, $4, $5)",
                [id_santri, tanggal, status, halaman, catatan]
            );

            // Respon dengan data hafalan yang telah ditambahkan
            res.status(201).json({
                message: "Data hafalan berhasil disimpan",
            });
        } catch (error) {
            console.error("Error adding hafalan:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        // Menanggapi metode HTTP selain GET dan POST
        res.status(405).json({ message: "Method not allowed" });
    }
}
