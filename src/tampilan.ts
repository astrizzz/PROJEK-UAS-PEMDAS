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