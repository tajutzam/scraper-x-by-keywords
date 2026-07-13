# X (Twitter) Search Scraper

Actor ini dirancang untuk melakukan *scraping* data tweet dari X (Twitter) berdasarkan *keyword* pencarian yang ditentukan. Actor ini menggunakan `PlaywrightCrawler` dengan otorisasi *cookies* untuk memastikan pengambilan data yang stabil dan terstruktur.

## Fitur

- **Multi-Keyword Search** — Mendukung pencarian banyak *keyword* sekaligus melalui input array.
- **Customizable Limits** — Batasi jumlah tweet yang ingin diambil per *keyword* (default 20).
- **Rich Data Output** — Menyimpan data tweet secara lengkap, termasuk informasi *author*, *metadata* tweet, *engagement counts*, dan lainnya.
- **Session Management** — Mengelola *cookies* sesi secara dinamis melalui Apify Key-Value Store.

## Input

Actor ini menerima konfigurasi berikut melalui *Input*:

| Field | Tipe | Wajib | Deskripsi |
| :--- | :--- | :--- | :--- |
| `searchTerms` | `string[]` | Ya | Daftar kata kunci pencarian. |
| `maxItems` | `number` | Tidak | Maksimum data tweet yang dikumpulkan per keyword (Default: `20`). |
| `storeId` | `string` | Tidak | ID Key-Value Store yang menyimpan *cookies* (Default: `vfHytVZkAofMaZ7mF`). |

### Contoh Input (JSON)

```json
{
  "searchTerms": ["teknologi", "apify"],
  "maxItems": 50
}
```

## Teknologi yang Digunakan

- **Apify SDK** — *Core* framework untuk menjalankan Actor.
- **Crawlee (Playwright)** — *Web scraping* berbasis browser untuk navigasi otomatis.
- **TypeScript** — Bahasa utama untuk *type-safety*.

## Cara Penggunaan

1. Pastikan Anda memiliki *cookies* aktif untuk akun X Anda yang tersimpan di *Key-Value Store* Apify.
2. Atur konfigurasi input sesuai kebutuhan.
3. Jalankan Actor melalui *dashboard* Apify, atau melalui *CLI* menggunakan perintah:
   ```bash
   apify run
   ```

## Catatan Penting

> **Stabilitas**: Pastikan `maxConcurrency` diset ke `1` untuk menjaga agar sesi tidak ter-*flag* oleh sistem keamanan X.
>
> **Validasi Sesi**: Actor akan melakukan validasi sesi secara otomatis saat *startup*. Jika *cookies* sudah *expired*, Actor akan berhenti untuk menghindari kegagalan *scraping*.

---

## Dibuat Oleh

**Mohammad Tajut Zamzami**
*Backend Developer*

Berfokus pada pengembangan sistem *backend* yang efisien, otomasi data, dan arsitektur *web scraping* yang *scalable*.
