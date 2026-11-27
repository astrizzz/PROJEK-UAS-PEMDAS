import { tanya, cetakNota } from './tampilan';
import { dataStok, cekStokCukup, kurangiStok, tampilkanPeringatanStok } from './stok';

// Tipe untuk kode kategori buku yang valid
export type KategoriBuku = 'akademik' | 'novel' | 'teknologi';

// Struktur satu data peminjaman (entitas utama aplikasi)
export interface Peminjaman {
  id: number;             // nomor unik peminjaman
  nama: string;           // nama peminjam
  statusAktif: boolean;   // true jika keanggotaan aktif
  jenisAnggota: string;   // Mahasiswa / Umum / Dosen
  kategori: KategoriBuku; // kategori buku yang dipinjam
  jumlah: number;         // jumlah buku yang dipinjam
  lamaPinjam: number;     // lama peminjaman dalam hari
}

// Struktur stok buku per kategori
export interface StokBuku {
  akademik: number;
  novel: number;
  teknologi: number;
}

// Tarif denda per hari keterlambatan (nilai tetap, rupiah)
export const TARIF_DENDA_PER_HARI: number = 1000;

// Data awal (seed) peminjaman, disimpan di memori dalam array
export const daftarPeminjaman: Peminjaman[] = [
  { id: 1, nama: 'Budi Santoso', statusAktif: true, jenisAnggota: 'Mahasiswa', kategori: 'akademik', jumlah: 2, lamaPinjam: 7 },
  { id: 2, nama: 'Siti Aminah', statusAktif: true, jenisAnggota: 'Umum', kategori: 'novel', jumlah: 1, lamaPinjam: 5 },
  { id: 3, nama: 'Rahmat Hidayat', statusAktif: true, jenisAnggota: 'Dosen', kategori: 'teknologi', jumlah: 3, lamaPinjam: 7 },
  { id: 4, nama: 'Dewi Lestari', statusAktif: true, jenisAnggota: 'Mahasiswa', kategori: 'novel', jumlah: 2, lamaPinjam: 5 },
  { id: 5, nama: 'Andi Wijaya', statusAktif: true, jenisAnggota: 'Mahasiswa', kategori: 'teknologi', jumlah: 1, lamaPinjam: 7 },
];

// ID berikutnya yang akan dipakai (berubah tiap ada data baru)
let idBerikutnya: number = 6;

// Menentukan jenis anggota dan batas pinjam (switch dengan 3 case + default)
export function tentukanJenisAnggota(pilihan: number): { jenis: string; batas: number } {
  let jenis = '';
  let batas = 0;
  switch (pilihan) {
    case 1:
      jenis = 'Mahasiswa';
      batas = 3;
      break;
    case 2:
      jenis = 'Umum';
      batas = 2;
      break;
    case 3:
      jenis = 'Dosen';
      batas = 4;
      break;
    default:
      jenis = 'Tidak Valid';
      batas = 0;
  }
  return { jenis, batas };
}

// Menentukan kategori buku dan lama pinjam (switch dengan 3 case + default)
export function tentukanKategori(pilihan: number): { kode: KategoriBuku | ''; nama: string; lama: number } {
  let kode: KategoriBuku | '' = '';
  let nama = '';
  let lama = 0;
  switch (pilihan) {
    case 1:
      kode = 'akademik';
      nama = 'Akademik';
      lama = 7;
      break;
    case 2:
      kode = 'novel';
      nama = 'Novel';
      lama = 5;
      break;
    case 3:
      kode = 'teknologi';
      nama = 'Teknologi';
      lama = 7;
      break;
    default:
      kode = '';
      nama = 'Tidak Valid';
      lama = 0;
  }
  return { kode, nama, lama };
}

// Menghitung total buku yang sedang dipinjam (for...of + operator compound +=)
export function hitungTotalBuku(daftar: Peminjaman[]): number {
  let total = 0;
  for (const p of daftar) {
    total += p.jumlah; // tambahkan jumlah tiap peminjaman
  }
  return total;
}

// Menghitung denda keterlambatan (operator aritmatika *)
export function hitungDenda(hariTerlambat: number, tarifPerHari: number): number {
  let denda = hariTerlambat * tarifPerHari;
  if (hariTerlambat > 7) {
    denda *= 2; // denda berlipat jika terlambat lebih dari seminggu
  }
  if (denda < 0) {
    denda = 0; // denda tidak boleh negatif
  }
  return denda;
}

// Menghitung rata-rata buku per peminjaman (operator compound /=)
export function hitungRataRataBuku(daftar: Peminjaman[]): number {
  if (daftar.length === 0) {
    return 0; // hindari pembagian dengan nol
  }
  let rata = hitungTotalBuku(daftar);
  rata /= daftar.length;
  return rata;
}

// Fitur Create: menambah data peminjaman baru (alur dari flowchart UTS)
export async function tambahPeminjaman(): Promise<void> {
  // Input data dasar peminjam
  const nama = (await tanya('Nama peminjam: ')).trim();
  const kodeStatus = (await tanya('Status anggota (A = aktif / T = tidak): ')).trim().toLowerCase();

  // Validasi input kosong atau status di luar A/T (operator logika || dan !)
  if (nama === '' || !(kodeStatus === 'a' || kodeStatus === 't')) {
    console.log('\nPeminjaman gagal: Nama tidak boleh kosong dan status harus A atau T!');
    return;
  }

  console.log('\nPilih Jenis Anggota: 1. Mahasiswa  2. Umum  3. Dosen');
  const jenis = tentukanJenisAnggota(Number(await tanya('Masukkan pilihan (1/2/3): ')));

  console.log('\nPilih Kategori Buku (Sisa Stok Saat Ini):');
  console.log(`1. Akademik  (Stok: ${dataStok.akademik})`);
  console.log(`2. Novel     (Stok: ${dataStok.novel})`);
  console.log(`3. Teknologi (Stok: ${dataStok.teknologi})`);
  const pilihanKategori = Number(await tanya('Masukkan pilihan (1/2/3): '));
  const kategori = tentukanKategori(pilihanKategori);
  const jumlahBuku = Number(await tanya('Jumlah buku yang dipinjam: '));

  const kodeBuku = kategori.kode; // kode kategori hasil switch

  // Validasi kelayakan, cek stok, simpan data, dan cetak nota (nested if sampai tingkat 4)
  if (kodeStatus === 'a') {
    if (kodeBuku !== '' && jumlahBuku > 0 && jumlahBuku <= jenis.batas) {
      if (cekStokCukup(kodeBuku, jumlahBuku)) {
        kurangiStok(kodeBuku, jumlahBuku); // kurangi stok kategori
        const dataBaru: Peminjaman = {
          id: idBerikutnya,
          nama: nama,
          statusAktif: true,
          jenisAnggota: jenis.jenis,
          kategori: kodeBuku,
          jumlah: jumlahBuku,
          lamaPinjam: kategori.lama,
        };
        daftarPeminjaman.push(dataBaru); // simpan ke array
        idBerikutnya += 1;               // siapkan ID berikutnya
        cetakNota(dataBaru, dataStok[kodeBuku], hitungDenda(1, TARIF_DENDA_PER_HARI));
        if (pilihanKategori === 3) {
          console.log('Tips: Jaga buku teknologi agar tidak rusak.');
        }
        tampilkanPeringatanStok(kodeBuku);
      } else {
        console.log(`\nPeminjaman gagal: Stok buku ${kategori.nama} tidak mencukupi! (Sisa stok: ${dataStok[kodeBuku]})`);
      }
    } else {
      console.log('\nPeminjaman gagal: Jumlah buku melebihi batas atau pilihan tidak valid!');
    }
  } else {
    console.log('\nPeminjaman gagal: Keanggotaan tidak aktif!');
  }
}