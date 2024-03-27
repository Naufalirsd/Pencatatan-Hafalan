"use strict";

require("dotenv").config({ path: ".env.local" });

const { sql } = require("@vercel/postgres");

async function execute() {
    // Buat tabel jika belum ada
    const createTable = await sql`
    CREATE TABLE IF NOT EXISTS hafalan (
        id SERIAL PRIMARY KEY,
        id_santri VARCHAR(50) NOT NULL,
        tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL,
        halaman INT NOT NULL,
        catatan VARCHAR(255)
    )    
    `;
    console.log(`Created "hafalan" table `, createTable);

    return {
        createTable,
    };
}

// Fungsi untuk menyisipkan data hafalan baru ke dalam tabel
async function insertHafalan(id_santri, tanggal, status, halaman, catatan) {
    const result = await sql`
    INSERT INTO hafalan (id_santri, tanggal, status, halaman, catatan)
    VALUES (${id_santri}, ${tanggal}, ${status}, ${halaman}, ${catatan})
    RETURNING *
    `;
    return result;
}

// Fungsi untuk mengambil semua data hafalan dari tabel
async function getAllHafalan() {
    const result = await sql`
    SELECT * FROM hafalan
    `;
    return result;
}

execute();

module.exports = {
    insertHafalan,
    getAllHafalan,
};
