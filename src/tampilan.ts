import * as readline from 'readline';
import type { Peminjaman } from './peminjaman';

// Membuat interface untuk membaca input dari terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fungsi pembantu: menampilkan pertanyaan lalu menunggu jawaban pengguna
export function tanya(pertanyaan: string): Promise<string> {
  return new Promise((selesai) => rl.question(pertanyaan, (jawaban) => selesai(jawaban)));
}

// Menutup pembacaan input saat program selesai
export function tutupInput(): void {
  rl.close();
}

// Mencetak nota peminjaman
export function cetakNota(p: Peminjaman, sisaStok: number, dendaPerHari: number): void {
  const minggu = Math.floor(p.lamaPinjam / 7); // jumlah minggu penuh
  const sisaHari = p.lamaPinjam % 7;           // sisa hari di luar minggu penuh
  console.log('\n        NOTA PEMINJAMAN           ');
  console.log('ID Peminjaman   :', p.id);
  console.log('Nama Peminjam   :', p.nama);
  console.log('Jenis Anggota   :', p.jenisAnggota);
  console.log('Kategori Buku   :', p.kategori);
  console.log('Jumlah Pinjam   :', p.jumlah);
  console.log('Lama Peminjaman :', p.lamaPinjam, 'hari (' + minggu + ' minggu ' + sisaHari + ' hari)');
  console.log('Sisa Stok       :', sisaStok);
  console.log('Denda per hari  : Rp' + dendaPerHari);
}

// Menampilkan seluruh data peminjaman (for + pesan jika data kosong)
export function tampilSemuaData(
  daftar: Peminjaman[],
  totalBuku: number,
  rataRata: number,
  totalStok: number
): void {
  const terakhir = daftar[daftar.length - 1]; // data peminjaman paling akhir

  if (!terakhir) {
    console.log('\nData peminjaman masih kosong.');
    return;
  }

  console.log('\n=== DAFTAR PEMINJAMAN ===');
  for (let i = 0; i < daftar.length; i++) {
    const p = daftar[i];
    if (!p) continue;
    console.log(`${p.id}. ${p.nama} | ${p.jenisAnggota} | ${p.kategori} | ${p.jumlah} buku | ${p.lamaPinjam} hari`);
  }
  console.log(`Total buku dipinjam : ${totalBuku}`);
  console.log(`Rata-rata per pinjam: ${rataRata.toFixed(1)} buku`);
  console.log(`Total stok tersedia : ${totalStok}`);
  console.log(`Peminjaman terakhir : ${terakhir.nama}`);
}

// Menampilkan daftar pilihan menu utama
export function tampilkanMenu(): void {
  console.log('\n===== SISTEM PEMINJAMAN BUKU PERPUSTAKAAN =====');
  console.log('1. Tambah peminjaman (Create)');
  console.log('2. Lihat semua peminjaman (Read)');
  console.log('3. Ubah peminjaman (Update)');
  console.log('4. Hapus peminjaman (Delete)');
  console.log('5. Cari peminjaman (Search)');
  console.log('0. Keluar');
}

// Placeholder fitur yang belum dikerjakan (diisi pada progress berikutnya)
export function belumTersedia(fitur: string): void {
  console.log(`\nFitur ${fitur} belum tersedia (dikerjakan pada progress berikutnya).`);
}