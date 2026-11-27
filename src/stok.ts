import type { KategoriBuku, StokBuku } from './peminjaman';

// Stok awal per kategori, sudah dikurangi buku pada data seed
export const dataStok: StokBuku = {
  akademik: 8,
  novel: 7,
  teknologi: 6,
};

// Mengecek apakah stok cukup untuk jumlah yang diminta
export function cekStokCukup(kategori: KategoriBuku, jumlah: number): boolean {
  return dataStok[kategori] >= jumlah;
}

// Mengurangi stok kategori setelah peminjaman berhasil (operator compound -=)
export function kurangiStok(kategori: KategoriBuku, jumlah: number): void {
  dataStok[kategori] -= jumlah;
}

// Menampilkan peringatan jika stok habis atau menipis
export function tampilkanPeringatanStok(kategori: KategoriBuku): void {
  const sisa = dataStok[kategori];
  if (sisa === 0) {
    console.log(`PERINGATAN: Stok buku ${kategori} HABIS! Segera lakukan restock.`);
  } else if (sisa < 3) {
    console.log(`Info: Stok buku ${kategori} mulai menipis (sisa kurang dari 3).`);
  }
}