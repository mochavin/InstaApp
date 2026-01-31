# InstaApp

<p align="center">
  <strong>Platform media sosial mirip Instagram yang dibangun dengan Laravel, React (Inertia.js), dan Tailwind CSS.</strong>
</p>

<p align="center">
  <p align="center">
    <a href="https://insta.avin.my.id/">Live Demo</a><br>
    <a href="https://drive.google.com/file/d/1CVgbtYGmCaTX7KZ5IDttLLbx1xND16wq/view?usp=drive_link">Video Demo</a>
  </p>
</p>

---

## Tentang Aplikasi

**InstaApp** adalah aplikasi web sosial media yang memungkinkan pengguna untuk berbagi foto dengan caption, berinteraksi melalui like dan komentar, serta mengelola konten mereka sendiri dengan sistem otorisasi yang aman.

## Fitur Utama

### Autentikasi Pengguna
- Registrasi akun baru dengan nama, email, dan kata sandi
- Login/Logout yang aman
- Dukungan Two-Factor Authentication (2FA) opsional
- Ditenagai oleh Laravel Fortify

### Posting Konten
- Upload gambar dari perangkat
- Tambahkan caption pada setiap postingan
- Feed kronologis dengan infinite scroll

### Interaksi Sosial
- Like postingan dengan update real-time
- Komentar pada postingan
- Lihat jumlah interaksi secara langsung

### Hak Akses (Authorization)
- Edit/hapus postingan sendiri
- Hapus komentar sendiri
- Unlike postingan yang sudah di-like
- Proteksi konten pengguna lain

## Tech Stack

### Backend
- **PHP 8.2+**
- **Laravel 12** - Framework PHP modern
- **Laravel Fortify** - Autentikasi
- **Inertia.js** - Modern monolith

### Frontend
- **React 19** dengan TypeScript
- **Tailwind CSS 4** - Utility-first CSS
- **Radix UI** - Komponen UI yang accessible
- **Lucide React** - Icon library

### Development Tools
- **Vite** - Build tool & dev server
- **ESLint & Prettier** - Code quality
- **Pest** - Testing framework
- **Laravel Debugbar** - Development debugging

## Persyaratan Sistem

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL / PostgreSQL / SQLite
- Git

## Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/mochavin/InstaApp.git
cd InstaApp
```

### 2. Setup Otomatis

Jalankan script setup yang sudah disediakan:

```bash
composer setup
```

Script ini akan:
- Install dependencies PHP
- Copy file `.env.example` ke `.env`
- Generate application key
- Jalankan database migration
- Install dependencies Node.js
- Build assets

### 3. Setup Manual (Opsional)

Jika ingin setup manual:

```bash
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Konfigurasi database di file .env, lalu jalankan migration
php artisan migrate

# Install Node.js dependencies
npm install

# Build assets untuk production
npm run build
```

### 4. Konfigurasi Environment

Edit file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=instaapp
DB_USERNAME=root
DB_PASSWORD=
```

### 5. (Opsional) Seed Database

Untuk mengisi database dengan data dummy:

```bash
php artisan db:seed
```

## Development

Jalankan development server dengan:

```bash
composer dev
```

Ini akan menjalankan secara bersamaan:
- Laravel server (`php artisan serve`)
- Queue listener
- Vite dev server

Atau jalankan dengan SSR:

```bash
composer dev:ssr
```

## Build Production

```bash
npm run build
```

Untuk build dengan SSR:

```bash
npm run build:ssr
```

## Testing

Jalankan test suite dengan:

```bash
composer test
```

Atau langsung dengan Pest:

```bash
./vendor/bin/pest
```

## Struktur Proyek

```
InstaApp/
├── app/
│   ├── Http/Controllers/    # Controller Laravel
│   ├── Models/              # Eloquent Models (User, Post, Like, Comment)
│   └── Policies/            # Authorization Policies
├── resources/
│   └── js/
│       ├── components/      # React components
│       ├── pages/           # Inertia pages
│       ├── layouts/         # Layout components
│       └── hooks/           # Custom React hooks
├── routes/
│   └── web.php              # Web routes
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
└── tests/                   # Test files
```

## Scripts Tersedia

### Composer Scripts
| Script | Deskripsi |
|--------|-----------|
| `composer setup` | Setup awal proyek |
| `composer dev` | Jalankan development server |
| `composer dev:ssr` | Development dengan SSR |
| `composer test` | Jalankan test suite |

### NPM Scripts
| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Jalankan Vite dev server |
| `npm run build` | Build untuk production |
| `npm run build:ssr` | Build dengan SSR |
| `npm run lint` | Jalankan ESLint |
| `npm run format` | Format code dengan Prettier |
| `npm run types` | Type checking TypeScript |

## Links

- **Repository:** [https://github.com/mochavin/InstaApp](https://github.com/mochavin/InstaApp)
- **Live Demo:** [https://insta.avin.my.id/](https://insta.avin.my.id/)