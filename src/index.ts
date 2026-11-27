import { tanya, tutupInput, tampilSemuaData, tampilkanMenu, belumTersedia } from './tampilan';
import { daftarPeminjaman, tambahPeminjaman, hitungTotalBuku, hitungRataRataBuku } from './peminjaman';
import { dataStok } from './stok';

// Menu utama berulang sampai pengguna memilih keluar (while + switch)
async function menuUtama(): Promise<void> {
  let jalan = true;
  while (jalan) {
    tampilkanMenu();
    const pilihan = (await tanya('Pilih menu: ')).trim();
    switch (pilihan) {
      case '1':
        await tambahPeminjaman();
        break;
      case '2': {
        const totalStok = dataStok.akademik + dataStok.novel + dataStok.teknologi; // jumlah seluruh stok
        tampilSemuaData(
          daftarPeminjaman,
          hitungTotalBuku(daftarPeminjaman),
          hitungRataRataBuku(daftarPeminjaman),
          totalStok
        );
        break;
      }
      case '3':
        belumTersedia('Ubah peminjaman');
        break;
      case '4':
        belumTersedia('Hapus peminjaman');
        break;
      case '5':
        belumTersedia('Cari peminjaman');
        break;
      case '0':
        console.log('\nTerima kasih. Program selesai.');
        jalan = false; // hentikan perulangan menu
        break;
      default:
        console.log('\nPilihan menu tidak valid, silakan coba lagi.');
    }
  }
  tutupInput(); // tutup pembacaan input
}

// Titik masuk program
menuUtama(); 